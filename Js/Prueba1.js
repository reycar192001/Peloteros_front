
function obtenerToken() {
    const token = localStorage.getItem('token');
    return token;
}

const token = obtenerToken();
async function fetchScheduleData(date, numPlayers) {
    try {
        const response = await fetch(`http://localhost:8090/peloteros/canchas/xfechanum/${date}/${numPlayers}`, {           
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();

        // Limpiar el contenedor de la cuadrícula
        renderScheduleGrid(data);
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
    }
}

function renderScheduleGrid(data) {
    // Limpiar el contenedor de la cuadrícula
    const gridContainer = document.getElementById("schedule-grid");
    gridContainer.innerHTML = ""; // Limpiar contenido anterior

    // Definir las canchas y las horas de inicio para la cuadrícula
    // Obtener la lista de canchas y horas únicas
    const canchas = [...new Set(data.map(item => item.canchaId))];
    const horas = [...new Set(data.map(item => item.horaInicio))];

    // Establecer grid-template-columns dinámicamente
    gridContainer.style.gridTemplateColumns = `repeat(${canchas.length + 1}, 1fr)`; // +1 para la columna de horarios

    // Crear la fila de encabezado
    gridContainer.appendChild(createHeaderCell("")); // Celda vacía para la columna de horarios
    canchas.forEach(cancha => gridContainer.appendChild(createHeaderCell(`Cancha ${cancha}`)));

    // Crear las filas de horarios y las celdas de disponibilidad
    horas.forEach(hora => {
        gridContainer.appendChild(createTimeCell(hora)); // Celda de hora en la primera columna
        canchas.forEach(canchaId => {
            const estado = getEstadoByCanchaHora(data, canchaId, hora);
            const slot = document.createElement("div");
            slot.classList.add("slot", estado === "Reservado" ? "unavailable" : "available");
            slot.textContent = estado === "Reservado" ? "Reservado" : "Disponible";
            gridContainer.appendChild(slot);
        });
    });
}

function getEstadoByCanchaHora(data, canchaId, horaInicio) {
    // Buscar el estado en los datos de respuesta de la API
    for (const item of data) {
        const hora = item.horaInicio.slice(0, 5); // Obtener la hora en formato HH:MM
        if (item.canchaId === canchaId && hora === horaInicio) {
            return item.estado;
        }
    }
    return "Disponible"; // Por defecto si no se encuentra un estado específico
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