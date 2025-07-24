// Gestor de Actividades para Usuarios
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  if (!isAuthenticated()) {
    window.location.href = "../../login.html"
    return
  }

  // Inicializar la página
  initActivitiesPage()
})

// Verificar autenticación
function isAuthenticated() {
  const userId = localStorage.getItem("userId")
  return !!userId
}

// Inicializar página de actividades
async function initActivitiesPage() {
  try {
    // Cargar información del usuario
    await loadUserInfo()

    // Cargar actividades
    await loadActivities()

    // Cargar estadísticas
    await loadUserStats()

    // Cargar próximas actividades
    await loadUpcomingActivities()

    // Configurar event listeners
    setupEventListeners()

    // Configurar dropdown del usuario
    setupUserDropdown()
  } catch (error) {
    console.error("Error initializing activities page:", error)
    showAlert("Error al cargar las actividades", "error")
  }
}

// Cargar información del usuario
async function loadUserInfo() {
  const session = getSession()
  const userName = session.userName || "Usuario Demo"

  // Actualizar avatares
  const avatarElements = document.querySelectorAll(".user-avatar")
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1877f2&color=fff&size=128`

  avatarElements.forEach((element) => {
    if (element.tagName === "IMG") {
      element.src = avatarUrl
      element.alt = userName
    }
  })
}

// Cargar actividades
async function loadActivities() {
  try {
    const response = await apiFetch("/actividades/usuario")

    let activities = []
    if (response && response.ok) {
      activities = await response.json()
    } else {
      // Datos de prueba
      activities = [
        {
          id: 1,
          titulo: "Limpieza Comunitaria",
          descripcion: "Jornada de limpieza en el parque central de la colmena",
          fecha: "2024-01-25T10:00:00Z",
          ubicacion: "Plaza Central",
          capacidadMaxima: 30,
          inscritos: 18,
          estado: "disponible",
          inscrito: false,
          completada: false,
          puntos: 10,
        },
        {
          id: 2,
          titulo: "Taller de Reciclaje",
          descripcion: "Aprende técnicas de reciclaje y reutilización de materiales",
          fecha: "2024-01-28T14:00:00Z",
          ubicacion: "Centro Comunitario",
          capacidadMaxima: 20,
          inscritos: 15,
          estado: "inscrito",
          inscrito: true,
          completada: false,
          puntos: 15,
        },
        {
          id: 3,
          titulo: "Huerto Urbano",
          descripcion: "Mantenimiento del huerto comunitario",
          fecha: "2024-01-15T09:00:00Z",
          ubicacion: "Huerto Comunitario",
          capacidadMaxima: 15,
          inscritos: 12,
          estado: "completada",
          inscrito: true,
          completada: true,
          puntos: 20,
        },
        {
          id: 4,
          titulo: "Reunión Mensual",
          descripcion: "Reunión mensual de la colmena para revisar avances",
          fecha: "2024-02-01T18:00:00Z",
          ubicacion: "Salón Principal",
          capacidadMaxima: 50,
          inscritos: 32,
          estado: "disponible",
          inscrito: false,
          completada: false,
          puntos: 5,
        },
        {
          id: 5,
          titulo: "Taller de Compostaje",
          descripcion: "Aprende a hacer compost casero para el huerto",
          fecha: "2024-02-05T16:00:00Z",
          ubicacion: "Huerto Comunitario",
          capacidadMaxima: 25,
          inscritos: 8,
          estado: "disponible",
          inscrito: false,
          completada: false,
          puntos: 12,
        },
      ]
    }

    renderActivities(activities)
    window.allActivities = activities // Guardar para filtros
  } catch (error) {
    console.error("Error loading activities:", error)
    showEmptyActivities()
  }
}

// Renderizar actividades
function renderActivities(activities) {
  const container = document.getElementById("activitiesContainer")

  if (!activities || activities.length === 0) {
    showEmptyActivities()
    return
  }

  container.innerHTML = activities.map((activity) => createActivityHTML(activity)).join("")
}

// Crear HTML para una actividad
function createActivityHTML(activity) {
  const date = new Date(activity.fecha)
  const formattedDate = date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const statusBadge = getStatusBadge(activity)
  const actionButton = getActionButton(activity)
  const progressBar = getProgressBar(activity)

  return `
    <div class="card activity-card" data-activity-id="${activity.id}">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <h3>${activity.titulo}</h3>
        ${statusBadge}
      </div>
      
      <p style="color: #65676b; margin-bottom: 16px;">${activity.descripcion}</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; font-size: 14px;">
        <div>
          <i class="fas fa-calendar" style="color: #1877f2; margin-right: 8px;"></i>
          <strong>Fecha:</strong> ${formattedDate}
        </div>
        <div>
          <i class="fas fa-clock" style="color: #1877f2; margin-right: 8px;"></i>
          <strong>Hora:</strong> ${formattedTime}
        </div>
        <div>
          <i class="fas fa-map-marker-alt" style="color: #1877f2; margin-right: 8px;"></i>
          <strong>Ubicación:</strong> ${activity.ubicacion}
        </div>
        <div>
          <i class="fas fa-star" style="color: #f39c12; margin-right: 8px;"></i>
          <strong>Puntos:</strong> ${activity.puntos}
        </div>
      </div>
      
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 14px; color: #65676b;">Participantes</span>
          <span style="font-size: 14px; color: #1c1e21;">${activity.inscritos}/${activity.capacidadMaxima}</span>
        </div>
        ${progressBar}
      </div>
      
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        ${actionButton}
      </div>
    </div>
  `
}

// Obtener badge de estado
function getStatusBadge(activity) {
  if (activity.completada) {
    return '<span class="status-badge completed">Completada</span>'
  } else if (activity.inscrito) {
    return '<span class="status-badge pending">Inscrito</span>'
  } else if (activity.inscritos >= activity.capacidadMaxima) {
    return '<span class="status-badge">Llena</span>'
  } else {
    return '<span class="status-badge active">Disponible</span>'
  }
}

// Obtener botón de acción
function getActionButton(activity) {
  if (activity.completada) {
    return '<button class="btn btn-outline" disabled><i class="fas fa-check"></i> Completada</button>'
  } else if (activity.inscrito) {
    return `<button class="btn btn-warning" onclick="cancelInscription(${activity.id})"><i class="fas fa-times"></i> Cancelar</button>`
  } else if (activity.inscritos >= activity.capacidadMaxima) {
    return '<button class="btn btn-outline" disabled><i class="fas fa-users"></i> Llena</button>'
  } else {
    return `<button class="btn btn-primary" onclick="joinActivity(${activity.id})"><i class="fas fa-plus"></i> Inscribirse</button>`
  }
}

// Obtener barra de progreso
function getProgressBar(activity) {
  const percentage = (activity.inscritos / activity.capacidadMaxima) * 100
  const color = percentage >= 90 ? "#f44336" : percentage >= 70 ? "#ff9800" : "#4caf50"

  return `
    <div style="width: 100%; background: #f0f2f5; border-radius: 4px; height: 6px;">
      <div style="width: ${percentage}%; background: ${color}; border-radius: 4px; height: 100%; transition: width 0.3s;"></div>
    </div>
  `
}

// Mostrar actividades vacías
function showEmptyActivities() {
  const container = document.getElementById("activitiesContainer")
  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-calendar-alt"></i>
      <h3>No hay actividades</h3>
      <p>Aún no hay actividades disponibles en tu colmena.</p>
    </div>
  `
}

