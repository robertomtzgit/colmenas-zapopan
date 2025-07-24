// Corregir las declaraciones de funciones globales al inicio del archivo
window.apiFetch = async (url, method = "GET", data = null) => {
  const API_BASE_URL = "http://localhost:8080/api"
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options)
    return response
  } catch (error) {
    console.error("Error in API call:", error)
    throw error
  }
}

window.showAlert = (message, type) => {
  const alertContainer = document.getElementById("alert-container") || createAlertContainer()
  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.innerHTML = `
    <span>${message}</span>
    <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
  `
  alertContainer.appendChild(alert)

  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove()
    }
  }, 3000)
}

function createAlertContainer() {
  const container = document.createElement("div")
  container.id = "alert-container"
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    max-width: 400px;
  `
  document.body.appendChild(container)
  return container
}

window.showModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("show")
  }
}

window.hideModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("show")
  }
}

window.validateRequired = (value) => {
  return value && value.toString().trim() !== ""
}

window.validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}

// Gestión de colmenas
class ColmenasManager {
  constructor() {
    this.colmenas = []
    this.usuarios = []
    this.currentColmena = null
    this.init()
  }

  async init() {
    await this.loadUsuarios()
    await this.loadColmenas()
    this.setupEventListeners()
  }

  // Corregir el método loadColmenas para incluir datos de prueba
  async loadColmenas() {
    try {
      const response = await window.apiFetch("/colmenas")
      if (response && response.ok) {
        this.colmenas = await response.json()
      } else {
        // Datos de prueba si la API no responde
        this.colmenas = [
          {
            id: 1,
            nombre: "Colmena Centro",
            direccion: "Calle Principal 100",
            colonia: "Centro",
            codigoPostal: "12345",
            latitud: 19.4326,
            longitud: -99.1332,
            telefono: "5551234567",
            imagenUrl: "/placeholder.svg?height=200&width=300&text=Colmena+Centro",
            responsable: { id: 1, nombre: "Juan Pérez" },
            activa: true,
          },
          {
            id: 2,
            nombre: "Colmena Norte",
            direccion: "Avenida Norte 200",
            colonia: "Zona Norte",
            codigoPostal: "12346",
            latitud: 19.4426,
            longitud: -99.1432,
            telefono: "5557654321",
            imagenUrl: "/placeholder.svg?height=200&width=300&text=Colmena+Norte",
            responsable: { id: 2, nombre: "María García" },
            activa: true,
          },
        ]
        window.showAlert("Usando datos de prueba - API no disponible", "warning")
      }
      this.renderColmenas()
    } catch (error) {
      console.error("Error loading colmenas:", error)
      // Datos de prueba en caso de error
      this.colmenas = [
        {
          id: 1,
          nombre: "Colmena Centro",
          direccion: "Calle Principal 100",
          colonia: "Centro",
          codigoPostal: "12345",
          latitud: 19.4326,
          longitud: -99.1332,
          telefono: "5551234567",
          imagenUrl: "/placeholder.svg?height=200&width=300&text=Colmena+Centro",
          responsable: { id: 1, nombre: "Juan Pérez" },
          activa: true,
        },
      ]
      this.renderColmenas()
      window.showAlert("Error al cargar colmenas - Mostrando datos de prueba", "warning")
    }
  }

  // Corregir el método loadUsuarios
  async loadUsuarios() {
    try {
      const response = await window.apiFetch("/usuarios")
      if (response && response.ok) {
        this.usuarios = await response.json()
      } else {
        // Usuarios de prueba
        this.usuarios = [
          { id: 1, nombre: "Juan Pérez" },
          { id: 2, nombre: "María García" },
          { id: 3, nombre: "Carlos López" },
        ]
      }
      this.populateResponsableSelects()
    } catch (error) {
      console.error("Error loading usuarios:", error)
      this.usuarios = [
        { id: 1, nombre: "Juan Pérez" },
        { id: 2, nombre: "María García" },
      ]
      this.populateResponsableSelects()
    }
  }

  populateResponsableSelects() {
    const selects = document.querySelectorAll(".responsable-select")
    selects.forEach((select) => {
      select.innerHTML = '<option value="">Sin responsable</option>'
      this.usuarios.forEach((usuario) => {
        select.innerHTML += `<option value="${usuario.id}">${usuario.nombre}</option>`
      })
    })
  }

  renderColmenas() {
    const container = document.getElementById("colmenas-container")
    if (!container) return

    container.innerHTML = ""

    this.colmenas.forEach((colmena) => {
      const card = document.createElement("div")
      card.className = "col-4"
      card.innerHTML = `
                <div class="card colmena-card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title">${colmena.nombre}</h5>
                            <span class="badge ${colmena.activa ? "badge-success" : "badge-danger"}">
                                ${colmena.activa ? "Activa" : "Inactiva"}
                            </span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="colmena-image">
                            <img src="${colmena.imagenUrl || "/placeholder.svg?height=200&width=300"}" 
                                 alt="${colmena.nombre}" class="img-fluid">
                        </div>
                        <div class="colmena-info">
                            <p><ion-icon name="location"></ion-icon> ${colmena.direccion}, ${colmena.colonia}</p>
                            <p><ion-icon name="call"></ion-icon> ${colmena.telefono}</p>
                            <p><ion-icon name="person"></ion-icon> 
                                ${colmena.responsable ? colmena.responsable.nombre : "Sin responsable"}
                            </p>
                            <p><ion-icon name="code"></ion-icon> CP: ${colmena.codigoPostal}</p>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary" onclick="colmenasManager.editColmena(${colmena.id})">
                                <ion-icon name="create"></ion-icon> Editar
                            </button>
                            <button class="btn btn-sm btn-info" onclick="colmenasManager.viewColmena(${colmena.id})">
                                <ion-icon name="eye"></ion-icon> Ver
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="colmenasManager.deleteColmena(${colmena.id})">
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
    // Botón nueva colmena
    const newColmenaBtn = document.getElementById("new-colmena-btn")
    if (newColmenaBtn) {
      newColmenaBtn.addEventListener("click", () => this.showColmenaModal())
    }

    // Formulario colmena
    const colmenaForm = document.getElementById("colmena-form")
    if (colmenaForm) {
      colmenaForm.addEventListener("submit", (e) => this.handleColmenaSubmit(e))
    }

    // Búsqueda
    const searchInput = document.getElementById("search-colmenas")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.filterColmenas(e.target.value))
    }

    // Filtro por estado
    const statusFilter = document.getElementById("status-filter")
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => this.filterByStatus(e.target.value))
    }
  }

  showColmenaModal(colmena = null) {
    this.currentColmena = colmena
    const modal = document.getElementById("colmena-modal")
    const form = document.getElementById("colmena-form")
    const title = document.getElementById("colmena-modal-title")

    if (colmena) {
      title.textContent = "Editar Colmena"
      this.populateColmenaForm(colmena)
    } else {
      title.textContent = "Nueva Colmena"
      form.reset()
    }

    window.showModal("colmena-modal")
  }

  populateColmenaForm(colmena) {
    document.getElementById("colmena-nombre").value = colmena.nombre
    document.getElementById("colmena-direccion").value = colmena.direccion
    document.getElementById("colmena-colonia").value = colmena.colonia
    document.getElementById("colmena-codigoPostal").value = colmena.codigoPostal
    document.getElementById("colmena-latitud").value = colmena.latitud
    document.getElementById("colmena-longitud").value = colmena.longitud
    document.getElementById("colmena-telefono").value = colmena.telefono
    document.getElementById("colmena-imagenUrl").value = colmena.imagenUrl || ""
    document.getElementById("colmena-responsable").value = colmena.responsable ? colmena.responsable.id : ""
    document.getElementById("colmena-activa").checked = colmena.activa
  }

  async handleColmenaSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const colmenaData = {
      nombre: formData.get("nombre"),
      direccion: formData.get("direccion"),
      colonia: formData.get("colonia"),
      codigoPostal: formData.get("codigoPostal"),
      latitud: Number.parseFloat(formData.get("latitud")),
      longitud: Number.parseFloat(formData.get("longitud")),
      telefono: formData.get("telefono"),
      imagenUrl: formData.get("imagenUrl"),
      responsableId: formData.get("responsableId") ? Number.parseInt(formData.get("responsableId")) : null,
      activa: formData.has("activa"),
    }

    // Validaciones
    if (!window.validateRequired(colmenaData.nombre)) {
      window.showAlert("El nombre es requerido", "danger")
      return false
    }

    if (!window.validateRequired(colmenaData.direccion)) {
      window.showAlert("La dirección es requerida", "danger")
      return false
    }

    if (!window.validateRequired(colmenaData.colonia)) {
      window.showAlert("La colonia es requerida", "danger")
      return false
    }

    if (!window.validateRequired(colmenaData.codigoPostal)) {
      window.showAlert("El código postal es requerido", "danger")
      return false
    }

    if (isNaN(colmenaData.latitud) || isNaN(colmenaData.longitud)) {
      window.showAlert("Las coordenadas deben ser números válidos", "danger")
      return false
    }

    if (!window.validatePhone(colmenaData.telefono)) {
      window.showAlert("El teléfono no es válido", "danger")
      return false
    }

    try {
      let response
      if (this.currentColmena) {
        response = await window.apiFetch(`/colmenas/${this.currentColmena.id}`, "PUT", colmenaData)
      } else {
        response = await window.apiFetch("/colmenas", "POST", colmenaData)
      }

      if (response && response.ok) {
        window.showAlert(
          this.currentColmena ? "Colmena actualizada correctamente" : "Colmena creada correctamente",
          "success",
        )
        window.hideModal("colmena-modal")
        await this.loadColmenas()
      } else {
        const errorData = await response.json()
        window.showAlert(errorData.message || "Error al guardar colmena", "danger")
      }
    } catch (error) {
      console.error("Error saving colmena:", error)
      window.showAlert("Error al guardar colmena", "danger")
    }
  }

  validateColmenaData(colmenaData) {
    if (!window.validateRequired(colmenaData.nombre)) {
      window.showAlert("El nombre es requerido", "danger")
      return false
    }

    if (!window.validateRequired(colmenaData.direccion)) {
      window.showAlert("La dirección es requerida", "danger")
      return false
    }

    if (!window.validateRequired(colmenaData.colonia)) {
      window.showAlert("La colonia es requerida", "danger")
      return false
    }

    if (!window.validateRequired(colmenaData.codigoPostal)) {
      window.showAlert("El código postal es requerido", "danger")
      return false
    }

    if (isNaN(colmenaData.latitud) || isNaN(colmenaData.longitud)) {
      window.showAlert("Las coordenadas deben ser números válidos", "danger")
      return false
    }

    if (!window.validatePhone(colmenaData.telefono)) {
      window.showAlert("El teléfono no es válido", "danger")
      return false
    }

    return true
  }

  async editColmena(id) {
    const colmena = this.colmenas.find((c) => c.id === id)
    if (colmena) {
      this.showColmenaModal(colmena)
    }
  }

  async viewColmena(id) {
    const colmena = this.colmenas.find((c) => c.id === id)
    if (colmena) {
      // Mostrar modal de detalles
      this.showColmenaDetails(colmena)
    }
  }

  showColmenaDetails(colmena) {
    const modal = document.getElementById("colmena-details-modal")
    const content = document.getElementById("colmena-details-content")

    content.innerHTML = `
            <div class="colmena-details">
                <div class="colmena-image-large">
                    <img src="${colmena.imagenUrl || "/placeholder.svg?height=300&width=400"}" 
                         alt="${colmena.nombre}" class="img-fluid">
                </div>
                <div class="colmena-info-detailed">
                    <h3>${colmena.nombre}</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Dirección:</strong>
                            <p>${colmena.direccion}, ${colmena.colonia}</p>
                        </div>
                        <div class="info-item">
                            <strong>Código Postal:</strong>
                            <p>${colmena.codigoPostal}</p>
                        </div>
                        <div class="info-item">
                            <strong>Teléfono:</strong>
                            <p>${colmena.telefono}</p>
                        </div>
                        <div class="info-item">
                            <strong>Responsable:</strong>
                            <p>${colmena.responsable ? colmena.responsable.nombre : "Sin responsable"}</p>
                        </div>
                        <div class="info-item">
                            <strong>Coordenadas:</strong>
                            <p>Lat: ${colmena.latitud}, Lng: ${colmena.longitud}</p>
                        </div>
                        <div class="info-item">
                            <strong>Estado:</strong>
                            <span class="badge ${colmena.activa ? "badge-success" : "badge-danger"}">
                                ${colmena.activa ? "Activa" : "Inactiva"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `

    window.showModal("colmena-details-modal")
  }

  async deleteColmena(id) {
    const colmena = this.colmenas.find((c) => c.id === id)
    if (!colmena) return

    if (confirm(`¿Estás seguro de eliminar la colmena "${colmena.nombre}"?`)) {
      try {
        const response = await window.apiFetch(`/colmenas/${id}`, "DELETE")
        if (response && response.ok) {
          window.showAlert("Colmena eliminada correctamente", "success")
          await this.loadColmenas()
        } else {
          window.showAlert("Error al eliminar colmena", "danger")
        }
      } catch (error) {
        console.error("Error deleting colmena:", error)
        window.showAlert("Error al eliminar colmena", "danger")
      }
    }
  }

  filterColmenas(searchTerm) {
    const cards = document.querySelectorAll(".colmena-card")
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase()
      const matches = text.includes(searchTerm.toLowerCase())
      card.parentElement.style.display = matches ? "" : "none"
    })
  }

  filterByStatus(status) {
    const cards = document.querySelectorAll(".colmena-card")
    cards.forEach((card) => {
      if (!status) {
        card.parentElement.style.display = ""
        return
      }

      const statusBadge = card.querySelector(".badge")
      const matches = statusBadge && statusBadge.textContent.trim() === status
      card.parentElement.style.display = matches ? "" : "none"
    })
  }
}

// Inicializar cuando se carga la página
let colmenasManager
document.addEventListener("DOMContentLoaded", () => {
  colmenasManager = new ColmenasManager()
})
