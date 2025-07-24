const BASE_URL = "http://localhost:8080/api"

// Función genérica para hacer peticiones a la API
async function callApi(endpoint, method = "GET", data = null) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options)

    // Verificar si la respuesta es 401 (no autorizado) y redirigir al login
    if (response.status === 401) {
      console.error("Sesión expirada o usuario no autorizado")
      localStorage.clear()
      window.location.href = "index.html"
      return null
    }

    return response
  } catch (error) {
    console.error(`Error calling API ${endpoint}:`, error)
    throw new Error("Error de conexión con el servidor.")
  }
}

// --- Funciones de Autenticación ---
async function registerUser(userData) {
  return callApi("/auth/register", "POST", userData)
}

async function loginUser(credentials) {
  return callApi("/auth/login", "POST", credentials)
}

// --- Funciones para Usuarios ---
async function getAllUsuarios() {
  return callApi("/usuarios")
}

async function getUsuarioById(id) {
  return callApi(`/usuarios/${id}`)
}

async function createUsuario(userData) {
  return callApi("/usuarios", "POST", userData)
}

async function updateUsuario(id, userData) {
  return callApi(`/usuarios/${id}`, "PUT", userData)
}

async function deleteUsuario(id) {
  return callApi(`/usuarios/${id}`, "DELETE")
}

// --- Funciones para Roles ---
async function getAllRoles() {
  return callApi("/roles")
}

async function getRoleById(id) {
  return callApi(`/roles/${id}`)
}

async function createRole(roleData) {
  return callApi("/roles", "POST", roleData)
}

async function updateRole(id, roleData) {
  return callApi(`/roles/${id}`, "PUT", roleData)
}

// --- Funciones para Colmenas ---
async function getAllColmenas() {
  return callApi("/colmenas")
}

async function getColmenaById(id) {
  return callApi(`/colmenas/${id}`)
}

async function createColmena(colmenaData) {
  return callApi("/colmenas", "POST", colmenaData)
}

async function updateColmena(id, colmenaData) {
  return callApi(`/colmenas/${id}`, "PUT", colmenaData)
}

async function deleteColmena(id) {
  return callApi(`/colmenas/${id}`, "DELETE")
}

// --- Funciones para Categorias de Actividad ---
async function getAllCategoriasActividad() {
  return callApi("/categorias-actividad")
}

async function getCategoriaActividadById(id) {
  return callApi(`/categorias-actividad/${id}`)
}

async function createCategoriaActividad(categoriaData) {
  return callApi("/categorias-actividad", "POST", categoriaData)
}

async function updateCategoriaActividad(id, categoriaData) {
  return callApi(`/categorias-actividad/${id}`, "PUT", categoriaData)
}

async function deleteCategoriaActividad(id) {
  return callApi(`/categorias-actividad/${id}`, "DELETE")
}

// --- Funciones para Actividades ---
async function getAllActividades() {
  return callApi("/actividades")
}

async function getActividadById(id) {
  return callApi(`/actividades/${id}`)
}

async function createActividad(actividadData) {
  return callApi("/actividades", "POST", actividadData)
}

async function updateActividad(id, actividadData) {
  return callApi(`/actividades/${id}`, "PUT", actividadData)
}

async function deleteActividad(id) {
  return callApi(`/actividades/${id}`, "DELETE")
}

// --- Funciones para Inscripciones ---
async function getAllInscripciones() {
  return callApi("/inscripciones")
}

async function getInscripcionById(id) {
  return callApi(`/inscripciones/${id}`)
}

async function createInscripcion(inscripcionData) {
  return callApi("/inscripciones", "POST", inscripcionData)
}

async function deleteInscripcion(id) {
  return callApi(`/inscripciones/${id}`, "DELETE")
}

async function getInscripcionesByUsuarioId(usuarioId) {
  return callApi(`/inscripciones/usuario/${usuarioId}`)
}

async function getInscripcionesByActividadId(actividadId) {
  return callApi(`/inscripciones/actividad/${actividadId}`)
}

// --- Funciones para Categorias de Reporte ---
async function getAllCategoriasReporte() {
  return callApi("/categorias-reporte")
}

