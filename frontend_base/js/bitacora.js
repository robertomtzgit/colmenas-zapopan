// Gestión de bitácora de eventos
class BitacoraManager {
  constructor() {
    this.eventos = []
    this.usuarios = []
    this.currentEvento = null
    this.init()
  }

  async init() {
    await this.loadUsuarios()
    await this.loadEventos()
    this.setupEventListeners()
  }

  async loadEventos() {
    try {
      const response = await apiFetch("/bitacora-eventos")
      if (response && response.ok) {
        this.eventos = await response.json()
        this.renderEventos()
      }
    } catch (error) {
      console.error("Error loading eventos:", error)
      showAlert("Error al cargar eventos de bitácora", "danger")
    }
  }

  async loadUsuarios() {
    try {
      const response = await apiFetch("/usuarios")
      if (response && response.ok) {
        this.usuarios = await response.json()
      }
    } catch (error) {
      console.error("Error loading usuarios:", error)
    }
  }

  renderEventos() {
    const tbody = document.getElementById("bitacora-tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    this.eventos.forEach((evento) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${evento.id}</td>
                <td>
                    <span class="badge ${this.getAccionBadgeClass(evento.accion)}">
                        ${evento.accion}
                    </span>
                </td>
                <td>
                    <span class="badge badge-primary">
                        ${evento.modulo}
                    </span>
                </td>
                <td>${evento.entidad}</td>
                <td>${evento.entidadId}</td>
                <td>${truncateText(evento.descripcion, 50)}</td>
                <td>${evento.usuario ? evento.usuario.nombre : "Sistema"}</td>
                <td>${evento.ip}</td>
                <td>${formatDate(evento.fechaEvento)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="bitacoraManager.viewEvento(${evento.id})">
                            <ion-icon name="eye"></ion-icon>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="bitacoraManager.deleteEvento(${evento.id})">
                            <ion-icon name="trash"></ion-icon>
                        </button>
                    </div>
                </td>
            `
      tbody.appendChild(row)
    })
  }

  getAccionBadgeClass(accion) {
    switch (accion) {
      case "CREACION":
        return "badge-success"
      case "ACTUALIZACION":
        return "badge-warning"
      case "ELIMINACION":
        return "badge-danger"
      case "CONSULTA":
        return "badge-info"
      case "LOGIN":
        return "badge-primary"
      case "LOGOUT":
        return "badge-secondary"
      default:
        return "badge-secondary"
    }
  }

  setupEventListeners() {
    // Botón nuevo evento
    const newEventoBtn = document.getElementById("new-evento-btn")
    if (newEventoBtn) {
      newEventoBtn.addEventListener("click", () => this.showEventoModal())
    }

    // Formulario evento
    const eventoForm = document.getElementById("evento-form")
    if (eventoForm) {
      eventoForm.addEventListener("submit", (e) => this.handleEventoSubmit(e))
    }

    // Búsqueda
    const searchInput = document.getElementById("search-eventos")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.filterEventos(e.target.value))
    }

    // Filtros
    const accionFilter = document.getElementById("accion-filter")
    if (accionFilter) {
      accionFilter.addEventListener("change", (e) => this.filterByAccion(e.target.value))
    }

    const moduloFilter = document.getElementById("modulo-filter")
    if (moduloFilter) {
      moduloFilter.addEventListener("change", (e) => this.filterByModulo(e.target.value))
    }

    const usuarioFilter = document.getElementById("usuario-filter")
    if (usuarioFilter) {
      usuarioFilter.addEventListener("change", (e) => this.filterByUsuario(e.target.value))
    }

    // Botón exportar
    const exportBtn = document.getElementById("export-bitacora-btn")
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportBitacora())
    }
  }

  showEventoModal(evento = null) {
    this.currentEvento = evento
    const modal = document.getElementById("evento-modal")
    const form = document.getElementById("evento-form")
    const title = document.getElementById("evento-modal-title")

    title.textContent = "Nuevo Evento de Bitácora"
    form.reset()

    showModal("evento-modal")
  }

  async handleEventoSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const session = getSession()

    const eventoData = {
      accion: formData.get("accion"),
      modulo: formData.get("modulo"),
      entidad: formData.get("entidad"),
      entidadId: Number.parseInt(formData.get("entidadId")),
      descripcion: formData.get("descripcion"),
      usuarioId: Number.parseInt(session.userId),
      ip: formData.get("ip") || "127.0.0.1",
      datosAdicionales: formData.get("datosAdicionales"),
    }

    // Validaciones
    if (!this.validateEventoData(eventoData)) {
      return
    }

    try {
      const response = await apiFetch("/bitacora-eventos", "POST", eventoData)

      if (response && response.ok) {
        showAlert("Evento registrado correctamente", "success")
        hideModal("evento-modal")
        await this.loadEventos()
      } else {
        const errorData = await response.json()
        showAlert(errorData.message || "Error al registrar evento", "danger")
      }
    } catch (error) {
      console.error("Error saving evento:", error)
      showAlert("Error al registrar evento", "danger")
    }
  }

  validateEventoData(eventoData) {
    if (!validateRequired(eventoData.accion)) {
      showAlert("La acción es requerida", "danger")
      return false
    }

    if (!validateRequired(eventoData.modulo)) {
      showAlert("El módulo es requerido", "danger")
      return false
    }

    if (!validateRequired(eventoData.entidad)) {
      showAlert("La entidad es requerida", "danger")
      return false
    }

    if (!eventoData.entidadId || eventoData.entidadId < 1) {
      showAlert("El ID de entidad debe ser un número válido", "danger")
      return false
    }

    if (!validateRequired(eventoData.descripcion)) {
      showAlert("La descripción es requerida", "danger")
      return false
    }

    return true
  }

  async viewEvento(id) {
    const evento = this.eventos.find((e) => e.id === id)
    if (evento) {
      this.showEventoDetails(evento)
    }
  }

  showEventoDetails(evento) {
    const modal = document.getElementById("evento-details-modal")
    const content = document.getElementById("evento-details-content")

    let datosAdicionalesHtml = ""
    if (evento.datosAdicionales) {
      try {
        const datos = JSON.parse(evento.datosAdicionales)
        datosAdicionalesHtml = `
                    <div class="info-section">
                        <h4>Datos Adicionales</h4>
                        <pre class="datos-adicionales">${JSON.stringify(datos, null, 2)}</pre>
                    </div>
                `
      } catch (error) {
        datosAdicionalesHtml = `
                    <div class="info-section">
                        <h4>Datos Adicionales</h4>
                        <p>${evento.datosAdicionales}</p>
                    </div>
                `
      }
    }

    content.innerHTML = `
            <div class="evento-details">
                <div class="evento-header">
                    <h3>Evento de Bitácora #${evento.id}</h3>
                    <div class="evento-badges">
                        <span class="badge ${this.getAccionBadgeClass(evento.accion)}">${evento.accion}</span>
                        <span class="badge badge-primary">${evento.modulo}</span>
                    </div>
                </div>
                
                <div class="evento-info-detailed">
                    <div class="info-section">
                        <h4>Descripción</h4>
                        <p>${evento.descripcion}</p>
                    </div>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Entidad:</strong>
                            <p>${evento.entidad}</p>
                        </div>
                        <div class="info-item">
                            <strong>ID de Entidad:</strong>
                            <p>${evento.entidadId}</p>
                        </div>
                        <div class="info-item">
                            <strong>Usuario:</strong>
                            <p>${evento.usuario ? evento.usuario.nombre : "Sistema"}</p>
                        </div>
                        <div class="info-item">
                            <strong>Dirección IP:</strong>
                            <p>${evento.ip}</p>
                        </div>
                        <div class="info-item">
                            <strong>Fecha del Evento:</strong>
                            <p>${formatDate(evento.fechaEvento)}</p>
                        </div>
                    </div>
                    
                    ${datosAdicionalesHtml}
                </div>
            </div>
        `

    showModal("evento-details-modal")
  }

  async deleteEvento(id) {
    const evento = this.eventos.find((e) => e.id === id)
    if (!evento) return

    if (confirm(`¿Estás seguro de eliminar el evento #${evento.id}?`)) {
      try {
        const response = await apiFetch(`/bitacora-eventos/${id}`, "DELETE")
        if (response && response.ok) {
          showAlert("Evento eliminado correctamente", "success")
          await this.loadEventos()
        } else {
          showAlert("Error al eliminar evento", "danger")
        }
      } catch (error) {
        console.error("Error deleting evento:", error)
        showAlert("Error al eliminar evento", "danger")
      }
    }
  }

  filterEventos(searchTerm) {
    const rows = document.querySelectorAll("#bitacora-tbody tr")
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase()
      const matches = text.includes(searchTerm.toLowerCase())
      row.style.display = matches ? "" : "none"
    })
  }

  filterByAccion(accion) {
    const rows = document.querySelectorAll("#bitacora-tbody tr")
    rows.forEach((row) => {
      if (!accion) {
        row.style.display = ""
        return
      }

      const accionBadge = row.cells[1].querySelector(".badge")
      const matches = accionBadge && accionBadge.textContent.trim() === accion
      row.style.display = matches ? "" : "none"
    })
  }

  filterByModulo(modulo) {
    const rows = document.querySelectorAll("#bitacora-tbody tr")
    rows.forEach((row) => {
      if (!modulo) {
        row.style.display = ""
        return
      }

      const moduloBadge = row.cells[2].querySelector(".badge")
      const matches = moduloBadge && moduloBadge.textContent.trim() === modulo
      row.style.display = matches ? "" : "none"
    })
  }

  filterByUsuario(usuarioId) {
    const rows = document.querySelectorAll("#bitacora-tbody tr")
    rows.forEach((row) => {
      if (!usuarioId) {
        row.style.display = ""
        return
      }

      const eventoId = Number.parseInt(row.cells[0].textContent)
      const evento = this.eventos.find((e) => e.id === eventoId)
      const matches = evento && evento.usuario && evento.usuario.id === Number.parseInt(usuarioId)
      row.style.display = matches ? "" : "none"
    })
  }

  exportBitacora() {
    // Crear CSV con los datos de la bitácora
    const headers = ["ID", "Acción", "Módulo", "Entidad", "ID Entidad", "Descripción", "Usuario", "IP", "Fecha"]
    const csvContent = [
      headers.join(","),
      ...this.eventos.map((evento) =>
        [
          evento.id,
          evento.accion,
          evento.modulo,
          evento.entidad,
          evento.entidadId,
          `"${evento.descripcion.replace(/"/g, '""')}"`,
          evento.usuario ? evento.usuario.nombre : "Sistema",
          evento.ip,
          formatDate(evento.fechaEvento),
        ].join(","),
      ),
    ].join("\n")

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `bitacora_eventos_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showAlert("Bitácora exportada correctamente", "success")
  }
}

// Inicializar cuando se carga la página
let bitacoraManager
document.addEventListener("DOMContentLoaded", () => {
  bitacoraManager = new BitacoraManager()
})

// Declaraciones de variables para resolver errores de lint
const apiFetch = async (url, method = "GET", body = null) => {
  const options = { method }
  if (body) {
    options.headers = { "Content-Type": "application/json" }
    options.body = JSON.stringify(body)
  }
  return fetch(url, options)
}

const showAlert = (message, type) => {
  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.textContent = message
  document.body.appendChild(alert)
  setTimeout(() => document.body.removeChild(alert), 3000)
}

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
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

const getSession = () => {
  return { userId: 1 } // Simulación de sesión
}
