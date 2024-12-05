// Función para validar la existencia del token
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotContainer = document.getElementById('chatbotContainer');
const tooltip = document.getElementById('tooltip');

function verificarToken() {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData'));
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const usuariosOption = document.getElementById('usuarios-option');
    const welcomeMessage = document.getElementById('welcome-message');

    if (token && userData) {
        // Si el token y userData existen, muestra "Cerrar Sesión", oculta "Login" y muestra el mensaje de bienvenida
        const primerNombre = obtenerPrimerNombre(userData.Nombre); // Extrae el primer nombre
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        usuariosOption.style.display = 'block';
        welcomeMessage.textContent = `Bienvenido, ${primerNombre}`;
    } else {
        // Si no hay token o userData, muestra "Login", oculta "Cerrar Sesión", oculta "USUARIOS" y limpia el mensaje de bienvenida
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        usuariosOption.style.display = 'none';
        welcomeMessage.textContent = '';
    }

    // Asignar acción al botón de cerrar sesión
    loginBtn.onclick = () => {
        
        window.location.href = 'Login.html'; // Redirige al login tras cerrar sesión
    };

    // Asignar acción al botón de cerrar sesión
    logoutBtn.onclick = () => {
        limpiarLocalStorage();
        window.location.reload();      
    };
}

function obtenerPrimerNombre(nombreCompleto) {
    if (!nombreCompleto) return ''; // Maneja casos donde la cadena sea nula o indefinida
    const primerEspacio = nombreCompleto.indexOf(' '); // Busca el primer espacio en blanco
    if (primerEspacio === -1) return nombreCompleto; // Si no hay espacio, retorna todo el nombre
    return nombreCompleto.substring(0, primerEspacio); // Retorna el texto antes del primer espacio
}

// Función para limpiar el localStorage
function limpiarLocalStorage() {
    localStorage.clear();
    console.log("Local storage eliminado.");
}

// Llama a la función al cargar la página
window.onload = verificarToken();

// Código existente


menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
});



menuBtn.addEventListener("click",(e)=>{
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class",isOpen ? "ri-close-line" : "ri-menu-line")
});

navLinks.addEventListener("click",(e)=>{
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class","ri-menu-line");
});

const scrollRevealOption = {
    origin: "bottom",
    distance: "50px",
    duration: 2000,
};

ScrollReveal().reveal(".header_image img", {
    ...scrollRevealOption,
    origin: "right"
});

ScrollReveal().reveal(".header_content p", {
    ...scrollRevealOption,
    delay: 500,
});
ScrollReveal().reveal(".header_content h1", {
    ...scrollRevealOption,
    delay: 1000,
});
ScrollReveal().reveal(".header_btns", {
    ...scrollRevealOption,
    delay: 1500,
});
ScrollReveal().reveal(".destination__card", {
    ...scrollRevealOption,
    interval: 500,
});

function limpiarLocalStorage() {
    localStorage.clear(); // Elimina todos los datos almacenados en localStorage
    console.log("Local storage eliminado.");
}

// Función para mostrar u ocultar el chatbot
chatbotBtn.addEventListener('click', () => {
    if (chatbotContainer.style.display === 'none' || chatbotContainer.style.display === '') {
        chatbotContainer.style.display = 'block'; // Muestra el chatbot
    } else {
        chatbotContainer.style.display = 'none'; // Oculta el chatbot
    }
});

function validarToken() {
    const token = localStorage.getItem('token'); 
    if (token) {        
        window.location.href='Horarios.html';
    } else {            
        showAlert3("Para continuar debe Iniciar sesión.");        
        setTimeout(function(){
            window.location.href='Login.html';                          
        }, 2000);
    }
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