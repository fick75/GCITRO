# 🚀 GUÍA COMPLETA - SISTEMA CITRO GOOGLE

## ✅ INSTALACIÓN EN 30 MINUTOS

Sistema 100% GRATIS usando Google Workspace.

---

## 📋 LO QUE VAS A NECESITAR

```
✅ Cuenta de Google (@uv.mx o personal)
✅ Acceso a Google Cloud Console
✅ 30 minutos de tiempo
✅ Navegador web
```

**NO necesitas:**
- ❌ Permisos de administrador
- ❌ Tarjeta de crédito
- ❌ Servidor
- ❌ Conocimientos técnicos avanzados

---

## 🎯 PASO 1: CREAR PROYECTO EN GOOGLE CLOUD (5 min)

### 1.1 Ir a Google Cloud Console

```
https://console.cloud.google.com
```

**Login con tu cuenta @uv.mx o personal**

### 1.2 Crear nuevo proyecto

```
1. Click en el selector de proyectos (arriba izquierda)
2. Click "New Project"
3. Nombre: CITRO Sistema UV
4. Organization: (dejar en blanco si no tienes)
5. Click "Create"
```

**Esperar 10-20 segundos...**

### 1.3 Seleccionar el proyecto

```
1. Click en el selector de proyectos
2. Seleccionar "CITRO Sistema UV"
3. ✅ Proyecto activo
```

---

## 🎯 PASO 2: HABILITAR APIs (3 min)

### 2.1 Ir a APIs & Services

```
Menú hamburguesa (☰) → APIs & Services → Library
```

### 2.2 Habilitar APIs necesarias (una por una)

**Buscar y habilitar cada una:**

```
1. Google Drive API
   → Click "Enable"
   
2. Google Sheets API
   → Click "Enable"
   
3. Gmail API
   → Click "Enable"
   
4. Google Calendar API
   → Click "Enable"
```

**Resultado:** 4 APIs habilitadas ✅

---

## 🎯 PASO 3: CREAR CREDENCIALES OAUTH (10 min)

### 3.1 Configurar pantalla de consentimiento

```
APIs & Services → OAuth consent screen
```

**Seleccionar:**
```
( ) Internal  ← Si tienes Google Workspace
(•) External  ← Si usas cuenta personal
```

**Click "Create"**

**Llenar información:**
```
App name: CITRO Sistema UV
User support email: tu-email@uv.mx
Developer contact: tu-email@uv.mx

Authorized domains: (opcional)

Click "Save and Continue"
```

**Scopes (Paso 2):**
```
Click "Add or Remove Scopes"

Buscar y agregar:
✅ .../auth/userinfo.email
✅ .../auth/userinfo.profile
✅ .../auth/drive.file
✅ .../auth/spreadsheets
✅ .../auth/gmail.send
✅ .../auth/calendar.events

Click "Update"
Click "Save and Continue"
```

**Test users (Paso 3):**
```
Click "Add Users"
Agregar: tu-email@uv.mx
Click "Add"
Click "Save and Continue"
```

**Summary (Paso 4):**
```
Verificar todo
Click "Back to Dashboard"
```

### 3.2 Crear credenciales OAuth

```
APIs & Services → Credentials
```

**Click "Create Credentials" → OAuth client ID**

```
Application type: Web application

Name: CITRO Web Client

Authorized JavaScript origins:
  Add URI: https://fick75.github.io
  Add URI: http://localhost:8000

Authorized redirect URIs:
  Add URI: https://fick75.github.io/citro-sistema-ct/
  Add URI: http://localhost:8000

Click "Create"
```

**COPIAR Y GUARDAR:**
```
Client ID: [ALGO-LARGO].apps.googleusercontent.com
Client Secret: [SECRETO] (no lo necesitas, pero guárdalo)

Click "OK"
```

### 3.3 Crear API Key (opcional)

```
Create Credentials → API key

COPIAR Y GUARDAR:
API Key: AIza[...]

Click "Close"
```

---

## 🎯 PASO 4: CREAR GOOGLE SHEET (2 min)

