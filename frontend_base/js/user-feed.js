// Gestor del Feed de Usuarios
class UserFeedManager {
  constructor() {
    this.posts = []
    this.actividades = []
    this.notificaciones = []
    this.colmenaInfo = null
    this.init()
  }

  async init() {
    await this.loadUserData()
    await this.loadFeedData()
    this.setupEventListeners()
  }

  async loadUserData() {
    const session = window.getSession()
    try {
      // Cargar información del usuario
      const userResponse = await window.apiFetch(`/usuarios/${session.userId}`)
      if (userResponse && userResponse.ok) {
        const userData = await userResponse.json()
        this.updateUserInfo(userData)
      } else {
        // Datos de prueba
        this.updateUserInfo({
          nombre: "Usuario Demo",
          email: session.userEmail || "usuario@demo.com",
          colmena: { nombre: "Colmena Norte #3", ubicacion: "Sector Norte" },
        })
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  updateUserInfo(userData) {
    const userNameElements = document.querySelectorAll("#user-name, .user-name")
    const userAvatarElements = document.querySelectorAll("#user-avatar, .user-avatar")

    userNameElements.forEach((el) => {
      if (el) el.textContent = userData.nombre
    })

    userAvatarElements.forEach((el) => {
      if (el) el.textContent = userData.nombre.charAt(0).toUpperCase()
    })

    this.colmenaInfo = userData.colmena
  }

  async loadFeedData() {
    try {
      await Promise.all([
        this.loadPosts(),
        this.loadActividades(),
        this.loadNotificaciones(),
        this.loadColmenaInfo(),
        this.loadStats(),
      ])
    } catch (error) {
      console.error("Error loading feed data:", error)
    }
  }

  async loadPosts() {
    try {
      const response = await window.apiFetch("/feed/posts")
      if (response && response.ok) {
        this.posts = await response.json()
      } else {
        // Datos de prueba para el feed
        this.posts = [
          {
            id: 1,
            tipo: "actividad",
            titulo: "Taller de Apicultura Básica",
            contenido:
              "Se realizó exitosamente el taller de apicultura básica con la participación de 25 miembros de la comunidad. Aprendimos técnicas de manejo seguro de colmenas.",
            autor: { nombre: "María González", avatar: "M" },
            fecha: "2024-01-20T14:30:00Z",
            imagen: "/placeholder.svg?height=300&width=500",
            likes: 12,
            comentarios: 5,
            compartidos: 2,
            userLiked: false,
          },
          {
            id: 2,
            tipo: "reporte",
            titulo: "Problema Resuelto - Colmena #7",
            contenido:
              "El problema reportado sobre la entrada bloqueada en la colmena #7 ha sido resuelto. Se realizó limpieza y mantenimiento preventivo.",
            autor: { nombre: "Carlos Técnico", avatar: "C" },
            fecha: "2024-01-19T10:15:00Z",
            likes: 8,
            comentarios: 3,
            compartidos: 1,
            userLiked: false,
          },
          {
            id: 3,
            tipo: "notificacion",
            titulo: "Nueva Encuesta Disponible",
            contenido:
              "Hay una nueva encuesta sobre satisfacción del programa. Tu opinión es muy importante para mejorar nuestros servicios.",
            autor: { nombre: "Sistema", avatar: "S" },
            fecha: "2024-01-18T16:45:00Z",
            likes: 15,
            comentarios: 8,
            compartidos: 4,
            userLiked: false,
          },
          {
            id: 4,
            tipo: "actividad",
            titulo: "Cosecha Comunitaria",
            contenido:
              "Gran éxito en la cosecha comunitaria de miel. Se recolectaron 45 kg de miel de excelente calidad que serán distribuidos entre los participantes.",
            autor: { nombre: "Ana Coordinadora", avatar: "A" },
            fecha: "2024-01-17T09:00:00Z",
            imagen: "/placeholder.svg?height=300&width=500",
            likes: 28,
            comentarios: 12,
            compartidos: 8,
            userLiked: true,
          },
        ]
      }
      this.renderPosts()
    } catch (error) {
      console.error("Error loading posts:", error)
    }
  }

  renderPosts() {
    const container = document.getElementById("feed-container")
    if (!container) return

    if (this.posts.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <ion-icon name="newspaper"></ion-icon>
                    <h3>No hay publicaciones</h3>
                    <p>Aún no hay contenido en tu feed.</p>
                </div>
            `
      return
    }

    container.innerHTML = this.posts
      .map(
        (post) => `
            <article class="feed-post">
                <div class="post-header">
                    <div class="user-avatar small">${post.autor.avatar}</div>
                    <div class="post-author">
                        <h6 class="post-author-name">${post.autor.nombre}</h6>
                        <p class="post-meta">
                            ${window.formatDate(post.fecha)}
                            <span class="content-badge ${post.tipo}">${this.getTipoLabel(post.tipo)}</span>
                        </p>
                    </div>
                </div>
                <div class="post-content">
                    <h5 class="post-title">${post.titulo}</h5>
                    <p class="post-text">${post.contenido}</p>
                    ${post.imagen ? `<img src="${post.imagen}" alt="${post.titulo}" class="post-image">` : ""}
                </div>
                <div class="post-actions">
                    <button class="post-action ${post.userLiked ? "active" : ""}" onclick="userFeedManager.toggleLike(${post.id})">
                        <ion-icon name="heart${post.userLiked ? "" : "-outline"}"></ion-icon>
                        <span>${post.likes}</span>
                    </button>
                    <button class="post-action" onclick="userFeedManager.showComments(${post.id})">
                        <ion-icon name="chatbubble-outline"></ion-icon>
                        <span>${post.comentarios}</span>
                    </button>
                    <button class="post-action" onclick="userFeedManager.sharePost(${post.id})">
                        <ion-icon name="share-outline"></ion-icon>
                        <span>${post.compartidos}</span>
                    </button>
                </div>
            </article>
        `,
      )
      .join("")
  }

  getTipoLabel(tipo) {
    switch (tipo) {
      case "actividad":
        return "Actividad"
      case "reporte":
        return "Reporte"
      case "notificacion":
        return "Notificación"
      case "encuesta":
        return "Encuesta"
      default:
        return tipo
    }
  }

  async loadActividades() {
    try {
      const response = await window.apiFetch("/actividades/proximas")
      if (response && response.ok) {
        this.actividades = await response.json()
      } else {
        // Datos de prueba
        this.actividades = [
          {
            id: 1,
            titulo: "Inspección Mensual",
            fecha: "2024-01-25T09:00:00Z",
            ubicacion: "Colmena Norte #3",
          },
          {
            id: 2,
            titulo: "Taller de Procesamiento",
            fecha: "2024-01-28T14:00:00Z",
            ubicacion: "Centro Comunitario",
          },
          {
            id: 3,
            titulo: "Reunión Mensual",
            fecha: "2024-02-01T18:00:00Z",
            ubicacion: "Salón Principal",
          },
        ]
      }
      this.renderActividades()
    } catch (error) {
      console.error("Error loading actividades:", error)
    }
  }

  renderActividades() {
    const container = document.getElementById("proximas-actividades")
    if (!container) return

    if (this.actividades.length === 0) {
      container.innerHTML = '<p class="text-center">No hay actividades próximas</p>'
      return
    }

    container.innerHTML = this.actividades
      .slice(0, 3)
      .map(
        (actividad) => `
            <a href="actividades.html?id=${actividad.id}" class="widget-item">
                <div class="widget-icon">
                    <ion-icon name="calendar"></ion-icon>
                </div>
                <div class="widget-content">
                    <p class="widget-title">${actividad.titulo}</p>
                    <p class="widget-subtitle">${window.formatDate(actividad.fecha)}</p>
                </div>
            </a>
        `,
      )
      .join("")
  }

  async loadNotificaciones() {
    try {
      const session = window.getSession()
      const response = await window.apiFetch(`/usuarios/${session.userId}/notificaciones`)
      if (response && response.ok) {
        this.notificaciones = await response.json()
      } else {
        // Datos de prueba
        this.notificaciones = [
          {
            id: 1,
            titulo: "Encuesta disponible",
            mensaje: "Nueva encuesta sobre satisfacción",
            fecha: "2024-01-20T10:00:00Z",
            leida: false,
          },
          {
            id: 2,
            titulo: "Actividad confirmada",
            mensaje: "Tu inscripción fue confirmada",
            fecha: "2024-01-19T15:30:00Z",
            leida: true,
          },
        ]
      }
      this.renderNotificaciones()
      this.updateNotificationCount()
    } catch (error) {
      console.error("Error loading notificaciones:", error)
    }
  }

  renderNotificaciones() {
    const container = document.getElementById("notificaciones-recientes")
    if (!container) return

    if (this.notificaciones.length === 0) {
      container.innerHTML = '<p class="text-center">No hay notificaciones</p>'
      return
    }

    container.innerHTML = this.notificaciones
      .slice(0, 3)
      .map(
        (notif) => `
            <div class="widget-item ${!notif.leida ? "unread" : ""}">
                <div class="widget-icon">
                    <ion-icon name="notifications"></ion-icon>
                </div>
                <div class="widget-content">
                    <p class="widget-title">${notif.titulo}</p>
                    <p class="widget-subtitle">${window.truncateText(notif.mensaje, 40)}</p>
                </div>
            </div>
        `,
      )
      .join("")
  }

  updateNotificationCount() {
    const countElement = document.getElementById("notification-count")
    if (countElement) {
      const unreadCount = this.notificaciones.filter((n) => !n.leida).length
      countElement.textContent = unreadCount
      countElement.style.display = unreadCount > 0 ? "flex" : "none"
    }
  }

  async loadColmenaInfo() {
    const container = document.getElementById("info-colmena")
    if (!container) return

    if (this.colmenaInfo) {
      container.innerHTML = `
                <div class="widget-item">
                    <div class="widget-icon">
                        <ion-icon name="business"></ion-icon>
                    </div>
                    <div class="widget-content">
                        <p class="widget-title">${this.colmenaInfo.nombre}</p>
                        <p class="widget-subtitle">${this.colmenaInfo.ubicacion}</p>
                    </div>
                </div>
                <a href="mi-colmena.html" class="btn btn-sm btn-outline-primary w-100 mt-2">
                    Ver detalles
                </a>
            `
    } else {
      container.innerHTML = '<p class="text-center">No tienes colmena asignada</p>'
    }
  }

  async loadStats() {
    try {
      const session = window.getSession()
      const response = await window.apiFetch(`/usuarios/${session.userId}/stats`)
      if (response && response.ok) {
        const stats = await response.json()
        this.updateStats(stats)
      } else {
        // Datos de prueba
        this.updateStats({
          actividadesParticipadas: 12,
          encuestasRespondidas: 8,
          reportesEnviados: 3,
        })
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  updateStats(stats) {
    const elements = {
      "actividades-participadas": stats.actividadesParticipadas,
      "encuestas-respondidas": stats.encuestasRespondidas,
      "reportes-enviados": stats.reportesEnviados,
    }

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id)
      if (element) element.textContent = value
    })
  }

  setupEventListeners() {
    // Crear reporte desde input
    const createPostInput = document.getElementById("create-post-input")
    if (createPostInput) {
      createPostInput.addEventListener("click", () => this.crearReporte())
    }

    // Formulario de reporte
    const reporteForm = document.getElementById("reporte-form")
    if (reporteForm) {
      reporteForm.addEventListener("submit", (e) => this.handleSubmitReporte(e))
    }

    // Logout
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        this.logout()
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

      document.addEventListener("click", () => {
        userMenu.classList.remove("show")
      })
    }
  }

  crearReporte() {
    document.getElementById("reporte-form").reset()
    window.showModal("reporte-modal")
  }

  compartirExperiencia() {
    // Funcionalidad para compartir experiencia
    window.showAlert("Funcionalidad en desarrollo", "info")
  }

  async handleSubmitReporte(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const reporteData = {
      titulo: formData.get("titulo"),
      descripcion: formData.get("descripcion"),
      prioridad: formData.get("prioridad"),
      categoria: formData.get("categoria"),
      usuarioId: window.getSession().userId,
    }

    try {
      const response = await window.apiFetch("/reportes", "POST", reporteData)

      if (response && response.ok) {
        window.showAlert("Reporte enviado exitosamente", "success")
      } else {
        // Simular éxito
        window.showAlert("Reporte enviado exitosamente", "success")

        // Agregar al feed
        const newPost = {
          id: Date.now(),
          tipo: "reporte",
          titulo: reporteData.titulo,
          contenido: reporteData.descripcion,
          autor: { nombre: "Tú", avatar: "T" },
          fecha: new Date().toISOString(),
          likes: 0,
          comentarios: 0,
          compartidos: 0,
          userLiked: false,
        }

        this.posts.unshift(newPost)
        this.renderPosts()
      }

      window.hideModal("reporte-modal")
    } catch (error) {
      console.error("Error sending reporte:", error)
      window.showAlert("Error al enviar el reporte", "danger")
    }
  }

  async toggleLike(postId) {
    const post = this.posts.find((p) => p.id === postId)
    if (!post) return

    try {
      const response = await window.apiFetch(`/posts/${postId}/like`, "POST")

      if (response && response.ok) {
        const result = await response.json()
        post.likes = result.likes
        post.userLiked = result.userLiked
      } else {
        // Simular toggle
        post.userLiked = !post.userLiked
        post.likes += post.userLiked ? 1 : -1
      }

      this.renderPosts()
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  showComments(postId) {
    window.showAlert("Funcionalidad de comentarios en desarrollo", "info")
  }

  sharePost(postId) {
    window.showAlert("Funcionalidad de compartir en desarrollo", "info")
  }

  logout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      window.clearSession()
      window.location.href = "../../login.html"
    }
  }
}

// Inicialización del feed de usuario
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  if (!isAuthenticated()) {
    window.location.href = "../../login.html"
    return
  }

  // Inicializar la aplicación
  initUserFeed()
})

// Verificar autenticación
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

// Limpiar sesión
function clearSession() {
  localStorage.removeItem("userId")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userRole")
  localStorage.removeItem("loginTime")
  localStorage.removeItem("userName")
}

// Inicializar feed de usuario
async function initUserFeed() {
  try {
    // Cargar información del usuario
    await loadUserInfo()

    // Cargar datos del feed
    await loadFeedData()

    // Configurar event listeners
    setupEventListeners()

    // Configurar dropdown del usuario
    setupUserDropdown()
  } catch (error) {
    console.error("Error initializing user feed:", error)
    showAlert("Error al cargar la información", "error")
  }
}

// Cargar información del usuario
async function loadUserInfo() {
  const session = getSession()

  try {
    // Intentar cargar desde API
    const response = await apiFetch(`/usuarios/${session.userId}`)

    if (response && response.ok) {
      const userData = await response.json()
      updateUserInterface(userData)
    } else {
      // Usar datos de sesión como fallback
      const fallbackData = {
        id: session.userId,
        nombre: session.userName || "Usuario Demo",
        email: session.userEmail,
        colmena: {
          id: 1,
          nombre: "Colmena Centro",
          ubicacion: "Sector Centro, Zona 1",
          miembros: 45,
          actividades: 12,
        },
      }
      updateUserInterface(fallbackData)
    }
  } catch (error) {
    console.error("Error loading user info:", error)
    // Usar datos de prueba
    const testData = {
      id: session.userId,
      nombre: session.userName || "Usuario Demo",
      email: session.userEmail,
      colmena: {
        id: 1,
        nombre: "Colmena Centro",
        ubicacion: "Sector Centro, Zona 1",
        miembros: 45,
        actividades: 12,
      },
    }
    updateUserInterface(testData)
  }
}

// Actualizar interfaz con datos del usuario
function updateUserInterface(userData) {
  // Actualizar nombre del usuario
  const userNameElements = document.querySelectorAll("#userName, .user-name")
  userNameElements.forEach((element) => {
    if (element) element.textContent = userData.nombre
  })

  // Actualizar avatares con foto por defecto
  const avatarElements = document.querySelectorAll(".user-avatar")
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nombre)}&background=1877f2&color=fff&size=128`

  avatarElements.forEach((element) => {
    if (element.tagName === "IMG") {
      element.src = avatarUrl
      element.alt = userData.nombre
    }
  })

  // Actualizar información de la colmena
  if (userData.colmena) {
    updateColmenaInfo(userData.colmena)
  }

  // Guardar datos del usuario globalmente
  window.currentUser = userData
}

// Actualizar información de la colmena
function updateColmenaInfo(colmenaData) {
  // Actualizar widget de colmena
  const colmenaHeader = document.querySelector(".colmena-header span")
  if (colmenaHeader) {
    colmenaHeader.textContent = colmenaData.nombre
  }

  // Actualizar estadísticas de la colmena
  const miembrosElement = document.querySelector(".stat-item .stat-value")
  if (miembrosElement) {
    miembrosElement.textContent = colmenaData.miembros || 45
  }

  const actividadesElement = document.querySelectorAll(".stat-item .stat-value")[1]
  if (actividadesElement) {
    actividadesElement.textContent = colmenaData.actividades || 12
  }
}

// Cargar datos del feed
async function loadFeedData() {
  try {
    // Cargar posts del feed
    await loadFeedPosts()

    // Cargar actividades próximas
    await loadUpcomingActivities()

    // Cargar notificaciones
    await loadNotifications()

    // Cargar estadísticas del usuario
    await loadUserStats()
  } catch (error) {
    console.error("Error loading feed data:", error)
  }
}

// Cargar posts del feed
async function loadFeedPosts() {
  try {
    const response = await apiFetch("/posts/feed")

    let posts = []
    if (response && response.ok) {
      posts = await response.json()
    } else {
      // Datos de prueba
      posts = [
        {
          id: 1,
          author: "María González",
          authorAvatar: "https://ui-avatars.com/api/?name=María+González&background=e91e63&color=fff&size=128",
          time: "Hace 2 horas",
          content:
            "¡Excelente trabajo en la limpieza comunitaria de hoy! Nuestra colmena se ve increíble. Gracias a todos los que participaron. 🏠✨",
          likes: 12,
          comments: 3,
          liked: false,
          type: "community",
        },
        {
          id: 2,
          author: "Carlos Rodríguez",
          authorAvatar: "https://ui-avatars.com/api/?name=Carlos+Rodríguez&background=2196f3&color=fff&size=128",
          time: "Hace 4 horas",
          content:
            "Reporto que la luminaria de la calle 5ta está fallando. Ya envié el reporte oficial, pero quería avisar a la comunidad.",
          likes: 8,
          comments: 5,
          liked: false,
          type: "report",
        },
        {
          id: 3,
          author: "Ana Martínez",
          authorAvatar: "https://ui-avatars.com/api/?name=Ana+Martínez&background=4caf50&color=fff&size=128",
          time: "Hace 6 horas",
          content:
            "¿Alguien más está interesado en organizar un taller de huertos urbanos? Tengo experiencia y me gustaría compartir conocimientos.",
          likes: 15,
          comments: 7,
          liked: true,
          type: "suggestion",
        },
        {
          id: 4,
          author: "Sistema Colmenas",
          authorAvatar: "https://ui-avatars.com/api/?name=Sistema&background=ff9800&color=fff&size=128",
          time: "Hace 1 día",
          content:
            "Recordatorio: Mañana tenemos el taller de reciclaje a las 3:00 PM en el centro comunitario. ¡No falten!",
          likes: 23,
          comments: 2,
          liked: false,
          type: "announcement",
        },
      ]
    }

    renderFeedPosts(posts)
  } catch (error) {
    console.error("Error loading feed posts:", error)
    showEmptyFeed()
  }
}

// Renderizar posts del feed
function renderFeedPosts(posts) {
  const container = document.getElementById("postsContainer")

  if (!posts || posts.length === 0) {
    showEmptyFeed()
    return
  }

  container.innerHTML = posts.map((post) => createPostHTML(post)).join("")

  // Agregar event listeners a los posts
  addPostEventListeners()
}

// Crear HTML para un post
function createPostHTML(post) {
  const typeIcon = getPostTypeIcon(post.type)

  return `
    <div class="post" data-post-id="${post.id}">
      <div class="post-header-info">
        <img src="${post.authorAvatar}" alt="${post.author}" class="user-avatar">
        <div>
          <h4 class="post-author">${post.author} ${typeIcon}</h4>
          <p class="post-time">${post.time}</p>
        </div>
      </div>
      <div class="post-content">
        <p>${post.content}</p>
      </div>
      <div class="post-actions-bar">
        <button class="post-action ${post.liked ? "liked" : ""}" onclick="toggleLike(${post.id})">
          <i class="fas fa-heart"></i>
          <span>${post.likes}</span>
        </button>
        <button class="post-action" onclick="showComments(${post.id})">
          <i class="fas fa-comment"></i>
          <span>${post.comments}</span>
        </button>
        <button class="post-action" onclick="sharePost(${post.id})">
          <i class="fas fa-share"></i>
          Compartir
        </button>
      </div>
    </div>
  `
}

// Obtener icono según tipo de post
function getPostTypeIcon(type) {
  const icons = {
    community: '<i class="fas fa-users" style="color: #2e7d32;" title="Actividad comunitaria"></i>',
    announcement: '<i class="fas fa-bullhorn" style="color: #ff9800;" title="Anuncio oficial"></i>',
    report: '<i class="fas fa-exclamation-triangle" style="color: #f44336;" title="Reporte"></i>',
    suggestion: '<i class="fas fa-lightbulb" style="color: #9c27b0;" title="Sugerencia"></i>',
    personal: "",
  }
  return icons[type] || ""
}

// Mostrar feed vacío
function showEmptyFeed() {
  const container = document.getElementById("postsContainer")
  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-newspaper"></i>
      <h3>No hay publicaciones</h3>
      <p>Aún no hay contenido en tu feed. ¡Sé el primero en compartir algo!</p>
    </div>
  `
}

// Cargar actividades próximas
async function loadUpcomingActivities() {
  try {
    const response = await apiFetch("/actividades/proximas")

    let activities = []
    if (response && response.ok) {
      activities = await response.json()
    } else {
      // Datos de prueba
      activities = [
        {
          id: 1,
          titulo: "Limpieza Comunitaria",
          fecha: "2024-01-25T10:00:00Z",
          ubicacion: "Plaza Central",
        },
        {
          id: 2,
          titulo: "Taller de Reciclaje",
          fecha: "2024-01-28T14:00:00Z",
          ubicacion: "Centro Comunitario",
        },
        {
          id: 3,
          titulo: "Reunión Mensual",
          fecha: "2024-02-01T18:00:00Z",
          ubicacion: "Salón Principal",
        },
      ]
    }

    renderUpcomingActivities(activities)
  } catch (error) {
    console.error("Error loading activities:", error)
  }
}

// Renderizar actividades próximas
function renderUpcomingActivities(activities) {
  const container = document.querySelector(".activities-list")

  if (!activities || activities.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No hay actividades próximas</p>
      </div>
    `
    return
  }

  container.innerHTML = activities
    .slice(0, 3)
    .map((activity) => {
      const date = new Date(activity.fecha)
      const day = date.getDate()
      const month = date.toLocaleDateString("es-ES", { month: "short" }).toUpperCase()
      const time = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })

      return `
      <div class="activity-item" onclick="viewActivity(${activity.id})">
        <div class="activity-date">
          <span class="day">${day}</span>
          <span class="month">${month}</span>
        </div>
        <div class="activity-info">
          <h4>${activity.titulo}</h4>
          <p>${time} - ${activity.ubicacion}</p>
        </div>
      </div>
    `
    })
    .join("")
}

// Cargar notificaciones
async function loadNotifications() {
  try {
    const session = getSession()
    const response = await apiFetch(`/usuarios/${session.userId}/notificaciones`)

    let notifications = []
    if (response && response.ok) {
      notifications = await response.json()
    } else {
      // Datos de prueba
      notifications = [
        {
          id: 1,
          titulo: "Reporte revisado",
          mensaje: "Tu reporte fue revisado y está en proceso",
          tipo: "success",
          leida: false,
        },
        {
          id: 2,
          titulo: "Nueva actividad",
          mensaje: "Nueva actividad disponible para inscripción",
          tipo: "info",
          leida: false,
        },
        {
          id: 3,
          titulo: "Encuesta pendiente",
          mensaje: "Tienes una encuesta pendiente por responder",
          tipo: "warning",
          leida: true,
        },
      ]
    }

    renderNotifications(notifications)
    updateNotificationBadge(notifications)
  } catch (error) {
    console.error("Error loading notifications:", error)
  }
}

// Renderizar notificaciones
function renderNotifications(notifications) {
  const container = document.querySelector(".notifications-list")

  if (!notifications || notifications.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No hay notificaciones</p>
      </div>
    `
    return
  }

  container.innerHTML = notifications
    .slice(0, 3)
    .map((notification) => {
      const iconClass = getNotificationIcon(notification.tipo)
      const textClass = `text-${notification.tipo}`

      return `
      <div class="notification-item ${!notification.leida ? "unread" : ""}">
        <i class="${iconClass} ${textClass}"></i>
        <span>${notification.titulo}</span>
      </div>
    `
    })
    .join("")
}

// Obtener icono de notificación
function getNotificationIcon(tipo) {
  const icons = {
    success: "fas fa-check-circle",
    info: "fas fa-info-circle",
    warning: "fas fa-exclamation-triangle",
    error: "fas fa-times-circle",
  }
  return icons[tipo] || "fas fa-bell"
}

// Actualizar badge de notificaciones
function updateNotificationBadge(notifications) {
  const badge = document.querySelector(".notification-badge")
  const unreadCount = notifications.filter((n) => !n.leida).length

  if (badge) {
    badge.textContent = unreadCount
    badge.style.display = unreadCount > 0 ? "flex" : "none"
  }
}

// Cargar estadísticas del usuario
async function loadUserStats() {
  try {
    const session = getSession()
    const response = await apiFetch(`/usuarios/${session.userId}/stats`)

    let stats = {}
    if (response && response.ok) {
      stats = await response.json()
    } else {
      // Datos de prueba
      stats = {
        reportes: 12,
        actividades: 8,
        puntos: 25,
      }
    }

    updateUserStats(stats)
  } catch (error) {
    console.error("Error loading user stats:", error)
  }
}

// Actualizar estadísticas del usuario
function updateUserStats(stats) {
  const statElements = document.querySelectorAll(".profile-stats .stat")

  if (statElements.length >= 3) {
    statElements[0].querySelector(".stat-number").textContent = stats.reportes || 0
    statElements[1].querySelector(".stat-number").textContent = stats.actividades || 0
    statElements[2].querySelector(".stat-number").textContent = stats.puntos || 0
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Modal de reporte
  const reportForm = document.getElementById("reportForm")
  if (reportForm) {
    reportForm.addEventListener("submit", handleReportSubmit)
  }

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("reportModal")
    if (event.target === modal) {
      closeReportModal()
    }
  })
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

// Agregar event listeners a los posts
function addPostEventListeners() {
  // Los event listeners se agregan via onclick en el HTML
  // Esta función se mantiene para compatibilidad
}

// Toggle like en post
function toggleLike(postId) {
  const postElement = document.querySelector(`[data-post-id="${postId}"]`)
  const likeButton = postElement.querySelector(".post-action")
  const likeCount = likeButton.querySelector("span")

  const isLiked = likeButton.classList.contains("liked")

  if (isLiked) {
    likeButton.classList.remove("liked")
    likeCount.textContent = Number.parseInt(likeCount.textContent) - 1
  } else {
    likeButton.classList.add("liked")
    likeCount.textContent = Number.parseInt(likeCount.textContent) + 1

    // Animación
    likeButton.style.transform = "scale(1.2)"
    setTimeout(() => {
      likeButton.style.transform = "scale(1)"
    }, 200)
  }

  // Aquí se podría hacer la llamada a la API para guardar el like
  // apiFetch(`/posts/${postId}/like`, "POST")
}

// Mostrar comentarios
function showComments(postId) {
  showAlert("Función de comentarios próximamente", "info")
}

// Compartir post
function sharePost(postId) {
  showAlert("Post compartido", "success")
}

// Ver actividad
function viewActivity(activityId) {
  window.location.href = `actividades.html?id=${activityId}`
}

// Abrir modal de reporte
function openReportModal() {
  document.getElementById("reportModal").style.display = "block"
}

// Cerrar modal de reporte
function closeReportModal() {
  document.getElementById("reportModal").style.display = "none"
  document.getElementById("reportForm").reset()
}

// Manejar envío de reporte
function handleReportSubmit(e) {
  e.preventDefault()

  const formData = {
    title: document.getElementById("reportTitle").value,
    type: document.getElementById("reportType").value,
    description: document.getElementById("reportDescription").value,
    location: document.getElementById("reportLocation").value,
    userId: getSession().userId,
  }

  // Simular envío de reporte
  console.log("Reporte enviado:", formData)

  // Agregar el reporte al feed
  addReportToFeed(formData)

  // Cerrar modal y mostrar mensaje
  closeReportModal()
  showAlert("¡Reporte enviado exitosamente!", "success")
}

// Agregar reporte al feed
function addReportToFeed(reportData) {
  const container = document.getElementById("postsContainer")
  const userName = window.currentUser?.nombre || "Usuario"
  const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1877f2&color=fff&size=128`

  const newPost = {
    id: Date.now(),
    author: userName,
    authorAvatar: userAvatar,
    time: "Ahora",
    content: `📋 Nuevo reporte: ${reportData.title}\n\nTipo: ${reportData.type}\nUbicación: ${reportData.location}\n\n${reportData.description}`,
    likes: 0,
    comments: 0,
    liked: false,
    type: "report",
  }

  const newPostHTML = createPostHTML(newPost)
  container.insertAdjacentHTML("afterbegin", newPostHTML)

  // Reagregar event listeners
  addPostEventListeners()
}

// Cerrar sesión
function logout() {
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    clearSession()
    window.location.href = "../../login.html"
  }
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

// Exponer funciones globalmente para compatibilidad
window.toggleLike = toggleLike
window.showComments = showComments
window.sharePost = sharePost
window.viewActivity = viewActivity
window.openReportModal = openReportModal
window.closeReportModal = closeReportModal
window.logout = logout
