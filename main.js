// --- 1. MEMORIA DEL CHAT ---
// Variable global para guardar los últimos mensajes (el historial)
let chatHistory = [];

function toggleChat() {
    const container = document.getElementById('chat-container');
    if (container) {
        container.classList.toggle('chat-hidden');
    }
}

// --- 2. EFECTO DE ESCRITURA ---
function typeWriter(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    let i = 0;
    el.innerText = "";
    function type() {
        if (i < text.length) {
            el.innerText += text.charAt(i);
            i++;
            const container = document.getElementById('chat-messages');
            container.scrollTop = container.scrollHeight;
            setTimeout(type, 15); 
        }
    }
    type();
}

// --- 3. ENVÍO DE MENSAJES CON HISTORIAL ---
async function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (!msg) return;

    // Añadimos el mensaje del usuario visualmente
    addMessage(msg, 'user');
    input.value = '';

    // AGREGAR A LA MEMORIA: Guardamos lo que dijo el usuario
    chatHistory.push({ role: "user", content: msg });

    // Limitamos la memoria a los últimos 6 mensajes para no saturar la API
    if (chatHistory.length > 6) chatHistory.shift();

    const botId = addMessage('...', 'bot');

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // ENVIAMOS EL HISTORIAL COMPLETO, NO SOLO EL MENSAJE SUELTO
            body: JSON.stringify({ history: chatHistory }) 
        });
        
        const data = await res.json();
        
        // AGREGAR A LA MEMORIA: Guardamos la respuesta del bot
        chatHistory.push({ role: "assistant", content: data.reply });
        
        typeWriter(botId, data.reply);

    } catch (error) {
        console.error("Error:", error);
        document.getElementById(botId).innerText = "Error de conexión.";
    }
}

// --- 4. UTILIDADES ---
function addMessage(text, sender) {
    const box = document.getElementById('chat-messages');
    if (!box) return;
    
    const div = document.createElement('div');
    const id = "m-" + Math.random().toString(36).slice(2, 7);
    div.id = id;
    div.className = `message ${sender}`;
    div.innerText = text;
    box.appendChild(div);
    
    // Scroll suave al añadir mensaje
    box.scrollTo({
        top: box.scrollHeight,
        behavior: 'smooth'
    });
    
    return id;
}

function handleKeyPress(e) { 
    if (e.key === 'Enter') sendMessage(); 
}

// --- 5. BIENVENIDA ---
window.onload = () => {
    setTimeout(() => {
        const bid = addMessage("...", "bot");
        typeWriter(bid, "¡Hola! Soy el asistente de Mant-enimiento. ¿Cómo puedo ayudarte hoy?");
    }, 1500);
};