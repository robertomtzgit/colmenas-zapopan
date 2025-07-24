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

window.formatDate = (dateString) => {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
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

window.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

window.validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}

window.getSession = () => {
  return {
    userId: localStorage.getItem("userId"),
    userEmail: localStorage.getItem("userEmail"),
    userName: localStorage.getItem("userName"),
    userRole: localStorage.getItem("userRole"),
  }
}

// Gestión de usuarios
class UsuariosManager {
  constructor() {
    this.usuarios = []
    this.roles = []
    this.currentUser = null
    this.init()
  }

  async init() {
    await this.loadRoles()
    await this.loadUsuarios()
    this.setupEventListeners()
  }

  // Corregir el método loadUsuarios para manejar datos de prueba si la API no responde
  async loadUsuarios() {
    try {
      const response = await window.apiFetch("/usuarios")
      if (response && response.ok) {
        this.usuarios = await response.json()
      } else {
        // Datos de prueba si la API no responde
        this.usuarios = [
          {
            id: 1,
            nombre: "Juan Pérez",
            email: "juan@example.com",
            edad: 30,
            sexo: "masculino",
            telefono: "5551234567",
            domicilio: "Calle Principal 123",
            estatus: "activo",
            rol: { id: 1, nombre: "ADMIN" },
            ultimoLogin: new Date().toISOString(),
          },
          {
            id: 2,
            nombre: "María García",
            email: "maria@example.com",
            edad: 28,
            sexo: "femenino",
            telefono: "5557654321",
            domicilio: "Avenida Central 456",
            estatus: "activo",
            rol: { id: 2, nombre: "USER" },
            ultimoLogin: new Date().toISOString(),
          },
        ]
        window.showAlert("Usando datos de prueba - API no disponible", "warning")
      }
      this.renderUsuarios()
    } catch (error) {
      console.error("Error loading usuarios:", error)
      // Datos de prueba en caso de error
      this.usuarios = [
        {
          id: 1,
          nombre: "Juan Pérez",
          email: "juan@example.com",
          edad: 30,
          sexo: "masculino",
          telefono: "5551234567",
          domicilio: "Calle Principal 123",
          estatus: "activo",
          rol: { id: 1, nombre: "ADMIN" },
          ultimoLogin: new Date().toISOString(),
        },
      ]
      this.renderUsuarios()
      window.showAlert("Error al cargar usuarios - Mostrando datos de prueba", "warning")
    }
  }

  // Corregir el método loadRoles
  async loadRoles() {
    try {
      const response = await window.apiFetch("/roles")
      if (response && response.ok) {
        this.roles = await response.json()
      } else {
        // Roles de prueba
        this.roles = [
          { id: 1, nombre: "ADMIN" },
          { id: 2, nombre: "USER" },
          { id: 3, nombre: "RESPONSABLE_COLMENA" },
        ]
      }
      this.populateRoleSelects()
    } catch (error) {
      console.error("Error loading roles:", error)
      this.roles = [
        { id: 1, nombre: "ADMIN" },
        { id: 2, nombre: "USER" },
        { id: 3, nombre: "RESPONSABLE_COLMENA" },
      ]
      this.populateRoleSelects()
    }
  }

  populateRoleSelects() {
    const selects = document.querySelectorAll(".role-select")
    selects.forEach((select) => {
      select.innerHTML = '<option value="">Seleccionar rol</option>'
      this.roles.forEach((role) => {
        select.innerHTML += `<option value="${role.id}">${role.nombre}</option>`
      })
    })
  }

