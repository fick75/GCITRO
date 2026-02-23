/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Google Sheets como Base de Datos
 * Almacenamiento de solicitudes en spreadsheet
 * ═══════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════
// CREAR SOLICITUD
// ════════════════════════════════════════════════════════════════

/**
 * Guardar solicitud en Google Sheets
 */
async function createSolicitudEnSheets(solicitudData) {
    try {
        if (!userState.isLoggedIn) {
            throw new Error('Debes iniciar sesión');
        }

        const formData = solicitudData.formData;
        const timestamp = new Date().toISOString();

        // Preparar fila de datos
        const rowData = [
            solicitudData.folio,                                    // A: Folio
            timestamp,                                              // B: Fecha
            solicitudData.tipo,                                     // C: Tipo
            formData.nombre_completo || formData.nombre_estudiante, // D: Nombre
            formData.correo || userState.profile.email,            // E: Email
            formData.matricula || '',                              // F: Matrícula
            parseFloat(formData.monto_total || 0),                 // G: Monto
            'Pendiente',                                           // H: Estado
            solicitudData.pdfUrl || '',                            // I: URL PDF
            solicitudData.driveFileId || '',                       // J: Drive File ID
            JSON.stringify(formData),                              // K: Datos JSON
            timestamp,                                             // L: Email enviado
            '',                                                    // M: Notas
            timestamp,                                             // N: Fecha actualización
            userState.profile.email                                // O: Actualizado por
        ];

        if (CONFIG.options.debug) {
            console.log('💾 Guardando en Google Sheets...');
            console.log('   Folio:', solicitudData.folio);
        }

        // Agregar fila al final de la hoja
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: CONFIG.sheets.spreadsheetId,
            range: `${CONFIG.sheets.sheetName}!A:O`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [rowData]
            }
        });

        if (CONFIG.options.debug) {
            console.log('✅ Guardado en Sheets');
            console.log('   Rango:', response.result.updates.updatedRange);
        }

        return {
            range: response.result.updates.updatedRange,
            rowNumber: extractRowNumber(response.result.updates.updatedRange)
        };

    } catch (error) {
        console.error('❌ Error al guardar en Sheets:', error);
        throw new Error(`No se pudo guardar en Sheets: ${error.message}`);
    }
}

// ════════════════════════════════════════════════════════════════
// LEER SOLICITUDES
// ════════════════════════════════════════════════════════════════

/**
 * Obtener todas las solicitudes (admin)
 */
async function getAllSolicitudes() {
    try {
        if (!userState.isAdmin) {
            throw new Error('No tienes permisos de administrador');
        }

        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: CONFIG.sheets.spreadsheetId,
            range: `${CONFIG.sheets.sheetName}!A2:O`  // Desde fila 2 (sin encabezados)
        });

        const rows = response.result.values || [];
        const solicitudes = rows.map((row, index) => parseSolicitudRow(row, index + 2));

        if (CONFIG.options.debug) {
            console.log(`✅ ${solicitudes.length} solicitud(es) obtenida(s)`);
        }

        return solicitudes;

    } catch (error) {
        console.error('❌ Error al obtener solicitudes:', error);
        throw error;
    }
}

/**
 * Obtener solicitudes del usuario actual
 */
async function getSolicitudesUsuario() {
    try {
        if (!userState.isLoggedIn) {
            throw new Error('Debes iniciar sesión');
        }

        // Obtener todas las solicitudes
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: CONFIG.sheets.spreadsheetId,
            range: `${CONFIG.sheets.sheetName}!A2:O`
        });

        const rows = response.result.values || [];
        const email = userState.profile.email.toLowerCase();

        // Filtrar por email del usuario
        const solicitudes = rows
            .map((row, index) => parseSolicitudRow(row, index + 2))
            .filter(s => s.EmailSolicitante.toLowerCase() === email);

        if (CONFIG.options.debug) {
            console.log(`✅ ${solicitudes.length} solicitud(es) del usuario`);
        }

        return solicitudes;

    } catch (error) {
        console.error('❌ Error al obtener solicitudes:', error);
        throw error;
    }
}

/**
 * Buscar solicitud por folio
 */
async function getSolicitudByFolio(folio) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: CONFIG.sheets.spreadsheetId,
            range: `${CONFIG.sheets.sheetName}!A2:O`
        });

        const rows = response.result.values || [];
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] === folio) {
                return parseSolicitudRow(rows[i], i + 2);
            }
        }

        return null;

    } catch (error) {
        console.error('❌ Error al buscar solicitud:', error);
        throw error;
    }
}

// ════════════════════════════════════════════════════════════════
// ACTUALIZAR SOLICITUDES
// ════════════════════════════════════════════════════════════════

/**
 * Actualizar estado de solicitud
 */
async function updateSolicitudEstado(rowNumber, nuevoEstado, notas = '') {
    try {
        if (!userState.isAdmin) {
            throw new Error('No tienes permisos de administrador');
        }

        const timestamp = new Date().toISOString();
        
        // Actualizar columnas H (Estado), M (Notas), N (Fecha actualización), O (Actualizado por)
        const updates = [
            {
                range: `${CONFIG.sheets.sheetName}!H${rowNumber}`,
                values: [[nuevoEstado]]
            },
            {
                range: `${CONFIG.sheets.sheetName}!M${rowNumber}`,
                values: [[notas]]
            },
            {
                range: `${CONFIG.sheets.sheetName}!N${rowNumber}`,
                values: [[timestamp]]
            },
            {
                range: `${CONFIG.sheets.sheetName}!O${rowNumber}`,
                values: [[userState.profile.email]]
            }
        ];

        const response = await gapi.client.sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: CONFIG.sheets.spreadsheetId,
            resource: {
                valueInputOption: 'USER_ENTERED',
                data: updates
            }
        });

        if (CONFIG.options.debug) {
            console.log('✅ Solicitud actualizada:', rowNumber);
        }

        return response.result;

    } catch (error) {
        console.error('❌ Error al actualizar solicitud:', error);
        throw error;
    }
}

