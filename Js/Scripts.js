const token = localStorage.getItem('token');
 
function obtenerDatosUsuario() {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
        alert("No hay datos");
        return null;
    }
    return JSON.parse(storedUserData); // Devuelve el objeto parseado
}

const userData = obtenerDatosUsuario();
if (userData) {
    // Accede a las propiedades del objeto
    const correo = userData.Correo; // Notar la "C" mayúscula
    const nombre = userData.Nombre;
    const telefono = userData.Telefono;

    console.log("Correo:", correo);
    console.log("Nombre:", nombre);
    console.log("Teléfono:", telefono);

}

const xhora = localStorage.getItem('selectedHora')+"";
const xidcancha = localStorage.getItem('selectedCancha')+"";
const selectedDate = localStorage.getItem('selectedDate')+"";
const xprecio = localStorage.getItem("Costo");
// Crear un nuevo objeto para el post
const newBoleta = {
    tipodoc: "Factura",    
    nombreCliente: userData.Nombre,
    dni: "75578039",
    direccion: "Los Olivos",
    email: userData.Correo,
    hora: xhora,
    fecha: selectedDate,
    idcancha:xidcancha,
    precio:xprecio
};

console.log("Datos para enviar:", newBoleta);

const stripe = Stripe('pk_test_51NczKhIflwBxpIOlJaEMgCS6nl1ObNGgWw7hJJjaMWN7D62yLP2Tktds4EsP0RJGHGnmJ9cdrd65vCOya0F0LAAP00wdH1suG8');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

async function confirmarPago() {
         // Mostrar el spinner
    document.getElementById('spinner').classList.remove('hidden');
    
    // Iniciar la barra de progreso (de 0% a 100%)
    const progressBar = document.querySelector('.progress');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2; // Aumenta el progreso cada vez un 2%
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval); // Detener el intervalo cuando llegue al 100%
        }
    }, 10); // El progreso avanza cada 50ms

    try {        
        const urlParams = new URLSearchParams(window.location.search);
        const clientSecret = urlParams.get('clientSecret');
        const xcorreo = userData.Correo;

        if (!clientSecret) {
            throw new Error('No se encontró clientSecret en la URL.');
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: xcorreo
                }
            }
        });

        if (error) {
            console.error('Error al confirmar el pago:', error.message);
            alert(`Error en el pago: ${error.message}`);
        } else if (paymentIntent.status === 'succeeded') {
            SendEmail(newBoleta);            
            console.log('Pago realizado con éxito:', paymentIntent);
            
            showAlert2('¡Pago realizado con éxito!' +"\n Se enviará el comprobante a su correo");            
            location.href = 'Mensaje.html'; // Redirige después del pago exitoso
            
            setTimeout(function(){
                console.log("ya ta")
                localStorage.removeItem("selectedCancha");
                localStorage.removeItem("selectedDate");
                localStorage.removeItem("selectedEstado");
                localStorage.removeItem("selectedHora")
                localStorage.removeItem("horarioid")  
                location.href = 'Index.html'                
            }, 2000);
          
        }
    } catch (error) {
        console.error('Error en el proceso de pago:', error.message);
        alert(`Ocurrió un error al procesar el pago: ${error.message}`);
    }

}

async function SendEmail(boleta) {
    try {
        const response = await fetch('http://localhost:8090/peloteros/correo/envioboleta', {           
            method: "POST",
            headers: {                
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(boleta)
        });
        
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
        //alert(`Sesion expirada.`);
        //location.href = 'Login.html';
    }
}

function borrardata(){   
    localStorage.removeItem("selectedCancha");
    localStorage.removeItem("selectedDate");
    localStorage.removeItem("selectedEstado");
    localStorage.removeItem("selectedHora")
    localStorage.removeItem("horarioid")  
    location.href = 'Index.html'
    alert('¡Pago realizado con éxito!' +"\n Se enviará el comprobante a su correo");
}

function showAlert2(message) {
    Swal.fire({
        icon: 'success',
        title: 'Atención',
        text: message,
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: 'custom-popup1',
            title: 'custom-title1',
            content: 'custom-content1',
            confirmButton: 'custom-button1'
        }
    });
}