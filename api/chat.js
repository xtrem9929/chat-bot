export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { message } = req.body;

    const informacionDeLaPagina = `
        Nombre: Mant-enimiento.
        Servicios: Arreglo de celulares y servicios técnicos de todo tipo.
        Contacto: juanito@mameluco.com.
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
                        content: `Eres el asistente de Mant-enimiento. Solo responde sobre: ${informacionDeLaPagina}. Si preguntan otra cosa, di que no puedes ayudar con eso.` 
                    },
                    { role: "user", content: message }
                ],
                temperature: 0.1
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ reply: "Error de conexión." });
    }
}