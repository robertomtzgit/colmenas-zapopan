// Importar las funciones de la API
// Asegúrate de que api.js esté cargado antes que script.js en tu HTML
// <script src="api.js"></script>
// <script src="script.js"></script>

const container = document.querySelector(".container")
const btnSignIn = document.getElementById("btn-sign-in")
const btnSignUp = document.getElementById("btn-sign-up")

btnSignIn.addEventListener("click", () => {
    container.classList.remove("toggle")
    const signInForm = document.getElementById("sign-in")
    const existingMessage = signInForm.querySelector(".message")
    if (existingMessage) existingMessage.remove()
})

btnSignUp.addEventListener("click", () => {
    container.classList.add("toggle")
    const signUpForm = document.getElementById("sign-up")
    const existingMessage = signUpForm.querySelector(".message")
    if (existingMessage) existingMessage.remove()
})

function showMessage(form, message, type) {
    const existingMessage = form.querySelector(".message")
    if (existingMessage) existingMessage.remove()
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${type}`
    messageDiv.textContent = message
    const firstInput = form.querySelector(".container-input")
    if (firstInput) {
        form.insertBefore(messageDiv, firstInput)
    } else {
        form.appendChild(messageDiv)
    }
    setTimeout(() => {
        if (messageDiv.parentNode) messageDiv.remove()
    }, 5000)
}

// === Registro real ===
document.getElementById("sign-up").addEventListener("submit", async function (e) {
    e.preventDefault()

    const nombre = document.getElementById("registerName").value
    const email = document.getElementById("registerEmail").value
    const password = document.getElementById("registerPassword").value
    const edad = Number.parseInt(document.getElementById("registerEdad").value)
    const sexo = document.getElementById("registerSexo").value
    const domicilio = document.getElementById("registerDomicilio").value
    const telefono = document.getElementById("registerTelefono").value

    // Validar campos básicos
    if (!nombre || !email || !password || isNaN(edad) || !sexo || !domicilio || !telefono) {
        showMessage(this, "Por favor, complete todos los campos.", "error")
        return
    }
    if (password.length < 6) {
        showMessage(this, "La contraseña debe tener al menos 6 caracteres.", "error")
        return
    }
    if (edad < 0) {
        showMessage(this, "La edad no puede ser negativa.", "error")
        return
    }

    // El rolId se asigna fijo en el frontend para el registro de usuario normal
    // Asumimos que el ID 2 es para el rol "USUARIO" o "COMUNITARIO"
    // Debes asegurarte de que este rol exista en tu BD con ID 2
    const rolId = 2

    const data = {
        nombre,
        email,
        password,
        edad,
        sexo,
        domicilio,
        telefono,
        rolId,
    }

    try {
        // Usar la función registerUser de api.js
        const registerUser = window.registerUser // Declare the variable before using it
        const response = await registerUser(data)
        if (response.ok) {
            const result = await response.json()
            showMessage(this, result.message || "Registro exitoso", "success")
            // Opcional: limpiar campos después del registro exitoso
            this.reset()
            // Redirigir al login o al dashboard si se desea
            setTimeout(() => {
                container.classList.remove("toggle") // Volver a la vista de login
            }, 1500)
        } else {
            const errorData = await response.json()
            showMessage(this, errorData.message || "Error en el registro", "error")
            console.error("Error en el registro:", errorData)
        }
    } catch (error) {
        showMessage(this, "No se pudo conectar con el servidor.", "error")
        console.error("Error de red:", error)
    }
})

// === Login real ===
document.getElementById("sign-in").addEventListener("submit", async function (e) {
    e.preventDefault()

    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value

    if (!email || !password) {
        showMessage(this, "Por favor, complete todos los campos.", "error")
        return
    }

    try {
        // Usar la función loginUser de api.js
        const loginUser = window.loginUser // Declare the variable before using it
        const response = await loginUser({ email, password })
        if (response.ok) {
            const data = await response.json()
            // Almacenar datos del usuario en localStorage
            localStorage.setItem("userId", data.userId)
            localStorage.setItem("userName", data.userEmail) // Usamos email como nombre temporal
            localStorage.setItem("userRole", data.userRole) // Almacenamos el rol del backend

            showMessage(this, data.message || "Inicio de sesión exitoso. Redirigiendo...", "success")
            setTimeout(() => {
                window.location.href = "dashboard.html"
            }, 1500)
        } else {
            const errorData = await response.json()
            showMessage(this, errorData.message || "Credenciales incorrectas.", "error")
            console.error("Error de login:", errorData)
        }
    } catch (err) {
        showMessage(this, "No se pudo conectar con el servidor.", "error")
        console.error("Error de red:", err)
    }
})
