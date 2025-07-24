// Gestión de reportes ciudadanos
class ReportesManager {
  constructor() {
    this.reportes = []
    this.categorias = []
    this.usuarios = []
    this.colmenas = []
    this.currentReporte = null
    this.init()
  }

  async init() {
    await this.loadCategorias()
    await this.loadUsuarios()
    await this.loadColmenas()
    await this.loadReportes()
    this.setupEventListeners()
  }

  async loadReportes() {
    try {
      const response = await window.apiFetch("/reportes") // Declare apiFetch
      if (response && response.ok) {
        this.reportes = await response.json()
        this.renderReportes()
      }
    } catch (error) {
      console.error("Error loading reportes:", error)
      window.showAlert("Error al cargar reportes", "danger") // Declare showAlert
    }
  }

  async loadCategorias() {
    try {
      const response = await window.apiFetch("/categorias-reporte") // Declare apiFetch
      if (response && response.ok) {
        this.categorias = await response.json()
        this.populateCategoriaSelects()
      }
    } catch (error) {
      console.error("Error loading categorias:", error)
    }
  }

  async loadUsuarios() {
    try {
      const response = await window.apiFetch("/usuarios") // Declare apiFetch
      if (response && response.ok) {
        this.usuarios = await response.json()
        this.populateUsuarioSelects()
      }
    } catch (error) {
      console.error("Error loading usuarios:", error)
    }
  }

  async loadColmenas() {
    try {
      const response = await window.apiFetch("/colmenas") // Declare apiFetch
      if (response && response.ok) {
        this.colmenas = await response.json()
        this.populateColmenaSelects()
      }
    } catch (error) {
      console.error("Error loading colmenas:", error)
    }
  }

  populateCategoriaSelects() {
    const selects = document.querySelectorAll(".categoria-reporte-select")
    selects.forEach((select) => {
      select.innerHTML = '<option value="">Seleccionar categoría</option>'
      this.categorias.forEach((categoria) => {
        select.innerHTML += `<option value="${categoria.id}">${categoria.nombre}</option>`
      })
    })
  }

  populateUsuarioSelects() {
    const selects = document.querySelectorAll(".usuario-select")
    selects.forEach((select) => {
      select.innerHTML = '<option value="">Sin asignar</option>'
      this.usuarios.forEach((usuario) => {
        select.innerHTML += `<option value="${usuario.id}">${usuario.nombre}</option>`
      })
    })
  }

  populateColmenaSelects() {
    const selects = document.querySelectorAll(".colmena-reporte-select")
    selects.forEach((select) => {
      select.innerHTML = '<option value="">Seleccionar colmena</option>'
      this.colmenas.forEach((colmena) => {
        select.innerHTML += `<option value="${colmena.id}">${colmena.nombre}</option>`
      })
    })
  }

