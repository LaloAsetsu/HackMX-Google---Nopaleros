
const keywords = [
    // Español
    "ganar dinero", "regístrate ahora", "¡aprovecha!", "promoción exclusiva", "oferta limitada",
    "acceso rápido", "contraseña", "banco", "cuenta", "confidencial", "clic aquí", "inversión segura",
    "sin costo", "te has ganado", "es un regalo", "haz clic", "última oportunidad", "información privada",
    "verificación de cuenta", "prueba gratuita", "compra ahora", "exclusivo para ti", "sorpresa", "urgente",
    "felicidades", "notificación de seguridad", "activar cuenta", "alerta de seguridad", "bono gratis",
    "dinero rápido", "consejo financiero", "sin riesgo", "solo por hoy", "asegúrate de obtener",
    "acceso exclusivo", "riesgo mínimo", "no pierdas esta oferta", "verifica tu identidad",
    "actualiza tu cuenta", "compra ya", "protección de cuenta", "confirma tu información",
    "limitada disponibilidad", "sin compromiso", "reembolso", "dinero seguro", "transacción garantizada",
    "seguro de inversión", "revisa tu cuenta", "oferta exclusiva", "promesa de ganancia", "transacción rápida",
    "dinero inmediato", "duplicar tus ganancias", "sin pagar nada", "notificación urgente", "activa ahora",
    "permanece seguro", "copia de seguridad", "protégete", "ahorra ahora", "verifica", "gratis",
    "sin costo alguno", "alerta de fraude", "suscripción gratis", "sin compromiso", "ganancias altas",
    "retorno garantizado", "incrementa tus ingresos", "juega y gana", "bono de bienvenida",
    "juegos de azar", "subasta", "puja", "gana tu premio", "obtén tu recompensa",

    // Inglés
    "make money", "sign up now", "don't miss out", "exclusive promotion", "limited offer", "fast access",
    "password", "bank", "account", "confidential", "click here", "safe investment", "free trial", "prize",
    "you won", "it's a gift", "click now", "last chance", "private information", "verify account",
    "exclusive for you", "congratulations", "security alert", "activate account", "free bonus", "quick money",
    "financial advice", "no risk", "only today", "secure access", "exclusive access", "no cost", "refund",
    "guaranteed transaction", "investment protection", "update your information", "limited availability",
    "money back", "immediate cash", "double your earnings", "risk-free", "urgent notification", "stay safe",
    "backup copy", "save now", "claim now", "no cost at all", "fraud alert", "free subscription", 
    "high earnings", "guaranteed return", "increase income", "gambling", "betting", "play and win",
    "welcome bonus", "chance games", "auction", "bid", "claim your prize", "get your reward"
];

const positiveKeywords = [
    // Español
    "maravilloso", "increíble", "sorpresa", "fantástico", "asegúrate", "exclusivo", "solamente hoy",
    "especial para ti", "no te lo pierdas", "único", "sin igual", "asombroso", "garantizado", "emocionante",
    "promoción única", "fabuloso", "exquisito", "excepcional", "lujoso", "premium", "revolucionario",
    "descuento especial", "personalizado", "hecho a la medida", "único en su clase",

    // Inglés
    "wonderful", "incredible", "surprise", "fantastic", "make sure", "exclusive", "only today",
    "special for you", "don't miss out", "unique", "one-of-a-kind", "amazing", "guaranteed", "exciting",
    "unique offer", "fabulous", "exquisite", "exceptional", "luxurious", "premium", "revolutionary",
    "special discount", "personalized", "custom made", "best of its kind"
];

// Frases exclamativas
const exclamatoryPattern = /!/g;

