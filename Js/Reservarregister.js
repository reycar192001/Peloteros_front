// script.js
function validarToken() {
    const token = localStorage.getItem('token'); 
    if (token) {        
        return token;
    } else {        
        alert("No hay token. Redirigiendo al login...");
        //window.location.href='Login.html';
    }
}
const token = localStorage.getItem('token');

function obtenerDatosUsuario() {
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {       
        return null;
    }
    return JSON.parse(storedUserData); // Devuelve el objeto parseado
}

const userData = obtenerDatosUsuario();
if (userData) {
    // Accede a las propiedades del objeto    
    const idusuario = userData.UsuarioID;    
    console.log("Usuarioid: ", idusuario);
}

const numerocancha = localStorage.getItem("selectedCancha");
const horario = localStorage.getItem("selectedHora");
const fecha = localStorage.getItem("selectedDate")
const xhorarioid = localStorage.getItem("horarioid");

// Cargar valores de localStorage y asignarlos a los inputs
document.getElementById("numeroCancha").value = numerocancha || "";
document.getElementById("horario").value =  horario || "";
document.getElementById("fecha").value = fecha || "";


    const newcanchahorario = {        
        canchas: {
            canchaID: parseInt(numerocancha) // roleID dentro de rolesObj
        },horarios: {
            horarioID: parseInt(xhorarioid) // roleID dentro de rolesObj
        }};
    // Crear el objeto que vamos a enviar
    const newreserva = { 
        estado:"Confirmada",       
        usuariosObj: {
            usuarioID: userData.UsuarioID // roleID dentro de rolesObj
        },horariosObj: {
            horarioID: xhorarioid // roleID dentro de rolesObj
        }};

    console.log(newcanchahorario);

async function registroreserva() {
    try {
        const response = await fetch('http://localhost:8090/peloteros/reservas/agregar', {           
            method: "POST",
            headers: {                
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newreserva)
        });
        
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
        alert(`Sesion expirada.`);
        location.href = 'Login.html';
    }
}

async function registrocanchaHorario() {
    try {
        const response = await fetch('http://localhost:8090/peloteros/horarioscanchas/agregar', {           
            method: "POST",
            headers: {                
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newcanchahorario)
        });
        

        // Limpiar el contenedor de la cuadrícula
        
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
        //alert(`Sesion expirada.`);
        //location.href = 'Login.html';
    }
}

// Llamada a la función para cargar los datos al cargar la página

function calcularMontoReserva() {
    const precioPorHora = parseFloat(localStorage.getItem("Costo")); 
    const horasReservadas =  1; 
    const monto = precioPorHora * horasReservadas; 
    return Math.round(monto * 1); 
}

async function confirmarReserva() {
    await registrocanchaHorario();
    await registroreserva();
    guardardatos();
    const amount = calcularMontoReserva();
    const currency = 'pen';
    const description = 'Reserva de cancha';

    try {
        const response = await fetch('http://localhost:8090/peloteros/api/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ amount, currency, description })
        });

        if (!response.ok) {
            console.error("Error en la respuesta del servidor:", response.status, response.statusText);
            showMessage(`Error en la reserva: ${response.statusText}`);
            return;
        }

        const data = await response.json();

        if (data.clientSecret) {
            console.log("ClientSecret recibido:", data.clientSecret);
            location.href = `pago.html?clientSecret=${data.clientSecret}`;
        } else {
            console.error("ClientSecret no recibido. Respuesta completa:", data);
            showMessage("Error al procesar el pago. ClientSecret no recibido.");
        }
    } catch (error) {
        console.error("Error al procesar el pago:", error);
        showMessage("Error al procesar la reserva y el pago.");
    }
}

function showMessage(message) {
    const messageDiv = document.getElementById("payment-message");
    messageDiv.classList.remove("hidden");
    messageDiv.innerText = message;
}

function editarReserva() {
    window.location.href='Horarios.html';
    // Aquí puedes redirigir a otra página o permitir la edición según tu necesidad
}

function guardardatos(){
    const documento = document.getElementById("dni").value;
    const tipodoc = document.getElementById("tipoDocumento").value;

    localStorage.setItem('documento', documento);
    localStorage.setItem('tipodoc', tipodoc+"");
}