function toggleChat() {
    document.getElementById('chat-container').classList.toggle('chat-hidden');
}

// Efecto de escribir letra por letra
function typeWriter(id, text) {
    const el = document.getElementById(id);
    let i = 0;
    el.innerText = "";
    function type() {
        if (i < text.length) {
            el.innerText += text.charAt(i);
            i++;
            const container = document.getElementById('chat-messages');
            container.scrollTop = container.scrollHeight;
            setTimeout(type, 15); // Velocidad
        }
    }
    type();
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, 'user');
    input.value = '';
    const botId = addMessage('...', 'bot');

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        typeWriter(botId, data.reply);
    } catch {
        document.getElementById(botId).innerText = "Error de conexión.";
    }
}

function addMessage(text, sender) {
    const box = document.getElementById('chat-messages');
    const div = document.createElement('div');
    const id = "m-" + Math.random().toString(36).slice(2, 7);
    div.id = id;
    div.className = `message ${sender}`;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return id;
}

function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }

// Bienvenida automática
window.onload = () => {
    setTimeout(() => {
        const bid = addMessage("...", "bot");
        typeWriter(bid, "¡Hola! Soy el asistente de Mant-enimiento. ¿Cómo puedo ayudarte hoy?");
    }, 1500);
};