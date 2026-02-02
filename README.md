# CRUDZASO v1 - Sistema de Gestión Académica

Sistema completo de gestión de tareas académicas con comentarios humanizados para facilitar el aprendizaje.

## 🚀 Inicio Rápido

### Prerequisitos
- Node.js (v14 o superior)
- npm o yarn

### Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Iniciar JSON Server (Base de datos simulada):**
```bash
npm run dev
```
Esto iniciará el servidor en `http://localhost:3000`

3. **Abrir la aplicación:**
Abre `index.html` en tu navegador o usa un servidor local como Live Server.

### API Endpoints

JSON Server proporciona automáticamente estos endpoints:

- **Usuarios:**
  - `GET /users` - Obtener todos los usuarios
  - `GET /users/:id` - Obtener usuario específico
  - `POST /users` - Crear nuevo usuario
  - `PUT /users/:id` - Actualizar usuario
  - `DELETE /users/:id` - Eliminar usuario

- **Tareas:**
  - `GET /tasks` - Obtener todas las tareas
  - `GET /tasks/:id` - Obtener tarea específica
  - `POST /tasks` - Crear nueva tarea
  - `PUT /tasks/:id` - Actualizar tarea
  - `DELETE /tasks/:id` - Eliminar tarea

- **Filtros avanzados:**
  - `GET /tasks?userId=user_001` - Tareas por usuario
  - `GET /tasks?status=Completed` - Tareas completadas
  - `GET /tasks?category=Mathematics` - Tareas por categoría

### Datos de Prueba

**Usuarios disponibles:**
- **ADMIN:** `admin@crudzaso.edu` / `admin123` (Administrador)
- **STUDENT:** `maria@university.edu` / `12345` (Estudiante)  
- **STUDENT:** `juan@university.edu` / `password` (Estudiante)

## 📁 Estructura del Proyecto

```
version1-humanizada/
├── index.html              # Página de login
├── package.json            # Configuración de Node.js
├── db.json                 # Base de datos JSON
├── README.md               # Este archivo
├── pages/                  # Páginas adicionales
│   ├── dashboard.html      # Panel principal
│   ├── tasks.html         # Gestión de tareas
│   ├── create-task.html   # Crear/editar tareas
│   ├── profile.html       # Perfil de usuario
│   └── register.html      # Registro de usuarios
└── assets/
    ├── css/
    │   └── styles.css     # Estilos completos
    └── js/
        ├── login.js       # Autenticación
        ├── register.js    # Registro
        ├── dashboard.js   # Panel principal
        ├── tasks.js       # Gestión de tareas
        ├── create-task.js # Formulario de tareas
        └── profile.js     # Perfil de usuario
```

## 🎯 Funcionalidades

- ✅ **Autenticación completa** con JSON Server
- ✅ **CRUD de tareas** con persistencia real
- ✅ **Dashboard con estadísticas** actualizadas
- ✅ **Búsqueda y filtros** avanzados
- ✅ **Perfil de usuario** editable
- ✅ **Responsive design** para todos los dispositivos
- ✅ **Comentarios humanizados** para aprendizaje

## 🔧 Desarrollo

### Modificar datos
Edita `db.json` para cambiar los datos iniciales.

### Personalizar API
JSON Server permite configuraciones avanzadas en `package.json`:
- Cambiar puerto: `--port 3001`
- Habilitar CORS: `--cors`
- Modo de solo lectura: `--ro`

## 📚 Aprendizaje

Esta versión incluye:
- **Comentarios detallados** explicando cada función
- **Filosofías de diseño** y mejores prácticas
- **Ejemplos prácticos** de integración con API
- **Patrones de desarrollo** frontend modernos

¡Perfecto para estudiantes que quieren entender cómo funciona una aplicación web completa!