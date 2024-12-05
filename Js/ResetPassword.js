const form = document.getElementById('reset-password');
form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Recoger los valores del formulario    
    const xcorreo = document.getElementById('correo').value;    
    const xnombre = document.getElementById('nombre').value;
    
    const color = "#008000";

    // Crear el objeto que vamos a enviar
    const credenciales = {       
        correo: xcorreo,               
        nombre: xnombre
    };

    try {
        const respuesta = await fetch('http://localhost:8090/peloteros/correo/recuperarcontraseña', {
            method: 'POST', // Método de inserción
            headers: {
                'Content-Type': 'application/json' // Indicamos que enviamos JSON
            },
            body: JSON.stringify(credenciales) // Convertir los datos a JSON
            
        });
        

        if (respuesta.status === 201 || respuesta.ok || respuesta.status ===200) {
            const resultado = await respuesta.json();
            console.log(resultado);
            document.getElementById('resultado').innerHTML = 'Correo enviado!';
            console.log('exitoooo!')          
            
            window.location.href='Login.html';
        } else {
            document.getElementById('resultado').innerHTML = 'Los datos no existen.';
            document.getElementById('resultado').setAttribute("color", color);
            
            console.log('Error en las credenciales.')
        }
    } catch (error) {
        console.log(error);
        document.getElementById('resultado').setAttribute("text-color", color);
        document.getElementById('resultado').innerHTML = 'Correo enviado! Revisalo';
        setTimeout(function(){
            
            window.location.href='Login.html';
            console.log(resultado);           
        }, 2000);
    }
});

