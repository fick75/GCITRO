/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Gmail API
 * Envío automático de emails
 * ═══════════════════════════════════════════════════════════════
 */

// ════════════════════════════════════════════════════════════════
// ENVÍO DE EMAILS
// ════════════════════════════════════════════════════════════════

/**
 * Enviar email de confirmación al usuario
 */
async function sendConfirmacionEmail(solicitudData) {
    try {
        const formData = solicitudData.formData;
        const tipoNombre = FORMS_CONFIG[solicitudData.tipo]?.title || solicitudData.tipo;
        
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
                <div style="background: #4285f4; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">✅ Solicitud Recibida</h1>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
                    <p style="font-size: 16px; color: #333;">Estimado/a <strong>${formData.nombre_completo || formData.nombre_estudiante}</strong>,</p>
                    
                    <p style="color: #555;">Su solicitud ha sido recibida exitosamente y será evaluada por el H. Consejo Técnico del CITRO.</p>
                    
                    <div style="background: #e8f0fe; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4285f4;">
                        <h3 style="color: #1967d2; margin-top: 0; font-size: 18px;">📋 Detalles de su solicitud:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666; width: 40%;"><strong>Folio:</strong></td>
                                <td style="padding: 8px 0; color: #333;">${solicitudData.folio}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Tipo:</strong></td>
                                <td style="padding: 8px 0; color: #333;">${tipoNombre}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Fecha:</strong></td>
                                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString('es-MX', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</td>
                            </tr>
                            ${formData.monto_total ? `
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Monto solicitado:</strong></td>
                                <td style="padding: 8px 0; color: #1e8e3e; font-weight: bold;">$${parseFloat(formData.monto_total).toLocaleString('es-MX')} MXN</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>
                    
                    <p style="color: #555;">El documento PDF de su solicitud ha sido guardado en Google Drive y está disponible para consulta.</p>
                    
                    ${solicitudData.pdfUrl ? `
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${solicitudData.pdfUrl}" 
                           style="display: inline-block; padding: 12px 30px; background: #4285f4; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                            📄 Ver Documento PDF
                        </a>
                    </div>
                    ` : ''}
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 25px;">
                        <p style="margin: 0; color: #666; font-size: 14px;">
                            💡 <strong>Nota:</strong> Recibirá una notificación por correo electrónico cuando su solicitud sea evaluada.
                        </p>
                    </div>
                    
                    <p style="color: #666; font-size: 14px; margin-top: 25px;">
                        Si tiene alguna duda, puede contactarnos en 
                        <a href="mailto:${CONFIG.email.adminEmail}" style="color: #4285f4; text-decoration: none;">
                            ${CONFIG.email.adminEmail}
                        </a>
                    </p>
                </div>
                
                <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; margin-top: 10px;">
                    <p style="margin: 5px 0;">${CONFIG.institucion.nombreCorto} - ${CONFIG.institucion.universidad}</p>
                    <p style="margin: 5px 0;">${CONFIG.institucion.direccion}</p>
                </div>
            </div>
        `;

        await sendEmail({
            to: formData.correo || userState.profile.email,
            subject: `✅ Solicitud Recibida - Folio ${solicitudData.folio}`,
            htmlBody: emailHtml
        });

        if (CONFIG.options.debug) {
            console.log('✅ Email de confirmación enviado');
        }

    } catch (error) {
        console.error('❌ Error al enviar email de confirmación:', error);
        // No lanzar error para no interrumpir el flujo
    }
}

/**
 * Enviar email de notificación al CT
 */
async function sendNotificacionCT(solicitudData) {
    try {
        const formData = solicitudData.formData;
        const tipoNombre = FORMS_CONFIG[solicitudData.tipo]?.title || solicitudData.tipo;
        
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 20px;">
                <div style="background: #ea4335; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">🔔 Nueva Solicitud</h1>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
                    <h2 style="color: #ea4335; margin-top: 0;">Nueva solicitud de ${tipoNombre}</h2>
                    
                    <div style="background: #fce8e6; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ea4335;">
                        <h3 style="color: #c5221f; margin-top: 0; font-size: 18px;">📋 Información del solicitante:</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #666; width: 40%;"><strong>Folio:</strong></td>
                                <td style="padding: 8px 0; color: #333; font-family: monospace; font-size: 16px;">${solicitudData.folio}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Nombre:</strong></td>
                                <td style="padding: 8px 0; color: #333;">${formData.nombre_completo || formData.nombre_estudiante}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                                <td style="padding: 8px 0; color: #333;">${formData.correo || userState.profile.email}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Matrícula:</strong></td>
                                <td style="padding: 8px 0; color: #333;">${formData.matricula || 'N/A'}</td>
                            </tr>
                            ${formData.monto_total ? `
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Monto solicitado:</strong></td>
                                <td style="padding: 8px 0; color: #1e8e3e; font-weight: bold; font-size: 18px;">$${parseFloat(formData.monto_total).toLocaleString('es-MX')} MXN</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 8px 0; color: #666;"><strong>Fecha:</strong></td>
                                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString('es-MX', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${solicitudData.pdfUrl}" 
                           style="display: inline-block; padding: 12px 30px; background: #4285f4; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 10px;">
                            📄 Ver PDF
                        </a>
                        <a href="https://docs.google.com/spreadsheets/d/${CONFIG.sheets.spreadsheetId}" 
                           style="display: inline-block; padding: 12px 30px; background: #34a853; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                            📊 Ver en Sheets
                        </a>
                    </div>
                    
                    <div style="background: #e8f0fe; padding: 15px; border-radius: 6px; margin-top: 25px;">
                        <p style="margin: 0; color: #1967d2; font-size: 14px;">
                            💡 Todos los detalles están disponibles en Google Sheets y el PDF en Google Drive.
                        </p>
                    </div>
                </div>
                
                <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; margin-top: 10px;">
                    <p style="margin: 5px 0;">Sistema CITRO - Universidad Veracruzana</p>
                    <p style="margin: 5px 0;">Notificación automática</p>
                </div>
            </div>
        `;

        await sendEmail({
            to: CONFIG.email.adminEmail,
            cc: CONFIG.admins.filter(email => email !== CONFIG.email.adminEmail),
            subject: `🔔 Nueva Solicitud - ${tipoNombre} - ${solicitudData.folio}`,
            htmlBody: emailHtml
        });

        if (CONFIG.options.debug) {
            console.log('✅ Email de notificación enviado al CT');
        }

    } catch (error) {
        console.error('❌ Error al enviar email al CT:', error);
        // No lanzar error para no interrumpir el flujo
    }
}

// ════════════════════════════════════════════════════════════════
// FUNCIÓN GENÉRICA DE ENVÍO
// ════════════════════════════════════════════════════════════════

/**
 * Enviar email usando Gmail API
 */
async function sendEmail({ to, cc = [], subject, htmlBody }) {
    try {
        // Crear mensaje en formato RFC 2822
        const emailLines = [];
        
        // Headers
        emailLines.push(`To: ${Array.isArray(to) ? to.join(', ') : to}`);
        
        if (cc.length > 0) {
            emailLines.push(`Cc: ${cc.join(', ')}`);
        }
        
        emailLines.push(`Subject: ${subject}`);
        emailLines.push('MIME-Version: 1.0');
        emailLines.push('Content-Type: text/html; charset=utf-8');
        emailLines.push('');
        emailLines.push(htmlBody);
        
        const email = emailLines.join('\r\n');
        
        // Codificar en base64url
        const encodedEmail = btoa(unescape(encodeURIComponent(email)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // Enviar
        const response = await gapi.client.gmail.users.messages.send({
            userId: 'me',
            resource: {
                raw: encodedEmail
            }
        });

        if (CONFIG.options.debug) {
            console.log('📧 Email enviado:', response.result.id);
        }

        return response.result;

    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        throw new Error(`No se pudo enviar el email: ${error.message}`);
    }
}

// ════════════════════════════════════════════════════════════════
// LOG
// ════════════════════════════════════════════════════════════════

if (CONFIG?.options?.debug) {
    console.log('📦 google-gmail.js cargado');
}
