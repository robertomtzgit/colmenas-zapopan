// Gestión de Encuestas
class EncuestasManager {
  constructor() {
    this.encuestas = []
    this.currentEncuesta = null
    this.preguntaCounter = 0
    this.init()
  }

  async init() {
    await this.loadEncuestas()
    this.setupEventListeners()
    this.loadSelectOptions()
  }

  setupEventListeners() {
    // Botón nueva encuesta
    document.getElementById("new-encuesta-btn")?.addEventListener("click", () => {
      this.openEncuestaModal()
    })

    // Formulario encuesta
    document.getElementById("encuesta-form")?.addEventListener("submit", (e) => {
      this.handleEncuestaSubmit(e)
    })

    // Formulario respuesta
    document.getElementById("respuesta-form")?.addEventListener("submit", (e) => {
      this.handleRespuestaSubmit(e)
    })

    // Agregar pregunta
    document.getElementById("add-pregunta-btn")?.addEventListener("click", () => {
      this.addPregunta()
    })

    // Filtros
    document.getElementById("search-encuestas")?.addEventListener("input", () => {
      this.filterEncuestas()
    })

    document.getElementById("estado-filter")?.addEventListener("change", () => {
      this.filterEncuestas()
    })

    document.getElementById("tipo-filter")?.addEventListener("change", () => {
      this.filterEncuestas()
    })
  }

  async loadEncuestas() {
    try {
      const response = await apiFetch("/encuestas")
      if (response && response.ok) {
        this.encuestas = await response.json()
      } else {
        // Datos de prueba si la API no está disponible
        this.encuestas = [
          {
            id: 1,
            titulo: "Satisfacción con Actividades Comunitarias",
            descripcion: "Queremos conocer tu opinión sobre las actividades que realizamos en la comunidad",
            fechaInicio: "2024-01-15T09:00:00",
            fechaFin: "2024-02-15T18:00:00",
            activa: true,
            anonima: false,
            fechaCreacion: "2024-01-10T10:00:00",
            preguntas: [
              {
                id: 1,
                texto: "¿Cómo calificarías las actividades comunitarias?",
                tipo: "opcion_multiple",
                opciones: ["Excelente", "Buena", "Regular", "Mala"],
                obligatoria: true,
              },
              {
                id: 2,
                texto: "¿Qué tipo de actividades te gustaría ver más?",
                tipo: "texto_libre",
                obligatoria: false,
              },
            ],
            totalRespuestas: 15,
          },
          {
            id: 2,
            titulo: "Evaluación de Servicios de Colmenas",
            descripcion: "Ayúdanos a mejorar nuestros servicios relacionados con las colmenas",
            fechaInicio: "2024-01-20T08:00:00",
            fechaFin: "2024-03-20T20:00:00",
            activa: true,
            anonima: true,
            fechaCreacion: "2024-01-18T14:30:00",
            preguntas: [
              {
                id: 3,
                texto: "¿Con qué frecuencia visitas las colmenas?",
                tipo: "opcion_unica",
                opciones: ["Diariamente", "Semanalmente", "Mensualmente", "Raramente"],
                obligatoria: true,
              },
              {
                id: 4,
                texto: "Del 1 al 5, ¿qué tan satisfecho estás con el mantenimiento?",
                tipo: "escala",
                rangoMin: 1,
                rangoMax: 5,
                obligatoria: true,
              },
            ],
            totalRespuestas: 8,
          },
          {
            id: 3,
            titulo: "Propuestas para Nuevos Proyectos",
            descripcion: "Comparte tus ideas para futuros proyectos comunitarios",
            fechaInicio: "2024-02-01T00:00:00",
            fechaFin: "2024-01-25T23:59:59",
            activa: false,
            anonima: false,
            fechaCreacion: "2024-01-20T16:00:00",
            preguntas: [
              {
                id: 5,
                texto: "Describe tu propuesta de proyecto",
                tipo: "texto_libre",
                obligatoria: true,
              },
            ],
            totalRespuestas: 22,
          },
        ]
      }
      this.renderEncuestas()
    } catch (error) {
      console.error("Error loading encuestas:", error)
      window.showAlert("Error al cargar las encuestas", "danger")
    }
  }

  async loadSelectOptions() {
    // Cargar opciones para selects si es necesario
    // Por ahora no hay selects específicos en encuestas
  }