async function getCategoriaReporteById(id) {
  return callApi(`/categorias-reporte/${id}`)
}

async function createCategoriaReporte(categoriaData) {
  return callApi("/categorias-reporte", "POST", categoriaData)
}

async function updateCategoriaReporte(id, categoriaData) {
  return callApi(`/categorias-reporte/${id}`, "PUT", categoriaData)
}

async function deleteCategoriaReporte(id) {
  return callApi(`/categorias-reporte/${id}`, "DELETE")
}

// --- Funciones para Reportes ---
async function getAllReportes() {
  return callApi("/reportes")
}

async function getReporteById(id) {
  return callApi(`/reportes/${id}`)
}

async function createReporte(reporteData) {
  return callApi("/reportes", "POST", reporteData)
}

async function updateReporte(id, reporteData) {
  return callApi(`/reportes/${id}`, "PUT", reporteData)
}

async function deleteReporte(id) {
  return callApi(`/reportes/${id}`, "DELETE")
}

async function getReportesByEstado(estado) {
  return callApi(`/reportes/estado/${estado}`)
}

async function getReportesByPrioridad(prioridad) {
  return callApi(`/reportes/prioridad/${prioridad}`)
}

async function getReportesByUsuarioId(usuarioId) {
  return callApi(`/reportes/usuario/${usuarioId}`)
}

// --- Funciones para Encuestas ---
async function getAllEncuestas() {
  return callApi("/encuestas")
}

async function getEncuestaById(id) {
  return callApi(`/encuestas/${id}`)
}

async function createEncuesta(encuestaData) {
  return callApi("/encuestas", "POST", encuestaData)
}

async function updateEncuesta(id, encuestaData) {
  return callApi(`/encuestas/${id}`, "PUT", encuestaData)
}

async function deleteEncuesta(id) {
  return callApi(`/encuestas/${id}`, "DELETE")
}

// --- Funciones para Respuestas de Encuesta ---
async function getAllRespuestasEncuesta() {
  return callApi("/respuestas-encuesta")
}

async function getRespuestaEncuestaById(id) {
  return callApi(`/respuestas-encuesta/${id}`)
}

async function createRespuestaEncuesta(respuestaData) {
  return callApi("/respuestas-encuesta", "POST", respuestaData)
}

async function deleteRespuestaEncuesta(id) {
  return callApi(`/respuestas-encuesta/${id}`, "DELETE")
}

async function getRespuestasByEncuestaId(encuestaId) {
  return callApi(`/respuestas-encuesta/encuesta/${encuestaId}`)
}

async function getRespuestasByUsuarioId(usuarioId) {
  return callApi(`/respuestas-encuesta/usuario/${usuarioId}`)
}

// --- Funciones para Notificaciones ---
async function getAllNotificaciones() {
  return callApi("/notificaciones")
}

async function getNotificacionById(id) {
  return callApi(`/notificaciones/${id}`)
}

async function createNotificacion(notificacionData) {
  return callApi("/notificaciones", "POST", notificacionData)
}

async function updateNotificacion(id, notificacionData) {
  return callApi(`/notificaciones/${id}`, "PUT", notificacionData)
}

async function deleteNotificacion(id) {
  return callApi(`/notificaciones/${id}`, "DELETE")
}

async function getNotificacionesByUsuarioId(usuarioId) {
  return callApi(`/notificaciones/usuario/${usuarioId}`)
}

async function getUnreadNotificacionesByUsuarioId(usuarioId) {
  return callApi(`/notificaciones/usuario/${usuarioId}/unread`)
}

async function markNotificationAsRead(id) {
  return callApi(`/notificaciones/${id}/mark-as-read`, "PUT")
}

// --- Funciones para Bitacora de Eventos ---
async function getAllBitacoraEventos() {
  return callApi("/bitacora-eventos")
}

async function getBitacoraEventoById(id) {
  return callApi(`/bitacora-eventos/${id}`)
}

async function createBitacoraEvento(eventoData) {
  return callApi("/bitacora-eventos", "POST", eventoData)
}

