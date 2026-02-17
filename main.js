function toggleChat() {
    const container = document.getElementById('chat-container');
    if (container) {
        container.classList.toggle('chat-hidden');
    } else {
        console.error("No se encontró el elemento con ID 'chat-container'");
    }
}
// Variable global para guardar la conversación (Memoria)
let chatHistory = [];

async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    // Guardamos el mensaje del usuario en la memoria
    chatHistory.push({ role: "user", content: message });

    // Si la memoria es muy larga, cortamos para quedarnos con los últimos 6 (3 pares)
    if (chatHistory.length > 6) chatHistory.shift();

    const botId = addMessage('...', 'bot');

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // ENVIAMOS TODA LA MEMORIA, NO SOLO EL MENSAJE
            body: JSON.stringify({ history: chatHistory }) 
        });
        
        const data = await res.json();
        
        // Guardamos la respuesta del bot en la memoria
        chatHistory.push({ role: "assistant", content: data.reply });
        
        typeWriter(botId, data.reply);
    } catch {
        document.getElementById(botId).innerText = "Error de conexión.";
    }
}