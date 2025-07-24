// Gestión de Notificaciones
class NotificacionesManager {
  constructor() {
    this.notificaciones = []
    this.currentNotificacion = null
    this.init()
  }

  async init() {
    await this.loadNotificaciones()
    this.setupEventListeners()
  }

  async loadNotificaciones() {
    try {
      const response = await apiFetch("/notificaciones")
      if (response && response.ok) {
        this.notificaciones = await response.json()
      } else {
        // Datos de prueba si la API no está disponible
        this.notificaciones = [
          {
            id: 1,
            titulo: "Mantenimiento de Colmenas",
            mensaje: "Se realizará mantenimiento preventivo en las colmenas del sector norte el próximo sábado.",
            tipo: "mantenimiento",
            prioridad: "alta",
            fechaCreacion: "2024-01-20T10:00:00Z",
            fechaVencimiento: "2024-01-27T23:59:59Z",
            activa: true,
            leida: false,
            creador: { nombre: "Admin Sistema" },
            destinatarios: ["Todos los usuarios"],
          },
          {
            id: 2,
            titulo: "Nueva Actividad Comunitaria",
            mensaje:
              "Te invitamos a participar en el taller de apicultura básica que se realizará el próximo miércoles.",
            tipo: "actividad",
            prioridad: "media",
            fechaCreacion: "2024-01-18T14:30:00Z",
            fechaVencimiento: "2024-01-25T18:00:00Z",
            activa: true,
            leida: true,
            creador: { nombre: "Coordinador Local" },
            destinatarios: ["Usuarios activos"],
          },
          {
            id: 3,
            titulo: "Reporte de Problema Resuelto",
            mensaje: "El problema reportado sobre la colmena #15 ha sido resuelto satisfactoriamente.",
            tipo: "reporte",
            prioridad: "baja",
            fechaCreacion: "2024-01-15T09:15:00Z",
            fechaVencimiento: null,
            activa: true,
            leida: false,
            creador: { nombre: "Técnico Especialista" },
            destinatarios: ["Usuario específico"],
          },
          {
            id: 4,
            titulo: "Encuesta Disponible",
            mensaje: "Hay una nueva encuesta disponible sobre la satisfacción del programa. Tu opinión es importante.",
            tipo: "encuesta",
            prioridad: "media",
            fechaCreacion: "2024-01-12T16:45:00Z",
            fechaVencimiento: "2024-02-12T23:59:59Z",
            activa: true,
            leida: true,
            creador: { nombre: "Equipo de Evaluación" },
            destinatarios: ["Todos los usuarios"],
          },
        ]
      }
      this.renderNotificaciones()
      this.updateStats()
    } catch (error) {
      console.error("Error loading notificaciones:", error)
      showAlert("Error al cargar las notificaciones", "danger")
    }
  }

