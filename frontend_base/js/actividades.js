// Gestión de actividades
class ActividadesManager {
  constructor() {
    this.actividades = []
    this.colmenas = []
    this.categorias = []
    this.usuarios = []
    this.currentActividad = null
    this.init()
  }

  async init() {
    await this.loadColmenas()
    await this.loadCategorias()
    await this.loadUsuarios()
    await this.loadActividades()
    this.setupEventListeners()
  }

  async loadActividades() {
    try {
      const response = await window.apiFetch("/actividades")
      if (response && response.ok) {
        this.actividades = await response.json()
        this.renderActividades()
      }
    } catch (error) {
      console.error("Error loading actividades:", error)
      window.showAlert("Error al cargar actividades", "danger")
    }
  }

  async loadColmenas() {
    try {
      const response = await window.apiFetch("/colmenas")
      if (response && response.ok) {
        this.colmenas = await response.json()
        this.populateColmenaSelects()
      }
    } catch (error) {
      console.error("Error loading colmenas:", error)
    }
  }

  async loadCategorias() {
    try {
      const response = await window.apiFetch("/categorias-actividad")
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
      const response = await window.apiFetch("/usuarios")
      if (response && response.ok) {
        this.usuarios = await response.json()
      }
    } catch (error) {
      console.error("Error loading usuarios:", error)
    }
  }

  populateColmenaSelects() {
    const selects = document.querySelectorAll(".colmena-select")
    selects.forEach((select) => {
      select.innerHTML = '<option value="">Seleccionar colmena</option>'
      this.colmenas.forEach((colmena) => {
        select.innerHTML += `<option value="${colmena.id}">${colmena.nombre}</option>`
      })
    })
  }

  populateCategoriaSelects() {
    const selects = document.querySelectorAll(".categoria-select")
    selects.forEach((select) => {
      select.innerHTML = '<option value="">Seleccionar categoría</option>'
      this.categorias.forEach((categoria) => {
        select.innerHTML += `<option value="${categoria.id}">${categoria.nombre}</option>`
      })
    })
  }

  renderActividades() {
    const container = document.getElementById("actividades-container")
    if (!container) return

    container.innerHTML = ""

    this.actividades.forEach((actividad) => {
      const card = document.createElement("div")
      card.className = "col-4"
      card.innerHTML = `
                <div class="card actividad-card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title">${actividad.titulo}</h5>
                            <span class="badge ${actividad.activa ? "badge-success" : "badge-danger"}">
                                ${actividad.activa ? "Activa" : "Inactiva"}
                            </span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="actividad-image">
                            <img src="${actividad.imagenUrl || "/placeholder.svg?height=200&width=300"}" 
                                 alt="${actividad.titulo}" class="img-fluid">
                        </div>
                        <div class="actividad-info">
                            <p class="actividad-description">${window.truncateText(actividad.descripcion, 100)}</p>
                            <div class="actividad-details">
                                <p><ion-icon name="calendar"></ion-icon> ${window.formatDate(actividad.fechaInicio)}</p>
                                <p><ion-icon name="time"></ion-icon> ${window.formatDate(actividad.fechaFin)}</p>
                                <p><ion-icon name="location"></ion-icon> ${actividad.ubicacion}</p>
                                <p><ion-icon name="people"></ion-icon> Capacidad: ${actividad.capacidadMaxima}</p>
                                <p><ion-icon name="business"></ion-icon> ${actividad.colmena ? actividad.colmena.nombre : "Sin colmena"}</p>
                                <p><ion-icon name="pricetag"></ion-icon> ${actividad.categoria ? actividad.categoria.nombre : "Sin categoría"}</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="actividadesManager.editActividad(${actividad.id})">
                                <ion-icon name="create"></ion-icon> Editar
                            </button>
                            <button class="btn btn-sm btn-info" onclick="actividadesManager.viewActividad(${actividad.id})">
                                <ion-icon name="eye"></ion-icon> Ver
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="actividadesManager.viewInscripciones(${actividad.id})">
                                <ion-icon name="people"></ion-icon> Inscritos
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="actividadesManager.deleteActividad(${actividad.id})">
                                <ion-icon name="trash"></ion-icon> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `
      container.appendChild(card)
    })
  }

