import { getGeminiReplies } from './gemini'
import { getGroqReplies, getGroqSingleReply } from './groq'
import { getFallbackReplies } from './fallback'

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Smart reply suggestions (returns 3 options)
 */
export async function getSmartReplies(lastMessage, context = '') {
  if (!lastMessage?.trim()) return []

  // 1. Try Gemini
  try {
    const replies = await getGeminiReplies(lastMessage, context)
    if (Array.isArray(replies) && replies.length > 0) return replies
  } catch (err) {
    console.warn('Gemini failed, trying Groq:', err.message)
  }

  await wait(200)

  // 2. Fallback to Groq
  try {
    const replies = await getGroqReplies(lastMessage, context)
    if (Array.isArray(replies) && replies.length > 0) return replies
  } catch (err) {
    console.warn('Groq failed, using fallback:', err.message)
  }

  // 3. Final fallback
  return getFallbackReplies(lastMessage)
}

/**
 * Persona-based reply (single message)
 */
export async function getPersonaReply(prompt, persona) {
  // Skip Gemini to avoid rate limits
  try {
    const reply = await getGroqSingleReply(prompt, persona)
    if (reply) return reply
  } catch (err) {
    console.warn('Groq persona reply failed:', err.message)
  }

  // Final fallback
  const fallbacks = [
    "Ha, okay that actually made me smile.",
    "Tell me more, I'm genuinely curious.",
    "That's such an interesting way to put it.",
    "Okay wait, I need context for that.",
    "I was not expecting that. I like it.",
  ]

  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

/**
 * Icebreaker generator (returns 3 messages)
 */
export async function generateIcebreakers(myProfile, theirProfile) {
  if (!myProfile || !theirProfile) return []

  const prompt = `
You are a witty dating app assistant. Generate 3 unique icebreaker opening messages.

My profile:
- Username: ${myProfile.username}
- Looking for: ${myProfile.looking_for}
- Bio: "${myProfile.bio}"

Their profile:
- Username: ${theirProfile.username}
- Age: ${theirProfile.age}
- Looking for: ${theirProfile.looking_for}
- Bio: "${theirProfile.bio}"

Rules:
- Each message is 1–2 sentences max
- Reference something specific from their bio
- Witty, warm, never cringe
- No "hey" or generic openers
- Sound like a real person, not AI

Return ONLY a JSON array of 3 strings.
`

  // 1. Try Gemini
  try {
    const replies = await getGeminiReplies(prompt)
    if (Array.isArray(replies) && replies.length > 0) return replies
  } catch (err) {
    console.warn('Gemini icebreaker failed, trying Groq:', err.message)
  }

  await wait(200)

  // 2. Fallback to Groq
  try {
    const replies = await getGroqReplies(prompt)
    if (Array.isArray(replies) && replies.length > 0) return replies
  } catch (err) {
    console.warn('Groq icebreaker failed, using fallback:', err.message)
  }

  // 3. Final fallback (slightly personalized)
  return [
    `${theirProfile.username}, your bio genuinely stood out — what’s the story behind it?`,
    `I feel like your bio has layers. Which part of it is most “you”?`,
    `Something tells me we’d get along — your bio kind of gave that away.`,
  ]
}