  renderEncuestas() {
    const container = document.getElementById("encuestas-container")
    if (!container) return

    if (this.encuestas.length === 0) {
      container.innerHTML = `
                <div class="col-12">
                    <div class="card">
                        <div class="card-body text-center">
                            <ion-icon name="document-text" style="font-size: 3rem; color: var(--text-light);"></ion-icon>
                            <h5 class="mt-3">No hay encuestas disponibles</h5>
                            <p class="text-muted">Crea la primera encuesta para comenzar</p>
                        </div>
                    </div>
                </div>
            `
      return
    }

    container.innerHTML = this.encuestas
      .map(
        (encuesta) => `
            <div class="col-md-6 col-lg-4">
                <div class="card encuesta-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title">${encuesta.titulo}</h5>
                            <div class="encuesta-badges">
                                <span class="badge ${encuesta.activa ? "badge-success" : "badge-secondary"}">
                                    ${encuesta.activa ? "Activa" : "Inactiva"}
                                </span>
                                ${encuesta.anonima ? '<span class="badge badge-info">Anónima</span>' : ""}
                            </div>
                        </div>
                        
                        <p class="encuesta-description">${window.truncateText(encuesta.descripcion, 120)}</p>
                        
                        <div class="encuesta-info">
                            <p><ion-icon name="calendar"></ion-icon> Inicio: ${window.formatDate(encuesta.fechaInicio)}</p>
                            <p><ion-icon name="calendar"></ion-icon> Fin: ${window.formatDate(encuesta.fechaFin)}</p>
                            <p><ion-icon name="help-circle"></ion-icon> Preguntas: ${encuesta.preguntas ? encuesta.preguntas.length : 0}</p>
                            <p><ion-icon name="people"></ion-icon> Respuestas: ${encuesta.totalRespuestas || 0}</p>
                        </div>
                        
                        <div class="action-buttons mt-3">
                            <button class="btn btn-sm btn-primary" onclick="encuestasManager.viewEncuesta(${encuesta.id})">
                                <ion-icon name="eye"></ion-icon> Ver
                            </button>
                            ${
                              encuesta.activa
                                ? `
                                <button class="btn btn-sm btn-success" onclick="encuestasManager.responderEncuesta(${encuesta.id})">
                                    <ion-icon name="create"></ion-icon> Responder
                                </button>
                            `
                                : ""
                            }
                            <button class="btn btn-sm btn-info" onclick="encuestasManager.viewRespuestas(${encuesta.id})">
                                <ion-icon name="bar-chart"></ion-icon> Respuestas
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="encuestasManager.editEncuesta(${encuesta.id})">
                                <ion-icon name="create"></ion-icon> Editar
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="encuestasManager.deleteEncuesta(${encuesta.id})">
                                <ion-icon name="trash"></ion-icon> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  filterEncuestas() {
    const searchTerm = document.getElementById("search-encuestas")?.value.toLowerCase() || ""
    const estadoFilter = document.getElementById("estado-filter")?.value || ""
    const tipoFilter = document.getElementById("tipo-filter")?.value || ""

    const filtered = this.encuestas.filter((encuesta) => {
      const matchesSearch =
        encuesta.titulo.toLowerCase().includes(searchTerm) || encuesta.descripcion.toLowerCase().includes(searchTerm)

      const matchesEstado =
        !estadoFilter ||
        (estadoFilter === "activa" && encuesta.activa) ||
        (estadoFilter === "inactiva" && !encuesta.activa)

      const matchesTipo =
        !tipoFilter ||
        (tipoFilter === "anonima" && encuesta.anonima) ||
        (tipoFilter === "no_anonima" && !encuesta.anonima)

      return matchesSearch && matchesEstado && matchesTipo
    })

    // Temporalmente guardar todas las encuestas y mostrar solo las filtradas
    const allEncuestas = [...this.encuestas]
    this.encuestas = filtered
    this.renderEncuestas()
    this.encuestas = allEncuestas
  }

  openEncuestaModal(encuesta = null) {
    this.currentEncuesta = encuesta
    this.preguntaCounter = 0

    const modal = document.getElementById("encuesta-modal")
    const title = document.getElementById("encuesta-modal-title")
    const form = document.getElementById("encuesta-form")

    if (encuesta) {
      title.textContent = "Editar Encuesta"
      this.fillEncuestaForm(encuesta)
    } else {
      title.textContent = "Nueva Encuesta"
      form.reset()
      document.getElementById("preguntas-container").innerHTML = ""
    }

    window.showModal("encuesta-modal")
  }

  fillEncuestaForm(encuesta) {
    document.getElementById("encuesta-titulo").value = encuesta.titulo
    document.getElementById("encuesta-descripcion").value = encuesta.descripcion
    document.getElementById("encuesta-fechaInicio").value = encuesta.fechaInicio.slice(0, 16)
    document.getElementById("encuesta-fechaFin").value = encuesta.fechaFin.slice(0, 16)
    document.getElementById("encuesta-activa").checked = encuesta.activa
    document.getElementById("encuesta-anonima").checked = encuesta.anonima

    // Cargar preguntas
    const container = document.getElementById("preguntas-container")
    container.innerHTML = ""

    if (encuesta.preguntas) {
      encuesta.preguntas.forEach((pregunta) => {
        this.addPregunta(pregunta)
      })
    }
  }

  addPregunta(preguntaData = null) {
    this.preguntaCounter++
    const container = document.getElementById("preguntas-container")

    const preguntaHtml = `
            <div class="pregunta-item" data-pregunta-id="${this.preguntaCounter}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6>Pregunta ${this.preguntaCounter}</h6>
                    <button type="button" class="btn btn-sm btn-danger" onclick="this.closest('.pregunta-item').remove()">
                        <ion-icon name="trash"></ion-icon>
                    </button>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label class="form-label">Texto de la pregunta</label>
                        <input type="text" class="form-control pregunta-texto" value="${preguntaData?.texto || ""}" required>
                    </div>
                    
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label class="form-label">Tipo de pregunta</label>
                                <select class="form-control pregunta-tipo" onchange="encuestasManager.togglePreguntaOptions(this)">
                                    <option value="texto_libre" ${preguntaData?.tipo === "texto_libre" ? "selected" : ""}>Texto libre</option>
                                    <option value="opcion_unica" ${preguntaData?.tipo === "opcion_unica" ? "selected" : ""}>Opción única</option>
                                    <option value="opcion_multiple" ${preguntaData?.tipo === "opcion_multiple" ? "selected" : ""}>Opción múltiple</option>
                                    <option value="escala" ${preguntaData?.tipo === "escala" ? "selected" : ""}>Escala numérica</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input pregunta-obligatoria" ${preguntaData?.obligatoria ? "checked" : ""}>
                                    <label class="form-check-label">Pregunta obligatoria</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="opciones-container" style="display: ${preguntaData?.tipo === "opcion_unica" || preguntaData?.tipo === "opcion_multiple" ? "block" : "none"}">
                        <label class="form-label">Opciones</label>
                        <div class="opciones-list">
                            ${
                              preguntaData?.opciones
                                ? preguntaData.opciones
                                    .map(
                                      (opcion, index) => `
                                <div class="input-group mb-2">
                                    <input type="text" class="form-control" value="${opcion}" placeholder="Opción ${index + 1}">
                                    <button type="button" class="btn btn-outline-danger" onclick="this.closest('.input-group').remove()">
                                        <ion-icon name="close"></ion-icon>
                                    </button>
                                </div>
                            `,
                                    )
                                    .join("")
                                : ""
                            }
                        </div>
                        <button type="button" class="btn btn-sm btn-secondary" onclick="encuestasManager.addOpcion(this)">
                            <ion-icon name="add"></ion-icon> Agregar opción
                        </button>
                    </div>
                    
                    <div class="escala-container" style="display: ${preguntaData?.tipo === "escala" ? "block" : "none"}">
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label">Valor mínimo</label>
                                    <input type="number" class="form-control escala-min" value="${preguntaData?.rangoMin || 1}">
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label class="form-label">Valor máximo</label>
                                    <input type="number" class="form-control escala-max" value="${preguntaData?.rangoMax || 5}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `

    container.insertAdjacentHTML("beforeend", preguntaHtml)
  }

  togglePreguntaOptions(select) {
    const preguntaItem = select.closest(".pregunta-item")
    const opcionesContainer = preguntaItem.querySelector(".opciones-container")
    const escalaContainer = preguntaItem.querySelector(".escala-container")

    const tipo = select.value

    opcionesContainer.style.display = tipo === "opcion_unica" || tipo === "opcion_multiple" ? "block" : "none"
    escalaContainer.style.display = tipo === "escala" ? "block" : "none"
  }

  addOpcion(button) {
    const opcionesList = button.previousElementSibling
    const opcionCount = opcionesList.children.length + 1

    const opcionHtml = `
            <div class="input-group mb-2">
                <input type="text" class="form-control" placeholder="Opción ${opcionCount}">
                <button type="button" class="btn btn-outline-danger" onclick="this.closest('.input-group').remove()">
                    <ion-icon name="close"></ion-icon>
                </button>
            </div>
        `

    opcionesList.insertAdjacentHTML("beforeend", opcionHtml)
  }

  async handleEncuestaSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const preguntas = this.collectPreguntas()

    const encuestaData = {
      titulo: formData.get("titulo"),
      descripcion: formData.get("descripcion"),
      fechaInicio: formData.get("fechaInicio"),
      fechaFin: formData.get("fechaFin"),
      activa: formData.has("activa"),
      anonima: formData.has("anonima"),
      preguntas: preguntas,
    }

    try {
      let response
      if (this.currentEncuesta) {
        response = await apiFetch(`/encuestas/${this.currentEncuesta.id}`, "PUT", encuestaData)
      } else {
        response = await apiFetch("/encuestas", "POST", encuestaData)
      }

      if (response && response.ok) {
        window.showAlert(`Encuesta ${this.currentEncuesta ? "actualizada" : "creada"} exitosamente`, "success")
        window.hideModal("encuesta-modal")
        await this.loadEncuestas()
      } else {
        throw new Error("Error en la respuesta del servidor")
      }
    } catch (error) {
      console.error("Error saving encuesta:", error)
      window.showAlert("Error al guardar la encuesta", "danger")
    }
  }

