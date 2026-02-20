# SociApp - Plataforma de Gestión para Asociaciones

**SociApp** es una solución integral diseñada para digitalizar y centralizar la administración de asociaciones sin ánimo de lucro o fundaciones. Permite una gestión eficiente de socios, actividades, proyectos, finanzas y comunicación, todo desde una interfaz moderna, intuitiva y responsive.

---

## 🚀 Funcionalidades Principales

### 1. Gestión de Usuarios y Socios
*   **Directorio Completo**: Registro detallado de usuarios con información de contacto, DNI, dirección y categoría (Monitor, Voluntario, Socio, etc.).
*   **Control de Membresía**: Gestión del estado de alta/baja, tipo de cuota y forma de pago.
*   **Carnet de Socio Virtual**: Visualización rápida de datos básicos y estado.

### 2. Administración de Proyectos
*   **Seguimiento de Proyectos**: Creación y monitorización de proyectos con estados personalizables (Activo, Pendiente, Finalizado).
*   **Gestión Documental**: Posibilidad de adjuntar archivos PDF a cada proyecto para tener la documentación legal y técnica siempre a mano.
*   **Control Presupuestario**: Seguimiento de presupuestos asignados y fuentes de financiación.
*   **Vinculación con Actividades**: Los proyectos pueden agrupar múltiples actividades para un seguimiento consolidado.

### 3. Actividades y Eventos
*   **Planificación**: Programación de actividades con detalles de lugar, día de la semana y rango horario.
*   **Asignación de Monitores**: Registro de monitores responsables por cada actividad.
*   **Vínculo con Proyectos**: Asociación directa de actividades a uno o varios proyectos marco.

### 4. Configuración y Finanzas
*   **Datos de la Asociación**: Panel para gestionar la información legal de la entidad (Nombre, CIF, Contacto).
*   **Junta Directiva**: Registro y organigrama de los cargos de la junta.
*   **Gestión Bancaria**: Administración de cuentas bancarias (IBAN/SWIFT) de la asociación.
*   **Donativos y Herencias**: Registro detallado de donaciones recibidas para cumplir con la transparencia fiscal.
*   **Relaciones Institucionales**: Directorio de entidades colaboradoras y convenios.

### 5. Mensajería Integral
*   **Comunicación Directa**: Envío de correos electrónicos individuales o masivos a los socios.
*   **Notificaciones**: Sistema de feedback inmediato para acciones realizadas en la plataforma.

### 6. Interfaz y Experiencia de Usuario (UX)
*   **Modo Oscuro/Claro**: Soporte nativo para temas visuales.
*   **Diseño Mobile-First**: Menú inferior tipo "Sticky Web" en móviles para una navegación ergonómica similar a una App nativa.
*   **Vistas Dinámicas**: Listas expandibles con micro-animaciones para una visualización limpia de la información compleja.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
*   **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
*   **Store**: [Pinia](https://pinia.vuejs.org/) para la gestión de estado.
*   **Estilos**: Vanilla CSS con variables modernas y diseño responsive.
*   **Iconos**: Material Symbols Outlined.

### Backend
*   **Framework**: [NestJS](https://nestjs.com/) para una arquitectura escalable.
*   **Base de Datos**: [TypeORM](https://typeorm.io/) con persistencia de datos.
*   **Seguridad**: Autenticación basada en JWT y roles de usuario.
*   **Comunicación**: Servicio de envío de correo integrado.

### Despliegue e Infraestructura
*   **Virtualización**: Docker y Docker Compose para un entorno de ejecución reproducible.
*   **Scripts**: Utilidades en Shell para facilitar el despliegue automático.

---

## 🛠️ Instalación y Configuración

### Requisitos Previos
*   Docker y Docker Compose (Recomendado)
*   Node.js (v18+) si se ejecuta localmente.

### Uso con Docker (Recomendado)
1. Ejecuta el script de inicio:
   ```bash
   ./docker.sh
   ```
   *Este comando levantará los contenedores de backend, frontend y base de datos de manera automática.*

### Ejecución Manual (Desarrollo)

#### Backend
1. `cd backend`
2. `npm install`
3. `npm run start:dev`

#### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 📄 Licencia
Este proyecto es privado y confidencial. Todos los derechos reservados.
