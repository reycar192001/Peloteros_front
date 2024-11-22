const form = document.getElementById('login-usuario');
form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Recoger los valores del formulario    
    const xcorreo = document.getElementById('correo').value;    
    const xpassword = document.getElementById('clave').value;
    
    const color = "#008000";

    // Crear el objeto que vamos a enviar
    const credenciales = {       
        correo: xcorreo,               
        password: xpassword
    };

    try {
        const respuesta = await fetch('http://localhost:8090/peloteros/usuarios/login', {
            method: 'POST', // Método de inserción
            headers: {
                'Content-Type': 'application/json' // Indicamos que enviamos JSON
            },
            body: JSON.stringify(credenciales) // Convertir los datos a JSON
        });

        

        if (respuesta.status === 201 || respuesta.ok || respuesta.status ===200) {
            const resultado = await respuesta.json();
            console.log(resultado);
            document.getElementById('resultado').innerHTML = 'Login exitoso!';
            console.log('Login exitoso!')
            
            guardarToken(resultado.token);
            window.location.href='index.html';
        } else {
            document.getElementById('resultado').innerHTML = 'Error en las credenciales.';
            document.getElementById('resultado').setAttribute("color", color);
            
            console.log('Error en las credenciales.')
        }
    } catch (error) {
        console.log(error);
        document.getElementById('resultado').setAttribute("text-color", color);
        document.getElementById('resultado').innerHTML = 'Login exitoso!';
        setTimeout(function(){
            console.log("ya ta")
            window.location.href='index.html';
            console.log(resultado);
            guardarToken(resultado.token);
        }, 2000);
    }
});

function obtenerToken() {
    const token = localStorage.getItem('token');
    return token;
}
function guardarToken(token) {
    localStorage.setItem('token', token);
}
