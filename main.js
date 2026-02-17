function toggleChat() {
    const container = document.getElementById('chat-container');
    container.classList.toggle('chat-hidden');
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    // Mostrar mensaje del usuario
    addMessage(message, 'user');
    input.value = '';

    // Mostrar "Escribiendo..."
    const loadingId = addMessage('...', 'bot');

    // AQUÍ CONECTAREMOS LA IA LUEGO
    // Por ahora simulamos una respuesta fluida
    setTimeout(() => {
        updateMessage(loadingId, "¡Entendido! Estoy procesando tu solicitud de forma fluida.");
    }, 1000);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    const id = Date.now();
    div.id = id;
    div.className = `message ${sender}`;
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

function updateMessage(id, newText) {
    document.getElementById(id).innerText = newText;
}