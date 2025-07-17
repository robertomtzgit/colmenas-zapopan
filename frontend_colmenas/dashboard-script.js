// Verificar autenticación al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication()
    setupUserInterface()
    loadDashboardData()
    loadActivities()
})

const userId = localStorage.getItem("userId")
const userName = localStorage.getItem("userName")
const userRole = localStorage.getItem("userRole") // Usamos userRole consistentemente

function checkAuthentication() {
    if (!userRole || !userName || !userId) {
        // Si no hay datos de usuario, redirigir al login
        window.location.href = "index.html"
        return
    }
}

function setupUserInterface() {
    // Actualizar mensaje de bienvenida
    const welcomeMessage = document.getElementById("welcomeMessage")
    const userTypeDisplay = document.getElementById("userTypeDisplay")
    const sectionDescription = document.getElementById("sectionDescription")
    const promotorActions = document.getElementById("promotorActions")

    welcomeMessage.textContent = `Bienvenido, ${userName}`
    userTypeDisplay.textContent = userRole

    if (userRole === "ADMIN" || userRole === "RESPONSABLE_COLMENA") {
        // Asumiendo que 'ADMIN' o 'RESPONSABLE_COLMENA' son promotores
        userTypeDisplay.style.backgroundColor = "rgba(16, 185, 129, 0.2)"
        userTypeDisplay.style.color = "#065f46"
        sectionDescription.textContent = "Gestiona las actividades de tu comunidad"
        promotorActions.style.display = "flex"
    } else {
        // Rol por defecto 'USUARIO'
        userTypeDisplay.style.backgroundColor = "rgba(59, 130, 246, 0.2)"
        userTypeDisplay.style.color = "#1e40af"
        sectionDescription.textContent = "Actividades disponibles en tu comunidad"
        promotorActions.style.display = "none"
    }
}

async function loadDashboardData() {
    // Cargar Total Usuarios
    try {
        // Usar la función de api.js
        const usersRes = await window.getAllUsuarios()
        if (usersRes.ok) {
            const users = await usersRes.json()
            document.getElementById("totalUsuarios").textContent = users.length
        } else {
            const errorData = await usersRes.json()
            console.error("Error al cargar total de usuarios:", errorData)
            document.getElementById("totalUsuarios").textContent = "Error"
        }
    } catch (error) {
        console.error("Error de red al cargar total de usuarios:", error)
        document.getElementById("totalUsuarios").textContent = "Error"
    }

    // Cargar Actividades Activas
    try {
        // Usar la función de api.js
        const activitiesRes = await window.getAllActividades()
        if (activitiesRes.ok) {
            const activities = await activitiesRes.json()
            const activeActivities = activities.filter((act) => act.activa).length
            document.getElementById("actividadesActivas").textContent = activeActivities
        } else {
            const errorData = await activitiesRes.json()
            console.error("Error al cargar actividades activas:", errorData)
            document.getElementById("actividadesActivas").textContent = "Error"
        }
    } catch (error) {
        console.error("Error de red al cargar actividades activas:", error)
        document.getElementById("actividadesActivas").textContent = "Error"
    }

    // Cargar Mis Inscripciones (solo para usuarios logueados)
    if (userId) {
        try {
            // Usar la función de api.js
            const inscripcionesRes = await window.getInscripcionesByUsuarioId(userId)
            if (inscripcionesRes.ok) {
                const inscripciones = await inscripcionesRes.json()
                document.getElementById("misInscripciones").textContent = inscripciones.length
            } else {
                const errorData = await inscripcionesRes.json()
                console.error("Error al cargar mis inscripciones:", errorData)
                document.getElementById("misInscripciones").textContent = "Error"
            }
        } catch (error) {
            console.error("Error de red al cargar mis inscripciones:", error)
            document.getElementById("misInscripciones").textContent = "Error"
        }
    } else {
        document.getElementById("misInscripciones").textContent = "N/A"
    }

    // Cargar Notificaciones No Leídas (solo para usuarios logueados)
    if (userId) {
        try {
            // Usar la función de api.js
            const notificacionesRes = await window.getUnreadNotificacionesByUsuarioId(userId)
            if (notificacionesRes.ok) {
                const notificaciones = await notificacionesRes.json()
                document.getElementById("notificacionesNoLeidas").textContent = notificaciones.length
            } else {
                const errorData = await notificacionesRes.json()
                console.error("Error al cargar notificaciones no leídas:", errorData)
                document.getElementById("notificacionesNoLeidas").textContent = "Error"
            }
        } catch (error) {
            console.error("Error de red al cargar notificaciones no leídas:", error)
            document.getElementById("notificacionesNoLeidas").textContent = "Error"
        }
    } else {
        document.getElementById("notificacionesNoLeidas").textContent = "N/A"
    }
}

