// Configuración global
const API_BASE_URL = "http://localhost:8080/api"

// Función genérica para hacer peticiones a la API
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

    // Verificar si la respuesta es 401 (no autorizado)
    if (response.status === 401) {
      console.error("Sesión expirada o usuario no autorizado")
      clearSession()
      redirectToLogin()
      return null
    }

    return response
  } catch (error) {
    console.error(`Error calling API ${endpoint}:`, error)
    showAlert("Error de conexión con el servidor", "danger")
    throw error
  }
}

// Manejo de sesión
function getSession() {
  return {
    userId: localStorage.getItem("userId"),
    userEmail: localStorage.getItem("userEmail"),
    userName: localStorage.getItem("userName"),
    userRole: localStorage.getItem("userRole"),
  }
}

function setSession(userId, userEmail, userRole, userName = null) {
  localStorage.setItem("userId", userId)
  localStorage.setItem("userEmail", userEmail)
  localStorage.setItem("userRole", userRole)
  if (userName) {
    localStorage.setItem("userName", userName)
  }
}

function clearSession() {
  localStorage.removeItem("userId")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userName")
  localStorage.removeItem("userRole")
}

function isAuthenticated() {
  return !!localStorage.getItem("userId")
}

function redirectToLogin() {
  window.location.href = "../login.html"
}

// Verificar autenticación en páginas protegidas
function checkAuth() {
  if (!isAuthenticated()) {
    redirectToLogin()
    return false
  }
  return true
}

// Cargar componentes
async function loadComponent(componentPath, containerId) {
  try {
    const response = await fetch(`../components/${componentPath}`)
    if (response.ok) {
      const html = await response.text()
      document.getElementById(containerId).innerHTML = html
    }
  } catch (error) {
    console.error(`Error loading component ${componentPath}:`, error)
  }
}

// Inicializar layout común
async function initLayout() {
  // Cargar componentes
  await loadComponent("navbar.html", "navbar-container")
  await loadComponent("sidebar.html", "sidebar-container")
  await loadComponent("footer.html", "footer-container")

  // Configurar información del usuario
  setupUserInfo()

  // Configurar navegación
  setupNavigation()

  // Cargar notificaciones
  loadNotificationCount()
}

// Configurar información del usuario
async function setupUserInfo() {
  const session = getSession()
  const userNameElement = document.getElementById("user-name")
  const userAvatarElement = document.getElementById("user-avatar")
  const userRoleElement = document.getElementById("user-role")

  if (session.userId) {
    try {
      // Obtener datos completos del usuario
      const response = await apiFetch(`/usuarios/${session.userId}`)
      if (response && response.ok) {
        const userData = await response.json()

        if (userNameElement) {
          userNameElement.textContent = userData.nombre
        }

        if (userAvatarElement) {
          userAvatarElement.textContent = userData.nombre.charAt(0).toUpperCase()
        }

        // Mostrar rol del usuario
        if (userRoleElement) {
          userRoleElement.textContent = userData.rol ? userData.rol.nombre : "Sin rol"
        }

        // Actualizar datos de sesión con información completa
        setSession(userData.id, userData.email, userData.rol ? userData.rol.nombre : "USER", userData.nombre)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      // Fallback a datos de sesión
      if (userNameElement) {
        userNameElement.textContent = session.userName || session.userEmail || "Usuario"
      }
      if (userAvatarElement) {
        userAvatarElement.textContent = (session.userName || session.userEmail || "U").charAt(0).toUpperCase()
      }
      if (userRoleElement) {
        userRoleElement.textContent = session.userRole || "Usuario"
      }
    }
  }
}

// Configurar navegación
function setupNavigation() {
  // Toggle sidebar
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.querySelector(".main-content")

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed")
      mainContent.classList.toggle("expanded")
    })
  }

  // Dropdown usuario
  const userDropdown = document.getElementById("user-dropdown")
  const userMenu = document.getElementById("user-menu")

  if (userDropdown && userMenu) {
    userDropdown.addEventListener("click", (e) => {
      e.stopPropagation()
      userMenu.classList.toggle("show")
    })

    // Cerrar dropdown al hacer click fuera
    document.addEventListener("click", () => {
      userMenu.classList.remove("show")
    })
  }

  // Logout desde dropdown
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }

  // Logout directo
  const logoutDirectBtn = document.getElementById("logout-direct-btn")
  if (logoutDirectBtn) {
    logoutDirectBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }

  // Marcar página activa en sidebar
  markActivePage()
}

// Marcar página activa en sidebar
function markActivePage() {
  const currentPage = window.location.pathname.split("/").pop().replace(".html", "")
  const sidebarLinks = document.querySelectorAll(".sidebar-menu a")

  sidebarLinks.forEach((link) => {
    const page = link.getAttribute("data-page")
    if (page === currentPage) {
      link.classList.add("active")
    }
  })
}

// Función logout
function logout() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    clearSession()
    // Redirigir al login
    window.location.href = "../login.html"
  }
}

// Cargar contador de notificaciones
async function loadNotificationCount() {
  const session = getSession()
  if (!session.userId) return

  try {
    const response = await apiFetch(`/notificaciones/usuario/${session.userId}/unread`)
    if (response && response.ok) {
      const notifications = await response.json()
      const countElement = document.getElementById("notification-count")
      if (countElement) {
        countElement.textContent = notifications.length
        countElement.style.display = notifications.length > 0 ? "flex" : "none"
      }
    }
  } catch (error) {
    console.error("Error loading notification count:", error)
  }
}

// Utilidades para mostrar alertas
function showAlert(message, type = "info", duration = 5000) {
  const alertContainer = document.getElementById("alert-container") || createAlertContainer()

  const alert = document.createElement("div")
  alert.className = `alert alert-${type}`
  alert.innerHTML = `
        <span>${message}</span>
        <button type="button" class="alert-close" onclick="this.parentElement.remove()">
            <ion-icon name="close"></ion-icon>
        </button>
    `

  alertContainer.appendChild(alert)

  // Auto-remove after duration
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove()
    }
  }, duration)
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

// Utilidades para modales
function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("show")
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("show")
  }
}

// Configurar modales
function setupModals() {
  // Cerrar modal al hacer click en el overlay
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.classList.remove("show")
    }
  })

  // Cerrar modal con botón close
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-close") || e.target.closest(".modal-close")) {
      const modal = e.target.closest(".modal")
      if (modal) {
        modal.classList.remove("show")
      }
    }
  })
}

// Utilidades para formateo
function formatDate(dateString) {
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

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount)
}

function truncateText(text, maxLength = 100) {
  if (!text) return ""
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

// Utilidades para validación
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePhone(phone) {
  const re = /^[\d\s\-+$$$$]+$/
  return re.test(phone) && phone.replace(/\D/g, "").length >= 10
}

function validateRequired(value) {
  return value && value.toString().trim().length > 0
}

// Inicialización global
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  if (!checkAuth()) return

  // Inicializar layout
  initLayout()

  // Configurar modales
  setupModals()

  // Configurar alertas
  createAlertContainer()
})

// Exportar funciones globales
window.apiFetch = apiFetch
window.getSession = getSession
window.setSession = setSession
window.clearSession = clearSession
window.isAuthenticated = isAuthenticated
window.checkAuth = checkAuth
window.showAlert = showAlert
window.showModal = showModal
window.hideModal = hideModal
window.formatDate = formatDate
window.formatCurrency = formatCurrency
window.truncateText = truncateText
window.validateEmail = validateEmail
window.validatePhone = validatePhone
window.validateRequired = validateRequired
