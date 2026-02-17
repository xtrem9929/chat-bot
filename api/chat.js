export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

    const { message } = req.body;

    // --- CONFIGURACIÓN DE TU INFORMACIÓN ---
    const informacionDeLaPagina = `
        Aquí pon toda la información de tu web:
        - Nombre: Mant-enimiento
        - Qué haces: servicio de arreglo de celulares, servicios de todo tipo 
        - Contacto: juanito@mameluco.com
        - Horarios: [Si aplica]
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
                        content: `Eres un asistente virtual estricto. 
                        Solo puedes responder dudas usando esta información: ${informacionDeLaPagina}.
                        Si preguntan algo fuera de tema, di: "Lo siento, solo puedo responder dudas sobre este sitio web".
                        Sé amable, breve y responde en español.` 
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.1, // Menos creatividad, más precisión
                max_tokens: 300
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);

        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Error al conectar con la IA. Intenta más tarde." });
    }
}