async function loadActivities() {
    const activitiesList = document.getElementById("activitiesList")
    activitiesList.innerHTML = '<p id="loadingActivities">Cargando actividades...</p>'

    try {
        // Usar la función de api.js
        const response = await window.getAllActividades()
        if (response.ok) {
            const activities = await response.json()
            activitiesList.innerHTML = "" // Limpiar el mensaje de carga

            if (activities.length === 0) {
                activitiesList.innerHTML = "<p>No hay actividades disponibles en este momento.</p>"
                return
            }

            activities.forEach((activity) => {
                const activityCard = createActivityCard(activity)
                activitiesList.appendChild(activityCard)
            })
        } else {
            const errorData = await response.json()
            activitiesList.innerHTML = `<p class="error-message">Error al cargar actividades: ${errorData.message || "Desconocido"}</p>`
            console.error("Error al cargar actividades:", errorData)
        }
    } catch (error) {
        activitiesList.innerHTML = '<p class="error-message">Error de conexión al cargar actividades.</p>'
        console.error("Error de red al cargar actividades:", error)
    }
}

function createActivityCard(activity) {
    const card = document.createElement("div")
    card.className = "activity-card"

    const startDate = new Date(activity.fechaInicio)
    const endDate = new Date(activity.fechaFin)
    const now = new Date()

    let statusClass = ""
    let statusText = ""

    if (now < startDate) {
        statusClass = "status-upcoming"
        statusText = "Próximo"
    } else if (now >= startDate && now <= endDate) {
        statusClass = "status-ongoing"
        statusText = "En curso"
    } else {
        statusClass = "status-completed"
        statusText = "Completado"
    }

    const categoryName = activity.categoria ? activity.categoria.nombre : "Sin Categoría"
    let categoryClass = ""
    switch (categoryName.toLowerCase()) {
        case "deportes":
            categoryClass = "category-wellness" // Usando una clase existente para un color similar
            break
        case "educacion":
            categoryClass = "category-education"
            break
        case "infraestructura":
            categoryClass = "category-government"
            break
        default:
            categoryClass = "category-badge" // Clase genérica
    }

    card.innerHTML = `
                <div class="activity-header">
                        <div>
                                <div class="activity-title">${activity.titulo}</div>
                        </div>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="activity-description">${activity.descripcion || "Sin descripción."}</div>
                <div class="activity-details">
                        <div class="detail-item"><span class="detail-icon">📅</span> <span>${startDate.toLocaleDateString()}</span></div>
                        <div class="detail-item"><span class="detail-icon">🕐</span> <span>${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
                        <div class="detail-item"><span class="detail-icon">📍</span> <span>${activity.ubicacion || "No especificada"}</span></div>
                        <div class="detail-item"><span class="detail-icon">👥</span> <span>${activity.capacidadMaxima !== null ? `${activity.capacidadMaxima} participantes` : "Sin límite"}</span></div>
                </div>
                <div class="activity-footer">
                        <span class="category-badge ${categoryClass}">${categoryName}</span>
                        <div class="activity-actions" id="actions-${activity.id}">
                                <!-- Botones se llenan dinámicamente -->
                        </div>
                </div>
        `

    const actionsContainer = card.querySelector(`#actions-${activity.id}`)
    setupActivityActions(actionsContainer, activity, statusText)

    return card
}