### 4.1 Crear spreadsheet

```
Ir a: https://sheets.google.com
Click "Blank" (nueva hoja en blanco)
```

### 4.2 Renombrar

```
Click en "Untitled spreadsheet"
Nombre: CITRO - Solicitudes
Renombrar hoja (pestaña abajo): Solicitudes
```

### 4.3 Crear encabezados

**En la primera fila (A1 hasta O1), escribir:**

```
A1: Folio
B1: Fecha
C1: Tipo
D1: Nombre
E1: Email
F1: Matrícula
G1: Monto
H1: Estado
I1: URL PDF
J1: Drive File ID
K1: Datos JSON
L1: Email Enviado
M1: Notas CT
N1: Fecha Actualización
O1: Actualizado Por
```

### 4.4 Formatear encabezados

```
Seleccionar fila 1 (A1:O1)
Formato → Negrita
Formato → Color de fondo → Gris claro
```

### 4.5 COPIAR SPREADSHEET ID

**En la URL, copiar el ID:**

```
https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/edit

Ejemplo:
https://docs.google.com/spreadsheets/d/1abc123XYZ.../edit
                                          ^^^^^^^^^
                                          Copiar esto
```

**GUARDAR ESTE ID** ✅

---

## 🎯 PASO 5: CREAR CARPETA EN DRIVE (2 min)

### 5.1 Ir a Google Drive

```
https://drive.google.com
```

### 5.2 Crear carpeta raíz

```
Click "+ New" → Folder
Name: CITRO Solicitudes
Click "Create"
```

### 5.3 COPIAR FOLDER ID

**Abrir la carpeta, copiar ID de la URL:**

```
https://drive.google.com/drive/folders/[ESTE_ES_EL_ID]

Ejemplo:
https://drive.google.com/drive/folders/1xyz789ABC...
                                          ^^^^^^^^^^
                                          Copiar esto
```

**GUARDAR ESTE ID** ✅

**Nota:** Las subcarpetas se crean automáticamente por el sistema.

---

## 🎯 PASO 6: CONFIGURAR CÓDIGO (5 min)

### 6.1 Descargar archivos

**Archivos necesarios (ya los tienes):**
```
✅ index-google.html → renombrar a index.html
✅ config-google.js
✅ google-auth.js
✅ google-drive.js
✅ google-sheets.js
✅ google-gmail.js
✅ app-google.js
✅ forms-data.js (mismo que versión Microsoft)
```

### 6.2 Editar config-google.js

**Abrir config-google.js y actualizar:**

```javascript
google: {
    clientId: 'PEGAR_TU_CLIENT_ID.apps.googleusercontent.com',  // Del Paso 3
    apiKey: 'PEGAR_TU_API_KEY',  // Del Paso 3 (opcional)
}

sheets: {
    spreadsheetId: 'PEGAR_TU_SPREADSHEET_ID',  // Del Paso 4
}

drive: {
    rootFolderId: 'PEGAR_TU_FOLDER_ID',  // Del Paso 5
}
```

---

## 🎯 PASO 7: SUBIR A GITHUB (3 min)

### 7.1 Crear repositorio

```
https://github.com/new

Repository name: citro-sistema-google
Description: Sistema CITRO con Google Workspace
Public
Create repository
```

### 7.2 Subir archivos

```bash
# En tu computadora
cd citro-sistema-google

# Copiar todos los archivos aquí

# Subir
git init
git add .
git commit -m "Sistema CITRO Google v1.0"
git remote add origin https://github.com/TU_USUARIO/citro-sistema-google.git
git push -u origin main
```

### 7.3 Configurar GitHub Pages

```
Settings → Pages
Source: Deploy from a branch
Branch: main
Folder: / (root)
Save
```

**Esperar 2-3 minutos...**

**Tu sitio estará en:**
```
https://TU_USUARIO.github.io/citro-sistema-google/
```

---

## 🎯 PASO 8: ACTUALIZAR REDIRECT URIS (2 min)

### 8.1 Volver a Google Cloud Console

```
APIs & Services → Credentials
Click en tu OAuth Client ID
```