// Cargar estadísticas del usuario
async function loadUserStats() {
  try {
    const session = getSession()
    const response = await apiFetch(`/usuarios/${session.userId}/estadisticas`)

    let stats = {}
    if (response && response.ok) {
      stats = await response.json()
    } else {
      // Datos de prueba basados en las actividades
      const activities = window.allActivities || []
      stats = {
        completadas: activities.filter((a) => a.completada).length,
        proximas: activities.filter((a) => a.inscrito && !a.completada).length,
        puntos: activities.filter((a) => a.completada).reduce((sum, a) => sum + a.puntos, 0),
      }
    }

    updateUserStats(stats)
  } catch (error) {
    console.error("Error loading user stats:", error)
  }
}

// Actualizar estadísticas del usuario
function updateUserStats(stats) {
  const completedElement = document.getElementById("completedActivities")
  const upcomingElement = document.getElementById("upcomingActivities")
  const pointsElement = document.getElementById("totalPoints")

  if (completedElement) completedElement.textContent = stats.completadas || 0
  if (upcomingElement) upcomingElement.textContent = stats.proximas || 0
  if (pointsElement) pointsElement.textContent = stats.puntos || 0
}

// Cargar próximas actividades
async function loadUpcomingActivities() {
  try {
    const response = await apiFetch("/actividades/usuario/proximas")

    let activities = []
    if (response && response.ok) {
      activities = await response.json()
    } else {
      const activities = window.allActivities || []
      const upcoming = activities
        .filter((a) => a.inscrito && !a.completada)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 3)

      renderUpcomingActivities(upcoming)
      return
    }

    renderUpcomingActivities(activities)
  } catch (error) {
    console.error("Error loading upcoming activities:", error)
  }
}

