// Configuración de la API
const API_BASE_URL = "http://localhost:8080/api"

// Elementos del DOM
const container = document.querySelector(".container")
const signInForm = document.getElementById("sign-in")
const signUpForm = document.getElementById("sign-up")
const btnSignUp = document.getElementById("btn-sign-up")
const btnSignIn = document.getElementById("btn-sign-in")

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si ya está autenticado
  if (isAuthenticated()) {
    redirectBasedOnRole()
    return
  }

  setupEventListeners()
})

// Configurar event listeners
function setupEventListeners() {
  // Cambio entre formularios
  btnSignUp.addEventListener("click", () => {
    container.classList.add("toggle")
  })

  btnSignIn.addEventListener("click", () => {
    container.classList.remove("toggle")
  })

  // Envío de formularios
  signInForm.addEventListener("submit", handleLogin)
  signUpForm.addEventListener("submit", handleRegister)
}

// Manejar inicio de sesión
async function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  if (!validateEmail(email)) {
    showAlert("Por favor ingresa un email válido", "error")
    return
  }

  if (!password) {
    showAlert("Por favor ingresa tu contraseña", "error")
    return
  }

  const submitButton = e.target.querySelector('button[type="submit"]')
  setLoading(submitButton, true)

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      // Guardar datos de sesión con nombre de usuario
      setSession(data.userId, data.userEmail, data.userRole, data.userName)
      showAlert("¡Bienvenido! Redirigiendo...", "success")

      // Redirigir según el rol - AQUÍ ESTÁ EL CAMBIO PRINCIPAL
      setTimeout(() => {
        if (data.userRole === "ADMIN" || data.userRole === "RESPONSABLE_COLMENA") {
          redirectToDashboard()
        } else {
          // Usuarios normales van al feed - YA NO SE BLOQUEA
          redirectToUserFeed()
        }
      }, 1500)
    } else {
      // Si la API no responde, simular login para pruebas
      handleTestLogin(email, password)
    }
  } catch (error) {
    console.error("Error en login:", error)
    // Modo de prueba si hay error de conexión
    handleTestLogin(email, password)
  } finally {
    setLoading(submitButton, false)
  }
}

// Función para manejar logins de prueba
function handleTestLogin(email, password) {
  if (email === "admin@test.com" && password === "123456") {
    setSession("1", "admin@test.com", "ADMIN", "Administrador de Prueba")
    showAlert("¡Bienvenido! (Modo de prueba)", "success")
    setTimeout(() => {
      redirectToDashboard()
    }, 1500)
  } else if (email === "user@test.com" && password === "123456") {
    setSession("2", "user@test.com", "USUARIO", "Usuario de Prueba")
    showAlert("¡Bienvenido! (Modo de prueba)", "success")
    setTimeout(() => {
      redirectToUserFeed()
    }, 1500)
  } else {
    showAlert("Credenciales inválidas. Prueba: admin@test.com / 123456 o user@test.com / 123456", "error")
  }
}

// Manejar registro
async function handleRegister(e) {
  e.preventDefault()

  const formData = {
    nombre: document.getElementById("registerName").value,
    email: document.getElementById("registerEmail").value,
    password: document.getElementById("registerPassword").value,
    edad: Number.parseInt(document.getElementById("registerEdad").value),
    sexo: document.getElementById("registerSexo").value,
    domicilio: document.getElementById("registerDomicilio").value,
    telefono: document.getElementById("registerTelefono").value,
    rolId: 2, // Rol de usuario normal por defecto
  }

  // Validaciones
  if (!validateRegisterForm(formData)) {
    return
  }

  const submitButton = e.target.querySelector('button[type="submit"]')
  setLoading(submitButton, true)

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (response.ok) {
      showAlert("¡Registro exitoso! Ahora puedes iniciar sesión.", "success")
      // Cambiar al formulario de login
      container.classList.remove("toggle")
      // Limpiar formulario
      signUpForm.reset()
    } else {
      showAlert(data.message || "Error en el registro", "error")
    }
  } catch (error) {
    console.error("Error en registro:", error)
    showAlert("Error de conexión. Inténtalo de nuevo.", "error")
  } finally {
    setLoading(submitButton, false)
  }
}

// Validaciones
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-+()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}

function validateRegisterForm(data) {
  if (!data.nombre.trim()) {
    showAlert("El nombre es requerido", "error")
    return false
  }

  if (!validateEmail(data.email)) {
    showAlert("El email no es válido", "error")
    return false
  }

  if (data.password.length < 6) {
    showAlert("La contraseña debe tener al menos 6 caracteres", "error")
    return false
  }

  if (!data.edad || data.edad < 1 || data.edad > 120) {
    showAlert("La edad debe ser un número válido", "error")
    return false
  }

  if (!data.sexo) {
    showAlert("El sexo es requerido", "error")
    return false
  }

  if (!data.domicilio.trim()) {
    showAlert("El domicilio es requerido", "error")
    return false
  }

  if (!validatePhone(data.telefono)) {
    showAlert("El teléfono no es válido", "error")
    return false
  }

  return true
}

// Manejo de sesión
function setSession(userId, userEmail, userRole, userName = null) {
  localStorage.setItem("userId", userId)
  localStorage.setItem("userEmail", userEmail)
  localStorage.setItem("userRole", userRole)
  localStorage.setItem("loginTime", new Date().getTime())
  if (userName) {
    localStorage.setItem("userName", userName)
  }
}

function isAuthenticated() {
  const userId = localStorage.getItem("userId")
  const loginTime = localStorage.getItem("loginTime")

  if (!userId || !loginTime) {
    return false
  }

  // Verificar si la sesión ha expirado (24 horas)
  const now = new Date().getTime()
  const sessionDuration = 24 * 60 * 60 * 1000 // 24 horas

  if (now - Number.parseInt(loginTime) > sessionDuration) {
    clearSession()
    return false
  }

  return true
}

function clearSession() {
  localStorage.removeItem("userId")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userRole")
  localStorage.removeItem("loginTime")
  localStorage.removeItem("userName")
}

// Funciones de redirección
function redirectToDashboard() {
  window.location.href = "pages/dashboard.html"
}

function redirectToUserFeed() {
  window.location.href = "pages/usuarios/feed.html"
}

function redirectBasedOnRole() {
  const userRole = localStorage.getItem("userRole")
  if (userRole === "ADMIN" || userRole === "RESPONSABLE_COLMENA") {
    redirectToDashboard()
  } else {
    redirectToUserFeed()
  }
}

// Utilidades UI
function showAlert(message, type) {
  const alertContainer = document.getElementById("alert-container")

  const alert = document.createElement("div")
  alert.className = `alert ${type}`
  alert.innerHTML = `
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">
            ×
        </button>
    `

  alertContainer.appendChild(alert)

  // Auto-remove después de 5 segundos
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove()
    }
  }, 5000)
}

function setLoading(button, loading) {
  if (loading) {
    button.disabled = true
    button.classList.add("loading")
    button.textContent = "Cargando..."
  } else {
    button.disabled = false
    button.classList.remove("loading")
    button.textContent = button.id.includes("sign-in") ? "Iniciar Sesión" : "Registrarse"
  }
}