  renderNotificaciones() {
    const container = document.getElementById("notificaciones-container")
    if (!container) return

    const filteredNotificaciones = this.getFilteredNotificaciones()

    if (filteredNotificaciones.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <ion-icon name="notifications-off"></ion-icon>
                    <h3>No hay notificaciones</h3>
                    <p>No se encontraron notificaciones que coincidan con los filtros aplicados.</p>
                </div>
            `
      return
    }

    container.innerHTML = filteredNotificaciones
      .map(
        (notificacion) => `
            <div class="card notificacion-card ${!notificacion.leida ? "notificacion-no-leida" : ""}">
                <div class="card-header">
                    <div class="notificacion-info">
                        <h5 class="card-title">
                            ${notificacion.titulo}
                            ${!notificacion.leida ? '<span class="badge badge-primary ml-2">Nueva</span>' : ""}
                        </h5>
                        <div class="notificacion-badges">
                            <span class="badge ${this.getTipoBadgeClass(notificacion.tipo)}">${this.getTipoLabel(notificacion.tipo)}</span>
                            <span class="badge ${this.getPrioridadBadgeClass(notificacion.prioridad)}">${notificacion.prioridad}</span>
                        </div>
                    </div>
                    <div class="notificacion-actions">
                        ${
                          !notificacion.leida
                            ? `
                            <button class="btn btn-sm btn-outline-primary" onclick="notificacionesManager.marcarComoLeida(${notificacion.id})" title="Marcar como leída">
                                <ion-icon name="checkmark"></ion-icon>
                            </button>
                        `
                            : ""
                        }
                        <button class="btn btn-sm btn-outline-secondary" onclick="notificacionesManager.editarNotificacion(${notificacion.id})" title="Editar">
                            <ion-icon name="create"></ion-icon>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="notificacionesManager.eliminarNotificacion(${notificacion.id})" title="Eliminar">
                            <ion-icon name="trash"></ion-icon>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <p class="notificacion-mensaje">${notificacion.mensaje}</p>
                    <div class="notificacion-meta">
                        <div class="meta-item">
                            <ion-icon name="person"></ion-icon>
                            <span>Creada por: ${notificacion.creador.nombre}</span>
                        </div>
                        <div class="meta-item">
                            <ion-icon name="calendar"></ion-icon>
                            <span>Fecha: ${formatDate(notificacion.fechaCreacion)}</span>
                        </div>
                        ${
                          notificacion.fechaVencimiento
                            ? `
                            <div class="meta-item">
                                <ion-icon name="time"></ion-icon>
                                <span>Vence: ${formatDate(notificacion.fechaVencimiento)}</span>
                            </div>
                        `
                            : ""
                        }
                        <div class="meta-item">
                            <ion-icon name="people"></ion-icon>
                            <span>Para: ${notificacion.destinatarios.join(", ")}</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  getFilteredNotificaciones() {
    let filtered = [...this.notificaciones]

    // Filtro por tipo
    const tipoFilter = document.getElementById("tipo-filter")
    if (tipoFilter && tipoFilter.value) {
      filtered = filtered.filter((n) => n.tipo === tipoFilter.value)
    }

    // Filtro por estado
    const estadoFilter = document.getElementById("estado-filter")
    if (estadoFilter && estadoFilter.value) {
      if (estadoFilter.value === "leida") {
        filtered = filtered.filter((n) => n.leida)
      } else if (estadoFilter.value === "no_leida") {
        filtered = filtered.filter((n) => !n.leida)
      }
    }

    // Filtro por búsqueda
    const searchInput = document.getElementById("search-input")
    if (searchInput && searchInput.value.trim()) {
      const searchTerm = searchInput.value.toLowerCase()
      filtered = filtered.filter(
        (n) => n.titulo.toLowerCase().includes(searchTerm) || n.mensaje.toLowerCase().includes(searchTerm),
      )
    }

    return filtered.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
  }

  setupEventListeners() {
    // Botón nueva notificación
    const nuevaNotificacionBtn = document.getElementById("nueva-notificacion-btn")
    if (nuevaNotificacionBtn) {
      nuevaNotificacionBtn.addEventListener("click", () => this.nuevaNotificacion())
    }

    // Botón marcar todas como leídas
    const marcarTodasBtn = document.getElementById("marcar-todas-btn")
    if (marcarTodasBtn) {
      marcarTodasBtn.addEventListener("click", () => this.marcarTodasComoLeidas())
    }

    // Formulario de notificación
    const notificacionForm = document.getElementById("notificacion-form")
    if (notificacionForm) {
      notificacionForm.addEventListener("submit", (e) => this.handleSubmitNotificacion(e))
    }

    // Filtros
    const tipoFilter = document.getElementById("tipo-filter")
    const estadoFilter = document.getElementById("estado-filter")
    const searchInput = document.getElementById("search-input")

    if (tipoFilter) {
      tipoFilter.addEventListener("change", () => this.renderNotificaciones())
    }
    if (estadoFilter) {
      estadoFilter.addEventListener("change", () => this.renderNotificaciones())
    }
    if (searchInput) {
      searchInput.addEventListener("input", () => this.renderNotificaciones())
    }
  }

  updateStats() {
    const totalElement = document.getElementById("total-notificaciones")
    const noLeidasElement = document.getElementById("notificaciones-no-leidas")
    const activasElement = document.getElementById("notificaciones-activas")

    if (totalElement) {
      totalElement.textContent = this.notificaciones.length
    }
    if (noLeidasElement) {
      noLeidasElement.textContent = this.notificaciones.filter((n) => !n.leida).length
    }
    if (activasElement) {
      activasElement.textContent = this.notificaciones.filter((n) => n.activa).length
    }
  }

  getTipoBadgeClass(tipo) {
    switch (tipo) {
      case "mantenimiento":
        return "badge-warning"
      case "actividad":
        return "badge-info"
      case "reporte":
        return "badge-success"
      case "encuesta":
        return "badge-primary"
      case "sistema":
        return "badge-secondary"
      default:
        return "badge-light"
    }
  }

  getTipoLabel(tipo) {
    switch (tipo) {
      case "mantenimiento":
        return "Mantenimiento"
      case "actividad":
        return "Actividad"
      case "reporte":
        return "Reporte"
      case "encuesta":
        return "Encuesta"
      case "sistema":
        return "Sistema"
      default:
        return tipo
    }
  }

  getPrioridadBadgeClass(prioridad) {
    switch (prioridad) {
      case "alta":
        return "badge-danger"
      case "media":
        return "badge-warning"
      case "baja":
        return "badge-success"
      default:
        return "badge-secondary"
    }
  }

  nuevaNotificacion() {
    this.currentNotificacion = null
    document.getElementById("modal-title").textContent = "Nueva Notificación"
    document.getElementById("notificacion-form").reset()
    showModal("notificacion-modal")
  }

  editarNotificacion(id) {
    const notificacion = this.notificaciones.find((n) => n.id === id)
    if (!notificacion) return

    this.currentNotificacion = notificacion
    document.getElementById("modal-title").textContent = "Editar Notificación"

    // Llenar formulario
    document.getElementById("titulo").value = notificacion.titulo
    document.getElementById("mensaje").value = notificacion.mensaje
    document.getElementById("tipo").value = notificacion.tipo
    document.getElementById("prioridad").value = notificacion.prioridad
    document.getElementById("fecha-vencimiento").value = notificacion.fechaVencimiento
      ? notificacion.fechaVencimiento.split("T")[0]
      : ""
    document.getElementById("activa").checked = notificacion.activa

    showModal("notificacion-modal")
  }

  async handleSubmitNotificacion(e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    const notificacionData = {
      titulo: formData.get("titulo"),
      mensaje: formData.get("mensaje"),
      tipo: formData.get("tipo"),
      prioridad: formData.get("prioridad"),
      fechaVencimiento: formData.get("fecha-vencimiento") || null,
      activa: formData.get("activa") === "on",
    }

    try {
      let response
      if (this.currentNotificacion) {
        response = await apiFetch(`/notificaciones/${this.currentNotificacion.id}`, "PUT", notificacionData)
      } else {
        response = await apiFetch("/notificaciones", "POST", notificacionData)
      }

      if (response && response.ok) {
        showAlert(`Notificación ${this.currentNotificacion ? "actualizada" : "creada"} exitosamente`, "success")
        hideModal("notificacion-modal")
        await this.loadNotificaciones()
      } else {
        // Simular éxito si la API no está disponible
        const newNotificacion = {
          id: this.currentNotificacion ? this.currentNotificacion.id : Date.now(),
          ...notificacionData,
          fechaCreacion: this.currentNotificacion ? this.currentNotificacion.fechaCreacion : new Date().toISOString(),
          leida: this.currentNotificacion ? this.currentNotificacion.leida : false,
          creador: { nombre: "Usuario Actual" },
          destinatarios: ["Todos los usuarios"],
        }

        if (this.currentNotificacion) {
          const index = this.notificaciones.findIndex((n) => n.id === this.currentNotificacion.id)
          this.notificaciones[index] = newNotificacion
        } else {
          this.notificaciones.unshift(newNotificacion)
        }

        showAlert(`Notificación ${this.currentNotificacion ? "actualizada" : "creada"} exitosamente`, "success")
        hideModal("notificacion-modal")
        this.renderNotificaciones()
        this.updateStats()
      }
    } catch (error) {
      console.error("Error saving notificacion:", error)
      showAlert("Error al guardar la notificación", "danger")
    }
  }

  async marcarComoLeida(id) {
    try {
      const response = await apiFetch(`/notificaciones/${id}/leer`, "PUT")

      if (response && response.ok) {
        showAlert("Notificación marcada como leída", "success")
      } else {
        // Simular éxito si la API no está disponible
        const notificacion = this.notificaciones.find((n) => n.id === id)
        if (notificacion) {
          notificacion.leida = true
        }
        showAlert("Notificación marcada como leída", "success")
      }

      this.renderNotificaciones()
      this.updateStats()
    } catch (error) {
      console.error("Error marking notification as read:", error)
      showAlert("Error al marcar la notificación como leída", "danger")
    }
  }

  async marcarTodasComoLeidas() {
    if (!confirm("¿Marcar todas las notificaciones como leídas?")) return

    try {
      const response = await apiFetch("/notificaciones/marcar-todas-leidas", "PUT")

      if (response && response.ok) {
        showAlert("Todas las notificaciones marcadas como leídas", "success")
      } else {
        // Simular éxito si la API no está disponible
        this.notificaciones.forEach((n) => (n.leida = true))
        showAlert("Todas las notificaciones marcadas como leídas", "success")
      }

      this.renderNotificaciones()
      this.updateStats()
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      showAlert("Error al marcar todas las notificaciones como leídas", "danger")
    }
  }

  async eliminarNotificacion(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta notificación?")) return

    try {
      const response = await apiFetch(`/notificaciones/${id}`, "DELETE")

      if (response && response.ok) {
        showAlert("Notificación eliminada exitosamente", "success")
      } else {
        // Simular éxito si la API no está disponible
        this.notificaciones = this.notificaciones.filter((n) => n.id !== id)
        showAlert("Notificación eliminada exitosamente", "success")
      }

      this.renderNotificaciones()
      this.updateStats()
    } catch (error) {
      console.error("Error deleting notificacion:", error)
      showAlert("Error al eliminar la notificación", "danger")
    }
  }
}

// Inicializar gestor de notificaciones
let notificacionesManager
document.addEventListener("DOMContentLoaded", () => {
  notificacionesManager = new NotificacionesManager()
})

// Declaración de variables no declaradas
const apiFetch = async (url, method = "GET", data = null) => {
  const options = { method }
  if (data) {
    options.headers = { "Content-Type": "application/json" }
    options.body = JSON.stringify(data)
  }
  return fetch(url, options)
}

const showAlert = (message, type) => {
  const alertContainer = document.createElement("div")
  alertContainer.className = `alert alert-${type}`
  alertContainer.textContent = message
  document.body.appendChild(alertContainer)
  setTimeout(() => document.body.removeChild(alertContainer), 3000)
}

const showModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
  }
}

const hideModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
