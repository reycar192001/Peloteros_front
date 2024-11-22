const form = document.getElementById('usuarioForm');
form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Recoger los valores del formulario
    const xnombre = document.getElementById('nomusuario').value;
    const xcorreo = document.getElementById('correo').value;    
    const xpassword = document.getElementById('clave').value;
    const xtelefono = "";
    const xroleID = 1;

    // Crear el objeto que vamos a enviar
    const nuevoUsuario = {
        nombre: xnombre,
        correo: xcorreo,
        telefono: xtelefono,
        rolesObj: {
            roleID: parseInt(xroleID) // roleID dentro de rolesObj
        },        
        password: xpassword
    };

    try {
        const respuesta = await fetch('http://localhost:8090/peloteros/usuarios/agregar', {
            method: 'POST', // Método de inserción
            headers: {
                'Content-Type': 'application/json' // Indicamos que enviamos JSON
            },
            body: JSON.stringify(nuevoUsuario) // Convertir los datos a JSON
        });

        if (respuesta.status === 201 || respuesta.ok || respuesta.status ===200) {
            const resultado = await respuesta.json();
            document.getElementById('resultado').innerHTML = 'Usuario agregado correctamente!';
            console.log('Usuario agregado correctamente!')
        } else {
            document.getElementById('resultado').innerHTML = 'Este usuario ya existe.';
            console.log('Error al agregar usuario.')
        }
    } catch (error) {
        console.log(error);
        document.getElementById('resultado').innerHTML = 'Usuario agregado correctamente!';
        setTimeout(function(){
            console.log("ya ta")
            window.location.href='Login.html';
            
        }, 3000);
    }
});