// ════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════

/**
 * Parsear fila de solicitud
 */
function parseSolicitudRow(row, rowNumber) {
    // Parsear datos JSON si existen
    let datosCompletos = {};
    try {
        if (row[10]) {
            datosCompletos = JSON.parse(row[10]);
        }
    } catch (e) {
        console.warn('⚠️ Error al parsear datos JSON:', e);
    }

    return {
        rowNumber: rowNumber,
        Folio: row[0] || '',
        FechaSolicitud: row[1] || '',
        TipoTramite: row[2] || '',
        NombreSolicitante: row[3] || '',
        EmailSolicitante: row[4] || '',
        Matricula: row[5] || '',
        MontoSolicitado: parseFloat(row[6]) || 0,
        Estado: row[7] || 'Pendiente',
        URLPdf: row[8] || '',
        DriveFileId: row[9] || '',
        DatosCompletos: datosCompletos,
        EmailEnviado: row[11] || '',
        NotasCT: row[12] || '',
        FechaActualizacion: row[13] || '',
        ActualizadoPor: row[14] || ''
    };
}

/**
 * Extraer número de fila de un rango
 */
function extractRowNumber(range) {
    // Ejemplo: "Solicitudes!A5:O5" -> 5
    const match = range.match(/!A(\d+)/);
    return match ? parseInt(match[1]) : null;
}

/**
 * Verificar que el spreadsheet existe y es accesible
 */
async function verifySpreadsheet() {
    try {
        const response = await gapi.client.sheets.spreadsheets.get({
            spreadsheetId: CONFIG.sheets.spreadsheetId,
            fields: 'properties.title,sheets.properties.title'
        });

        if (CONFIG.options.debug) {
            console.log('✅ Spreadsheet verificado:', response.result.properties.title);
        }

        // Verificar que existe la hoja
        const sheetExists = response.result.sheets.some(
            sheet => sheet.properties.title === CONFIG.sheets.sheetName
        );

        if (!sheetExists) {
            throw new Error(`La hoja "${CONFIG.sheets.sheetName}" no existe en el spreadsheet`);
        }

        return true;

    } catch (error) {
        console.error('❌ Error al verificar spreadsheet:', error);
        throw new Error('El spreadsheet no es accesible. Verifica el ID en config-google.js');
    }
}

/**
 * Inicializar spreadsheet (crear encabezados si no existen)
 */
async function initializeSpreadsheet() {
    try {
        // Verificar si ya tiene encabezados
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: CONFIG.sheets.spreadsheetId,
            range: `${CONFIG.sheets.sheetName}!A1:O1`
        });

        if (response.result.values && response.result.values.length > 0) {
            if (CONFIG.options.debug) {
                console.log('✅ Spreadsheet ya inicializado');
            }
            return;
        }

        // Crear encabezados
        const headers = [
            'Folio',
            'Fecha',
            'Tipo',
            'Nombre',
            'Email',
            'Matrícula',
            'Monto',
            'Estado',
            'URL PDF',
            'Drive File ID',
            'Datos JSON',
            'Email Enviado',
            'Notas CT',
            'Fecha Actualización',
            'Actualizado Por'
        ];

        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: CONFIG.sheets.spreadsheetId,
            range: `${CONFIG.sheets.sheetName}!A1:O1`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [headers]
            }
        });

        // Formatear encabezados (negrita, fondo gris)
        await gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: CONFIG.sheets.spreadsheetId,
            resource: {
                requests: [{
                    repeatCell: {
                        range: {
                            sheetId: 0,
                            startRowIndex: 0,
                            endRowIndex: 1
                        },
                        cell: {
                            userEnteredFormat: {
                                backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                                textFormat: { bold: true }
                            }
                        },
                        fields: 'userEnteredFormat(backgroundColor,textFormat)'
                    }
                }]
            }
        });

        if (CONFIG.options.debug) {
            console.log('✅ Spreadsheet inicializado con encabezados');
        }

    } catch (error) {
        console.error('❌ Error al inicializar spreadsheet:', error);
        throw error;
    }
}

/**
 * Exportar a CSV
 */
async function exportToCSV() {
    try {
        const solicitudes = userState.isAdmin ? 
            await getAllSolicitudes() : 
            await getSolicitudesUsuario();

        const headers = [
            'Folio',
            'Fecha',
            'Tipo',
            'Nombre',
            'Email',
            'Matrícula',
            'Monto',
            'Estado',
            'URL PDF',
            'Notas'
        ];

        const rows = solicitudes.map(s => [
            s.Folio,
            s.FechaSolicitud,
            s.TipoTramite,
            s.NombreSolicitante,
            s.EmailSolicitante,
            s.Matricula,
            s.MontoSolicitado,
            s.Estado,
            s.URLPdf,
            s.NotasCT
        ]);

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        // Agregar BOM para Excel
        const bom = '\uFEFF';
        const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CITRO_Solicitudes_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        showNotification('CSV descargado exitosamente', 'success');

    } catch (error) {
        console.error('❌ Error al exportar CSV:', error);
        showNotification('Error al exportar CSV', 'error');
    }
}

// ════════════════════════════════════════════════════════════════
// LOG
// ════════════════════════════════════════════════════════════════

if (CONFIG?.options?.debug) {
    console.log('📦 google-sheets.js cargado');
}