### 8.2 Actualizar URLs

**En "Authorized redirect URIs", agregar:**
```
https://TU_USUARIO.github.io/citro-sistema-google/
```

**Click "Save"**

---

## ✅ PASO 9: PROBAR EL SISTEMA (3 min)

### 9.1 Abrir el sitio

```
https://TU_USUARIO.github.io/citro-sistema-google/
```

### 9.2 Hacer login

```
Click "Iniciar sesión con Google"
→ Seleccionar tu cuenta @uv.mx
→ Aceptar permisos
→ ✅ Logueado
```

### 9.3 Enviar solicitud de prueba

```
1. Click en cualquier formulario
2. Llenar datos de prueba
3. Click "Enviar Solicitud"
4. Esperar...
5. ✅ Éxito!
```

### 9.4 Verificar

**Google Sheets:**
```
Abrir tu spreadsheet
→ Debe aparecer la solicitud ✅
```

**Google Drive:**
```
Abrir carpeta CITRO Solicitudes
→ Debe aparecer subcarpeta con el PDF ✅
```

**Gmail:**
```
Revisar inbox
→ Debe llegar email de confirmación ✅
```

---

## 🎉 ¡LISTO!

**Sistema 100% funcional en Google** ✅

---

## 📊 ESTRUCTURA FINAL

```
Google Cloud Project: CITRO Sistema UV
│
├── 🔐 OAuth 2.0 Client
│   └─ Login con Google
│
├── 📊 Google Sheets: CITRO - Solicitudes
│   └─ Base de datos de solicitudes
│
├── 📁 Google Drive: CITRO Solicitudes/
│   ├── CITRO - Apoyo Académico/
│   ├── CITRO - Aval Institucional/
│   ├── CITRO - Apoyo a Terceros/
│   ├── CITRO - Comité Tutorial/
│   └── CITRO - Solicitud Libre/
│
├── 📧 Gmail API
│   └─ Emails automáticos
│
└── 📅 Calendar API
    └─ Eventos (opcional)
```

---

## 🎯 VENTAJAS VS MICROSOFT

| Aspecto | Microsoft 365 | Google Workspace |
|---------|---------------|------------------|
| **Costo** | Licencias | ✅ GRATIS |
| **Setup** | 1 hora | ✅ 30 min |
| **Permisos** | Admin required | ✅ No requiere |
| **Complejidad** | Alta | ✅ Baja |
| **Documentación** | SharePoint Lists | ✅ Google Sheets |
| **Visual** | Limitado | ✅ Sheets = Excel visual |
| **Exportar** | Requiere código | ✅ Sheets export nativo |
| **Compartir** | Complicado | ✅ Share button |
| **Colaboración** | Básica | ✅ Real-time |

---

## 🔧 TROUBLESHOOTING

### Error: "Access blocked"

**Solución:**
```
Google Cloud Console → OAuth consent screen
Publishing status: Testing → Publish App
```

### Error: "Invalid redirect URI"

**Solución:**
```
Verificar que la URL en Credentials coincida
exactamente con la URL de tu sitio
```

### Error: "Spreadsheet not found"

**Solución:**
```
Verificar que el Spreadsheet ID en config-google.js
sea correcto (sin espacios ni caracteres extra)
```

### PDF no se sube a Drive

**Solución:**
```
Verificar Folder ID
Verificar que Drive API esté habilitada
Revisar consola (F12) para errores
```

---

## 📞 SOPORTE

**Email:** ctecnicocitro@uv.mx

---

## 🎯 PRÓXIMOS PASOS

### Opcional - Mejoras avanzadas:

```
✅ Publicar app OAuth (Testing → Production)
✅ Agregar más usuarios de prueba
✅ Crear dashboard en Google Data Studio
✅ Configurar Google Apps Script para automatizaciones
✅ Integrar con Google Forms
✅ Deploy en Firebase Hosting (más rápido que GitHub Pages)
```

---

**¡Disfruta tu sistema CITRO Google!** 🚀

© 2026 Universidad Veracruzana - CITRO
