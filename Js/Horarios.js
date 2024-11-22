function obtenerToken() {
    const token = localStorage.getItem('token');
    return token;
}

const token = obtenerToken();
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
                "Authorization": `Bearer ${token}`,
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
    // Limpiar el contenedor de la cuadrícula
    const gridContainer = document.getElementById("schedule-grid");
    gridContainer.innerHTML = ""; // Limpiar contenido anterior

    // Definir los nombres de las canchas y las horas de inicio para la cuadrícula
    const canchas = [...new Set(data.map(item => item.canchaId))];
    const horas = [...new Set(data.map(item => item.horaInicio))];
    //const idhorario = [...new Set(data.map(item => item.horarioid))];
    //const horas = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

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
                } else {
                    console.log("Esta celda no tiene un horarioId asignado.");
                }
                handleCellSelection(canchaId, hora, estado);
                localStorage.setItem("selectedCancha", canchaId);
                localStorage.setItem("selectedHora", hora);
                localStorage.setItem("selectedEstado", estado);
                }else{
                    alert(`Seleccionaste un horario que no está disponible, elige otro por favor.`);
                }
                
                //localStorage.setItem("selectedDate", date);
            });
            gridContainer.appendChild(slot);
        });
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

function seteardatos(){
    // Recuperar el número de jugadores desde sessionStorage
const numeroJugadores = sessionStorage.getItem("numeroJugadores");

if (numeroJugadores) {
    console.log("Número de jugadores:", numeroJugadores);
    // Utilizar el número de jugadores en el código
} else {
    console.log("Número de jugadores no encontrado en sessionStorage.");
}
}

function handleCellSelection(canchaId, hora, estado) {
    // Aquí puedes manejar los valores seleccionados
    console.log("Celda seleccionada:");
    console.log("Cancha ID:", canchaId);
    console.log("Hora:", hora);
    console.log("Estado:", estado);

    // Puedes realizar alguna acción, como almacenar en localStorage o mostrar en pantalla
    // Ejemplo de mostrar en una alerta:
    alert(`Seleccionaste:\nCancha: ${canchaId}\nHora: ${hora}\nEstado: ${estado}`);

}
