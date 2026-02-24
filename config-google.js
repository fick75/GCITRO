/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Configuración Google - VERSIÓN CORREGIDA
 * Sistema 100% Google Workspace
 * Universidad Veracruzana
 * ═══════════════════════════════════════════════════════════════
 */

const CONFIG = {
    // ━━━ GOOGLE OAUTH 2.0 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    google: {
        clientId: '147189238289-c2du7shhgvrd1de9koq17gjb6p2e4bvj.apps.googleusercontent.com',
        // ✅ CORREGIDO: Quitado "1" extra, sufijo correcto c2du...
        
        scopes: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/gmail.send'
        ],
        
        redirectUri: window.location.origin,
        
        discoveryDocs: [
            'https://sheets.googleapis.com/$discovery/rest?version=v4',
            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
            'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'
        ]
    },

    // ━━━ GOOGLE SHEETS (BASE DE DATOS) ━━━━━━━━━━━━━━━━━━━━━━━
    sheets: {
        spreadsheetId: '1ZbGK8Nfzp4UTtEyyvlXpYiRfVWxVBTNZvxJw9HMpVMA',
        sheetName: 'Solicitudes',
        columns: [
            'Folio', 'Fecha', 'Tipo', 'Nombre', 'Email', 'Matricula',
            'Monto', 'Estado', 'PDF_URL', 'PDF_ID', 'Datos_JSON',
            'Notas_CT', 'Usuario_Google', 'Timestamp'
        ]
    },

    // ━━━ GOOGLE DRIVE (ALMACENAMIENTO) ━━━━━━━━━━━━━━━━━━━━━━━
    drive: {
        rootFolderId: '15MCFE1No0h1wLvQktSqMyUvDe1bttZWG?usp=drive_link',
        folders: {
            apoyo_academico: '01_Apoyo_Academico',
            aval_institucional: '02_Aval_Institucional',
            apoyo_terceros: '03_Apoyo_Terceros',
            comite_tutorial: '04_Comite_Tutorial',
            solicitud_libre: '05_Solicitud_Libre'
        },
        folderIds: {}
    },

    // ━━━ ADMINISTRADORES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    admins: [
        'citroct7@gmail.com',
        'jcfaicus@gmail.com'
    ],

    // ━━━ INFORMACIÓN INSTITUCIONAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━
    institucion: {
        nombre: 'Centro de Investigaciones Tropicales',
        nombreCorto: 'CITRO',
        universidad: 'Universidad Veracruzana',
        email: 'ctecnicocitro@uv.mx',
        telefono: '228-842-1800',
        direccion: 'Xalapa, Veracruz, México',
        sitioWeb: 'https://www.uv.mx/citro'
    },

    // ━━━ CONFIGURACIÓN DE CORREOS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    email: {
        adminEmail: 'ctecnicocitro@uv.mx',
        enviarConfirmacion: true,
        ccAdminEnConfirmacion: true,
        firmaEmail: 'H. Consejo Técnico del CITRO<br>Universidad Veracruzana'
    },

    // ━━━ OPCIONES DE SEGURIDAD Y VALIDACIÓN ━━━━━━━━━━━━━━━━━━
    options: {
        soloEmailUV: true,
        dominioPermitido: 'gmail.com',
        plazoMinimoDias: 21,
        montoMaximo: 100000,
        requiereJustificacionSi: 50000,
        debug: true
    },

    // ━━━ CONFIGURACIÓN DE FORMULARIOS ━━━━━━━━━━━━━━━━━━━━━━━━
    formularios: {
        formatoFolio: {
            apoyo_academico: 'AAC',
            aval_institucional: 'AVI',
            apoyo_terceros: 'TER',
            comite_tutorial: 'CMT',
            solicitud_libre: 'LIB'
        }
    },

    // ━━━ VERSIÓN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    version: {
        numero: '3.0',
        fecha: 'Febrero 2026',
        nombre: 'Sistema CITRO Google - Versión Estable',
        plataforma: 'Google Workspace'
    }
};

function isAdmin(email) {
    if (!email) return false;
    return CONFIG.admins.includes(email.toLowerCase().trim());
}

function isUVEmail(email) {
    if (!CONFIG.options.soloEmailUV) return true;
    return email.toLowerCase().endsWith(`@${CONFIG.options.dominioPermitido}`);
}

(function validarConfig() {
    const errores = [];
    if (CONFIG.google.clientId.includes('TU_CLIENT_ID')) errores.push('⚠️ Falta configurar Google Client ID');
    if (CONFIG.sheets.spreadsheetId.includes('TU_SPREADSHEET')) errores.push('⚠️ Falta configurar Spreadsheet ID');
    if (CONFIG.drive.rootFolderId.includes('TU_FOLDER') || CONFIG.drive.rootFolderId.includes('PONER_TU')) {
        errores.push('⚠️ Falta configurar carpeta raíz de Drive');
    }
    if (errores.length > 0) {
        console.error('❌ ERRORES DE CONFIGURACIÓN:');
        errores.forEach(e => console.error(e));
    } else if (CONFIG.options.debug) {
        console.log('✅ Configuración Google validada');
        console.log('🔐 Client ID:', CONFIG.google.clientId.substring(0, 25) + '...');
        console.log('📊 Spreadsheet:', CONFIG.sheets.spreadsheetId);
        console.log('🔒 Solo @' + CONFIG.options.dominioPermitido);
        console.log('👥 Admins:', CONFIG.admins);
    }
})();