  collectPreguntas() {
    const preguntaItems = document.querySelectorAll(".pregunta-item")
    const preguntas = []

    preguntaItems.forEach((item) => {
      const texto = item.querySelector(".pregunta-texto").value
      const tipo = item.querySelector(".pregunta-tipo").value
      const obligatoria = item.querySelector(".pregunta-obligatoria").checked

      const pregunta = {
        texto,
        tipo,
        obligatoria,
      }

      if (tipo === "opcion_unica" || tipo === "opcion_multiple") {
        const opciones = []
        item.querySelectorAll(".opciones-list input").forEach((input) => {
          if (input.value.trim()) {
            opciones.push(input.value.trim())
          }
        })
        pregunta.opciones = opciones
      } else if (tipo === "escala") {
        pregunta.rangoMin = Number.parseInt(item.querySelector(".escala-min").value)
        pregunta.rangoMax = Number.parseInt(item.querySelector(".escala-max").value)
      }

      preguntas.push(pregunta)
    })

    return preguntas
  }

  viewEncuesta(id) {
    const encuesta = this.encuestas.find((e) => e.id === id)
    if (!encuesta) return

    const content = `
            <div class="encuesta-details">
                <div class="encuesta-header">
                    <div>
                        <h3>${encuesta.titulo}</h3>
                        <p class="text-muted">${encuesta.descripcion}</p>
                    </div>
                    <div class="encuesta-badges">
                        <span class="badge ${encuesta.activa ? "badge-success" : "badge-secondary"}">
                            ${encuesta.activa ? "Activa" : "Inactiva"}
                        </span>
                        ${encuesta.anonima ? '<span class="badge badge-info">Anónima</span>' : ""}
                    </div>
                </div>
                
                <div class="info-section">
                    <h4>Información General</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Fecha de Inicio:</strong>
                            ${window.formatDate(encuesta.fechaInicio)}
                        </div>
                        <div class="info-item">
                            <strong>Fecha de Fin:</strong>
                            ${window.formatDate(encuesta.fechaFin)}
                        </div>
                        <div class="info-item">
                            <strong>Total de Preguntas:</strong>
                            ${encuesta.preguntas ? encuesta.preguntas.length : 0}
                        </div>
                        <div class="info-item">
                            <strong>Total de Respuestas:</strong>
                            ${encuesta.totalRespuestas || 0}
                        </div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4>Preguntas</h4>
                    ${
                      encuesta.preguntas
                        ? encuesta.preguntas
                            .map(
                              (pregunta, index) => `
                        <div class="pregunta-detail">
                            <h6>Pregunta ${index + 1} ${pregunta.obligatoria ? '<span class="badge badge-warning">Obligatoria</span>' : ""}</h6>
                            <p><strong>Tipo:</strong> ${this.getTipoLabel(pregunta.tipo)}</p>
                            <p><strong>Texto:</strong> ${pregunta.texto}</p>
                            ${pregunta.opciones ? `<p><strong>Opciones:</strong> ${pregunta.opciones.join(", ")}</p>` : ""}
                            ${pregunta.rangoMin !== undefined ? `<p><strong>Rango:</strong> ${pregunta.rangoMin} - ${pregunta.rangoMax}</p>` : ""}
                        </div>
                    `,
                            )
                            .join("")
                        : "<p>No hay preguntas definidas</p>"
                    }
                </div>
            </div>
        `

    document.getElementById("encuesta-details-content").innerHTML = content
    window.showModal("encuesta-details-modal")
  }