async function deleteBitacoraEvento(id) {
  return callApi(`/bitacora-eventos/${id}`, "DELETE")
}

async function getBitacoraEventosByUsuarioId(usuarioId) {
  return callApi(`/bitacora-eventos/usuario/${usuarioId}`)
}

async function getBitacoraEventosByModulo(modulo) {
  return callApi(`/bitacora-eventos/modulo/${modulo}`)
}

// Exportar todas las funciones para que estén disponibles globalmente
window.registerUser = registerUser
window.loginUser = loginUser
window.getAllUsuarios = getAllUsuarios
window.getUsuarioById = getUsuarioById
window.createUsuario = createUsuario
window.updateUsuario = updateUsuario
window.deleteUsuario = deleteUsuario
window.getAllRoles = getAllRoles
window.getRoleById = getRoleById
window.createRole = createRole
window.updateRole = updateRole
window.getAllColmenas = getAllColmenas
window.getColmenaById = getColmenaById
window.createColmena = createColmena
window.updateColmena = updateColmena
window.deleteColmena = deleteColmena
window.getAllCategoriasActividad = getAllCategoriasActividad
window.getCategoriaActividadById = getCategoriaActividadById
window.createCategoriaActividad = createCategoriaActividad
window.updateCategoriaActividad = updateCategoriaActividad
window.deleteCategoriaActividad = deleteCategoriaActividad
window.getAllActividades = getAllActividades
window.getActividadById = getActividadById
window.createActividad = createActividad
window.updateActividad = updateActividad
window.deleteActividad = deleteActividad
window.getAllInscripciones = getAllInscripciones
window.getInscripcionById = getInscripcionById
window.createInscripcion = createInscripcion
window.deleteInscripcion = deleteInscripcion
window.getInscripcionesByUsuarioId = getInscripcionesByUsuarioId
window.getInscripcionesByActividadId = getInscripcionesByActividadId
window.getAllCategoriasReporte = getAllCategoriasReporte
window.getCategoriaReporteById = getCategoriaReporteById
window.createCategoriaReporte = createCategoriaReporte
window.updateCategoriaReporte = updateCategoriaReporte
window.deleteCategoriaReporte = deleteCategoriaReporte
window.getAllReportes = getAllReportes
window.getReporteById = getReporteById
window.createReporte = createReporte
window.updateReporte = updateReporte
window.deleteReporte = deleteReporte
window.getReportesByEstado = getReportesByEstado
window.getReportesByPrioridad = getReportesByPrioridad
window.getReportesByUsuarioId = getReportesByUsuarioId
window.getAllEncuestas = getAllEncuestas
window.getEncuestaById = getEncuestaById
window.createEncuesta = createEncuesta
window.updateEncuesta = updateEncuesta
window.deleteEncuesta = deleteEncuesta
window.getAllRespuestasEncuesta = getAllRespuestasEncuesta
window.getRespuestaEncuestaById = getRespuestaEncuestaById
window.createRespuestaEncuesta = createRespuestaEncuesta
window.deleteRespuestaEncuesta = deleteRespuestaEncuesta
window.getRespuestasByEncuestaId = getRespuestasByEncuestaId
window.getRespuestasByUsuarioId = getRespuestasByUsuarioId
window.getAllNotificaciones = getAllNotificaciones
window.getNotificacionById = getNotificacionById
window.createNotificacion = createNotificacion
window.updateNotificacion = updateNotificacion
window.deleteNotificacion = deleteNotificacion
window.getNotificacionesByUsuarioId = getNotificacionesByUsuarioId
window.getUnreadNotificacionesByUsuarioId = getUnreadNotificacionesByUsuarioId
window.markNotificationAsRead = markNotificationAsRead
window.getAllBitacoraEventos = getAllBitacoraEventos
window.getBitacoraEventoById = getBitacoraEventoById
window.createBitacoraEvento = createBitacoraEvento
window.deleteBitacoraEvento = deleteBitacoraEvento
window.getBitacoraEventosByUsuarioId = getBitacoraEventosByUsuarioId
window.getBitacoraEventosByModulo = getBitacoraEventosByModulo
