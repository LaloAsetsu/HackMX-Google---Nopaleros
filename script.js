document.addEventListener('DOMContentLoaded', () => {
const chatbotContainer = document.getElementById('chatbot-container');
const openChatbotButton = document.getElementById('open-chatbot');
const closeChatbotButton = document.getElementById('close-chatbot');
const sendMessageButton = document.getElementById('send-message');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

let conversationContext = {
    lastTopic: null,
    isOffTopic: false,
};

// Abrir el chatbot
openChatbotButton.addEventListener('click', () => {
    chatbotContainer.classList.add('show');
    openChatbotButton.style.display = 'none';
});

// Cerrar el chatbot
closeChatbotButton.addEventListener('click', () => {
    chatbotContainer.classList.remove('show');
    openChatbotButton.style.display = 'block';
});

// Enviar mensaje al chatbot
sendMessageButton.addEventListener('click', () => {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
    addMessage(userMessage, 'user');
    chatbotInput.value = '';
    generateResponse(userMessage);
    }
});

function normalizeText(text) {
    return text
    .toLowerCase()
    .normalize('NFD') // Normalizar para eliminar acentos
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-zA-Z0-9\s]/g, ''); // Eliminar caracteres especiales
}

// Generar la respuesta del chatbot basada en el contexto y la entrada
function generateResponse(message) {
    const normalizedMessage = normalizeText(message);
    const tokens = normalizedMessage.split(/\s+/);

    // Palabras clave relacionadas con fraudes, seguridad, phishing, etc.
    const securityKeywords = {
    phishing: ['phishing', 'correo', 'falso', 'robo', 'identidad', 'estafa', 'email'],
    malware: ['virus', 'malware', 'software malicioso', 'troyano', 'spyware'],
    seguridad: ['seguridad', 'privacidad', 'contraseñas', 'antivirus', 'protección'],
    fraude: ['fraudulento', 'estafa', 'peligroso', 'engañoso', 'inseguro'],
    paginas: ['sitio', 'web', 'pagina', 'dominio', 'enlace', 'url', 'https', 'http'],
    pregunta: ['por', 'que', 'porque', 'qué', 'cómo', 'cuándo', 'dónde', 'quién'],
    };

    const greetings = ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'qué tal'];
    const farewells = ['adiós', 'hasta luego', 'nos vemos', 'chao'];
    const helpKeywords = ['ayuda', 'información', 'qué puedes hacer', 'qué sabes'];

    // Fragmentos de respuestas para diferentes temas
    const responseFragments = {
    saludo: [
        '¡Hola! ¿Cómo estás?', 
        '¡Buenos días! ¿En qué puedo ayudarte hoy?', 
        '¡Hola! ¿Tienes alguna pregunta sobre seguridad en línea?'
    ],
    phishing: [
        'El phishing es una técnica de fraude en la que alguien se hace pasar por una entidad confiable para obtener tus datos personales.',
        'Para evitar el phishing, nunca hagas clic en enlaces sospechosos y verifica siempre la dirección de email del remitente.',
        'El phishing suele utilizar correos electrónicos o sitios web falsos para engañarte. Siempre verifica la autenticidad de los mensajes.'
    ],
    malware: [
        'El malware es software diseñado para dañar o acceder a tu computadora sin permiso.',
        'Para protegerte del malware, usa un buen antivirus y no descargues archivos de sitios web dudosos.',
        'El malware puede robar tus datos o incluso cifrar tus archivos, como sucede con el ransomware.'
    ],
    seguridad: [
        'La seguridad en línea es esencial para proteger tu información personal y financiera.',
        'Usa contraseñas fuertes y únicas, y cambia tus contraseñas periódicamente.',
        'Asegúrate de navegar solo en sitios que tengan un certificado de seguridad válido (https).'
    ],
    fraude: [
        'Los sitios fraudulentos pueden intentar engañarte para que proporciones información personal o financiera.',
        'Verifica siempre la autenticidad de una página antes de ingresar datos sensibles.',
        'Los sitios peligrosos a menudo tienen errores ortográficos, dominios extraños o enlaces no seguros.'
    ],
    paginas: [
        'Un sitio web seguro suele tener un candado en la barra de direcciones y una URL que comienza con "https".',
        'Si la página tiene errores de gramática o solicita datos sensibles sin justificación, puede ser sospechosa.',
        'Para verificar si un sitio es seguro, busca un certificado SSL válido y revisa la URL cuidadosamente.'
    ],
    pregunta: [
        'Cuando preguntas "por qué", es importante considerar que un sitio puede ser fraudulento si tiene errores de seguridad.',
        'Un sitio puede parecer fraudulento si no tiene información de contacto clara o si solicita información sensible sin justificación.',
        'Recuerda que los sitios que no usan HTTPS son potencialmente peligrosos y pueden estar intentando robar tus datos.'
    ],
    desviacion: [
        'Parece que nos hemos desviado del tema. ¿Te gustaría hablar sobre la seguridad en línea?',
        'No estoy seguro de que eso esté relacionado con la seguridad en internet. ¿Hay algo más que quieras saber sobre fraudes o phishing?',
        'Ese es un tema interesante, pero creo que podemos regresar a hablar sobre cómo protegerte en línea. ¿Te interesa?'
    ],
    despedida: [
        '¡Adiós! Espero que la información te haya sido útil. Si tienes más preguntas, no dudes en volver.',
        '¡Hasta luego! Cuídate y navega de manera segura.',
        'Nos vemos pronto. Recuerda siempre verificar la seguridad de las páginas que visitas.'
    ],
    default: [
        'Lo siento, no entiendo tu pregunta. ¿Podrías darme más detalles?',
        'No estoy seguro de haber entendido. ¿Podrías reformular tu pregunta?',
        '¿Puedes darme más contexto sobre lo que estás preguntando?'
    ]
    };

    // Detectar el contexto y generar la respuesta adecuada
    let context = detectContext(tokens, securityKeywords, greetings, farewells, helpKeywords);

    // Si se detecta que el usuario está fuera del tema, actualiza el contexto
    if (context !== conversationContext.lastTopic && conversationContext.isOffTopic) {
    context = 'desviacion';
    }

    // Mantener el contexto actualizado
    conversationContext.lastTopic = context;
    conversationContext.isOffTopic = context === 'desviacion';

    // Generar una respuesta dinámica
    let response = generateDynamicResponse(context, responseFragments);

    // Mostrar la respuesta del chatbot
    setTimeout(() => addMessage(response, 'bot'), 500);
}