  getTipoLabel(tipo) {
    const tipos = {
      texto_libre: "Texto libre",
      opcion_unica: "Opción única",
      opcion_multiple: "Opción múltiple",
      escala: "Escala numérica",
    }
    return tipos[tipo] || tipo
  }

  responderEncuesta(id) {
    const encuesta = this.encuestas.find((e) => e.id === id)
    if (!encuesta || !encuesta.activa) {
      window.showAlert("Esta encuesta no está disponible para responder", "warning")
      return
    }

    const content = `
            <div class="respuesta-encuesta">
                <h4>${encuesta.titulo}</h4>
                <p class="text-muted mb-4">${encuesta.descripcion}</p>
                
                ${
                  encuesta.preguntas
                    ? encuesta.preguntas
                        .map(
                          (pregunta, index) => `
                    <div class="form-group mb-4">
                        <label class="form-label">
                            ${index + 1}. ${pregunta.texto}
                            ${pregunta.obligatoria ? '<span class="text-danger">*</span>' : ""}
                        </label>
                        ${this.renderPreguntaInput(pregunta, index)}
                    </div>
                `,
                        )
                        .join("")
                    : ""
                }
                
                <input type="hidden" name="encuestaId" value="${encuesta.id}">
            </div>
        `

    document.getElementById("respuesta-form-content").innerHTML = content
    window.showModal("respuesta-modal")
  }

