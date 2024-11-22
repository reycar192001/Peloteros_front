// script.js
function obtenerToken() {
    const token = localStorage.getItem('token');
    return token;
}

const token = obtenerToken()

// Cargar valores de localStorage y asignarlos a los inputs
document.getElementById("numeroCancha").value = localStorage.getItem("selectedCancha") || "";
document.getElementById("horario").value = localStorage.getItem("selectedHora") || "";
document.getElementById("fecha").value = localStorage.getItem("selectedDate") || "";


    const xhorarioid = localStorage.getItem("horarioid");
    const xcanchaid = document.getElementById('numeroCancha').value;    
    

    // Crear el objeto que vamos a enviar
    const newcanchahorario = {        
        canchas: {
            canchaID: parseInt(xcanchaid) // roleID dentro de rolesObj
        },horarios: {
            horarioID: parseInt(xhorarioid) // roleID dentro de rolesObj
        }};

    console.log(newcanchahorario);

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

function confirmarReserva() {
   
        registroreserva()

        alert("Reserva confirmada.");
    

    // Aquí puedes agregar el código para enviar la confirmación al backend si es necesario
}

function editarReserva() {
    window.location.href='Horarios.html';
    // Aquí puedes redirigir a otra página o permitir la edición según tu necesidad
}