/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Aplicación Principal
 * Lógica de negocio y manejo de UI
 * ═══════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VARIABLES GLOBALES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let currentFormType = null;
let currentFormData = {};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVEGACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function goToHome() {
    showSection('landing-section');
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
    window.scrollTo(0, 0);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NOTIFICACIONES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.error('Elemento notification no encontrado');
        alert(message);
        return;
    }

    notification.textContent = message;
    notification.className = 'notification show';
    
    const colors = {
        success: '#34a853',
        error: '#ea4335',
        warning: '#fbbc04',
        info: '#4285f4'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function showLoading(show) {
    const loader = document.getElementById('loading');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SELECCIÓN DE TRÁMITE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function selectTramite(tipo) {
    if (!userState.isLoggedIn) {
        showNotification('Debes iniciar sesión para realizar un trámite', 'warning');
        return;
    }

    currentFormType = tipo;
    const formConfig = FORMS_CONFIG[tipo];
    
    if (!formConfig) {
        showNotification('Tipo de trámite no válido', 'error');
        return;
    }

    renderForm(formConfig);
    showSection('form-section');
}

function renderForm(formConfig) {
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const formFields = document.getElementById('dynamic-form'); // ✅ CORREGIDO: ID correcto

    if (!formTitle || !formSubtitle || !formFields) {
        console.error('Error: Elementos del formulario no encontrados');
        showNotification('Error al cargar el formulario', 'error');
        return;
    }

    formTitle.textContent = formConfig.title;
    formSubtitle.textContent = formConfig.subtitle;

    let html = '';
    formConfig.fields.forEach(field => {
        html += createFieldHTML(field);
    });

    formFields.innerHTML = html;
}

function createFieldHTML(field) {
    const required = field.required ? '*' : '';
    let inputHTML = '';

    switch (field.type) {
        case 'text':
        case 'email':
        case 'date':
        case 'number':
            inputHTML = `<input 
                type="${field.type}" 
                id="${field.name}" 
                name="${field.name}" 
                placeholder="${field.placeholder || ''}"
                ${field.required ? 'required' : ''}
                ${field.min !== undefined ? `min="${field.min}"` : ''}
                ${field.max !== undefined ? `max="${field.max}"` : ''}
            />`;
            break;

        case 'select':
            inputHTML = `<select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                <option value="">-- Seleccionar --</option>
                ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>`;
            break;

        case 'textarea':
            inputHTML = `<textarea 
                id="${field.name}" 
                name="${field.name}" 
                rows="4"
                placeholder="${field.placeholder || ''}"
                ${field.required ? 'required' : ''}
            ></textarea>`;
            break;
    }

    return `
        <div class="form-group">
            <label for="${field.name}">${field.label} <span style="color: #ea4335;">${required}</span></label>
            ${inputHTML}
            ${field.help ? `<small style="color: #5f6368; font-size: 12px; display: block; margin-top: 4px;">${field.help}</small>` : ''}
        </div>
    `;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENVÍO DE FORMULARIO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Función llamada desde HTML (mantener compatibilidad)
async function enviarSolicitud() {
    const form = document.getElementById('solicitud-form');
    if (form) {
        const event = { 
            preventDefault: () => {},
            target: form
        };
        await submitForm(event);
    }
}

async function submitForm(event) {
    event.preventDefault();

    if (!userState.isLoggedIn) {
        showNotification('Debes iniciar sesión', 'error');
        return;
    }

    showLoading(true);

    try {
        const formData = new FormData(event.target);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });

        const formConfig = FORMS_CONFIG[currentFormType];
        const validation = validateFormData(currentFormType, data);

        if (!validation.valid) {
            showNotification(validation.errors[0], 'error');
            showLoading(false);
            return;
        }

        const folio = generateFolio(currentFormType);
        
        const pdfBlob = await generatePDF(currentFormType, data, folio);
        
        const pdfUrl = await uploadPDFToDrive(pdfBlob, folio, currentFormType);

        const solicitud = {
            folio: folio,
            fecha: new Date().toISOString(),
            tipo: currentFormType,
            nombre: data.nombre_completo || data.nombre_estudiante || data.nombre_solicitante,
            email: userState.profile.email,
            matricula: data.matricula || '',
            monto: data.monto_total || data.monto_solicitado || 0,
            estado: 'Pendiente',
            pdfUrl: pdfUrl,
            datosJSON: JSON.stringify(data),
            usuarioGoogle: userState.profile.email
        };

        await saveSolicitudToSheet(solicitud);

        await sendConfirmationEmail(solicitud, data);

        showNotification('¡Solicitud enviada exitosamente! Recibirás una confirmación por correo.', 'success');
        
        event.target.reset();
        
        setTimeout(() => {
            goToHome();
        }, 2000);

    } catch (error) {
        console.error('Error al enviar solicitud:', error);
        showNotification('Error al enviar la solicitud: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function validateFormData(tipo, data) {
    const formConfig = FORMS_CONFIG[tipo];
    const errors = [];

    formConfig.fields.forEach(field => {
        const value = data[field.name];

        if (field.required && (!value || value.trim() === '')) {
            errors.push(`El campo "${field.label}" es obligatorio`);
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors.push(`El campo "${field.label}" debe ser un email válido`);
            }
        }

        if (field.type === 'number' && value) {
            const num = parseFloat(value);
            if (isNaN(num)) {
                errors.push(`El campo "${field.label}" debe ser un número`);
            }
            if (field.min !== undefined && num < field.min) {
                errors.push(`El campo "${field.label}" debe ser mayor o igual a ${field.min}`);
            }
            if (field.max !== undefined && num > field.max) {
                errors.push(`El campo "${field.label}" debe ser menor o igual a ${field.max}`);
            }
        }
    });

    return {
        valid: errors.length === 0,
        errors: errors
    };
}

function generateFolio(tipo) {
    const prefijo = CONFIG.formularios.formatoFolio[tipo] || 'SOL';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefijo}-${timestamp}-${random}`;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function showDashboard() {
    if (!userState.isLoggedIn) {
        showNotification('Debes iniciar sesión para ver el Dashboard', 'warning');
        return;
    }
    showSection('dashboard-section');
    await loadDashboardData();
}

async function loadDashboardData() {
    showLoading(true);
    try {
        const solicitudes = userState.isAdmin ? 
            await getAllSolicitudes() : 
            await getSolicitudesUsuario();

        renderDashboardStats(solicitudes);
        renderSolicitudesTable(solicitudes);
    } catch (error) {
        console.error("Error cargando dashboard:", error);
        showNotification('Error al cargar datos', 'error');
    } finally {
        showLoading(false);
    }
}

function renderDashboardStats(solicitudes) {
    const total = solicitudes.length;
    const pendientes = solicitudes.filter(s => s.Estado === 'Pendiente').length;
    const aprobadas = solicitudes.filter(s => s.Estado === 'Aprobada').length;

    const statsDiv = document.getElementById('dashboard-stats');
    if (statsDiv) {
        statsDiv.innerHTML = `
            <div class="card" style="text-align: center; border-bottom: 4px solid #4285f4;">
                <h2 style="font-size: 36px; margin-bottom: 5px;">${total}</h2>
                <p>Total Solicitudes</p>
            </div>
            <div class="card" style="text-align: center; border-bottom: 4px solid #fbbc04;">
                <h2 style="font-size: 36px; color: #fbbc04; margin-bottom: 5px;">${pendientes}</h2>
                <p>Pendientes</p>
            </div>
            <div class="card" style="text-align: center; border-bottom: 4px solid #34a853;">
                <h2 style="font-size: 36px; color: #34a853; margin-bottom: 5px;">${aprobadas}</h2>
                <p>Aprobadas</p>
            </div>
        `;
    }
}

function renderSolicitudesTable(solicitudes) {
    const tbody = document.getElementById('solicitudes-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (solicitudes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 24px;">No hay solicitudes.</td></tr>';
        return;
    }

    solicitudes.forEach(s => {
        const fecha = new Date(s.Fecha).toLocaleDateString('es-MX');
        
        let colorEstado = '#fbbc04';
        if (s.Estado === 'Aprobada') colorEstado = '#34a853';
        if (s.Estado === 'Rechazada') colorEstado = '#ea4335';

        const nombreTramite = s.Tipo.replace(/_/g, ' ').toUpperCase();

        let acciones = `<a href="${s.PDF_URL}" target="_blank" class="btn btn-secondary">Ver PDF</a>`;
        
        if (userState.isAdmin && s.Estado === 'Pendiente') {
            acciones += `
                <button onclick="cambiarEstado('${s.Folio}', 'Aprobada')" class="btn" style="background:#e6f4ea; color:#137333;">Aprobar</button>
                <button onclick="cambiarEstado('${s.Folio}', 'Rechazada')" class="btn" style="background:#fce8e6; color:#c5221f;">Rechazar</button>
            `;
        }

        tbody.innerHTML += `
            <tr>
                <td>${s.Folio}</td>
                <td>${fecha}</td>
                <td>${nombreTramite}</td>
                <td>${s.Nombre}<br><small>${s.Email}</small></td>
                <td><span style="background: ${colorEstado}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${s.Estado}</span></td>
                <td>${acciones}</td>
            </tr>
        `;
    });
}

async function cambiarEstado(folio, nuevoEstado) {
    if (!confirm(`¿Cambiar estado a ${nuevoEstado}?`)) return;

    showLoading(true);
    try {
        await updateSolicitudEstado(folio, nuevoEstado);
        showNotification(`Estado actualizado a ${nuevoEstado}`, 'success');
        await loadDashboardData();
    } catch (error) {
        showNotification('Error al actualizar', 'error');
    } finally {
        showLoading(false);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INICIALIZACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

document.addEventListener('DOMContentLoaded', () => {
    // El formulario usa onsubmit inline en HTML, no necesita listener aquí
    
    if (CONFIG.options.debug) {
        console.log('✅ app-google.js cargado');
        console.log('📋 Funciones disponibles: goToHome, showSection, selectTramite, submitForm');
    }
});
