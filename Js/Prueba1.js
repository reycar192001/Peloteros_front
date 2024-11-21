async function fetchScheduleData() {
    try {
        const response = await fetch("http://localhost:8090/peloteros/horarioscanchas/listar");
        const data = await response.json();
        console.log(data)

        // Limpiar el contenedor de la cuadrícula
        const gridContainer = document.getElementById("schedule-grid");
        gridContainer.innerHTML = ""; // Limpiar contenido anterior

        // Definir los nombres de canchas y las horas de inicio para la cuadrícula
        const canchas = ["A", "B", "C", "D", "E", "F", "G"];
        const horas = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

        // Crear la fila de encabezado con nombres de canchas
        gridContainer.appendChild(createHeaderCell("")); // Celda vacía para la primera columna
        canchas.forEach(cancha => gridContainer.appendChild(createHeaderCell(cancha)));

        // Crear las filas de horarios y las celdas de disponibilidad
        horas.forEach(hora => {
            gridContainer.appendChild(createTimeCell(hora)); // Celda de hora en la primera columna
            canchas.forEach((cancha, index) => {
                const estado = getEstadoByCanchaHora(data, index + 1, hora); // Obtener estado del array
                const slot = document.createElement("div");
                slot.classList.add("slot", estado === "Reservado" ? "unavailable" : "available");
                slot.textContent = estado === "Reservado" ? "Reservado" : "Disponible";
                gridContainer.appendChild(slot);
            });
        });
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
    }
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
        const [horarioId, estado, canchaDataId] = item;
        if (canchaDataId === canchaId && itemHoraMatch(horaInicio, item)) {
            return estado;
        }
    }
    return "Disponible"; // Por defecto si no se encuentra un estado específico
}

function itemHoraMatch(horaInicio, item) {
    // Comparar horas
    const start = horaInicio + ":00"; // Formato completo de tiempo
    return item.includes(start);
}
