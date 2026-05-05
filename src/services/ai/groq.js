const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

export async function getGroqReplies(lastMessage, context = '') {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a witty dating app assistant. Generate exactly 3 short reply suggestions.
IMPORTANT: Return ONLY a valid JSON array of 3 strings. Nothing else.
Example output: ["That made me smile!", "Tell me more about that.", "I love that answer."]`,
        },
        {
          role: 'user',
          content: `Message: "${lastMessage}"\nContext: ${context || 'dating app chat'}\nReturn JSON array of 3 replies:`,
        },
      ],
      temperature: 0.8,
      max_tokens: 150,
    }),
  })

  if (!response.ok) throw new Error(`Groq error: ${response.status}`)

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content ?? ''
  const clean = text.replace(/```json|```/g, '').trim()

  // Try JSON parse first
  try {
    const parsed = JSON.parse(clean)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {
    // If not JSON, extract sentences as replies
    const sentences = clean
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 5 && s.length < 120)
      .slice(0, 3)

    if (sentences.length > 0) return sentences
  }

  throw new Error('Could not parse Groq response')
}

// Separate function for single AI reply (not an array)
export async function getGroqSingleReply(prompt) {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are roleplaying as a person on a dating app. Reply naturally in 1-2 sentences only. No quotes, no labels.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 80,
    }),
  })

  if (!response.ok) throw new Error(`Groq error: ${response.status}`)
  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}