async function setupActivityActions(actionsContainer, activity, statusText) {
    actionsContainer.innerHTML = "" // Limpiar botones existentes

    if (userRole === "ADMIN" || userRole === "RESPONSABLE_COLMENA") {
        // Botones para promotores
        if (statusText === "Completado") {
            actionsContainer.innerHTML = `
                                <button class="btn btn-small btn-outline" onclick="verResumen(${activity.id})">Ver Resumen</button>
                                <button class="btn btn-small btn-primary" onclick="openReportsPage(${activity.id})">Reportes</button>
                        `
        } else {
            actionsContainer.innerHTML = `
                                <button class="btn btn-small btn-outline" onclick="editarActividad(${activity.id})">Editar</button>
                                <button class="btn btn-small btn-primary" onclick="openActivityDetailModal(${activity.id})">Ver Detalles</button>
                        `
        }
    } else {
        // Botones para usuarios
        if (statusText === "Próximo") {
            // Verificar si el usuario ya está inscrito
            // Usar la función de api.js
            const inscripcionesRes = await window.getInscripcionesByUsuarioId(userId)
            if (inscripcionesRes.ok) {
                const inscripciones = await inscripcionesRes.json()
                const alreadyEnrolled = inscripciones.some((insc) => insc.actividad.id === activity.id)

                if (alreadyEnrolled) {
                    actionsContainer.innerHTML = `
                                                <button class="btn btn-small btn-outline" disabled>Ya Inscrito</button>
                                                <button class="btn btn-small btn-primary" onclick="openActivityDetailModal(${activity.id})">Ver Detalles</button>
                                        `
                } else {
                    actionsContainer.innerHTML = `
                                                <button class="btn btn-small btn-primary" onclick="inscribirse(${activity.id})">Inscribirse</button>
                                                <button class="btn btn-small btn-outline" onclick="openActivityDetailModal(${activity.id})">Ver Detalles</button>
                                        `
                }
            } else {
                // Si hay un error al cargar inscripciones, aún ofrecer la opción de inscribirse
                actionsContainer.innerHTML = `
                                        <button class="btn btn-small btn-primary" onclick="inscribirse(${activity.id})">Inscribirse</button>
                                        <button class="btn btn-small btn-outline" onclick="openActivityDetailModal(${activity.id})">Ver Detalles</button>
                                `
                console.error("Error al verificar inscripciones para la actividad:", await inscripcionesRes.json())
            }
        } else if (statusText === "En curso") {
            actionsContainer.innerHTML = `
                                <button class="btn btn-small btn-outline" onclick="openActivityDetailModal(${activity.id})">Ver Detalles</button>
                        `
        } else {
            // Completado
            actionsContainer.innerHTML = `
                                <button class="btn btn-small btn-outline" onclick="verResumen(${activity.id})">Ver Resumen</button>
                        `
        }
    }
}

// --- Funciones de navegación y acciones ---
function logout() {
    if (confirm("¿Está seguro que desea cerrar sesión?")) {
        localStorage.clear() // Limpiar todo el localStorage
        window.location.href = "index.html"
    }
}

function openNewActivityModal() {
    alert("Funcionalidad para crear nueva actividad (requiere un modal/formulario).")
    // Aquí podrías redirigir a una página de creación o abrir un modal complejo
    // window.location.href = 'create-activity.html';
}

function openReportsPage(activityId = null) {
    if (activityId) {
        alert(`Funcionalidad para ver reportes de la actividad ${activityId} (requiere una página/modal de reportes).`)
    } else {
        alert("Funcionalidad para ver reportes generales (requiere una página de reportes).")
    }
    // window.location.href = 'reports.html';
}

function openUsersPage() {
    window.location.href = "users.html"
}

function openColmenasPage() {
    alert("Funcionalidad para gestionar colmenas (requiere una página de gestión de colmenas).")
    // window.location.href = 'colmenas.html';
}