// Renderizar próximas actividades
function renderUpcomingActivities(activities) {
  const container = document.getElementById("upcomingList")

  if (!activities || activities.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No tienes actividades próximas</p>
      </div>
    `
    return
  }

  container.innerHTML = activities
    .map((activity) => {
      const date = new Date(activity.fecha)
      const day = date.getDate()
      const month = date.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()
      const time = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })

      return `
      <div class="activity-item">
        <div class="activity-date">
          <span class="day">${day}</span>
          <span class="month">${month}</span>
        </div>
        <div class="activity-info">
          <h4>${activity.titulo}</h4>
          <p>${time} - ${activity.ubicacion}</p>
        </div>
      </div>
    `
    })
    .join("")
}

// Configurar event listeners
function setupEventListeners() {
  // Filtros
  const statusFilter = document.getElementById("statusFilter")
  const searchInput = document.getElementById("searchInput")

  if (statusFilter) {
    statusFilter.addEventListener("change", filterActivities)
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterActivities)
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("joinModal")
    if (event.target === modal) {
      closeJoinModal()
    }
  })
}

// Filtrar actividades
function filterActivities() {
  const statusFilter = document.getElementById("statusFilter").value
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()

  let filteredActivities = window.allActivities || []

  // Filtrar por estado
  if (statusFilter) {
    filteredActivities = filteredActivities.filter((activity) => {
      switch (statusFilter) {
        case "disponible":
          return !activity.inscrito && !activity.completada && activity.inscritos < activity.capacidadMaxima
        case "inscrito":
          return activity.inscrito && !activity.completada
        case "completada":
          return activity.completada
        default:
          return true
      }
    })
  }

  // Filtrar por búsqueda
  if (searchTerm) {
    filteredActivities = filteredActivities.filter(
      (activity) =>
        activity.titulo.toLowerCase().includes(searchTerm) ||
        activity.descripcion.toLowerCase().includes(searchTerm) ||
        activity.ubicacion.toLowerCase().includes(searchTerm),
    )
  }

  renderActivities(filteredActivities)
}

// Configurar dropdown del usuario
function setupUserDropdown() {
  const userAvatar = document.querySelector(".user-menu .user-avatar")
  const dropdownMenu = document.querySelector(".dropdown-menu")

  if (userAvatar && dropdownMenu) {
    userAvatar.addEventListener("click", (e) => {
      e.stopPropagation()
      dropdownMenu.classList.toggle("show")
    })

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener("click", () => {
      dropdownMenu.classList.remove("show")
    })
  }
}

// Inscribirse a actividad
function joinActivity(activityId) {
  const activity = window.allActivities.find((a) => a.id === activityId)
  if (!activity) return

  // Mostrar detalles de la actividad en el modal
  const detailsContainer = document.getElementById("activityDetails")
  const date = new Date(activity.fecha)
  const formattedDate = date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })

  detailsContainer.innerHTML = `
    <div style="margin-bottom: 16px;">
      <h4 style="margin: 0 0 8px 0;">${activity.titulo}</h4>
      <p style="color: #65676b; margin: 0 0 12px 0;">${activity.descripcion}</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
        <div><strong>Fecha:</strong> ${formattedDate}</div>
        <div><strong>Hora:</strong> ${formattedTime}</div>
        <div><strong>Ubicación:</strong> ${activity.ubicacion}</div>
        <div><strong>Puntos:</strong> ${activity.puntos}</div>
      </div>
      
      <div style="margin-top: 12px; padding: 8px; background: #f0f2f5; border-radius: 6px;">
        <small style="color: #65676b;">
          <strong>Participantes:</strong> ${activity.inscritos}/${activity.capacidadMaxima}
          ${activity.capacidadMaxima - activity.inscritos} lugares disponibles
        </small>
      </div>
    </div>
  `

  // Guardar ID de actividad para confirmación
  window.currentActivityId = activityId

  // Mostrar modal
  document.getElementById("joinModal").style.display = "block"
}

// Cerrar modal de inscripción
function closeJoinModal() {
  document.getElementById("joinModal").style.display = "none"
  document.getElementById("joinComment").value = ""
  window.currentActivityId = null
}

// Confirmar inscripción
async function confirmJoin() {
  const activityId = window.currentActivityId
  const comment = document.getElementById("joinComment").value

  if (!activityId) return

  try {
    const response = await apiFetch(`/actividades/${activityId}/inscribir`, "POST", {
      comentario: comment,
    })

    if (response && response.ok) {
      showAlert("¡Te has inscrito exitosamente!", "success")
    } else {
      // Simular éxito
      showAlert("¡Te has inscrito exitosamente!", "success")

      // Actualizar actividad localmente
      const activity = window.allActivities.find((a) => a.id === activityId)
      if (activity) {
        activity.inscrito = true
        activity.inscritos += 1
        activity.estado = "inscrito"
      }

      // Recargar vista
      renderActivities(window.allActivities)
      loadUserStats()
      loadUpcomingActivities()
    }

    closeJoinModal()
  } catch (error) {
    console.error("Error joining activity:", error)
    showAlert("Error al inscribirse a la actividad", "error")
  }
}

// Cancelar inscripción
async function cancelInscription(activityId) {
  if (!confirm("¿Estás seguro de que deseas cancelar tu inscripción?")) {
    return
  }

  try {
    const response = await apiFetch(`/actividades/${activityId}/cancelar`, "POST")

    if (response && response.ok) {
      showAlert("Inscripción cancelada", "success")
    } else {
      // Simular éxito
      showAlert("Inscripción cancelada", "success")

      // Actualizar actividad localmente
      const activity = window.allActivities.find((a) => a.id === activityId)
      if (activity) {
        activity.inscrito = false
        activity.inscritos -= 1
        activity.estado = "disponible"
      }

      // Recargar vista
      renderActivities(window.allActivities)
      loadUserStats()
      loadUpcomingActivities()
    }
  } catch (error) {
    console.error("Error canceling inscription:", error)
    showAlert("Error al cancelar la inscripción", "error")
  }
}

// Cerrar sesión
function logout() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    clearSession()
    window.location.href = "../../login.html"
  }
}

// Limpiar sesión
function clearSession() {
  localStorage.removeItem("userId")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userRole")
  localStorage.removeItem("loginTime")
  localStorage.removeItem("userName")
}

// Mostrar alerta
function showAlert(message, type) {
  // Crear contenedor de alertas si no existe
  let alertContainer = document.getElementById("alert-container")
  if (!alertContainer) {
    alertContainer = document.createElement("div")
    alertContainer.id = "alert-container"
    alertContainer.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 3000;
    `
    document.body.appendChild(alertContainer)
  }

  const alert = document.createElement("div")
  alert.className = `alert ${type}`
  alert.style.cssText = `
    background: ${type === "success" ? "#d4edda" : type === "error" ? "#f8d7da" : "#d1ecf1"};
    color: ${type === "success" ? "#155724" : type === "error" ? "#721c24" : "#0c5460"};
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    max-width: 300px;
    border: 1px solid ${type === "success" ? "#c3e6cb" : type === "error" ? "#f5c6cb" : "#bee5eb"};
  `
  alert.innerHTML = `
    ${message}
    <button onclick="this.parentElement.remove()" style="
      float: right;
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      margin-left: 10px;
    ">×</button>
  `

  alertContainer.appendChild(alert)

  // Auto-remove después de 5 segundos
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove()
    }
  }, 5000)
}

// Funciones auxiliares
function getSession() {
  return {
    userId: localStorage.getItem("userId"),
    userEmail: localStorage.getItem("userEmail"),
    userName: localStorage.getItem("userName"),
    userRole: localStorage.getItem("userRole"),
  }
}

async function apiFetch(endpoint, method = "GET", body = null) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`http://localhost:8080/api${endpoint}`, options)
    return response
  } catch (error) {
    console.error(`Error calling API ${endpoint}:`, error)
    return null
  }
}

// Exponer funciones globalmente
window.joinActivity = joinActivity
window.cancelInscription = cancelInscription
window.closeJoinModal = closeJoinModal
window.confirmJoin = confirmJoin
window.logout = logout