// Función para detectar el contexto
function detectContext(tokens, keywordDictionary, greetings, farewells, helpKeywords) {
    let contextMatches = {};

    // Detectar saludos y despedidas
    if (greetings.some(greeting => tokens.includes(greeting))) {
    return 'saludo';
    }
    if (farewells.some(farewell => tokens.includes(farewell))) {
    return 'despedida';
    }

    // Detectar solicitud de ayuda
    if (helpKeywords.some(help => tokens.includes(help))) {
    return 'seguridad';
    }

    // Buscar coincidencias de palabras clave por categoría
    for (const [context, keywords] of Object.entries(keywordDictionary)) {
    contextMatches[context] = tokens.filter(token => keywords.includes(token)).length;
    }

    // Comprobar si hay una pregunta
    const hasQuestion = tokens.some(token => keywordDictionary.pregunta.includes(token));
    if (hasQuestion) {
    return 'pregunta';
    }

    // Devolver el contexto con más coincidencias o 'default' si no se encuentra un contexto claro
    const detectedContext = Object.entries(contextMatches).reduce((a, b) => (b[1] > a[1] ? b : a));
    return detectedContext[1] > 0 ? detectedContext[0] : 'default';
}

// Función para generar una respuesta dinámica
function generateDynamicResponse(context, responseFragments) {
    const fragments = responseFragments[context] || responseFragments['default'];
    // Concatenar al menos dos fragmentos por lenguaje
    const response = fragments.sort(() => 0.5 - Math.random()).slice(0, 2).join(' ');
    return response;
}

// Agregar mensaje al contenedor de mensajes
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Enviar mensaje con la tecla Enter
chatbotInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
    sendMessageButton.click();
    }
});
});
