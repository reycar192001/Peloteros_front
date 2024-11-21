// script.js

// Cargar usuarios y mostrar en lista
const cargarUsuarios = async () => {
    try {
        const respuesta = await fetch('http://localhost:8090/peloteros/usuarios/listar');
        if (respuesta.ok) {
            const usuarios = await respuesta.json();
            let usuariosHTML = '';
            usuarios.forEach(usuario => {
                usuariosHTML += `
                <div class="usuario-item" data-id="${usuario.UsuarioID}">
                    <p><strong>Nombre:</strong> ${usuario.Nombre}</p>
                    <p><strong>Correo:</strong> ${usuario.Correo}</p>
                    
                </div>`;
            });
            document.getElementById('listaUsuarios').innerHTML = usuariosHTML;

            // Añadir evento de click a cada usuario
            document.querySelectorAll('.usuario-item').forEach(item => {
                item.addEventListener('click', async function () {
                    const usuarioID = this.getAttribute('data-id');
                    console.log(usuarioID)
                    await cargarUsuarioParaActualizar(usuarioID);
                });
            });
        }
    } catch (error) {
        console.error('Error al cargar usuarios', error);
    }
};


// Cargar datos del usuario seleccionado en el formulario
const cargarUsuarioParaActualizar = async (UsuarioID) => {
    try {
        const respuesta = await fetch(`http://localhost:8090/peloteros/usuarios/buscar/${UsuarioID}`);
        if (respuesta.ok) {
            const usuario = await respuesta.json();
            document.getElementById('nombre').value = usuario.Nombre;
            document.getElementById('correo').value = usuario.Correo;
            document.getElementById('telefono').value = usuario.Telefono;
            document.getElementById('roleID').value = usuario.RoleID;
            
            document.getElementById('password').value = usuario.Password;

            // Guardar el UsuarioID en un atributo del formulario
            document.getElementById('actualizarForm').setAttribute('data-usuario-id', UsuarioID);
            const btnEliminar = document.getElementById('btn-eliminar');            
            btnEliminar.onclick = () => eliminarUsuario(usuario.UsuarioID); // Asignar el evento
        }
    } catch (error) {
        console.error('Error al cargar usuario', error);
    }
};

// Función para eliminar un usuario por ID
const eliminarUsuario = async (id) => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmacion) {
        try {
            const respuesta = await fetch(`http://localhost:8090/peloteros/usuarios/borrar/${id}`, {
                method: 'DELETE',
            });

            if (respuesta.status === 200) {
                alert("Usuario eliminado correctamente");
                document.getElementById('resultado').innerHTML ="Usuario eliminado correctamente"
                cargarusuarios(); // Recargar la lista de usuarios
            } else {
                console.error("Error al eliminar el usuario");
                document.getElementById('resultado').innerHTML = "Error al eliminar el usuario"
                cargarusuarios();
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            cargarusuarios();
        }
    }
};


// Actualizar usuario
const form = document.getElementById('actualizarForm');
form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Recoger los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const telefono = document.getElementById('telefono').value;
    const roleID = document.getElementById('roleID').value;
    const password = document.getElementById('password').value;
    const usuarioID = form.getAttribute('data-usuario-id'); // Obtener el ID del usuario

    // Crear el objeto para actualizar
    const usuarioActualizado = {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        password: password,
        rolesObj: {
            roleID: parseInt(roleID)
        }
    };

    try {
        const respuesta = await fetch(`http://localhost:8090/peloteros/usuarios/editar/${usuarioID}`, {
            method: 'PUT', // Método de actualización
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioActualizado)
        });

        if (respuesta.ok) {
            document.getElementById('resultado').innerHTML = 'Usuario actualizado correctamente!';
            // Recargar la lista de usuarios
            cargarUsuarios();
        } else {
            document.getElementById('resultado').innerHTML = 'Error al actualizar usuario.';
        }
    } catch (error) {
        console.error('Error al actualizar usuario', error);
        document.getElementById('resultado').innerHTML = 'Ocurrió un error en la solicitud.';
    }
});

// Inicializar cargando la lista de usuarios
cargarUsuarios();