  renderPreguntaInput(pregunta, index) {
    switch (pregunta.tipo) {
      case "texto_libre":
        return `<textarea class="form-control" name="respuesta_${index}" rows="3" ${pregunta.obligatoria ? "required" : ""}></textarea>`

      case "opcion_unica":
        return pregunta.opciones
          .map(
            (opcion, opIndex) => `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="respuesta_${index}" value="${opcion}" id="opcion_${index}_${opIndex}" ${pregunta.obligatoria ? "required" : ""}>
                        <label class="form-check-label" for="opcion_${index}_${opIndex}">${opcion}</label>
                    </div>
                `,
          )
          .join("")

      case "opcion_multiple":
        return pregunta.opciones
          .map(
            (opcion, opIndex) => `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="respuesta_${index}[]" value="${opcion}" id="opcion_${index}_${opIndex}">
                        <label class="form-check-label" for="opcion_${index}_${opIndex}">${opcion}</label>
                    </div>
                `,
          )
          .join("")

      case "escala":
        const options = []
        for (let i = pregunta.rangoMin; i <= pregunta.rangoMax; i++) {
          options.push(`<option value="${i}">${i}</option>`)
        }
        return `<select class="form-control" name="respuesta_${index}" ${pregunta.obligatoria ? "required" : ""}>
                    <option value="">Seleccionar...</option>
                    ${options.join("")}
                </select>`

      default:
        return `<input type="text" class="form-control" name="respuesta_${index}" ${pregunta.obligatoria ? "required" : ""}>`
    }
  }

  async handleRespuestaSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const encuestaId = formData.get("encuestaId")
    const session = window.getSession()

    const respuestaData = {
      encuestaId: Number.parseInt(encuestaId),
      usuarioId: Number.parseInt(session.userId),
      respuestas: [],
    }

    // Recopilar respuestas
    const encuesta = this.encuestas.find((e) => e.id == encuestaId)
    if (encuesta && encuesta.preguntas) {
      encuesta.preguntas.forEach((pregunta, index) => {
        const respuesta = {
          preguntaId: pregunta.id || index + 1,
          valor: "",
        }

        if (pregunta.tipo === "opcion_multiple") {
          const valores = formData.getAll(`respuesta_${index}[]`)
          respuesta.valor = valores.join(", ")
        } else {
          respuesta.valor = formData.get(`respuesta_${index}`) || ""
        }

        respuestaData.respuestas.push(respuesta)
      })
    }

