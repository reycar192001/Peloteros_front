const msgerForm = get(".msger-imputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const BOT_IMG = "/Recursos/bot.png";
const PERSON_IMG = "/Recursos/user.png";
const BOT_NAME = "BOT";
const PERSON_NAME = "Usuario";

const prompts = [
    ["hola", "hey", "buenos días", "buenas tardes"],
    ["cómo estás", "cómo te va", "cómo van las cosas"],
    ["como puedo reservar una cancha","reserva","reservas","si","reservar","quiero reservar","como hago una reserva","hacer reserva","como reservar", "donde puedo reservar una cancha", "me gustaría hacer una reserva","como puedo hacer una reserva"],
    ["qué horarios están disponibles", "cuáles son los horarios disponibles", "horarios de las canchas","quiero saber los horarios","quiero saber los horarios disponibles"],
    ["cuál es el precio de la cancha", "precio de la cancha", "cuánto cuesta reservar una cancha"],
    ["necesito ayuda", "ayúdame", "me puedes ayudar"],
    ["quién eres", "eres un bot", "quién te creó"],
    ["adiós", "hasta luego", "nos vemos"],
    ["gracias", "muchas gracias", "te agradezco"],
    ["dónde está la cancha", "ubicación de la cancha"],
    ["cómo puedo cancelar mi reserva", "cancelar reserva", "quiero cancelar mi reserva"]
];
 
const replies = [
    ["¡Hola! ¿En qué puedo ayudarte con la reserva de canchas?"],
    ["Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte con las reservas?"],
    ["Para reservar una cancha, puedes hacerlo directamente desde <a href='http://127.0.0.1:5500/Horarios.html' target='_blank' style='color: #FFC300;'>este enlace</a>."],
    ["Los horarios disponibles varían. Puedes consultar los horarios exactos en la página de reservas <a href='http://127.0.0.1:5500/Horarios.html' target='_blank' style='color: #FFC300;'>aquí</a>."],
    ["El precio depende de la cancha y el horario. Puedes ver todos los precios y hacer tu reserva <a href='https://tulinkderecervas.com' target='_blank' style='color: #FFC300;'>aquí</a>."],
    ["Claro, ¿en qué puedo asistirte con tu reserva?"],
    ["Soy tu asistente para ayudarte con las reservas de canchas. ¿Qué necesitas saber?"],
    ["¡Hasta luego! Espero que hayas encontrado la información que necesitas para tu reserva."],
    ["¡De nada! Si necesitas más ayuda, no dudes en preguntar."],
    ["La cancha está ubicada en [dirección]. Para más detalles, puedes revisar la página de reservas <a href='http://127.0.0.1:5500/Nosotros.html' target='_blank' style='color: #FFC300;'>aquí</a>."],
    ["Para cancelar tu reserva, visita la página de reservas y selecciona la opción de cancelación. Aquí está el enlace directo: <a href='https://tulinkderecervas.com' target='_blank' style='color: #FFC300;'>Cancelar reserva</a>."]
];

const alternative = [
    ["Lo siento, no entendí eso. ¿Te gustaría saber más sobre las reservas de canchas?"],
    ["Por favor, prueba de nuevo. ¿En qué puedo ayudarte con las reservas?"],
    ["Lo siento, no estoy seguro de lo que necesitas. ¿Puedo ayudarte con una reserva?"]
];

const robot = ["Soy un bot aquí para ayudarte con tus reservas de canchas", "No soy un robot, soy un asistente virtual"];

msgerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const msgText = msgerInput.value;
    if (!msgText) return;
    msgerInput.value = "";
    addChat(PERSON_NAME, PERSON_IMG, "right", msgText);
    output(msgText);
});

function output(input) {
    let product;
    let text = input
        .toLowerCase()
        .replace(/[^a-zA-Záéíóúñ0-9\s]/g, "")
        .trim();
    
    product = compare(prompts, replies, text);

    if (!product) {
        if (text.match(/thank/gi)) {
            product = "¡De nada! Si tienes más preguntas, aquí estaré.";
        } else if (text.match(/(robot|bot|asistente)/gi)) {
            product = robot[Math.floor(Math.random() * robot.length)];
        } else {
            product = alternative[Math.floor(Math.random() * alternative.length)];
        }
    }

    const delay = Math.max(input.split(" ").length * 100, 500);
    setTimeout(() => {
        addChat(BOT_NAME, BOT_IMG, "left", product);
    }, delay);
}

function compare(promptsArray, repliesArray, string) {
    for (let x = 0; x < promptsArray.length; x++) {
        for (let y = 0; y < promptsArray[x].length; y++) {
            const regex = new RegExp(`\\b${promptsArray[x][y]}\\b`, "i");
            if (regex.test(string)) {
                const replies = repliesArray[x];
                return replies[Math.floor(Math.random() * replies.length)];
            }
        }
    }
    return null;
}

function addChat(name, img, side, text) {
    const msgHTML = `
    <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image:url(${img})"></div>
        <div class="msg-bubble">
            <div class="msg-info">
                <div class="msg-info-name">${name}</div>
                <div class="msg-info-time">${formatDate(new Date())}</div>
            </div>
            <div class="msg-text">${text}</div>
        </div>
    </div>`;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}