  renderUsuarios() {
    const tbody = document.getElementById("usuarios-tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    this.usuarios.forEach((usuario) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${usuario.id}</td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar-sm">${usuario.nombre.charAt(0).toUpperCase()}</div>
                        <div>
                            <div class="user-name">${usuario.nombre}</div>
                            <div class="user-email">${usuario.email}</div>
                        </div>
                    </div>
                </td>
                <td>${usuario.edad}</td>
                <td>${usuario.sexo}</td>
                <td>${usuario.telefono}</td>
                <td>
                    <span class="badge ${usuario.estatus === "activo" ? "badge-success" : "badge-danger"}">
                        ${usuario.estatus}
                    </span>
                </td>
                <td>
                    <span class="badge badge-primary">
                        ${usuario.rol ? usuario.rol.nombre : "Sin rol"}
                    </span>
                </td>
                <td>${window.formatDate(usuario.ultimoLogin)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="usuariosManager.editUsuario(${usuario.id})">
                            <ion-icon name="create"></ion-icon>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="usuariosManager.deleteUsuario(${usuario.id})">
                            <ion-icon name="trash"></ion-icon>
                        </button>
                    </div>
                </td>
            `
      tbody.appendChild(row)
    })
  }

  setupEventListeners() {
    // Botón nuevo usuario
    const newUserBtn = document.getElementById("new-user-btn")
    if (newUserBtn) {
      newUserBtn.addEventListener("click", () => this.showUserModal())
    }

    // Formulario usuario
    const userForm = document.getElementById("user-form")
    if (userForm) {
      userForm.addEventListener("submit", (e) => this.handleUserSubmit(e))
    }

    // Búsqueda
    const searchInput = document.getElementById("search-usuarios")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.filterUsuarios(e.target.value))
    }

    // Filtro por rol
    const roleFilter = document.getElementById("role-filter")
    if (roleFilter) {
      roleFilter.addEventListener("change", (e) => this.filterByRole(e.target.value))
    }

    // Filtro por estatus
    const statusFilter = document.getElementById("status-filter")
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) => this.filterByStatus(e.target.value))
    }
  }

  showUserModal(usuario = null) {
    this.currentUser = usuario
    const modal = document.getElementById("user-modal")
    const form = document.getElementById("user-form")
    const title = document.getElementById("user-modal-title")

    if (usuario) {
      title.textContent = "Editar Usuario"
      this.populateUserForm(usuario)
    } else {
      title.textContent = "Nuevo Usuario"
      form.reset()
    }

    window.showModal("user-modal")
  }

  populateUserForm(usuario) {
    document.getElementById("user-nombre").value = usuario.nombre
    document.getElementById("user-email").value = usuario.email
    document.getElementById("user-edad").value = usuario.edad
    document.getElementById("user-sexo").value = usuario.sexo
    document.getElementById("user-domicilio").value = usuario.domicilio
    document.getElementById("user-telefono").value = usuario.telefono
    document.getElementById("user-estatus").value = usuario.estatus
    document.getElementById("user-rol").value = usuario.rol ? usuario.rol.id : ""
  }

  async handleUserSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const userData = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      edad: Number.parseInt(formData.get("edad")),
      sexo: formData.get("sexo"),
      domicilio: formData.get("domicilio"),
      telefono: formData.get("telefono"),
      estatus: formData.get("estatus"),
      rolId: Number.parseInt(formData.get("rolId")),
    }

    // Validaciones
    if (!window.validateRequired(userData.nombre)) {
      window.showAlert("El nombre es requerido", "danger")
      return false
    }

    if (!window.validateEmail(userData.email)) {
      window.showAlert("El email no es válido", "danger")
      return false
    }

    if (!userData.edad || userData.edad < 1 || userData.edad > 120) {
      window.showAlert("La edad debe ser un número válido", "danger")
      return false
    }

    if (!window.validateRequired(userData.sexo)) {
      window.showAlert("El sexo es requerido", "danger")
      return false
    }

    if (!window.validateRequired(userData.domicilio)) {
      window.showAlert("El domicilio es requerido", "danger")
      return false
    }

    if (!window.validatePhone(userData.telefono)) {
      window.showAlert("El teléfono no es válido", "danger")
      return false
    }

    if (!userData.rolId) {
      window.showAlert("El rol es requerido", "danger")
      return false
    }

    try {
      let response
      if (this.currentUser) {
        response = await window.apiFetch(`/usuarios/${this.currentUser.id}`, "PUT", userData)
      } else {
        response = await window.apiFetch("/usuarios", "POST", userData)
      }

      if (response && response.ok) {
        window.showAlert(
          this.currentUser ? "Usuario actualizado correctamente" : "Usuario creado correctamente",
          "success",
        )
        window.hideModal("user-modal")
        await this.loadUsuarios()
      } else {
        const errorData = await response.json()
        window.showAlert(errorData.message || "Error al guardar usuario", "danger")
      }
    } catch (error) {
      console.error("Error saving user:", error)
      window.showAlert("Error al guardar usuario", "danger")
    }
  }

  validateUserData(userData) {
    if (!window.validateRequired(userData.nombre)) {
      window.showAlert("El nombre es requerido", "danger")
      return false
    }

    if (!window.validateEmail(userData.email)) {
      window.showAlert("El email no es válido", "danger")
      return false
    }

    if (!userData.edad || userData.edad < 1 || userData.edad > 120) {
      window.showAlert("La edad debe ser un número válido", "danger")
      return false
    }

    if (!window.validateRequired(userData.sexo)) {
      window.showAlert("El sexo es requerido", "danger")
      return false
    }

    if (!window.validateRequired(userData.domicilio)) {
      window.showAlert("El domicilio es requerido", "danger")
      return false
    }

    if (!window.validatePhone(userData.telefono)) {
      window.showAlert("El teléfono no es válido", "danger")
      return false
    }

    if (!userData.rolId) {
      window.showAlert("El rol es requerido", "danger")
      return false
    }

    return true
  }

  async editUsuario(id) {
    const usuario = this.usuarios.find((u) => u.id === id)
    if (usuario) {
      this.showUserModal(usuario)
    }
  }

  async deleteUsuario(id) {
    const usuario = this.usuarios.find((u) => u.id === id)
    if (!usuario) return

    if (confirm(`¿Estás seguro de eliminar al usuario "${usuario.nombre}"?`)) {
      try {
        const response = await window.apiFetch(`/usuarios/${id}`, "DELETE")
        if (response && response.ok) {
          window.showAlert("Usuario eliminado correctamente", "success")
          await this.loadUsuarios()
        } else {
          window.showAlert("Error al eliminar usuario", "danger")
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        window.showAlert("Error al eliminar usuario", "danger")
      }
    }
  }

  filterUsuarios(searchTerm) {
    const rows = document.querySelectorAll("#usuarios-tbody tr")
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase()
      const matches = text.includes(searchTerm.toLowerCase())
      row.style.display = matches ? "" : "none"
    })
  }

  filterByRole(roleId) {
    const rows = document.querySelectorAll("#usuarios-tbody tr")
    rows.forEach((row) => {
      if (!roleId) {
        row.style.display = ""
        return
      }

      const usuario = this.usuarios.find((u) => u.id === Number.parseInt(row.cells[0].textContent))

      const matches = usuario && usuario.rol && usuario.rol.id === Number.parseInt(roleId)
      row.style.display = matches ? "" : "none"
    })
  }

  filterByStatus(status) {
    const rows = document.querySelectorAll("#usuarios-tbody tr")
    rows.forEach((row) => {
      if (!status) {
        row.style.display = ""
        return
      }

      const statusBadge = row.querySelector(".badge")
      const matches = statusBadge && statusBadge.textContent.trim() === status
      row.style.display = matches ? "" : "none"
    })
  }
}

// Inicializar cuando se carga la página
let usuariosManager
document.addEventListener("DOMContentLoaded", () => {
  usuariosManager = new UsuariosManager()
})
