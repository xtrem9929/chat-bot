// Función para abrir/cerrar
function toggleChat() {
    const container = document.getElementById('chat-container');
    container.classList.toggle('chat-hidden');
}

// Función para enviar mensajes
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;

    // 1. Mostrar mensaje del usuario
    addMessage(message, 'user');
    input.value = '';

    // 2. Crear burbuja de "Escribiendo..." y guardar su ID
    const botMsgId = addMessage('Escribiendo...', 'bot');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        
        // 3. Reemplazar "Escribiendo..." por la respuesta real
        updateMessage(botMsgId, data.reply);

    } catch (error) {
        updateMessage(botMsgId, "Lo siento, hubo un error de conexión.");
    }
}

// Auxiliar: Añadir mensajes al contenedor
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    const id = "msg-" + Date.now(); // ID único
    
    div.id = id;
    div.className = `message ${sender}`;
    div.innerText = text;
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

// Auxiliar: Actualizar un mensaje específico
function updateMessage(id, newText) {
    const msgElement = document.getElementById(id);
    if (msgElement) msgElement.innerText = newText;
}

// Permitir enviar con la tecla Enter
function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}