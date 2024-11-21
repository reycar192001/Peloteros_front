// script.js

async function fetchScheduleData() {
    try {
        // Hacer petición a la API para obtener los datos de horarios y canchas
        const response = await fetch("http://localhost:8090/peloteros/horarioscanchas/listar");
        const data = await response.json();
        console.log(data)
        // Limpiar el contenedor de la cuadrícula
        const gridContainer = document.getElementById("schedule-grid");
        gridContainer.innerHTML = ""; // Limpiar contenido anterior

        // Procesar y mostrar los datos
        data.forEach(item => {
            const horarioId = item[0];  // ID del horario
            const estado = item[1];     // Estado (Disponible o Reservado)
            const canchaId = item[2];   // ID de la cancha

            // Crear un elemento div para cada horario
            const slot = document.createElement("div");
            slot.classList.add("slot");

            // Asignar la clase según el estado
            if (estado === "Reservado") {
                slot.classList.add("unavailable");
                slot.textContent = "Reservado";
            } else if(estado === "Disponible"){
                slot.classList.add("available");
                slot.textContent = "Disponible";
            }else{
                slot.classList.add("mantenimiento");
                slot.textContent = "Mantenimiento";
            }

            // Asignar el horario y agregar al contenedor
           
            slot.setAttribute("data-horario-id", horarioId);
            slot.setAttribute("data-cancha-id", canchaId);

            gridContainer.appendChild(slot);
        });
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
    }
}

// Llamada a la función para cargar los datos al cargar la página
window.addEventListener("load", fetchScheduleData);
