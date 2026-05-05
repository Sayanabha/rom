const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`

export async function getGeminiReplies(lastMessage, context = '') {
  const prompt = `You are a witty, warm, and slightly flirty dating app assistant helping someone reply to a message.

Context: ${context}
Last message received: "${lastMessage}"

Generate exactly 3 short, natural reply suggestions. Each reply should:
- Be 1-2 sentences max
- Sound human, not robotic
- Be slightly playful but genuine
- Fit the tone of the message

Return ONLY a JSON array of 3 strings. No explanation. No markdown. Example:
["reply one", "reply two", "reply three"]`

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 200,
      },
    }),
  })

  if (!response.ok) throw new Error(`Gemini error: ${response.status}`)

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}