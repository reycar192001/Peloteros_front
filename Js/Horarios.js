function validarToken() {
    const token = localStorage.getItem('token'); 
    if (token) {        
        window.location.href='RegistroReserva.html';
    } else {        
        showAlert3("Para continuar debe Iniciar sesión."+ "\n Redirigiendo al login...");
        window.location.href='Login.html';
    }
}

//const token = validarToken();
const numJugadores = sessionStorage.getItem("numJugadores");
const datetime = obtenerDate();
const calendar = document.getElementById("date-picker");
calendar.value = datetime;
calendar.min = datetime;
console.log(datetime);
fetchScheduleDataByDateAndPlayers(datetime, 9)

async function fetchScheduleDataByDateAndPlayers(date, numPlayers) {
    try {
        const response = await fetch(`http://localhost:8090/peloteros/canchas/xfechanum/${date}/${numPlayers}`, {           
            method: "GET",
            headers: {
                //"Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        
        const data = await response.json();        
        renderScheduleGrid(data);
        
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
        alert(`Sesion expirada.`);
        location.href = 'Login.html';
    }
}

function renderScheduleGrid(data) {    
    const gridContainer = document.getElementById("schedule-grid");
    gridContainer.innerHTML = ""; // Limpiar contenido anterior

    // Definir los nombres de las canchas y las horas de inicio para la cuadrícula
    const canchas = [...new Set(data.map(item => item.canchaId))];
    const horas = [...new Set(data.map(item => item.horaInicio))];
    //const precio = [...new Set(data.map(item => item.precioHora))];
    

    gridContainer.style.gridTemplateColumns = `repeat(${canchas.length + 1}, 1fr)`;
    // Crear la fila de encabezado con nombres de canchas
    gridContainer.appendChild(createHeaderCell("")); // Celda vacía para la primera columna
    canchas.forEach(cancha => gridContainer.appendChild(createHeaderCell(`Cancha ${cancha}`)));

    // Crear las filas de horarios y las celdas de disponibilidad
    horas.forEach(hora => {
        gridContainer.appendChild(createTimeCell(hora)); // Celda de hora en la primera columna
        canchas.forEach(canchaId => {
            const estado = getEstadoByCanchaHora(data, canchaId, hora); // Obtener estado del array
            const slotData = data.find(item => item.canchaId === canchaId && item.horaInicio === hora);
            const slot = document.createElement("div");
            if (slotData) {
                slot.classList.add("slot", slotData.estado === "Reservado" ? "unavailable" : "available");
                slot.textContent = slotData.estado === "Reservado" ? "Reservado" : "Disponible";
                slot.setAttribute("data-horario-id", slotData.horarioId); // Agregar horarioId como atributo
                //console.log(slotData)
            } else {
                slot.classList.add("slot", "available");
                slot.textContent = "Disponible";
            }

            // Agregar evento de clic para seleccionar la celda
            slot.addEventListener("click", () => {
                if(slot.textContent ==="Disponible"){
                    const horarioId = slot.getAttribute("data-horario-id");
                if (horarioId) {
                    console.log("Horario ID seleccionado:", horarioId);
                    localStorage.setItem("horarioid",horarioId)
                    const costo = slotData.precioHora;
                    console.log ("Costo:", costo);
                    localStorage.setItem("Costo", costo+".00")
                } else {
                    console.log("Esta celda no tiene un horarioId asignado.");
                }
                handleCellSelection(canchaId, hora, estado);
                localStorage.setItem("selectedCancha", canchaId);
                localStorage.setItem("selectedHora", hora);
                localStorage.setItem("selectedEstado", estado);
                
                }else{
                    showAlert(`Seleccionaste un horario que no está disponible, elige otro por favor.`);
                }
                
                //localStorage.setItem("selectedDate", date);
            });
            gridContainer.appendChild(slot);
        });
    });
}

function showAlert(message) {
    Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: message,
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: 'custom-popup',
            title: 'custom-title',
            content: 'custom-content',
            confirmButton: 'custom-button'
        }
    });
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

function showAlert3(message) {
    Swal.fire({
        icon: 'error',
        title: 'Atención',
        text: message,
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: 'custom-popup2',
            title: 'custom-title2',
            content: 'custom-content2',
            confirmButton: 'custom-button2'
        }
    });
}

function createHeaderCell(text) {
    const headerCell = document.createElement("div");
    headerCell.classList.add("header-cell");
    headerCell.textContent = text;
    return headerCell;
}

function createTimeCell(text) {
    const timeCell = document.createElement("div");
    timeCell.classList.add("time-cell");
    timeCell.textContent = text;
    return timeCell;
}

function getEstadoByCanchaHora(data, canchaId, horaInicio) {
    // Buscar el estado en los datos de respuesta de la API
    for (const item of data) {
        const hora = item.horaInicio.slice(0, 5); // Obtener la hora en formato HH:MM
        if (item.numeroCancha === canchaId && hora === horaInicio) {
            return item.estado;
        }
    }
    return "Disponible"; // Por defecto si no se encuentra un estado específico
}

// Llamada al cargar la página o al cambiar la fecha y el número de jugadores
document.getElementById("date-picker").addEventListener("change", (event) => {
    const date = event.target.value;    
        localStorage.setItem("selectedDate", date);
    const numPlayers = 9
    if (date && numPlayers) {
        fetchScheduleDataByDateAndPlayers(date, numPlayers);
    }    
    
});

function obtenerDate(){
    if(localStorage.getItem("selectedDate")=== null){
        const fecha = new Date();
        const fecha1= formatDate(fecha)
        localStorage.setItem("selectedDate", fecha1);
        return fecha1;
    }else {
        return localStorage.getItem("selectedDate");
        
    }    
}
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // `getMonth()` retorna de 0 a 11, por lo que sumamos 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


function handleCellSelection(canchaId, hora, estado) {
    // Aquí puedes manejar los valores seleccionados
    console.log("Celda seleccionada:");
    console.log("Cancha ID:", canchaId);
    console.log("Hora:", hora);
    console.log("Estado:", estado);
    

    // Puedes realizar alguna acción, como almacenar en localStorage o mostrar en pantalla
    // Ejemplo de mostrar en una alerta:
    showAlert2(`Seleccionaste:\nCancha: ${canchaId}\nHora: ${hora}\nEstado: ${estado}`);

}

document.addEventListener('DOMContentLoaded', function() {
    // Obtener los elementos del DOM
    const continueButton = document.getElementById('continueButton');
    const iframeContainer = document.getElementById('iframeContainer');
    const closeButton = document.getElementById('closeButton');

    continueButton.addEventListener('click', () => {
        iframeContainer.style.display = 'block'; // Muestra el iframe con RegistroReserva.html
    });

    closeButton.addEventListener('click', () => {
        iframeContainer.style.display = 'none'; // Oculta el iframe
    });

    window.addEventListener('message', function(event) {
        if (event.origin === window.location.origin) { // Verifica que el mensaje provenga de la misma página
            if (event.data === 'complete') {
                window.location.href = 'Pago.html'; // Redirige a la página de pago
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.getElementById('closeButton');
    const iframeContainer = document.getElementById('iframeContainer');

    // Agregar el evento de cierre al botón
    closeButton.addEventListener('click', () => {
        // Ocultar el modal (el contenedor con el iframe)
        iframeContainer.style.display = 'none';

        // Redirigir a index.html de forma normal
        window.location.href = 'Index.html';
    });
});

