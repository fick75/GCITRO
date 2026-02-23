/**
 * ═══════════════════════════════════════════════════════════════
 * CITRO — Configuración de Formularios
 * Definición de campos para los 5 tipos de solicitudes
 * Universidad Veracruzana
 * ═══════════════════════════════════════════════════════════════
 */

const FORMS_CONFIG = {

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 1. APOYO ACADÉMICO
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    apoyo_academico: {
        title: 'Solicitud de Apoyo Académico',
        subtitle: 'Apoyo para congresos, viajes, investigación y actividades académicas',
        fields: [
            {
                name: 'nombre_completo',
                label: 'Nombre completo',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo del solicitante'
            },
            {
                name: 'correo',
                label: 'Correo electrónico',
                type: 'email',
                required: true,
                placeholder: 'correo@gmail.com'
            },
            {
                name: 'matricula',
                label: 'Matrícula',
                type: 'text',
                required: true,
                placeholder: 'Matrícula o número de empleado'
            },
            {
                name: 'tipo_solicitante',
                label: 'Tipo de solicitante',
                type: 'select',
                required: true,
                options: [
                    'Estudiante de Licenciatura',
                    'Estudiante de Maestría',
                    'Estudiante de Doctorado',
                    'Académico',
                    'Técnico Académico',
                    'Personal Administrativo'
                ]
            },
            {
                name: 'tipo_apoyo',
                label: 'Tipo de apoyo solicitado',
                type: 'select',
                required: true,
                options: [
                    'Congreso nacional',
                    'Congreso internacional',
                    'Estancia de investigación',
                    'Trabajo de campo',
                    'Curso o taller',
                    'Publicación de artículo',
                    'Material de investigación',
                    'Otro'
                ]
            },
            {
                name: 'nombre_evento',
                label: 'Nombre del evento/actividad',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo del congreso, curso, etc.'
            },
            {
                name: 'fecha_inicio',
                label: 'Fecha de inicio',
                type: 'date',
                required: true
            },
            {
                name: 'fecha_fin',
                label: 'Fecha de finalización',
                type: 'date',
                required: true
            },
            {
                name: 'lugar',
                label: 'Lugar del evento',
                type: 'text',
                required: true,
                placeholder: 'Ciudad, Estado, País'
            },
            {
                name: 'monto_total',
                label: 'Monto total solicitado (MXN)',
                type: 'number',
                required: true,
                min: 0,
                max: 100000,
                placeholder: '0.00'
            },
            {
                name: 'desglose_gastos',
                label: 'Desglose de gastos',
                type: 'textarea',
                required: true,
                placeholder: 'Detallar: transporte, hospedaje, inscripción, etc.'
            },
            {
                name: 'justificacion',
                label: 'Justificación de la solicitud',
                type: 'textarea',
                required: true,
                placeholder: 'Explicar la relevancia académica y el beneficio de la actividad'
            },
            {
                name: 'observaciones',
                label: 'Observaciones adicionales',
                type: 'textarea',
                required: false,
                placeholder: 'Información adicional relevante (opcional)'
            }
        ]
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 2. AVAL INSTITUCIONAL
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    aval_institucional: {
        title: 'Solicitud de Aval Institucional',
        subtitle: 'Respaldo oficial del CITRO para proyectos, convenios o actividades',
        fields: [
            {
                name: 'nombre_completo',
                label: 'Nombre completo del solicitante',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo'
            },
            {
                name: 'correo',
                label: 'Correo electrónico',
                type: 'email',
                required: true,
                placeholder: 'correo@gmail.com'
            },
            {
                name: 'matricula',
                label: 'Matrícula o número de empleado',
                type: 'text',
                required: true,
                placeholder: 'Matrícula o número de empleado'
            },
            {
                name: 'tipo_aval',
                label: 'Tipo de aval solicitado',
                type: 'select',
                required: true,
                options: [
                    'Proyecto de investigación',
                    'Convenio de colaboración',
                    'Evento académico',
                    'Publicación',
                    'Solicitud de beca/financiamiento',
                    'Otro'
                ]
            },
            {
                name: 'titulo_proyecto',
                label: 'Título del proyecto/actividad',
                type: 'text',
                required: true,
                placeholder: 'Título completo'
            },
            {
                name: 'institucion_destino',
                label: 'Institución destino del aval',
                type: 'text',
                required: true,
                placeholder: 'Nombre de la institución que recibirá el aval'
            },
            {
                name: 'fecha_requerida',
                label: 'Fecha en que se requiere el aval',
                type: 'date',
                required: true
            },
            {
                name: 'descripcion_proyecto',
                label: 'Descripción del proyecto/actividad',
                type: 'textarea',
                required: true,
                placeholder: 'Descripción detallada del proyecto o actividad'
            },
            {
                name: 'vinculacion_citro',
                label: 'Vinculación con el CITRO',
                type: 'textarea',
                required: true,
                placeholder: 'Explicar cómo se relaciona el proyecto con las líneas de investigación del CITRO'
            },
            {
                name: 'observaciones',
                label: 'Observaciones adicionales',
                type: 'textarea',
                required: false,
                placeholder: 'Información adicional relevante (opcional)'
            }
        ]
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 3. APOYO A TERCEROS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    apoyo_terceros: {
        title: 'Solicitud de Apoyo a Terceros',
        subtitle: 'Apoyo para colaboradores externos, visitantes o instituciones',
        fields: [
            {
                name: 'nombre_solicitante',
                label: 'Nombre completo del solicitante (responsable CITRO)',
                type: 'text',
                required: true,
                placeholder: 'Nombre del responsable en CITRO'
            },
            {
                name: 'correo_solicitante',
                label: 'Correo electrónico del solicitante',
                type: 'email',
                required: true,
                placeholder: 'correo@gmail.com'
            },
            {
                name: 'nombre_tercero',
                label: 'Nombre completo del tercero beneficiario',
                type: 'text',
                required: true,
                placeholder: 'Nombre de la persona o institución externa'
            },
            {
                name: 'institucion_tercero',
                label: 'Institución de procedencia del tercero',
                type: 'text',
                required: true,
                placeholder: 'Nombre de la institución'
            },
            {
                name: 'tipo_apoyo',
                label: 'Tipo de apoyo solicitado',
                type: 'select',
                required: true,
                options: [
                    'Estancia académica',
                    'Colaboración en proyecto',
                    'Uso de instalaciones',
                    'Capacitación o taller',
                    'Apoyo económico',
                    'Otro'
                ]
            },
            {
                name: 'fecha_inicio',
                label: 'Fecha de inicio',
                type: 'date',
                required: true
            },
            {
                name: 'fecha_fin',
                label: 'Fecha de finalización',
                type: 'date',
                required: true
            },
            {
                name: 'descripcion_actividad',
                label: 'Descripción de la actividad',
                type: 'textarea',
                required: true,
                placeholder: 'Describir la actividad a realizar'
            },
            {
                name: 'justificacion',
                label: 'Justificación del apoyo',
                type: 'textarea',
                required: true,
                placeholder: 'Explicar la relevancia del apoyo y beneficios para el CITRO'
            },
            {
                name: 'observaciones',
                label: 'Observaciones adicionales',
                type: 'textarea',
                required: false,
                placeholder: 'Información adicional relevante (opcional)'
            }
        ]
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 4. COMITÉ TUTORIAL
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    comite_tutorial: {
        title: 'Solicitud al Comité Tutorial',
        subtitle: 'Modificación de comité tutorial (estudiantes de posgrado)',
        fields: [
            {
                name: 'nombre_estudiante',
                label: 'Nombre completo del estudiante',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo'
            },
            {
                name: 'correo',
                label: 'Correo electrónico',
                type: 'email',
                required: true,
                placeholder: 'correo@gmail.com'
            },
            {
                name: 'matricula',
                label: 'Matrícula',
                type: 'text',
                required: true,
                placeholder: 'Matrícula'
            },
            {
                name: 'programa',
                label: 'Programa de posgrado',
                type: 'select',
                required: true,
                options: [
                    'Maestría en Ecología Tropical',
                    'Doctorado en Ecología Tropical'
                ]
            },
            {
                name: 'tipo_solicitud',
                label: 'Tipo de solicitud',
                type: 'select',
                required: true,
                options: [
                    'Cambio de director de tesis',
                    'Adición de codirector',
                    'Cambio de sinodal',
                    'Modificación de tema',
                    'Otro'
                ]
            },
            {
                name: 'comite_actual',
                label: 'Comité tutorial actual',
                type: 'textarea',
                required: true,
                placeholder: 'Listar nombres completos y roles'
            },
            {
                name: 'justificacion',
                label: 'Justificación de la solicitud',
                type: 'textarea',
                required: true,
                placeholder: 'Explicar las razones de la solicitud'
            },
            {
                name: 'observaciones',
                label: 'Observaciones adicionales',
                type: 'textarea',
                required: false,
                placeholder: 'Información adicional relevante (opcional)'
            }
        ]
    },

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // 5. SOLICITUD LIBRE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    solicitud_libre: {
        title: 'Solicitud Libre',
        subtitle: 'Para trámites no contemplados en las categorías anteriores',
        fields: [
            {
                name: 'nombre_completo',
                label: 'Nombre completo',
                type: 'text',
                required: true,
                placeholder: 'Nombre completo del solicitante'
            },
            {
                name: 'correo',
                label: 'Correo electrónico',
                type: 'email',
                required: true,
                placeholder: 'correo@gmail.com'
            },
            {
                name: 'asunto',
                label: 'Asunto de la solicitud',
                type: 'text',
                required: true,
                placeholder: 'Título breve de la solicitud'
            },
            {
                name: 'descripcion',
                label: 'Descripción detallada',
                type: 'textarea',
                required: true,
                placeholder: 'Explicar de manera completa la solicitud'
            },
            {
                name: 'justificacion',
                label: 'Justificación',
                type: 'textarea',
                required: true,
                placeholder: 'Explicar las razones de la solicitud'
            },
            {
                name: 'observaciones',
                label: 'Observaciones adicionales',
                type: 'textarea',
                required: false,
                placeholder: 'Información adicional relevante (opcional)'
            }
        ]
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (typeof console !== 'undefined') {
    console.log('📋 forms-data.js cargado');
    console.log('✅ 5 formularios disponibles');
}
