// Este archivo NO lo ve el usuario, se ejecuta en los servidores de Vercel
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Solo POST' });

    const { message } = req.body;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}` // Vercel sacará esto de la configuración que hiciste
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Eres un asistente amable para mi sitio web. Responde de forma clara y fluida." },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: 'Error en la conexión con la IA' });
    }
}