// Importar funciones de api.js (asumimos que api.js está cargado globalmente)

document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication()
    setupUserInterface()
    loadRolesForFiltersAndForm() // Cargar roles primero
    loadUsers() // Luego cargar usuarios
    document.getElementById("editUserForm").addEventListener("submit", handleEditUserSubmit)
})

const userId = localStorage.getItem("userId")
const userName = localStorage.getItem("userName")
const userRole = localStorage.getItem("userRole")

let allUsers = [] // Para almacenar todos los usuarios y aplicar filtros en el cliente
let allRoles = [] // Para almacenar todos los roles

function checkAuthentication() {
    if (!userRole || !userName || !userId) {
        window.location.href = "index.html"
        return
    }
    // Redirigir si el usuario no tiene un rol administrativo
    if (userRole !== "ADMIN" && userRole !== "RESPONSABLE_COLMENA") {
        alert("No tienes permisos para acceder a esta página.")
        window.location.href = "dashboard.html"
    }
}

function setupUserInterface() {
    document.getElementById("userNameDisplay").textContent = userName
    const userTypeDisplay = document.getElementById("userTypeDisplay")
    userTypeDisplay.textContent = userRole

    if (userRole === "ADMIN" || userRole === "RESPONSABLE_COLMENA") {
        userTypeDisplay.style.backgroundColor = "rgba(16, 185, 129, 0.2)"
        userTypeDisplay.style.color = "#065f46"
    } else {
        userTypeDisplay.style.backgroundColor = "rgba(59, 130, 246, 0.2)"
        userTypeDisplay.style.color = "#1e40af"
    }
}

function logout() {
    if (confirm("¿Está seguro que desea cerrar sesión?")) {
        localStorage.clear()
        window.location.href = "index.html"
    }
}

async function loadRolesForFiltersAndForm() {
    try {
        const response = await window.getAllRoles()
        if (response.ok) {
            allRoles = await response.json()
            populateRoleSelects()
        } else {
            console.error("Error al cargar roles:", await response.json())
        }
    } catch (error) {
        console.error("Error de red al cargar roles:", error)
    }
}

function populateRoleSelects() {
    const filterRoleSelect = document.getElementById("filterRole")
    const editUserRolSelect = document.getElementById("editUserRol")

    // Clear existing options (except "Todos los Roles")
    filterRoleSelect.innerHTML = '<option value="">Todos los Roles</option>'
    editUserRolSelect.innerHTML = "" // Clear all for edit form

    allRoles.forEach((role) => {
        const optionFilter = document.createElement("option")
        optionFilter.value = role.id
        optionFilter.textContent = role.nombre
        filterRoleSelect.appendChild(optionFilter)

        const optionEdit = document.createElement("option")
        optionEdit.value = role.id
        optionEdit.textContent = role.nombre
        editUserRolSelect.appendChild(optionEdit)
    })
}

async function loadUsers() {
    const usersTableBody = document.getElementById("usersTableBody")
    usersTableBody.innerHTML = '<tr><td colspan="10" class="loading-message">Cargando usuarios...</td></tr>'

    try {
        const response = await window.getAllUsuarios()
        if (response.ok) {
            allUsers = await response.json()
            applyFilters() // Apply filters after loading all users
        } else {
            const errorData = await response.json()
            usersTableBody.innerHTML = `<tr><td colspan="10" class="error-message">Error al cargar usuarios: ${errorData.message || "Desconocido"}</td></tr>`
            console.error("Error al cargar usuarios:", errorData)
        }
    } catch (error) {
        usersTableBody.innerHTML =
            '<tr><td colspan="10" class="error-message">Error de conexión al cargar usuarios.</td></tr>'
        console.error("Error de red al cargar usuarios:", error)
    }
}

function applyFilters() {
    const searchInput = document.getElementById("searchUserInput").value.toLowerCase()
    const filterStatus = document.getElementById("filterStatus").value
    const filterRole = document.getElementById("filterRole").value

    const filteredUsers = allUsers.filter((user) => {
        const matchesSearch =
            user.nombre.toLowerCase().includes(searchInput) || user.email.toLowerCase().includes(searchInput)
        const matchesStatus = filterStatus === "" || user.estatus === filterStatus
        const matchesRole = filterRole === "" || (user.rol && user.rol.id == filterRole)
        return matchesSearch && matchesStatus && matchesRole
    })

    renderUsersTable(filteredUsers)
}

function resetFilters() {
    document.getElementById("searchUserInput").value = ""
    document.getElementById("filterStatus").value = ""
    document.getElementById("filterRole").value = ""
    applyFilters()
}

