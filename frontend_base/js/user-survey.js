// Gestor de Encuestas para Usuarios
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  if (!isAuthenticated()) {
    window.location.href = "../../login.html"
    return
  }

  // Inicializar la página
  initSurveysPage()
})

// Variables globales
let currentSurvey = null
let allSurveys = []

// Verificar autenticación
function isAuthenticated() {
  const userId = localStorage.getItem("userId")
  return !!userId
}

// Inicializar página de encuestas
async function initSurveysPage() {
  try {
    // Cargar información del usuario
    await loadUserInfo()

    // Cargar encuestas
    await loadSurveys()

    // Cargar estadísticas
    await loadUserStats()

    // Configurar event listeners
    setupEventListeners()

    // Configurar dropdown del usuario
    setupUserDropdown()
  } catch (error) {
    console.error("Error initializing surveys page:", error)
    showAlert("Error al cargar las encuestas", "error")
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

// Cargar encuestas
async function loadSurveys() {
  try {
    const response = await apiFetch("/encuestas/usuario")

    let surveys = []
    if (response && response.ok) {
      surveys = await response.json()
    } else {
      // Datos de prueba
      surveys = [
        {
          id: 1,
          titulo: "Satisfacción con el Programa de Colmenas",
          descripcion:
            "Queremos conocer tu opinión sobre el programa comunitario de colmenas y cómo podemos mejorarlo para beneficiar a toda la comunidad.",
          fechaCreacion: "2024-01-15T10:00:00Z",
          fechaVencimiento: "2024-02-15T23:59:59Z",
          activa: true,
          completada: false,
          totalPreguntas: 8,
          respuestasRecibidas: 45,
          creador: "Administración",
          preguntas: [
            {
              id: 1,
              texto: "¿Qué tan satisfecho estás con el programa de colmenas?",
              tipo: "opcion_unica",
              opciones: ["Muy satisfecho", "Satisfecho", "Neutral", "Insatisfecho", "Muy insatisfecho"],
              requerida: true,
            },
            {
              id: 2,
              texto: "¿Cuáles son los aspectos que más valoras del programa?",
              tipo: "opcion_multiple",
              opciones: [
                "Actividades comunitarias",
                "Mantenimiento de espacios",
                "Comunicación",
                "Organización",
                "Participación ciudadana",
              ],
              requerida: true,
            },
            {
              id: 3,
              texto: "¿Qué aspectos crees que se podrían mejorar?",
              tipo: "texto_largo",
              requerida: false,
            },
            {
              id: 4,
              texto: "En una escala del 1 al 5, ¿cómo calificarías la comunicación?",
              tipo: "escala",
              requerida: true,
            },
          ],
        },
        {
          id: 2,
          titulo: "Evaluación de Actividades Comunitarias",
          descripcion: "Ayúdanos a mejorar nuestras actividades comunitarias con tu valiosa opinión y sugerencias.",
          fechaCreacion: "2024-01-10T09:00:00Z",
          fechaVencimiento: "2024-03-01T23:59:59Z",
          activa: true,
          completada: true,
          totalPreguntas: 5,
          respuestasRecibidas: 32,
          creador: "Coordinador Local",
          fechaRespuesta: "2024-01-18T14:30:00Z",
          preguntas: [
            {
              id: 5,
              texto: "¿Con qué frecuencia participas en actividades comunitarias?",
              tipo: "opcion_unica",
              opciones: ["Siempre", "Frecuentemente", "A veces", "Raramente", "Nunca"],
              requerida: true,
            },
            {
              id: 6,
              texto: "¿Qué tipo de actividades te interesan más?",
              tipo: "opcion_multiple",
              opciones: ["Limpieza", "Talleres educativos", "Eventos sociales", "Deportes", "Jardinería"],
              requerida: true,
            },
          ],
        },
        {
          id: 3,
          titulo: "Propuestas para Mejoras en la Colmena",
          descripcion: "Comparte tus ideas y propuestas para hacer de nuestra colmena un lugar aún mejor para vivir.",
          fechaCreacion: "2024-01-05T16:00:00Z",
          fechaVencimiento: "2024-01-20T23:59:59Z",
          activa: false,
          completada: false,
          totalPreguntas: 6,
          respuestasRecibidas: 28,
          creador: "Comité de Mejoras",
          preguntas: [],
        },
        {
          id: 4,
          titulo: "Seguridad en la Colmena",
          descripcion: "Evaluación sobre las medidas de seguridad actuales y propuestas de mejora.",
          fechaCreacion: "2024-01-25T11:00:00Z",
          fechaVencimiento: "2024-02-25T23:59:59Z",
          activa: true,
          completada: false,
          totalPreguntas: 7,
          respuestasRecibidas: 12,
          creador: "Comité de Seguridad",
          preguntas: [
            {
              id: 7,
              texto: "¿Te sientes seguro en tu colmena?",
              tipo: "opcion_unica",
              opciones: ["Muy seguro", "Seguro", "Neutral", "Inseguro", "Muy inseguro"],
              requerida: true,
            },
            {
              id: 8,
              texto: "¿Qué medidas de seguridad consideras más importantes?",
              tipo: "opcion_multiple",
              opciones: ["Iluminación", "Cámaras de seguridad", "Control de acceso", "Patrullaje", "Alarmas"],
              requerida: true,
            },
            {
              id: 9,
              texto: "Describe algún incidente de seguridad que hayas presenciado:",
              tipo: "texto_largo",
              requerida: false,
            },
          ],
        },
      ]
    }

    allSurveys = surveys
    renderSurveys(surveys)
  } catch (error) {
    console.error("Error loading surveys:", error)
    showEmptySurveys()
  }
}

// Renderizar encuestas
function renderSurveys(surveys) {
  const container = document.getElementById("surveysContainer")

  if (!surveys || surveys.length === 0) {
    showEmptySurveys()
    return
  }

  container.innerHTML = surveys.map((survey) => createSurveyHTML(survey)).join("")
}

// Crear HTML para una encuesta
function createSurveyHTML(survey) {
  const createdDate = new Date(survey.fechaCreacion)
  const expiryDate = new Date(survey.fechaVencimiento)
  const now = new Date()

  const formattedCreated = createdDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const formattedExpiry = expiryDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Determinar estado
  let status = "active"
  let statusText = "Disponible"
  let actionButton = ""

  if (!survey.activa || expiryDate < now) {
    status = "expired"
    statusText = "Expirada"
    actionButton = '<button class="btn btn-outline" disabled><i class="fas fa-clock"></i> Expirada</button>'
  } else if (survey.completada) {
    status = "completed"
    statusText = "Completada"
    actionButton = `
      <button class="btn btn-outline" onclick="viewSurveyResults(${survey.id})">
        <i class="fas fa-chart-bar"></i> Ver Resultados
      </button>
      <button class="btn btn-primary" onclick="viewMyResponse(${survey.id})">
        <i class="fas fa-eye"></i> Ver Mi Respuesta
      </button>
    `
  } else {
    actionButton = `
      <button class="btn btn-primary" onclick="takeSurvey(${survey.id})">
        <i class="fas fa-edit"></i> Responder Encuesta
      </button>
    `
  }

  // Calcular progreso de respuestas (simulado)
  const targetResponses = 50 // Meta de respuestas
  const progressPercentage = Math.min((survey.respuestasRecibidas / targetResponses) * 100, 100)

  return `
    <div class="survey-card" data-survey-id="${survey.id}">
      <div class="survey-header">
        <div>
          <h3 class="survey-title">${survey.titulo}</h3>
          <span class="status-badge ${status}">${statusText}</span>
        </div>
      </div>
      
      <p class="survey-description">${survey.descripcion}</p>
      
      <div class="survey-meta">
        <div class="meta-item">
          <i class="fas fa-user"></i>
          <span>Creada por: ${survey.creador}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-calendar"></i>
          <span>Creada: ${formattedCreated}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-clock"></i>
          <span>Vence: ${formattedExpiry}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-question-circle"></i>
          <span>${survey.totalPreguntas} preguntas</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-users"></i>
          <span>${survey.respuestasRecibidas} respuestas</span>
        </div>
        ${
          survey.completada
            ? `
        <div class="meta-item">
          <i class="fas fa-check"></i>
          <span>Respondida: ${new Date(survey.fechaRespuesta).toLocaleDateString("es-ES")}</span>
        </div>
        `
            : ""
        }
      </div>
      
      <div class="survey-progress">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 14px; font-weight: 600;">Progreso de Respuestas</span>
          <span style="font-size: 14px; color: #65676b;">${survey.respuestasRecibidas}/${targetResponses}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progressPercentage}%"></div>
        </div>
      </div>
      
      <div class="survey-actions">
        ${actionButton}
      </div>
    </div>
  `
}

// Mostrar encuestas vacías
function showEmptySurveys() {
  const container = document.getElementById("surveysContainer")
  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-poll"></i>
      <h3>No hay encuestas disponibles</h3>
      <p>Aún no hay encuestas disponibles en tu colmena. Las encuestas aparecerán aquí cuando estén disponibles.</p>
    </div>
  `
}

// Cargar estadísticas del usuario
async function loadUserStats() {
  try {
    const surveys = allSurveys || []
    const stats = {
      total: surveys.length,
      completed: surveys.filter((s) => s.completada).length,
      pending: surveys.filter((s) => s.activa && !s.completada && new Date(s.fechaVencimiento) > new Date()).length,
    }

    updateUserStats(stats)
  } catch (error) {
    console.error("Error loading user stats:", error)
  }
}

// Actualizar estadísticas del usuario
function updateUserStats(stats) {
  const totalElement = document.getElementById("totalSurveys")
  const completedElement = document.getElementById("completedSurveys")
  const pendingElement = document.getElementById("pendingSurveys")

  if (totalElement) totalElement.textContent = stats.total || 0
  if (completedElement) completedElement.textContent = stats.completed || 0
  if (pendingElement) pendingElement.textContent = stats.pending || 0
}

// Configurar event listeners
function setupEventListeners() {
  // Filtros
  const statusFilter = document.getElementById("statusFilter")
  const searchInput = document.getElementById("searchInput")

  if (statusFilter) {
    statusFilter.addEventListener("change", filterSurveys)
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterSurveys)
  }

  // Cerrar modales al hacer clic fuera
  window.addEventListener("click", (event) => {
    const surveyModal = document.getElementById("surveyModal")
    const resultsModal = document.getElementById("resultsModal")

    if (event.target === surveyModal) {
      closeSurveyModal()
    }
    if (event.target === resultsModal) {
      closeResultsModal()
    }
  })
}

// Filtrar encuestas
function filterSurveys() {
  const statusFilter = document.getElementById("statusFilter").value
  const searchTerm = document.getElementById("searchInput").value.toLowerCase()

  let filteredSurveys = allSurveys || []

  // Filtrar por estado
  if (statusFilter) {
    const now = new Date()
    filteredSurveys = filteredSurveys.filter((survey) => {
      switch (statusFilter) {
        case "disponible":
          return survey.activa && !survey.completada && new Date(survey.fechaVencimiento) > now
        case "completada":
          return survey.completada
        case "expirada":
          return !survey.activa || new Date(survey.fechaVencimiento) <= now
        default:
          return true
      }
    })
  }

  // Filtrar por búsqueda
  if (searchTerm) {
    filteredSurveys = filteredSurveys.filter(
      (survey) =>
        survey.titulo.toLowerCase().includes(searchTerm) ||
        survey.descripcion.toLowerCase().includes(searchTerm) ||
        survey.creador.toLowerCase().includes(searchTerm),
    )
  }

  renderSurveys(filteredSurveys)
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

// Tomar encuesta
function takeSurvey(surveyId) {
  const survey = allSurveys.find((s) => s.id === surveyId)
  if (!survey || !survey.preguntas || survey.preguntas.length === 0) {
    showAlert("Esta encuesta no tiene preguntas disponibles", "error")
    return
  }

  currentSurvey = survey
  document.getElementById("surveyModalTitle").textContent = survey.titulo

  const container = document.getElementById("questionsContainer")
  container.innerHTML = survey.preguntas.map((question, index) => createQuestionHTML(question, index)).join("")

  document.getElementById("surveyModal").style.display = "block"
}

// Crear HTML para una pregunta
function createQuestionHTML(question, index) {
  let inputHTML = ""

  switch (question.tipo) {
    case "texto_corto":
      inputHTML = `
        <input type="text" class="text-input" name="question_${question.id}" ${question.requerida ? "required" : ""} placeholder="Escribe tu respuesta...">
      `
      break

    case "texto_largo":
      inputHTML = `
        <textarea class="text-input" name="question_${question.id}" rows="4" ${question.requerida ? "required" : ""} placeholder="Escribe tu respuesta detallada..."></textarea>
      `
      break

    case "opcion_unica":
      inputHTML = `
        <div class="question-options">
          ${question.opciones
            .map(
              (option, optIndex) => `
            <label class="option-item">
              <input type="radio" name="question_${question.id}" value="${option}" ${question.requerida ? "required" : ""}>
              <span>${option}</span>
            </label>
          `,
            )
            .join("")}
        </div>
      `
      break

    case "opcion_multiple":
      inputHTML = `
        <div class="question-options">
          ${question.opciones
            .map(
              (option, optIndex) => `
            <label class="option-item">
              <input type="checkbox" name="question_${question.id}" value="${option}">
              <span>${option}</span>
            </label>
          `,
            )
            .join("")}
        </div>
      `
      break

    case "escala":
      inputHTML = `
        <div class="scale-container">
          ${[1, 2, 3, 4, 5]
            .map(
              (num) => `
            <label class="scale-option">
              <input type="radio" name="question_${question.id}" value="${num}" ${question.requerida ? "required" : ""}>
              <span>${num}</span>
            </label>
          `,
            )
            .join("")}
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #65676b;">
          <span>Muy malo</span>
          <span>Excelente</span>
        </div>
      `
      break

    default:
      inputHTML = `
        <input type="text" class="text-input" name="question_${question.id}" ${question.requerida ? "required" : ""}>
      `
  }

  return `
    <div class="question-container">
      <div class="question-title">
        <span>Pregunta ${index + 1}</span>
        ${question.requerida ? '<span class="question-required">*</span>' : ""}
      </div>
      <p style="margin-bottom: 16px; color: #1c1e21; font-weight: 500;">${question.texto}</p>
      ${inputHTML}
    </div>
  `
}

// Cerrar modal de encuesta
function closeSurveyModal() {
  document.getElementById("surveyModal").style.display = "none"
  document.getElementById("surveyForm").reset()
  currentSurvey = null
}

// Enviar encuesta
async function submitSurvey() {
  if (!currentSurvey) return

  const form = document.getElementById("surveyForm")
  const formData = new FormData(form)

  // Validar campos requeridos
  const requiredQuestions = currentSurvey.preguntas.filter((q) => q.requerida)
  for (const question of requiredQuestions) {
    const value = formData.get(`question_${question.id}`)
    if (!value || (Array.isArray(value) && value.length === 0)) {
      showAlert(`Por favor responde la pregunta requerida: "${question.texto}"`, "error")
      return
    }
  }

  // Recopilar respuestas
  const responses = {}
  currentSurvey.preguntas.forEach((question) => {
    if (question.tipo === "opcion_multiple") {
      responses[question.id] = formData.getAll(`question_${question.id}`)
    } else {
      responses[question.id] = formData.get(`question_${question.id}`)
    }
  })

  const responseData = {
    encuestaId: currentSurvey.id,
    usuarioId: getSession().userId,
    respuestas: responses,
    fechaRespuesta: new Date().toISOString(),
  }

  try {
    const response = await apiFetch("/encuestas/responder", "POST", responseData)

    if (response && response.ok) {
      showAlert("¡Respuesta enviada exitosamente!", "success")
    } else {
      // Simular éxito
      showAlert("¡Respuesta enviada exitosamente!", "success")

      // Actualizar encuesta localmente
      const survey = allSurveys.find((s) => s.id === currentSurvey.id)
      if (survey) {
        survey.completada = true
        survey.fechaRespuesta = new Date().toISOString()
        survey.respuestasRecibidas += 1
      }

      // Recargar vista
      renderSurveys(allSurveys)
      loadUserStats()
    }

    closeSurveyModal()
  } catch (error) {
    console.error("Error submitting survey:", error)
    showAlert("Error al enviar la respuesta", "error")
  }
}

// Ver resultados de encuesta
function viewSurveyResults(surveyId) {
  const survey = allSurveys.find((s) => s.id === surveyId)
  if (!survey) return

  document.getElementById("resultsModalTitle").textContent = `Resultados: ${survey.titulo}`

  const container = document.getElementById("resultsContainer")
  container.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <i class="fas fa-chart-bar" style="font-size: 48px; color: #1877f2; margin-bottom: 16px;"></i>
      <h4>Resultados de la Encuesta</h4>
      <p style="color: #65676b; margin-bottom: 20px;">
        Esta encuesta ha recibido <strong>${survey.respuestasRecibidas}</strong> respuestas hasta el momento.
      </p>
      <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <p style="margin: 0; font-size: 14px; color: #65676b;">
          Los resultados detallados estarán disponibles una vez que la encuesta haya finalizado.
        </p>
      </div>
      <p style="font-size: 14px; color: #65676b;">
        Gracias por tu participación en esta encuesta.
      </p>
    </div>
  `

  document.getElementById("resultsModal").style.display = "block"
}

// Ver mi respuesta
function viewMyResponse(surveyId) {
  const survey = allSurveys.find((s) => s.id === surveyId)
  if (!survey) return

  document.getElementById("resultsModalTitle").textContent = `Mi Respuesta: ${survey.titulo}`

  const container = document.getElementById("resultsContainer")
  container.innerHTML = `
    <div style="padding: 20px;">
      <div style="background: #e8f5e8; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <i class="fas fa-check-circle" style="color: #4caf50;"></i>
          <strong>Encuesta Completada</strong>
        </div>
        <p style="margin: 0; font-size: 14px; color: #2e7d32;">
          Respondiste esta encuesta el ${new Date(survey.fechaRespuesta).toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      
      <div style="text-align: center; padding: 20px;">
        <i class="fas fa-file-alt" style="font-size: 48px; color: #1877f2; margin-bottom: 16px;"></i>
        <h4>Respuesta Registrada</h4>
        <p style="color: #65676b;">
          Tu respuesta ha sido registrada exitosamente. Gracias por tu participación.
        </p>
      </div>
    </div>
  `

  document.getElementById("resultsModal").style.display = "block"
}

// Cerrar modal de resultados
function closeResultsModal() {
  document.getElementById("resultsModal").style.display = "none"
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
window.takeSurvey = takeSurvey
window.closeSurveyModal = closeSurveyModal
window.submitSurvey = submitSurvey
window.viewSurveyResults = viewSurveyResults
window.viewMyResponse = viewMyResponse
window.closeResultsModal = closeResultsModal
window.logout = logout
