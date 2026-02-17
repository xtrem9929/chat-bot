// api/chat.js
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { message } = req.body;

    // AQUÍ DEFINES LA INFORMACIÓN DE TU PÁGINA
    const informacionDeMiPagina = `
        Nombre del sitio: Mi Portafolio Creativo.
        Servicios: Diseño web, ilustración digital y edición de video.
        Contacto: correo@ejemplo.com.
        Ubicación: Ica, Perú.
        (Agrega aquí todo el texto que quieras que el bot sepa)
    `;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: `Eres un asistente exclusivo de la página web. 
                        REGLAS CRÍTICAS:
                        1. Solo puedes responder preguntas basadas en esta información: ${informacionDeMiPagina}.
                        2. Si el usuario pregunta algo que NO está en esa información (ej. política, clima, recetas, otros temas), responde amablemente: "Lo siento, solo puedo ayudarte con información sobre este sitio web".
                        3. No inventes datos.
                        4. Responde de forma breve y profesional.` 
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.1 // Bajamos la temperatura para que sea menos creativo y más preciso
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
}