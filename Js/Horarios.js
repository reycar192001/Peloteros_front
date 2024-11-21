const token = obtenerToken();
const numJugadores = sessionStorage.getItem("numJugadores");

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
    }
}

function renderScheduleGrid(data) {
    // Limpiar el contenedor de la cuadrícula
    const gridContainer = document.getElementById("schedule-grid");
    gridContainer.innerHTML = ""; // Limpiar contenido anterior

    // Definir los nombres de las canchas y las horas de inicio para la cuadrícula
    const canchas = [...new Set(data.map(item => item.canchaId))];
    const horas = [...new Set(data.map(item => item.horaInicio))];
    //const horas = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

    // Crear la fila de encabezado con nombres de canchas
    gridContainer.appendChild(createHeaderCell("")); // Celda vacía para la primera columna
    canchas.forEach(cancha => gridContainer.appendChild(createHeaderCell(`Cancha ${cancha}`)));

    // Crear las filas de horarios y las celdas de disponibilidad
    horas.forEach(hora => {
        gridContainer.appendChild(createTimeCell(hora)); // Celda de hora en la primera columna
        canchas.forEach(canchaId => {
            const estado = getEstadoByCanchaHora(data, canchaId, hora); // Obtener estado del array
            const slot = document.createElement("div");
            slot.classList.add("slot", estado === "Reservado" ? "unavailable" : "available");
            slot.textContent = estado === "Reservado" ? "Reservado" : "Disponible";
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
    const numPlayers = numJugadores
    if (date && numPlayers) {
        fetchScheduleDataByDateAndPlayers(date, numPlayers);
    }
});

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

function obtenerToken() {
    const token = localStorage.getItem('token');
    return token;
}