    try {
      const response = await apiFetch("/encuestas/respuestas", "POST", respuestaData)

      if (response && response.ok) {
        window.showAlert("Respuesta enviada exitosamente", "success")
        window.hideModal("respuesta-modal")
        await this.loadEncuestas()
      } else {
        throw new Error("Error en la respuesta del servidor")
      }
    } catch (error) {
      console.error("Error saving respuesta:", error)
      window.showAlert("Error al enviar la respuesta", "danger")
    }
  }

  async viewRespuestas(id) {
    const encuesta = this.encuestas.find((e) => e.id === id)
    if (!encuesta) return

    try {
      const response = await apiFetch(`/encuestas/${id}/respuestas`)
      let respuestas = []

      if (response && response.ok) {
        respuestas = await response.json()
      } else {
        // Datos de prueba
        respuestas = [
          {
            id: 1,
            usuario: { nombre: "Juan Pérez", email: "juan@email.com" },
            fechaRespuesta: "2024-01-16T10:30:00",
            respuestas: [
              { preguntaId: 1, valor: "Excelente" },
              { preguntaId: 2, valor: "Me gustaría ver más talleres de apicultura" },
            ],
          },
          {
            id: 2,
            usuario: { nombre: "María García", email: "maria@email.com" },
            fechaRespuesta: "2024-01-17T14:15:00",
            respuestas: [
              { preguntaId: 1, valor: "Buena" },
              { preguntaId: 2, valor: "Actividades de educación ambiental" },
            ],
          },
        ]
      }

      const content = `
                <div class="respuestas-encuesta">
                    <h4>${encuesta.titulo}</h4>
                    <p class="text-muted mb-4">Total de respuestas: ${respuestas.length}</p>
                    
                    ${
                      respuestas.length === 0
                        ? '<p class="text-center">No hay respuestas aún</p>'
                        : respuestas
                            .map(
                              (respuesta) => `
                            <div class="respuesta-item">
                                <div class="respuesta-header">
                                    <div>
                                        <strong>${encuesta.anonima ? "Respuesta anónima" : respuesta.usuario.nombre}</strong>
                                        ${!encuesta.anonima ? `<small class="text-muted"> (${respuesta.usuario.email})</small>` : ""}
                                    </div>
                                    <small class="text-muted">${window.formatDate(respuesta.fechaRespuesta)}</small>
                                </div>
                                
                                ${respuesta.respuestas
                                  .map((resp, index) => {
                                    const pregunta =
                                      encuesta.preguntas.find((p) => p.id === resp.preguntaId) ||
                                      encuesta.preguntas[index]
                                    return `
                                        <div class="respuesta-detalle">
                                            <strong>${pregunta ? pregunta.texto : `Pregunta ${index + 1}`}:</strong>
                                            <p>${resp.valor || "Sin respuesta"}</p>
                                        </div>
                                    `
                                  })
                                  .join("")}
                            </div>
                        `,
                            )
                            .join("")
                    }
                </div>
            `

      document.getElementById("respuestas-content").innerHTML = content
      window.showModal("respuestas-modal")
    } catch (error) {
      console.error("Error loading respuestas:", error)
      window.showAlert("Error al cargar las respuestas", "danger")
    }
  }

  editEncuesta(id) {
    const encuesta = this.encuestas.find((e) => e.id === id)
    if (encuesta) {
      this.openEncuestaModal(encuesta)
    }
  }

  async deleteEncuesta(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta encuesta?")) {
      return
    }

    try {
      const response = await apiFetch(`/encuestas/${id}`, "DELETE")

      if (response && response.ok) {
        window.showAlert("Encuesta eliminada exitosamente", "success")
        await this.loadEncuestas()
      } else {
        throw new Error("Error en la respuesta del servidor")
      }
    } catch (error) {
      console.error("Error deleting encuesta:", error)
      window.showAlert("Error al eliminar la encuesta", "danger")
    }
  }
}

// Inicializar gestor de encuestas
let encuestasManager
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("encuestas-container")) {
    encuestasManager = new EncuestasManager()
  }
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
  return fetch(url, options)
}

window.showAlert = (message, type) => {
  const alertContainer = document.createElement("div")
  alertContainer.className = `alert alert-${type} alert-dismissible fade show`
  alertContainer.role = "alert"
  alertContainer.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `
  document.body.appendChild(alertContainer)
}

window.truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "..."
  }
  return text
}

window.formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

window.showModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    const bootstrapModal = new window.bootstrap.Modal(modal)
    bootstrapModal.show()
  }
}

window.hideModal = (modalId) => {
  const modal = document.getElementById(modalId)
  if (modal) {
    const bootstrapModal = window.bootstrap.Modal.getInstance(modal)
    bootstrapModal.hide()
  }
}

window.getSession = () => {
  return { userId: 1 } // Dummy session data
}