  renderReportes() {
    const tbody = document.getElementById("reportes-tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    this.reportes.forEach((reporte) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${reporte.id}</td>
                <td>
                    <div class="reporte-title">${reporte.titulo}</div>
                    <div class="reporte-description">${window.truncateText(reporte.descripcion, 50)}</div> <!-- Declare truncateText -->
                </td>
                <td>
                    <span class="badge badge-primary">
                        ${reporte.categoria ? reporte.categoria.nombre : "Sin categoría"}
                    </span>
                </td>
                <td>
                    <span class="badge ${this.getEstadoBadgeClass(reporte.estado)}">
                        ${reporte.estado}
                    </span>
                </td>
                <td>
                    <span class="badge ${this.getPrioridadBadgeClass(reporte.prioridad)}">
                        ${reporte.prioridad}
                    </span>
                </td>
                <td>${reporte.usuario ? reporte.usuario.nombre : "Usuario desconocido"}</td>
                <td>${reporte.colmena ? reporte.colmena.nombre : "Sin colmena"}</td>
                <td>${reporte.asignadoA ? reporte.asignadoA.nombre : "Sin asignar"}</td>
                <td>${window.formatDate(reporte.fechaCreacion)}</td> <!-- Declare formatDate -->
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="reportesManager.editReporte(${reporte.id})">
                            <ion-icon name="create"></ion-icon>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="reportesManager.viewReporte(${reporte.id})">
                            <ion-icon name="eye"></ion-icon>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="reportesManager.deleteReporte(${reporte.id})">
                            <ion-icon name="trash"></ion-icon>
                        </button>
                    </div>
                </td>
            `
      tbody.appendChild(row)
    })
  }

  getEstadoBadgeClass(estado) {
    switch (estado) {
      case "pendiente":
        return "badge-warning"
      case "en_proceso":
        return "badge-info"
      case "resuelto":
        return "badge-success"
      case "rechazado":
        return "badge-danger"
      default:
        return "badge-secondary"
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

  setupEventListeners() {
    // Botón nuevo reporte
    const newReporteBtn = document.getElementById("new-reporte-btn")
    if (newReporteBtn) {
      newReporteBtn.addEventListener("click", () => this.showReporteModal())
    }

    // Formulario reporte
    const reporteForm = document.getElementById("reporte-form")
    if (reporteForm) {
      reporteForm.addEventListener("submit", (e) => this.handleReporteSubmit(e))
    }

    // Búsqueda
    const searchInput = document.getElementById("search-reportes")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.filterReportes(e.target.value))
    }

    // Filtros
    const estadoFilter = document.getElementById("estado-filter")
    if (estadoFilter) {
      estadoFilter.addEventListener("change", (e) => this.filterByEstado(e.target.value))
    }

    const prioridadFilter = document.getElementById("prioridad-filter")
    if (prioridadFilter) {
      prioridadFilter.addEventListener("change", (e) => this.filterByPrioridad(e.target.value))
    }

    const categoriaFilter = document.getElementById("categoria-filter")
    if (categoriaFilter) {
      categoriaFilter.addEventListener("change", (e) => this.filterByCategoria(e.target.value))
    }
  }

  showReporteModal(reporte = null) {
    this.currentReporte = reporte
    const modal = document.getElementById("reporte-modal")
    const form = document.getElementById("reporte-form")
    const title = document.getElementById("reporte-modal-title")

    if (reporte) {
      title.textContent = "Editar Reporte"
      this.populateReporteForm(reporte)
    } else {
      title.textContent = "Nuevo Reporte"
      form.reset()
      // Establecer valores por defecto
      document.getElementById("reporte-estado").value = "pendiente"
      document.getElementById("reporte-prioridad").value = "media"
    }

    window.showModal("reporte-modal") // Declare showModal
  }

  populateReporteForm(reporte) {
    document.getElementById("reporte-titulo").value = reporte.titulo
    document.getElementById("reporte-descripcion").value = reporte.descripcion
    document.getElementById("reporte-categoria").value = reporte.categoria ? reporte.categoria.id : ""
    document.getElementById("reporte-estado").value = reporte.estado
    document.getElementById("reporte-prioridad").value = reporte.prioridad
    document.getElementById("reporte-ubicacion").value = reporte.ubicacion
    document.getElementById("reporte-latitud").value = reporte.latitud || ""
    document.getElementById("reporte-longitud").value = reporte.longitud || ""
    document.getElementById("reporte-imagenUrl").value = reporte.imagenUrl || ""
    document.getElementById("reporte-usuario").value = reporte.usuario ? reporte.usuario.id : ""
    document.getElementById("reporte-colmena").value = reporte.colmena ? reporte.colmena.id : ""
    document.getElementById("reporte-asignadoA").value = reporte.asignadoA ? reporte.asignadoA.id : ""
    document.getElementById("reporte-comentarioResolucion").value = reporte.comentarioResolucion || ""
  }

  async handleReporteSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const session = window.getSession() // Declare getSession

    const reporteData = {
      titulo: formData.get("titulo"),
      descripcion: formData.get("descripcion"),
      categoriaId: Number.parseInt(formData.get("categoriaId")),
      estado: formData.get("estado"),
      prioridad: formData.get("prioridad"),
      ubicacion: formData.get("ubicacion"),
      latitud: formData.get("latitud") ? Number.parseFloat(formData.get("latitud")) : null,
      longitud: formData.get("longitud") ? Number.parseFloat(formData.get("longitud")) : null,
      imagenUrl: formData.get("imagenUrl"),
      usuarioId: formData.get("usuarioId")
        ? Number.parseInt(formData.get("usuarioId"))
        : Number.parseInt(session.userId),
      colmenaId: formData.get("colmenaId") ? Number.parseInt(formData.get("colmenaId")) : null,
      asignadoAId: formData.get("asignadoAId") ? Number.parseInt(formData.get("asignadoAId")) : null,
      comentarioResolucion: formData.get("comentarioResolucion"),
      fechaResolucion: formData.get("estado") === "resuelto" ? new Date().toISOString() : null,
    }

    // Validaciones
    if (!window.validateRequired(reporteData.titulo)) {
      // Declare validateRequired
      window.showAlert("El título es requerido", "danger") // Declare showAlert
      return false
    }

    if (!window.validateRequired(reporteData.descripcion)) {
      // Declare validateRequired
      window.showAlert("La descripción es requerida", "danger") // Declare showAlert
      return false
    }

    if (!reporteData.categoriaId) {
      window.showAlert("La categoría es requerida", "danger") // Declare showAlert
      return false
    }

    if (!window.validateRequired(reporteData.estado)) {
      // Declare validateRequired
      window.showAlert("El estado es requerido", "danger") // Declare showAlert
      return false
    }

    if (!window.validateRequired(reporteData.prioridad)) {
      // Declare validateRequired
      window.showAlert("La prioridad es requerida", "danger") // Declare showAlert
      return false
    }

    if (!window.validateRequired(reporteData.ubicacion)) {
      // Declare validateRequired
      window.showAlert("La ubicación es requerida", "danger") // Declare showAlert
      return false
    }

    return true
  }

  validateReporteData(reporteData) {
    if (!window.validateRequired(reporteData.titulo)) {
      // Declare validateRequired
      window.showAlert("El título es requerido", "danger") // Declare showAlert
      return false
    }

    if (!window.validateRequired(reporteData.descripcion)) {
      // Declare validateRequired
      window.showAlert("La descripción es requerida", "danger") // Declare showAlert
      return false
    }

    if (!reporteData.categoriaId) {
      window.showAlert("La categoría es requerida", "danger") // Declare showAlert
      return false
    }

    if (!window.validateRequired(reporteData.estado)) {
      // Declare validateRequired
      window.showAlert("El estado es requerido", "danger") // Declare showAlert
      return false
    }

    if (!window.validateRequired(reporteData.prioridad)) {
      // Declare validateRequired
      window.showAlert("La prioridad es requerida", "danger") // Declare showAlert
      return false
    }

    if (!window.validateRequired(reporteData.ubicacion)) {
      // Declare validateRequired
      window.showAlert("La ubicación es requerida", "danger") // Declare showAlert
      return false
    }

    return true
  }

  async editReporte(id) {
    const reporte = this.reportes.find((r) => r.id === id)
    if (reporte) {
      this.showReporteModal(reporte)
    }
  }

  async viewReporte(id) {
    const reporte = this.reportes.find((r) => r.id === id)
    if (reporte) {
      this.showReporteDetails(reporte)
    }
  }

  showReporteDetails(reporte) {
    const modal = document.getElementById("reporte-details-modal")
    const content = document.getElementById("reporte-details-content")

    content.innerHTML = `
            <div class="reporte-details">
                <div class="reporte-header">
                    <h3>${reporte.titulo}</h3>
                    <div class="reporte-badges">
                        <span class="badge ${this.getEstadoBadgeClass(reporte.estado)}">${reporte.estado}</span>
                        <span class="badge ${this.getPrioridadBadgeClass(reporte.prioridad)}">${reporte.prioridad}</span>
                    </div>
                </div>
                
                ${
                  reporte.imagenUrl
                    ? `
                    <div class="reporte-image">
                        <img src="${reporte.imagenUrl}" alt="Imagen del reporte" class="img-fluid">
                    </div>
                `
                    : ""
                }
                
                <div class="reporte-info-detailed">
                    <div class="info-section">
                        <h4>Descripción</h4>
                        <p>${reporte.descripcion}</p>
                    </div>
                    
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Categoría:</strong>
                            <p>${reporte.categoria ? reporte.categoria.nombre : "Sin categoría"}</p>
                        </div>
                        <div class="info-item">
                            <strong>Ubicación:</strong>
                            <p>${reporte.ubicacion}</p>
                        </div>
                        <div class="info-item">
                            <strong>Reportado por:</strong>
                            <p>${reporte.usuario ? reporte.usuario.nombre : "Usuario desconocido"}</p>
                        </div>
                        <div class="info-item">
                            <strong>Colmena:</strong>
                            <p>${reporte.colmena ? reporte.colmena.nombre : "Sin colmena"}</p>
                        </div>
                        <div class="info-item">
                            <strong>Asignado a:</strong>
                            <p>${reporte.asignadoA ? reporte.asignadoA.nombre : "Sin asignar"}</p>
                        </div>
                        <div class="info-item">
                            <strong>Fecha de creación:</strong>
                            <p>${window.formatDate(reporte.fechaCreacion)}</p> <!-- Declare formatDate -->
                        </div>
                        ${
                          reporte.fechaResolucion
                            ? `
                            <div class="info-item">
                                <strong>Fecha de resolución:</strong>
                                <p>${window.formatDate(reporte.fechaResolucion)}</p> <!-- Declare formatDate -->
                            </div>
                        `
                            : ""
                        }
                        ${
                          reporte.latitud && reporte.longitud
                            ? `
                            <div class="info-item">
                                <strong>Coordenadas:</strong>
                                <p>Lat: ${reporte.latitud}, Lng: ${reporte.longitud}</p>
                            </div>
                        `
                            : ""
                        }
                    </div>
                    
                    ${
                      reporte.comentarioResolucion
                        ? `
                        <div class="info-section">
                            <h4>Comentario de resolución</h4>
                            <p>${reporte.comentarioResolucion}</p>
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `

    window.showModal("reporte-details-modal") // Declare showModal
  }

  async deleteReporte(id) {
    const reporte = this.reportes.find((r) => r.id === id)
    if (!reporte) return

    if (confirm(`¿Estás seguro de eliminar el reporte "${reporte.titulo}"?`)) {
      try {
        const response = await window.apiFetch(`/reportes/${id}`, "DELETE") // Declare apiFetch
        if (response && response.ok) {
          window.showAlert("Reporte eliminado correctamente", "success") // Declare showAlert
          await this.loadReportes()
        } else {
          window.showAlert("Error al eliminar reporte", "danger") // Declare showAlert
        }
      } catch (error) {
        console.error("Error deleting reporte:", error)
        window.showAlert("Error al eliminar reporte", "danger") // Declare showAlert
      }
    }
  }

  filterReportes(searchTerm) {
    const rows = document.querySelectorAll("#reportes-tbody tr")
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase()
      const matches = text.includes(searchTerm.toLowerCase())
      row.style.display = matches ? "" : "none"
    })
  }

