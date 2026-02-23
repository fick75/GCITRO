/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Google Drive API
 * Almacenamiento de PDFs en carpetas organizadas
 * ═══════════════════════════════════════════════════════════════
 */

// Cache de IDs de carpetas
const foldersCache = {
    folders: {},
    expiry: null
};

// ════════════════════════════════════════════════════════════════
// GESTIÓN DE CARPETAS
// ════════════════════════════════════════════════════════════════

/**
 * Obtener o crear carpeta por tipo de trámite
 */
async function getOrCreateFolder(tipoTramite) {
    try {
        // Verificar cache
        if (foldersCache.folders[tipoTramite] && 
            foldersCache.expiry && 
            Date.now() < foldersCache.expiry) {
            return foldersCache.folders[tipoTramite];
        }

        const folderName = CONFIG.drive.folders[tipoTramite];
        
        if (!folderName) {
            throw new Error(`Tipo de trámite no válido: ${tipoTramite}`);
        }

        if (CONFIG.options.debug) {
            console.log(`📁 Buscando carpeta: ${folderName}`);
        }

        // Buscar carpeta existente
        const response = await gapi.client.drive.files.list({
            q: `name='${folderName}' and '${CONFIG.drive.rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            fields: 'files(id, name)',
            spaces: 'drive'
        });

        let folderId;

        if (response.result.files && response.result.files.length > 0) {
            // Carpeta existe
            folderId = response.result.files[0].id;
            
            if (CONFIG.options.debug) {
                console.log(`✅ Carpeta encontrada: ${folderId}`);
            }
        } else {
            // Crear carpeta
            const createResponse = await gapi.client.drive.files.create({
                resource: {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [CONFIG.drive.rootFolderId]
                },
                fields: 'id'
            });

            folderId = createResponse.result.id;
            
            if (CONFIG.options.debug) {
                console.log(`✅ Carpeta creada: ${folderId}`);
            }
        }

        // Guardar en cache
        foldersCache.folders[tipoTramite] = folderId;
        foldersCache.expiry = Date.now() + (30 * 60 * 1000); // 30 minutos

        return folderId;

    } catch (error) {
        console.error('❌ Error al obtener/crear carpeta:', error);
        throw error;
    }
}

// ════════════════════════════════════════════════════════════════
// SUBIR ARCHIVOS
// ════════════════════════════════════════════════════════════════

/**
 * Subir PDF a Google Drive
 */
async function uploadPDFToDrive(pdfBlob, folio, tipoTramite) {
    try {
        if (!pdfBlob || pdfBlob.size === 0) {
            throw new Error('El PDF está vacío');
        }

        if (CONFIG.options.debug) {
            console.log('📤 Subiendo PDF a Google Drive...');
            console.log('   Folio:', folio);
            console.log('   Tipo:', tipoTramite);
            console.log('   Tamaño:', (pdfBlob.size / 1024).toFixed(2), 'KB');
        }

        // Obtener carpeta destino
        const folderId = await getOrCreateFolder(tipoTramite);
        const fileName = `${folio}.pdf`;

        // Preparar metadata
        const metadata = {
            name: fileName,
            mimeType: 'application/pdf',
            parents: [folderId],
            description: `Solicitud CITRO - ${tipoTramite} - ${folio}`
        };

        // Crear FormData para multipart upload
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { 
            type: 'application/json' 
        }));
        form.append('file', pdfBlob);

        // Subir archivo
        const response = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${userState.accessToken}`
                },
                body: form
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Error al subir archivo');
        }

        const data = await response.json();

        // Hacer el archivo accesible (anyone with link can view)
        try {
            await gapi.client.drive.permissions.create({
                fileId: data.id,
                resource: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
        } catch (permError) {
            console.warn('⚠️ No se pudieron configurar permisos públicos:', permError);
        }

        if (CONFIG.options.debug) {
            console.log('✅ PDF subido exitosamente');
            console.log('   ID:', data.id);
            console.log('   URL:', data.webViewLink);
        }

        return {
            fileId: data.id,
            webViewLink: data.webViewLink,
            webContentLink: data.webContentLink
        };

    } catch (error) {
        console.error('❌ Error al subir PDF:', error);
        throw new Error(`No se pudo subir el PDF: ${error.message}`);
    }
}

/**
 * Obtener archivo de Drive
 */
async function getFileFromDrive(fileId) {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            fields: 'id, name, webViewLink, webContentLink, createdTime, size'
        });

        return response.result;

    } catch (error) {
        console.error('❌ Error al obtener archivo:', error);
        throw error;
    }
}

/**
 * Eliminar archivo de Drive
 */
async function deleteFileFromDrive(fileId) {
    try {
        await gapi.client.drive.files.delete({
            fileId: fileId
        });

        if (CONFIG.options.debug) {
            console.log('🗑️ Archivo eliminado:', fileId);
        }

        return true;

    } catch (error) {
        console.error('❌ Error al eliminar archivo:', error);
        throw error;
    }
}

/**
 * Listar archivos en una carpeta
 */
async function listFilesInFolder(folderId, maxResults = 100) {
    try {
        const response = await gapi.client.drive.files.list({
            q: `'${folderId}' in parents and trashed=false`,
            fields: 'files(id, name, webViewLink, createdTime, size)',
            orderBy: 'createdTime desc',
            pageSize: maxResults
        });

        return response.result.files || [];

    } catch (error) {
        console.error('❌ Error al listar archivos:', error);
        throw error;
    }
}

// ════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════

/**
 * Verificar que la carpeta raíz existe
 */
async function verifyRootFolder() {
    try {
        const response = await gapi.client.drive.files.get({
            fileId: CONFIG.drive.rootFolderId,
            fields: 'id, name, mimeType'
        });

        if (response.result.mimeType !== 'application/vnd.google-apps.folder') {
            throw new Error('El ID proporcionado no es una carpeta');
        }

        if (CONFIG.options.debug) {
            console.log('✅ Carpeta raíz verificada:', response.result.name);
        }

        return true;

    } catch (error) {
        console.error('❌ Error al verificar carpeta raíz:', error);
        throw new Error('La carpeta raíz de Drive no es accesible. Verifica el ID en config-google.js');
    }
}

/**
 * Crear todas las carpetas necesarias
 */
async function createAllFolders() {
    try {
        if (CONFIG.options.debug) {
            console.log('📁 Creando estructura de carpetas...');
        }

        const tipos = Object.keys(CONFIG.drive.folders);
        const promises = tipos.map(tipo => getOrCreateFolder(tipo));
        
        await Promise.all(promises);

        if (CONFIG.options.debug) {
            console.log('✅ Todas las carpetas creadas/verificadas');
        }

        return true;

    } catch (error) {
        console.error('❌ Error al crear carpetas:', error);
        throw error;
    }
}

/**
 * Obtener URL pública del archivo
 */
function getPublicFileUrl(fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
}

/**
 * Obtener URL de descarga directa
 */
function getDirectDownloadUrl(fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// ════════════════════════════════════════════════════════════════
// LOG
// ════════════════════════════════════════════════════════════════

if (CONFIG?.options?.debug) {
    console.log('📦 google-drive.js cargado');
}
