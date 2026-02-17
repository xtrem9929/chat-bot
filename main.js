// Abrir y cerrar el chat
function toggleChat() {
    const container = document.getElementById('chat-container');
    container.classList.toggle('chat-hidden');
}

// Enviar mensaje
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;

    // 1. Añadimos el mensaje del usuario (este NO se toca más)
    addMessage(message, 'user');
    input.value = '';

    // 2. Creamos la burbuja del bot con "Escribiendo..." y guardamos SU ID específico
    const botMsgId = addMessage('Escribiendo...', 'bot');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        
        // 3. ACTUALIZACIÓN CRÍTICA: Buscamos SOLO la burbuja de "Escribiendo..." por su ID
        const botBubble = document.getElementById(botMsgId);
        if (botBubble) {
            botBubble.innerText = data.reply;
        }

    } catch (error) {
        const botBubble = document.getElementById(botMsgId);
        if (botBubble) {
            botBubble.innerText = "Lo siento, hubo un error de conexión.";
        }
    }
}

// Función para añadir mensajes (Crea elementos nuevos siempre)
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    
    // Creamos el contenedor del mensaje
    const div = document.createElement('div');
    const id = "msg-" + Math.random().toString(36).substr(2, 9); // ID aleatorio único
    
    div.id = id;
    div.className = `message ${sender}`;
    div.innerText = text;
    
    chatMessages.appendChild(div);
    
    // Scroll automático al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return id; // Retornamos el ID para saber cuál editar luego
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}