function verCalendario() {
    alert("Funcionalidad para ver calendario de actividades (requiere una página de calendario).")
}

function editarActividad(activityId) {
    alert(`Funcionalidad para editar actividad ${activityId} (requiere un modal/formulario de edición).`)
}

async function inscribirse(activityId) {
    if (confirm("¿Desea inscribirse a esta actividad?")) {
        try {
            // Usar la función de api.js
            const response = await window.createInscripcion({ actividadId: activityId, usuarioId: userId })
            if (response.ok) {
                alert(`¡Te has inscrito exitosamente a la actividad ${activityId}!`)
                loadActivities() // Recargar actividades para actualizar el estado del botón
                loadDashboardData() // Actualizar el contador de inscripciones
            } else {
                const errorData = await response.json()
                alert(`Error al inscribirse: ${errorData.message || "Desconocido"}`)
                console.error("Error al inscribirse:", errorData)
            }
        } catch (error) {
            alert("Error de conexión al inscribirse.")
            console.error("Error de red al inscribirse:", error)
        }
    }
}

function verResumen(activityId) {
    alert(`Funcionalidad para ver resumen de la actividad ${activityId} (requiere una página/modal de resumen).`)
}

// --- Modal de Detalles de Actividad ---
const activityDetailModal = document.getElementById("activityDetailModal")
const modalActivityTitle = document.getElementById("modalActivityTitle")
const modalActivityDescription = document.getElementById("modalActivityDescription")
const modalActivityDate = document.getElementById("modalActivityDate")
const modalActivityTime = document.getElementById("modalActivityTime")
const modalActivityLocation = document.getElementById("modalActivityLocation")
const modalActivityCapacity = document.getElementById("modalActivityCapacity")
const modalActivityColmena = document.getElementById("modalActivityColmena")
const modalActivityCategory = document.getElementById("modalActivityCategory")
const modalActivityCreator = document.getElementById("modalActivityCreator")
const modalActions = activityDetailModal.querySelector(".modal-actions")

async function openActivityDetailModal(activityId) {
    try {
        // Usar la función de api.js
        const response = await window.getActividadById(activityId)
        if (response.ok) {
            const activity = await response.json()
            const startDate = new Date(activity.fechaInicio)
            const endDate = new Date(activity.fechaFin)

            modalActivityTitle.textContent = activity.titulo
            modalActivityDescription.textContent = activity.descripcion || "Sin descripción."
            modalActivityDate.textContent = startDate.toLocaleDateString()
            modalActivityTime.textContent = `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            modalActivityLocation.textContent = activity.ubicacion || "No especificada"
            modalActivityCapacity.textContent =
                activity.capacidadMaxima !== null ? `${activity.capacidadMaxima} participantes` : "Sin límite"
            modalActivityColmena.textContent = activity.colmena ? activity.colmena.nombre : "N/A"
            modalActivityCategory.textContent = activity.categoria ? activity.categoria.nombre : "N/A"
            modalActivityCreator.textContent = activity.creadoPor ? activity.creadoPor.nombre : "N/A"

            // Puedes añadir botones específicos al modal si es necesario
            modalActions.innerHTML = `<button class="btn btn-primary" onclick="closeActivityDetailModal()">Cerrar</button>`

            activityDetailModal.style.display = "block"
        } else {
            const errorData = await response.json()
            alert(`Error al cargar detalles de actividad: ${errorData.message || "Desconocido"}`)
            console.error("Error al cargar detalles de actividad:", errorData)
        }
    } catch (error) {
        alert("Error de conexión al cargar detalles de actividad.")
        console.error("Error de red al cargar detalles de actividad:", error)
    }
}

function closeActivityDetailModal() {
    activityDetailModal.style.display = "none"
}

// Cerrar modal al hacer clic fuera de él
window.onclick = (event) => {
    if (event.target == activityDetailModal) {
        activityDetailModal.style.display = "none"
    }
}
