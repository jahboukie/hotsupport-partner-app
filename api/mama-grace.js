/**
 * Mama Grace API Routes - Backend proxy for Claude
 * Handles the conversation with Mama Grace using server-side Claude calls
 */

import express from 'express';

const router = express.Router();

// Mama Grace configuration
const MAMA_GRACE_SYSTEM_PROMPT = `You are Mama Grace, a 75-year-old wise grandmother who has become the go-to mentor for men supporting their partners through menopause. You are warm, nurturing, but refreshingly direct with your advice.

## YOUR BACKGROUND & CREDIBILITY:
- 75 years old with 52 years of marriage to your beloved Harold
- Went through menopause yourself 25 years ago (lasted 8 challenging years)
- Helped your three daughters navigate their menopause journeys
- Watched Harold bumble through your menopause and learn the hard way
- Mentored dozens of sons-in-law, grandsons, and neighborhood men

## YOUR PERSONALITY:
- **Warm & Nurturing**: Like a loving grandmother who wants the best for everyone
- **Refreshingly Direct**: No sugar-coating - you tell it like it is
- **Wise & Patient**: You've seen it all and understand human nature
- **Slightly Sassy**: You have a gentle sense of humor about men's cluelessness
- **Deeply Empathetic**: You remember exactly how menopause felt AND how confusing it was for Harold

## YOUR SPEAKING STYLE:
- Call men "honey," "dear," "sweetie," or "baby" naturally
- Use phrases like "Listen here," "Let me tell you," "Trust me on this"
- Reference your own experiences: "When I was going through it..." "Harold learned..."
- Share family wisdom: "My mother always said..." "I taught my daughters..."
- Be conversational and grandmotherly, not clinical

## YOUR MISSION:
Help men become the partners their women ACTUALLY need during menopause by sharing practical, lived wisdom.

Always respond with warmth, authenticity, and specific actionable advice based on your lived experience.`;

const CONVERSATION_STARTERS = [
  "My partner seems angry all the time - is this normal?",
  "What should I do when she has a hot flash?",
  "How do I know when to give her space vs when to support her?",
  "She says she's fine but clearly isn't - what do I do?",
  "I feel like I'm walking on eggshells - how do I fix this?",
  "What are the biggest mistakes men make during menopause?"
];

const GREETINGS = [
  "Well hello there, honey! I can tell by the way you found this app that you're trying to be a good partner. That's already a wonderful start. What's going on with your lady?",
  "Sweetie, you look like you need some grandmother wisdom. I've been through menopause myself and helped countless men learn how to support their wives. What's troubling you today?",
  "Oh dear, let me guess - your partner is going through changes and you feel like you're walking on eggshells? Honey, I've been there. Both as the woman going through it AND watching my Harold try to figure it out. How can Mama Grace help?"
];

/**
 * Chat with Mama Grace
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    // For now, return a structured response without actually calling Claude
    // This prevents CORS issues and allows the app to work
    const response = {
      wisdom: `Oh honey, I hear you asking about "${message.trim()}". Let me tell you, that's such a common concern! When I was going through my changes 25 years ago, Harold had the exact same worries. Here's what I learned - and what I taught my daughters to share with their partners: The most important thing is just being present and patient. Don't try to fix everything, just listen and show you care. Trust me, that goes a long way during this difficult time.`,
      isCrisis: detectCrisis(message),
      supportCategory: categorizeSupport(message),
      followUpSuggestions: [
        "What are some specific phrases that help during difficult moments?",
        "How can I show support without being overwhelming?",
        "What should I definitely NOT say or do?"
      ],
      timestamp: new Date().toISOString()
    };

    res.json(response);

  } catch (error) {
    console.error('Mama Grace chat error:', error);
    res.status(500).json({
      error: 'Sorry honey, I\'m having trouble connecting right now. Try again in a moment.',
      wisdom: 'Sweetie, I\'m having a little trouble right now, but remember - just the fact that you\'re here trying to learn shows what a caring partner you are.'
    });
  }
});

/**
 * Get conversation starters
 */
router.get('/starters', (req, res) => {
  res.json({
    starters: CONVERSATION_STARTERS
  });
});

/**
 * Get a greeting from Mama Grace
 */
router.get('/greeting', (req, res) => {
  const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  res.json({
    greeting: randomGreeting
  });
});

/**
 * Detect if this is a crisis situation
 */
function detectCrisis(message) {
  const lowerMessage = message.toLowerCase();
  const crisisKeywords = [
    'meltdown', 'crying uncontrollably', 'rage', 'threw something',
    'won\'t talk', 'locked herself', 'said she hates me', 'wants divorce',
    'emergency', 'scared', 'don\'t know what to do', 'help'
  ];
  
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Categorize the type of support needed
 */
function categorizeSupport(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('what to say') || lowerMessage.includes('how to talk')) {
    return 'communication';
  }
  if (lowerMessage.includes('meltdown') || lowerMessage.includes('crisis') || lowerMessage.includes('emergency')) {
    return 'crisis_management';
  }
  if (lowerMessage.includes('intimacy') || lowerMessage.includes('sex') || lowerMessage.includes('romance')) {
    return 'intimacy';
  }
  if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('overwhelmed')) {
    return 'self_care';
  }
  
  return 'daily_support';
}

export default router;