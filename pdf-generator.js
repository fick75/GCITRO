/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Generador de PDFs
 * Crea PDFs profesionales para cada tipo de solicitud
 * Universidad Veracruzana
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Generar PDF para cualquier tipo de solicitud
 */
async function generatePDF(tipoTramite, data, folio) {
    try {
        if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
            throw new Error('jsPDF no está cargado. Verifica que la librería esté incluida.');
        }

        const { jsPDF } = window.jspdf || jspdf;
        const doc = new jsPDF();

        const formConfig = FORMS_CONFIG[tipoTramite];
        if (!formConfig) {
            throw new Error('Configuración de formulario no encontrada');
        }

        // Configuración de colores
        const primaryColor = [66, 133, 244]; // Google Blue
        const textColor = [33, 33, 33];
        const grayColor = [95, 99, 104];

        let yPosition = 20;

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // ENCABEZADO
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        // Universidad
        doc.setFontSize(10);
        doc.setTextColor(...grayColor);
        doc.text('Universidad Veracruzana', 105, yPosition, { align: 'center' });
        yPosition += 5;

        // CITRO
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...primaryColor);
        doc.text('Centro de Investigaciones Tropicales', 105, yPosition, { align: 'center' });
        yPosition += 7;

        // Título del documento
        doc.setFontSize(14);
        doc.setTextColor(...textColor);
        doc.text(formConfig.title, 105, yPosition, { align: 'center' });
        yPosition += 10;

        // Línea separadora
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // INFORMACIÓN GENERAL
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...grayColor);

        // Folio
        doc.text('Folio:', 20, yPosition);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...textColor);
        doc.text(folio, 50, yPosition);

        // Fecha
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...grayColor);
        const fecha = new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.text('Fecha:', 120, yPosition);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...textColor);
        doc.text(fecha, 150, yPosition);

        yPosition += 10;

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // DATOS DEL FORMULARIO
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        formConfig.fields.forEach(field => {
            const value = data[field.name] || 'No especificado';

            // Verificar espacio en la página
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            // Etiqueta (label)
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...primaryColor);
            doc.text(field.label + ':', 20, yPosition);
            yPosition += 5;

            // Valor
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...textColor);

            // Manejar textos largos (textarea)
            if (field.type === 'textarea' && value.length > 80) {
                const lines = doc.splitTextToSize(value, 170);
                lines.forEach(line => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    doc.text(line, 20, yPosition);
                    yPosition += 5;
                });
            } else {
                const lines = doc.splitTextToSize(value, 170);
                lines.forEach(line => {
                    doc.text(line, 20, yPosition);
                    yPosition += 5;
                });
            }

            yPosition += 3;
        });

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // PIE DE PÁGINA
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        const pageCount = doc.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Línea separadora
            doc.setDrawColor(...grayColor);
            doc.setLineWidth(0.3);
            doc.line(20, 280, 190, 280);

            // Texto del pie
            doc.setFontSize(8);
            doc.setTextColor(...grayColor);
            doc.text(
                'Centro de Investigaciones Tropicales - Universidad Veracruzana',
                105,
                285,
                { align: 'center' }
            );
            doc.text(
                'Xalapa, Veracruz, México | Tel: 228-842-1800',
                105,
                290,
                { align: 'center' }
            );

            // Número de página
            doc.text(
                `Página ${i} de ${pageCount}`,
                190,
                290,
                { align: 'right' }
            );
        }

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // GENERAR BLOB
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

        const pdfBlob = doc.output('blob');

        if (CONFIG.options.debug) {
            console.log('✅ PDF generado exitosamente');
            console.log(`📄 Tamaño: ${(pdfBlob.size / 1024).toFixed(2)} KB`);
            console.log(`📄 Páginas: ${pageCount}`);
        }

        return pdfBlob;

    } catch (error) {
        console.error('Error generando PDF:', error);
        throw new Error('Error al generar el PDF: ' + error.message);
    }
}

/**
 * Descargar PDF localmente (para pruebas)
 */
function downloadPDF(pdfBlob, filename) {
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'documento.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Log de carga
if (typeof console !== 'undefined') {
    console.log('📄 pdf-generator.js loaded successfully');
}