  setupEventListeners() {
    // Botón nueva actividad
    const newActividadBtn = document.getElementById("new-actividad-btn")
    if (newActividadBtn) {
      newActividadBtn.addEventListener("click", () => this.showActividadModal())
    }

    // Formulario actividad
    const actividadForm = document.getElementById("actividad-form")
    if (actividadForm) {
      actividadForm.addEventListener("submit", (e) => this.handleActividadSubmit(e))
    }

    // Búsqueda
    const searchInput = document.getElementById("search-actividades")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.filterActividades(e.target.value))
    }

    // Filtros
    const categoriaFilter = document.getElementById("categoria-filter")
    if (categoriaFilter) {
      categoriaFilter.addEventListener("change", (e) => this.filterByCategoria(e.target.value))
    }

    const colmenaFilter = document.getElementById("colmena-filter")
    if (colmenaFilter) {
      colmenaFilter.addEventListener("change", (e) => this.filterByColmena(e.target.value))
    }
  }

  showActividadModal(actividad = null) {
    this.currentActividad = actividad
    const modal = document.getElementById("actividad-modal")
    const form = document.getElementById("actividad-form")
    const title = document.getElementById("actividad-modal-title")

    if (actividad) {
      title.textContent = "Editar Actividad"
      this.populateActividadForm(actividad)
    } else {
      title.textContent = "Nueva Actividad"
      form.reset()
      // Establecer valores por defecto
      document.getElementById("actividad-activa").checked = true
    }

    window.showModal("actividad-modal")
  }

  populateActividadForm(actividad) {
    document.getElementById("actividad-titulo").value = actividad.titulo
    document.getElementById("actividad-descripcion").value = actividad.descripcion
    document.getElementById("actividad-fechaInicio").value = actividad.fechaInicio
      ? actividad.fechaInicio.slice(0, 16)
      : ""
    document.getElementById("actividad-fechaFin").value = actividad.fechaFin ? actividad.fechaFin.slice(0, 16) : ""
    document.getElementById("actividad-ubicacion").value = actividad.ubicacion
    document.getElementById("actividad-capacidadMaxima").value = actividad.capacidadMaxima
    document.getElementById("actividad-colmena").value = actividad.colmena ? actividad.colmena.id : ""
    document.getElementById("actividad-categoria").value = actividad.categoria ? actividad.categoria.id : ""
    document.getElementById("actividad-imagenUrl").value = actividad.imagenUrl || ""
    document.getElementById("actividad-activa").checked = actividad.activa
  }

  async handleActividadSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const session = window.getSession()

    const actividadData = {
      titulo: formData.get("titulo"),
      descripcion: formData.get("descripcion"),
      fechaInicio: formData.get("fechaInicio"),
      fechaFin: formData.get("fechaFin"),
      ubicacion: formData.get("ubicacion"),
      capacidadMaxima: Number.parseInt(formData.get("capacidadMaxima")),
      colmenaId: Number.parseInt(formData.get("colmenaId")),
      categoriaId: Number.parseInt(formData.get("categoriaId")),
      creadoPorId: Number.parseInt(session.userId),
      imagenUrl: formData.get("imagenUrl"),
      activa: formData.has("activa"),
    }

    // Validaciones
    if (!window.validateRequired(actividadData.titulo)) {
      window.showAlert("El título es requerido", "danger")
      return false
    }

    if (!window.validateRequired(actividadData.descripcion)) {
      window.showAlert("La descripción es requerida", "danger")
      return false
    }

    if (!actividadData.fechaInicio) {
      window.showAlert("La fecha de inicio es requerida", "danger")
      return false
    }

    if (!actividadData.fechaFin) {
      window.showAlert("La fecha de fin es requerida", "danger")
      return false
    }

    if (new Date(actividadData.fechaInicio) >= new Date(actividadData.fechaFin)) {
      window.showAlert("La fecha de fin debe ser posterior a la fecha de inicio", "danger")
      return false
    }

    if (!window.validateRequired(actividadData.ubicacion)) {
      window.showAlert("La ubicación es requerida", "danger")
      return false
    }

    if (!actividadData.capacidadMaxima || actividadData.capacidadMaxima < 1) {
      window.showAlert("La capacidad máxima debe ser mayor a 0", "danger")
      return false
    }

    if (!actividadData.colmenaId) {
      window.showAlert("La colmena es requerida", "danger")
      return false
    }

    if (!actividadData.categoriaId) {
      window.showAlert("La categoría es requerida", "danger")
      return false
    }

    try {
      let response
      if (this.currentActividad) {
        response = await window.apiFetch(`/actividades/${this.currentActividad.id}`, "PUT", actividadData)
      } else {
        response = await window.apiFetch("/actividades", "POST", actividadData)
      }

      if (response && response.ok) {
        window.showAlert(
          this.currentActividad ? "Actividad actualizada correctamente" : "Actividad creada correctamente",
          "success",
        )
        window.hideModal("actividad-modal")
        await this.loadActividades()
      } else {
        const errorData = await response.json()
        window.showAlert(errorData.message || "Error al guardar actividad", "danger")
      }
    } catch (error) {
      console.error("Error saving actividad:", error)
      window.showAlert("Error al guardar actividad", "danger")
    }
  }

  validateActividadData(actividadData) {
    if (!window.validateRequired(actividadData.titulo)) {
      window.showAlert("El título es requerido", "danger")
      return false
    }

    if (!window.validateRequired(actividadData.descripcion)) {
      window.showAlert("La descripción es requerida", "danger")
      return false
    }

    if (!actividadData.fechaInicio) {
      window.showAlert("La fecha de inicio es requerida", "danger")
      return false
    }

    if (!actividadData.fechaFin) {
      window.showAlert("La fecha de fin es requerida", "danger")
      return false
    }

    if (new Date(actividadData.fechaInicio) >= new Date(actividadData.fechaFin)) {
      window.showAlert("La fecha de fin debe ser posterior a la fecha de inicio", "danger")
      return false
    }

    if (!window.validateRequired(actividadData.ubicacion)) {
      window.showAlert("La ubicación es requerida", "danger")
      return false
    }

    if (!actividadData.capacidadMaxima || actividadData.capacidadMaxima < 1) {
      window.showAlert("La capacidad máxima debe ser mayor a 0", "danger")
      return false
    }

    if (!actividadData.colmenaId) {
      window.showAlert("La colmena es requerida", "danger")
      return false
    }

    if (!actividadData.categoriaId) {
      window.showAlert("La categoría es requerida", "danger")
      return false
    }

    return true
  }

  async editActividad(id) {
    const actividad = this.actividades.find((a) => a.id === id)
    if (actividad) {
      this.showActividadModal(actividad)
    }
  }

  async viewActividad(id) {
    const actividad = this.actividades.find((a) => a.id === id)
    if (actividad) {
      this.showActividadDetails(actividad)
    }
  }

  showActividadDetails(actividad) {
    const modal = document.getElementById("actividad-details-modal")
    const content = document.getElementById("actividad-details-content")

    content.innerHTML = `
            <div class="actividad-details">
                <div class="actividad-image-large">
                    <img src="${actividad.imagenUrl || "/placeholder.svg?height=300&width=400"}" 
                         alt="${actividad.titulo}" class="img-fluid">
                </div>
                <div class="actividad-info-detailed">
                    <h3>${actividad.titulo}</h3>
                    <p class="actividad-description-full">${actividad.descripcion}</p>
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Fecha de inicio:</strong>
                            <p>${window.formatDate(actividad.fechaInicio)}</p>
                        </div>
                        <div class="info-item">
                            <strong>Fecha de fin:</strong>
                            <p>${window.formatDate(actividad.fechaFin)}</p>
                        </div>
                        <div class="info-item">
                            <strong>Ubicación:</strong>
                            <p>${actividad.ubicacion}</p>
                        </div>
                        <div class="info-item">
                            <strong>Capacidad máxima:</strong>
                            <p>${actividad.capacidadMaxima} personas</p>
                        </div>
                        <div class="info-item">
                            <strong>Colmena:</strong>
                            <p>${actividad.colmena ? actividad.colmena.nombre : "Sin colmena"}</p>
                        </div>
                        <div class="info-item">
                            <strong>Categoría:</strong>
                            <p>${actividad.categoria ? actividad.categoria.nombre : "Sin categoría"}</p>
                        </div>
                        <div class="info-item">
                            <strong>Creado por:</strong>
                            <p>${actividad.creadoPor ? actividad.creadoPor.nombre : "Usuario desconocido"}</p>
                        </div>
                        <div class="info-item">
                            <strong>Estado:</strong>
                            <span class="badge ${actividad.activa ? "badge-success" : "badge-danger"}">
                                ${actividad.activa ? "Activa" : "Inactiva"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `

    window.showModal("actividad-details-modal")
  }

  async viewInscripciones(actividadId) {
    try {
      const response = await window.apiFetch(`/inscripciones/actividad/${actividadId}`)
      if (response && response.ok) {
        const inscripciones = await response.json()
        this.showInscripcionesModal(actividadId, inscripciones)
      }
    } catch (error) {
      console.error("Error loading inscripciones:", error)
      window.showAlert("Error al cargar inscripciones", "danger")
    }
  }

  showInscripcionesModal(actividadId, inscripciones) {
    const modal = document.getElementById("inscripciones-modal")
    const content = document.getElementById("inscripciones-content")
    const actividad = this.actividades.find((a) => a.id === actividadId)

    content.innerHTML = `
            <h4>Inscripciones para: ${actividad ? actividad.titulo : "Actividad"}</h4>
            <p>Total de inscritos: ${inscripciones.length}</p>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Fecha de inscripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inscripciones
                          .map(
                            (inscripcion) => `
                            <tr>
                                <td>${inscripcion.usuario.nombre}</td>
                                <td>${inscripcion.usuario.email}</td>
                                <td>${window.formatDate(inscripcion.fechaInscripcion)}</td>
                                <td>
                                    <button class="btn btn-sm btn-danger" 
                                            onclick="actividadesManager.removeInscripcion(${inscripcion.id})">
                                        <ion-icon name="trash"></ion-icon>
                                    </button>
                                </td>
                            </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
        `

    window.showModal("inscripciones-modal")
  }

  async removeInscripcion(inscripcionId) {
    if (confirm("¿Estás seguro de eliminar esta inscripción?")) {
      try {
        const response = await window.apiFetch(`/inscripciones/${inscripcionId}`, "DELETE")
        if (response && response.ok) {
          window.showAlert("Inscripción eliminada correctamente", "success")
          window.hideModal("inscripciones-modal")
        } else {
          window.showAlert("Error al eliminar inscripción", "danger")
        }
      } catch (error) {
        console.error("Error removing inscripcion:", error)
        window.showAlert("Error al eliminar inscripción", "danger")
      }
    }
  }

  async deleteActividad(id) {
    const actividad = this.actividades.find((a) => a.id === id)
    if (!actividad) return

    if (confirm(`¿Estás seguro de eliminar la actividad "${actividad.titulo}"?`)) {
      try {
        const response = await window.apiFetch(`/actividades/${id}`, "DELETE")
        if (response && response.ok) {
          window.showAlert("Actividad eliminada correctamente", "success")
          await this.loadActividades()
        } else {
          window.showAlert("Error al eliminar actividad", "danger")
        }
      } catch (error) {
        console.error("Error deleting actividad:", error)
        window.showAlert("Error al eliminar actividad", "danger")
      }
    }
  }

  filterActividades(searchTerm) {
    const cards = document.querySelectorAll(".actividad-card")
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase()
      const matches = text.includes(searchTerm.toLowerCase())
      card.parentElement.style.display = matches ? "" : "none"
    })
  }

  filterByCategoria(categoriaId) {
    const cards = document.querySelectorAll(".actividad-card")
    cards.forEach((card) => {
      if (!categoriaId) {
        card.parentElement.style.display = ""
        return
      }

      const actividad = this.actividades.find((a) => card.querySelector(".card-title").textContent === a.titulo)

      const matches = actividad && actividad.categoria && actividad.categoria.id === Number.parseInt(categoriaId)
      card.parentElement.style.display = matches ? "" : "none"
    })
  }

  filterByColmena(colmenaId) {
    const cards = document.querySelectorAll(".actividad-card")
    cards.forEach((card) => {
      if (!colmenaId) {
        card.parentElement.style.display = ""
        return
      }

      const actividad = this.actividades.find((a) => card.querySelector(".card-title").textContent === a.titulo)

      const matches = actividad && actividad.colmena && actividad.colmena.id === Number.parseInt(colmenaId)
      card.parentElement.style.display = matches ? "" : "none"
    })
  }
}

// Inicializar cuando se carga la página
let actividadesManager
document.addEventListener("DOMContentLoaded", () => {
  actividadesManager = new ActividadesManager()
})