  filterByEstado(estado) {
    const rows = document.querySelectorAll("#reportes-tbody tr")
    rows.forEach((row) => {
      if (!estado) {
        row.style.display = ""
        return
      }

      const estadoBadge = row.cells[3].querySelector(".badge")
      const matches = estadoBadge && estadoBadge.textContent.trim() === estado
      row.style.display = matches ? "" : "none"
    })
  }

  filterByPrioridad(prioridad) {
    const rows = document.querySelectorAll("#reportes-tbody tr")
    rows.forEach((row) => {
      if (!prioridad) {
        row.style.display = ""
        return
      }

      const prioridadBadge = row.cells[4].querySelector(".badge")
      const matches = prioridadBadge && prioridadBadge.textContent.trim() === prioridad
      row.style.display = matches ? "" : "none"
    })
  }

  filterByCategoria(categoriaId) {
    const rows = document.querySelectorAll("#reportes-tbody tr")
    rows.forEach((row) => {
      if (!categoriaId) {
        row.style.display = ""
        return
      }

      const reporteId = Number.parseInt(row.cells[0].textContent)
      const reporte = this.reportes.find((r) => r.id === reporteId)
      const matches = reporte && reporte.categoria && reporte.categoria.id === Number.parseInt(categoriaId)
      row.style.display = matches ? "" : "none"
    })
  }
}

// Inicializar cuando se carga la página
let reportesManager
document.addEventListener("DOMContentLoaded", () => {
  reportesManager = new ReportesManager()
})

// Declare global functions
window.apiFetch = async (url, method = "GET", data = null) => {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  }
  if (data) {
    options.body = JSON.stringify(data)
  }
  const response = await fetch(url, options)
  return response
}

window.showAlert = (message, type) => {
  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.textContent = message
  document.body.appendChild(alert)
  setTimeout(() => {
    document.body.removeChild(alert)
  }, 3000)
}

window.truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "..."
  }
  return text
}

window.formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

window.showModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
  }
}

window.hideModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
  }
}

window.getSession = () => {
  return { userId: 1 } // Example session data
}

window.validateRequired = (value) => {
  return value !== null && value !== undefined && value.trim() !== ""
}
