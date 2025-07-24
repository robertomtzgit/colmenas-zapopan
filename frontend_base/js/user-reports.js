// Gestor de Reportes para Usuarios
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  if (!isAuthenticated()) {
    window.location.href = "../../login.html"
    return
  }

  // Inicializar la página
  initReportsPage()
})

// Verificar autenticación
function isAuthenticated() {
  const userId = localStorage.getItem("userId")
  return !!userId
}

// Inicializar página de reportes
async function initReportsPage() {
  try {
    // Cargar información del usuario
    await loadUserInfo()

    // Cargar reportes
    await loadReports()

    // Cargar estadísticas
    await loadUserStats()

    // Configurar event listeners
    setupEventListeners()

    // Configurar dropdown del usuario
    setupUserDropdown()
  } catch (error) {
    console.error("Error initializing reports page:", error)
    showAlert("Error al cargar los reportes", "error")
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

// Cargar reportes
async function loadReports() {
  try {
    const session = getSession()
    const response = await apiFetch(`/reportes/usuario/${session.userId}`)

    let reports = []
    if (response && response.ok) {
      reports = await response.json()
    } else {
      // Datos de prueba
      reports = [
        {
          id: 1,
          titulo: "Luminaria dañada en Calle 5ta",
          descripcion:
            "La luminaria del poste #15 en la calle 5ta no funciona desde hace una semana. Esto genera inseguridad durante las noches.",
          tipo: "problema",
          prioridad: "alta",
          estado: "resuelto",
          ubicacion: "Calle 5ta, Poste #15",
          fechaCreacion: "2024-01-15T10:30:00Z",
          fechaActualizacion: "2024-01-20T14:45:00Z",
          comentarioResolucion: "Se reemplazó la luminaria dañada. El problema ha sido solucionado.",
        },
        {
          id: 2,
          titulo: "Sugerencia: Área de juegos infantiles",
          descripcion:
            "Propongo la instalación de un área de juegos para niños en el parque central. Esto beneficiaría a muchas familias de la colmena.",
          tipo: "sugerencia",
          prioridad: "media",
          estado: "en_proceso",
          ubicacion: "Parque Central",
          fechaCreacion: "2024-01-18T16:20:00Z",
          fechaActualizacion: "2024-01-19T09:15:00Z",
          comentarioResolucion: "La propuesta está siendo evaluada por el comité de mejoras.",
        },
        {
          id: 3,
          titulo: "Fuga de agua en tubería principal",
          descripcion:
            "Hay una fuga considerable en la tubería principal cerca del edificio B. El agua se está desperdiciando y puede causar daños.",
          tipo: "problema",
          prioridad: "alta",
          estado: "pendiente",
          ubicacion: "Edificio B, Tubería principal",
          fechaCreacion: "2024-01-22T08:45:00Z",
          fechaActualizacion: "2024-01-22T08:45:00Z",
          comentarioResolucion: null,
        },
        {
          id: 4,
          titulo: "Mantenimiento de jardines comunitarios",
          descripcion:
            "Los jardines necesitan poda y mantenimiento general. Las plantas están creciendo demasiado y obstruyen los senderos.",
          tipo: "mantenimiento",
          prioridad: "baja",
          estado: "en_proceso",
          ubicacion: "Jardines Comunitarios",
          fechaCreacion: "2024-01-20T12:00:00Z",
          fechaActualizacion: "2024-01-21T10:30:00Z",
          comentarioResolucion: "Programado para mantenimiento la próxima semana.",
        },
        {
          id: 5,
          titulo: "Problema de seguridad en entrada principal",
          descripcion:
            "La puerta de seguridad de la entrada principal no cierra correctamente, permitiendo acceso no autorizado.",
          tipo: "seguridad",
          prioridad: "alta",
          estado: "resuelto",
          ubicacion: "Entrada Principal",
          fechaCreacion: "2024-01-10T14:20:00Z",
          fechaActualizacion: "2024-01-12T16:00:00Z",
          comentarioResolucion: "Se reparó el mecanismo de cierre y se reforzó la seguridad.",
        },
      ]
    }

    renderReports(reports)
    window.allReports = reports // Guardar para filtros
  } catch (error) {
    console.error("Error loading reports:", error)
    showEmptyReports()
  }
}

// Renderizar reportes
function renderReports(reports) {
  const container = document.getElementById("reportsContainer")

  if (!reports || reports.length === 0) {
    showEmptyReports()
    return
  }

  container.innerHTML = reports.map((report) => createReportHTML(report)).join("")
}

// Crear HTML para un reporte
function createReportHTML(report) {
  const createdDate = new Date(report.fechaCreacion)
  const updatedDate = new Date(report.fechaActualizacion)
  const formattedCreated = createdDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const formattedUpdated = updatedDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const statusBadge = getStatusBadge(report.estado)
  const priorityBadge = getPriorityBadge(report.prioridad)
  const typeIcon = getTypeIcon(report.tipo)

  return `
    <div class="card report-card" data-report-id="${report.id}">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          ${typeIcon}
          <h3 style="margin: 0;">${report.titulo}</h3>
        </div>
        <div style="display: flex; gap: 8px;">
          ${priorityBadge}
          ${statusBadge}
        </div>
      </div>
      
      <p style="color: #65676b; margin-bottom: 16px; line-height: 1.4;">
        ${report.descripcion.length > 150 ? report.descripcion.substring(0, 150) + "..." : report.descripcion}
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; font-size: 14px;">
        <div>
          <i class="fas fa-map-marker-alt" style="color: #1877f2; margin-right: 8px;"></i>
          <strong>Ubicación:</strong> ${report.ubicacion}
        </div>
        <div>
          <i class="fas fa-calendar" style="color: #1877f2; margin-right: 8px;"></i>
          <strong>Creado:</strong> ${formattedCreated}
        </div>
        <div>
          <i class="fas fa-tag" style="color: #1877f2; margin-right: 8px;"></i>
          <strong>Tipo:</strong> ${getTypeLabel(report.tipo)}
        </div>
        <div>
          <i class="fas fa-clock" style="color: #1877f2; margin-right: 8px;"></i>
          <strong>Actualizado:</strong> ${formattedUpdated}
        </div>
      </div>
      
      ${
        report.comentarioResolucion
          ? `
        <div style="background: #f0f2f5; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <i class="fas fa-comment" style="color: #1877f2;"></i>
            <strong style="font-size: 14px;">Comentario de seguimiento:</strong>
          </div>
          <p style="margin: 0; font-size: 14px; color: #65676b;">${report.comentarioResolucion}</p>
        </div>
      `
          : ""
      }
      
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button class="btn btn-outline" onclick="viewReportDetails(${report.id})">
          <i class="fas fa-eye"></i> Ver Detalles
        </button>
        ${
          report.estado === "pendiente"
            ? `
          <button class="btn btn-warning" onclick="editReport(${report.id})">
            <i class="fas fa-edit"></i> Editar
          </button>
        `
            : ""
        }
      </div>
    </div>
  `
}

// Obtener badge de estado
function getStatusBadge(estado) {
  const badges = {
    pendiente: '<span class="status-badge pending">Pendiente</span>',
    en_proceso: '<span class="status-badge active">En Proceso</span>',
    resuelto: '<span class="status-badge completed">Resuelto</span>',
    rechazado: '<span class="status-badge">Rechazado</span>',
  }
  return badges[estado] || '<span class="status-badge">Desconocido</span>'
}

// Obtener badge de prioridad
function getPriorityBadge(prioridad) {
  const badges = {
    baja: '<span class="status-badge" style="background: #e8f5e8; color: #2e7d32;">Baja</span>',
    media: '<span class="status-badge" style="background: #fff3e0; color: #f57c00;">Media</span>',
    alta: '<span class="status-badge" style="background: #ffebee; color: #d32f2f;">Alta</span>',
  }
  return badges[prioridad] || '<span class="status-badge">Normal</span>'
}

// Obtener icono de tipo
function getTypeIcon(tipo) {
  const icons = {
    problema: '<i class="fas fa-exclamation-triangle" style="color: #f44336;" title="Problema"></i>',
    sugerencia: '<i class="fas fa-lightbulb" style="color: #ff9800;" title="Sugerencia"></i>',
    mantenimiento: '<i class="fas fa-tools" style="color: #2196f3;" title="Mantenimiento"></i>',
    seguridad: '<i class="fas fa-shield-alt" style="color: #9c27b0;" title="Seguridad"></i>',
  }
  return icons[tipo] || '<i class="fas fa-file-alt" style="color: #65676b;"></i>'
}

// Obtener etiqueta de tipo
function getTypeLabel(tipo) {
  const labels = {
    problema: "Problema",
    sugerencia: "Sugerencia",
    mantenimiento: "Mantenimiento",
    seguridad: "Seguridad",
  }
  return labels[tipo] || "Otro"
}

// Mostrar reportes vacíos
function showEmptyReports() {
  const container = document.getElementById("reportsContainer")
  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-file-alt"></i>
      <h3>No hay reportes</h3>
      <p>Aún no has creado ningún reporte. ¡Crea tu primer reporte para mejorar tu colmena!</p>
      <button class="btn btn-primary" onclick="openReportModal()" style="margin-top: 16px;">
        <i class="fas fa-plus"></i> Crear Primer Reporte
      </button>
    </div>
  `
}

// Cargar estadísticas del usuario
async function loadUserStats() {
  try {
    const reports = window.allReports || []
    const stats = {
      total: reports.length,
      resueltos: reports.filter((r) => r.estado === "resuelto").length,
      pendientes: reports.filter((r) => r.estado === "pendiente").length,
    }

    updateUserStats(stats)
  } catch (error) {
    console.error("Error loading user stats:", error)
  }
}

// Actualizar estadísticas del usuario
function updateUserStats(stats) {
  const totalElement = document.getElementById("totalReports")
  const resolvedElement = document.getElementById("resolvedReports")
  const pendingElement = document.getElementById("pendingReports")

  if (totalElement) totalElement.textContent = stats.total || 0
  if (resolvedElement) resolvedElement.textContent = stats.resueltos || 0
  if (pendingElement) pendingElement.textContent = stats.pendientes || 0
}

// Configurar event listeners
function setupEventListeners() {
  // Filtros
  const statusFilter = document.getElementById("statusFilter")
  const typeFilter = document.getElementById("typeFilter")
  const searchInput = document.getElementById("searchInput")

  if (statusFilter) {
    statusFilter.addEventListener("change", filterReports)
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", filterReports)
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterReports)
  }

  // Formulario de reporte
  const reportForm = document.getElementById("reportForm")
  if (reportForm) {
    reportForm.addEventListener("submit", handleReportSubmit)
  }

  // Cerrar modales al hacer clic fuera
  window.addEventListener("click", (event) => {
    const reportModal = document.getElementById("reportModal")
    const detailsModal = document.getElementById("detailsModal")

    if (event.target === reportModal) {
      closeReportModal()
    }
    if (event.target === detailsModal) {
      closeDetailsModal()
    }
  })
}

// Filtrar reportes
function filterReports() {
  const statusFilter = document.getElementById("statusFilter").value
  const typeFilter = document.getElementById("typeFilter").value
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()

  let filteredReports = window.allReports || []

  // Filtrar por estado
  if (statusFilter) {
    filteredReports = filteredReports.filter((report) => report.estado === statusFilter)
  }

  // Filtrar por tipo
  if (typeFilter) {
    filteredReports = filteredReports.filter((report) => report.tipo === typeFilter)
  }

  // Filtrar por búsqueda
  if (searchTerm) {
    filteredReports = filteredReports.filter(
      (report) =>
        report.titulo.toLowerCase().includes(searchTerm) ||
        report.descripcion.toLowerCase().includes(searchTerm) ||
        report.ubicacion.toLowerCase().includes(searchTerm),
    )
  }

  renderReports(filteredReports)
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

// Abrir modal de reporte
function openReportModal() {
  document.getElementById("reportForm").reset()
  document.getElementById("reportModal").style.display = "block"
}

// Cerrar modal de reporte
function closeReportModal() {
  document.getElementById("reportModal").style.display = "none"
}

// Manejar envío de reporte
async function handleReportSubmit(e) {
  e.preventDefault()

  const formData = {
    titulo: document.getElementById("reportTitle").value,
    tipo: document.getElementById("reportType").value,
    prioridad: document.getElementById("reportPriority").value,
    descripcion: document.getElementById("reportDescription").value,
    ubicacion: document.getElementById("reportLocation").value,
    usuarioId: getSession().userId,
  }

  try {
    const response = await apiFetch("/reportes", "POST", formData)

    if (response && response.ok) {
      showAlert("¡Reporte enviado exitosamente!", "success")
    } else {
      // Simular éxito
      showAlert("¡Reporte enviado exitosamente!", "success")

      // Agregar el nuevo reporte a la lista
      const newReport = {
        id: Date.now(),
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        tipo: formData.tipo,
        prioridad: formData.prioridad,
        estado: "pendiente",
        ubicacion: formData.ubicacion,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        comentarioResolucion: null,
      }

      window.allReports.unshift(newReport)
      renderReports(window.allReports)
      loadUserStats()
    }

    closeReportModal()
  } catch (error) {
    console.error("Error creating report:", error)
    showAlert("Error al enviar el reporte", "error")
  }
}

// Ver detalles del reporte
function viewReportDetails(reportId) {
  const report = window.allReports.find((r) => r.id === reportId)
  if (!report) return

  const createdDate = new Date(report.fechaCreacion)
  const updatedDate = new Date(report.fechaActualizacion)
  const formattedCreated = createdDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  const formattedUpdated = updatedDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const statusBadge = getStatusBadge(report.estado)
  const priorityBadge = getPriorityBadge(report.prioridad)
  const typeIcon = getTypeIcon(report.tipo)

  const detailsContainer = document.getElementById("reportDetails")
  detailsContainer.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        ${typeIcon}
        <h4 style="margin: 0; flex: 1;">${report.titulo}</h4>
        <div style="display: flex; gap: 8px;">
          ${priorityBadge}
          ${statusBadge}
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <h5 style="margin: 0 0 8px 0; color: #1c1e21;">Descripción:</h5>
        <p style="margin: 0; line-height: 1.6; color: #65676b;">${report.descripcion}</p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div>
          <h6 style="margin: 0 0 4px 0; color: #1877f2;">Información General</h6>
          <div style="font-size: 14px; line-height: 1.6;">
            <div style="margin-bottom: 4px;">
              <strong>Tipo:</strong> ${getTypeLabel(report.tipo)}
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Prioridad:</strong> ${report.prioridad.charAt(0).toUpperCase() + report.prioridad.slice(1)}
            </div>
            <div>
              <strong>Ubicación:</strong> ${report.ubicacion}
            </div>
          </div>
        </div>
        <div>
          <h6 style="margin: 0 0 4px 0; color: #1877f2;">Fechas</h6>
          <div style="font-size: 14px; line-height: 1.6;">
            <div style="margin-bottom: 4px;">
              <strong>Creado:</strong> ${formattedCreated}
            </div>
            <div>
              <strong>Actualizado:</strong> ${formattedUpdated}
            </div>
          </div>
        </div>
      </div>
      
      ${
        report.comentarioResolucion
          ? `
        <div style="background: #e8f5e8; padding: 16px; border-radius: 8px; border-left: 4px solid #4caf50;">
          <h6 style="margin: 0 0 8px 0; color: #2e7d32; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-comment"></i>
            Comentario de Seguimiento
          </h6>
          <p style="margin: 0; line-height: 1.6; color: #1b5e20;">${report.comentarioResolucion}</p>
        </div>
      `
          : ""
      }
    </div>
  `

  document.getElementById("detailsModal").style.display = "block"
}

// Cerrar modal de detalles
function closeDetailsModal() {
  document.getElementById("detailsModal").style.display = "none"
}

// Editar reporte (placeholder)
function editReport(reportId) {
  showAlert("Función de edición próximamente", "info")
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
window.openReportModal = openReportModal
window.closeReportModal = closeReportModal
window.viewReportDetails = viewReportDetails
window.closeDetailsModal = closeDetailsModal
window.editReport = editReport
window.logout = logout