function renderUsersTable(users) {
    const usersTableBody = document.getElementById("usersTableBody")
    usersTableBody.innerHTML = "" // Clear existing rows

    if (users.length === 0) {
        usersTableBody.innerHTML =
            '<tr><td colspan="10" class="empty-message">No se encontraron usuarios con los filtros aplicados.</td></tr>'
        return
    }

    users.forEach((user) => {
        const row = usersTableBody.insertRow()

        const roleName = user.rol ? user.rol.nombre : "N/A"
        let roleClass = "role-default"
        if (roleName.toUpperCase() === "ADMIN") roleClass = "role-ADMIN"
        else if (roleName.toUpperCase() === "RESPONSABLE_COLMENA") roleClass = "role-RESPONSABLE_COLMENA"
        else if (roleName.toUpperCase() === "USUARIO") roleClass = "role-USUARIO"

        const statusClass = `status-${user.estatus || "inactivo"}` // Default to inactivo if null

        row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.nombre}</td>
                        <td>${user.email}</td>
                        <td><span class="role-badge ${roleClass}">${roleName}</span></td>
                        <td><span class="status-badge ${statusClass}">${user.estatus || "N/A"}</span></td>
                        <td>${user.edad || "N/A"}</td>
                        <td>${user.sexo || "N/A"}</td>
                        <td>${user.telefono || "N/A"}</td>
                        <td>${user.ultimoLogin ? new Date(user.ultimoLogin).toLocaleString() : "N/A"}</td>
                        <td class="table-actions">
                                <button class="btn btn-small btn-outline" onclick="openEditUserModal(${user.id})">Editar</button>
                                <button class="btn btn-small ${user.estatus === "activo" ? "btn-outline" : "btn-primary"}" onclick="toggleUserStatus(${user.id}, '${user.estatus}')">
                                        ${user.estatus === "activo" ? "Suspender" : "Activar"}
                                </button>
                        </td>
                `
    })
}

async function openEditUserModal(userIdToEdit) {
    try {
        const response = await window.getUsuarioById(userIdToEdit)
        if (response.ok) {
            const user = await response.json()
            document.getElementById("editUserId").value = user.id
            document.getElementById("editUserName").value = user.nombre
            document.getElementById("editUserEmail").value = user.email
            document.getElementById("editUserEdad").value = user.edad || ""
            document.getElementById("editUserSexo").value = user.sexo || "otro"
            document.getElementById("editUserDomicilio").value = user.domicilio || ""
            document.getElementById("editUserTelefono").value = user.telefono || ""
            document.getElementById("editUserEstatus").value = user.estatus || "activo"
            document.getElementById("editUserRol").value = user.rol ? user.rol.id : ""

            document.getElementById("editUserModal").style.display = "block"
        } else {
            const errorData = await response.json()
            alert(`Error al cargar datos del usuario: ${errorData.message || "Desconocido"}`)
            console.error("Error al cargar usuario para edición:", errorData)
        }
    } catch (error) {
        alert("Error de conexión al cargar datos del usuario.")
        console.error("Error de red al cargar usuario para edición:", error)
    }
}

function closeEditUserModal() {
    document.getElementById("editUserModal").style.display = "none"
    document.getElementById("editUserForm").reset() // Limpiar el formulario
}

async function handleEditUserSubmit(e) {
    e.preventDefault()

    const userId = document.getElementById("editUserId").value
    const nombre = document.getElementById("editUserName").value
    const email = document.getElementById("editUserEmail").value
    const password = document.getElementById("editUserPassword").value // Puede estar vacío
    const edad = document.getElementById("editUserEdad").value
    const sexo = document.getElementById("editUserSexo").value
    const domicilio = document.getElementById("editUserDomicilio").value
    const telefono = document.getElementById("editUserTelefono").value
    const estatus = document.getElementById("editUserEstatus").value
    const rolId = document.getElementById("editUserRol").value

    const userData = {
        nombre,
        email,
        edad: edad ? Number.parseInt(edad) : null,
        sexo: sexo || null,
        domicilio,
        telefono,
        estatus,
        rolId: Number.parseInt(rolId),
    }

    // Solo añadir la contraseña si no está vacía
    if (password) {
        userData.password = password
    }

    try {
        const response = await window.updateUsuario(userId, userData)
        if (response.ok) {
            alert("Usuario actualizado exitosamente.")
            closeEditUserModal()
            loadUsers() // Recargar la tabla para ver los cambios
        } else {
            const errorData = await response.json()
            alert(`Error al actualizar usuario: ${errorData.message || "Desconocido"}`)
            console.error("Error al actualizar usuario:", errorData)
        }
    } catch (error) {
        alert("Error de conexión al actualizar usuario.")
        console.error("Error de red al actualizar usuario:", error)
    }
}

async function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === "activo" ? "suspendido" : "activo"
    if (confirm(`¿Está seguro que desea ${newStatus === "activo" ? "activar" : "suspender"} a este usuario?`)) {
        try {
            // Primero, obtener los datos actuales del usuario
            const userResponse = await window.getUsuarioById(userId)
            if (!userResponse.ok) {
                const errorData = await userResponse.json()
                alert(`Error al obtener datos del usuario para cambiar estatus: ${errorData.message || "Desconocido"}`)
                console.error("Error al obtener usuario para toggle status:", errorData)
                return
            }
            const user = await userResponse.json()

            // Crear un objeto de request con los datos actuales y el nuevo estatus
            const userData = {
                nombre: user.nombre,
                email: user.email,
                edad: user.edad,
                sexo: user.sexo,
                domicilio: user.domicilio,
                telefono: user.telefono,
                estatus: newStatus, // Solo cambiamos el estatus
                rolId: user.rol.id, // Aseguramos que el rol se mantenga
            }

            const response = await window.updateUsuario(userId, userData)
            if (response.ok) {
                alert(`Usuario ${newStatus} exitosamente.`)
                loadUsers() // Recargar la tabla
            } else {
                const errorData = await response.json()
                alert(`Error al cambiar estatus del usuario: ${errorData.message || "Desconocido"}`)
                console.error("Error al cambiar estatus:", errorData)
            }
        } catch (error) {
            alert("Error de conexión al cambiar estatus del usuario.")
            console.error("Error de red al cambiar estatus:", error)
        }
    }
}

// Cerrar modal al hacer clic fuera de él
window.onclick = (event) => {
    const editUserModal = document.getElementById("editUserModal")
    if (event.target == editUserModal) {
        closeEditUserModal()
    }
}
