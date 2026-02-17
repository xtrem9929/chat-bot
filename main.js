function toggleChat() {
    const container = document.getElementById('chat-container');
    container.classList.toggle('chat-hidden');
}

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

// Esta función es la que se activa cuando el usuario hace clic en "Enviar"
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;

    // 1. Mostrar el mensaje del usuario en la burbuja de chat
    addMessage(message, 'user');
    input.value = '';

    // 2. Mostrar un mensaje temporal de "Pensando..."
    const loadingId = addMessage('Escribiendo...', 'bot');

    try {
        // 3. LLAMADA MÁGICA: Aquí llamamos a tu función de Vercel
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // 4. Reemplazar "Escribiendo..." con la respuesta real de la IA
        updateMessage(loadingId, data.reply);

    } catch (error) {
        updateMessage(loadingId, "Ups, algo salió mal. Inténtalo de nuevo.");
    }
}

// Funciones auxiliares (asegúrate de tenerlas)
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
    const msgElement = document.getElementById(id);
    if (msgElement) msgElement.innerText = newText;
}

// Función para abrir/cerrar el chat
function toggleChat() {
    const container = document.getElementById('chat-container');
    container.classList.toggle('chat-hidden');
}