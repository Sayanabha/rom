const SMART_REPLIES = {
  greeting: [
    "Hey! Finally, someone interesting shows up.",
    "Oh hi, I was just thinking about reaching out.",
    "Hey you! This feels like the start of something.",
  ],
  question: [
    "That is actually a great question. Let me think.",
    "Okay I love that you asked that.",
    "Hmm, honestly? I have been thinking about that too.",
  ],
  compliment: [
    "That genuinely made me smile, thank you.",
    "You are going to make me blush.",
    "Okay stop, you are too sweet.",
  ],
  default: [
    "Ha, okay I did not expect that.",
    "Tell me more, I am intrigued.",
    "That is such a you thing to say.",
    "Wait, really? I need context.",
    "Okay this is already a great conversation.",
  ],
}

function detectIntent(message) {
  const lower = message.toLowerCase()
  if (/^(hey|hi|hello|sup|yo|hiya)/.test(lower)) return 'greeting'
  if (lower.includes('?')) return 'question'
  if (/(beautiful|cute|amazing|love|great|awesome)/.test(lower)) return 'compliment'
  return 'default'
}

export function getFallbackReplies(lastMessage = '') {
  const intent = detectIntent(lastMessage)
  const pool = SMART_REPLIES[intent]
  // Return 3 random unique replies
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3)
}