// Función para calcular el puntaje de la página
function scorePage(content) {
let score = 0;

// Búsqueda de palabras clave
keywords.forEach(keyword => {
    const occurrences = content.match(new RegExp(keyword, "gi")) || [];
    score += occurrences.length * 2;  // Cada coincidencia suma 2 puntos
});

// Detección de palabras positivas engañosas
positiveKeywords.forEach(keyword => {
    const occurrences = content.match(new RegExp(keyword, "gi")) || [];
    score -= occurrences.length;  // Palabras engañosas restan 1 punto
});

// Contar frases exclamativas
const exclamationCount = (content.match(exclamatoryPattern) || []).length;
score += exclamationCount;  // Cada exclamación suma 1 punto

// Detectar patrones de enlaces sospechosos
const linkMatches = content.match(/(http|https):\/\/[^\s]+(\.xyz|\.top|\.click|\.info|\.work|\.biz)/gi) || [];
score += linkMatches.length * 3;  // Enlaces sospechosos suman 3 puntos

// Evaluar el uso excesivo de mayúsculas
const capsMatches = content.match(/[A-Z\s]{6,}/g) || [];
score += capsMatches.length * 2;

// Detección de lenguaje engañoso (análisis de sentimiento básico)
const negativeWords = ["mal", "desastroso", "perdido", "robo", "engaño"];
const sentimentScore = negativeWords.reduce((count, word) => {
    const occurrences = content.match(new RegExp(word, "gi")) || [];
    return count + occurrences.length;
}, 0);
score += sentimentScore * 3;  // Palabras negativas suman 3 puntos

// Longitud del contenido
const contentLength = content.split(' ').length;  // Número de palabras
if (contentLength < 100) {
    score += 5;  // Si hay menos de 100 palabras, añade 5 puntos
}

// Proporción de enlaces externos
const totalLinks = content.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g) || [];
const externalLinks = totalLinks.filter(link => !link.includes(window.location.hostname));
if (externalLinks.length > 10) {
    score += (externalLinks.length - 10);  // Más de 10 enlaces externos añade puntos
}

return score;
}

// Función para determinar si la página es sospechosa
function isFraudulentPage(content) {
const fraudScore = scorePage(content);
return fraudScore >= 20; 
}


// Obtiene el contenido del texto de la página para analizar
const pageContent = document.body.innerText.toLowerCase();
if (isFraudulentPage(pageContent)) {
  const blurOverlay = document.createElement("div");
  blurOverlay.style.position = "fixed";
  blurOverlay.style.top = "0";
  blurOverlay.style.left = "0";
  blurOverlay.style.width = "100%";
  blurOverlay.style.height = "100%";
  blurOverlay.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  blurOverlay.style.filter = "blur(8px)";
  blurOverlay.style.zIndex = "9998";
  document.body.appendChild(blurOverlay);

  // Crea el contenedor de advertencia
  const warningDiv = document.createElement("div");
  warningDiv.id = "fraud-warning";
  warningDiv.style.position = "fixed";
  warningDiv.style.top = "50%";
  warningDiv.style.left = "50%";
  warningDiv.style.transform = "translate(-50%, -50%)";
  warningDiv.style.backgroundColor = "white";  
  warningDiv.style.padding = "20px";
  warningDiv.style.border = "2px solid red";
  warningDiv.style.zIndex = "9999";
  warningDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  warningDiv.innerHTML = `
    <div class="warning-content" style="text-align: center;">
      <img src="https://i.pinimg.com/736x/f0/e0/07/f0e0072a056ff5a28ff3a15b2786d915.jpg" alt="Advertencia" style="width: 50px; height: 50px;">
      <p style="color: darkblue; font-weight: bold;">¡Este sitio podría ser fraudulento!</p>
      <button id="exit-button" style="color: black; font-weight: bold;">Salir</button>
    </div>
  `;
  
  document.body.appendChild(warningDiv);  // Agrega el contenedor al cuerpo

  // Evento para salir del sitio
  document.getElementById("exit-button").addEventListener("click", () => {
    window.location.href = "https://www.google.com";
  });

  // Abre popup.html en una nueva pestaña al hacer clic en el contenedor de advertencia
  warningDiv.addEventListener("click", () => {

    window.open(chrome.runtime.getURL("popup.html"), "_blank");

  });
}
