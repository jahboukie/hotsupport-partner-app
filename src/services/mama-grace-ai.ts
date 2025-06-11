/**
 * Mama Grace AI Service - Pure Human-Claude Collaboration
 * Connects partners with grandmother wisdom through Claude
 */

import { MAMA_GRACE_CONFIG } from '../config/mama-grace-master-prompt.js';
import { apiClient } from './api-client';

export class MamaGraceAI {
  private apiKey: string;
  private baseUrl: string = 'https://api.anthropic.com/v1/messages';
  private model: string = 'claude-3-sonnet-20240229';

  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!this.apiKey) {
      throw new Error('Anthropic API key not found in environment variables');
    }
  }

  /**
   * Get wisdom from Mama Grace
   */
  async getWisdom(userMessage: string, context?: ConversationContext): Promise<MamaGraceResponse> {
    try {
      // Use our API client to communicate with the backend
      const response = await apiClient.chatWithMamaGrace(userMessage, context);
      
      return {
        wisdom: response.wisdom,
        isCrisis: response.isCrisis,
        supportCategory: response.supportCategory,
        followUpSuggestions: response.followUpSuggestions,
        timestamp: response.timestamp
      };

    } catch (error) {
      console.error('Mama Grace AI Error:', error);
      return this.getEmergencyResponse(userMessage);
    }
  }

  /**
   * Detect crisis situations that need immediate attention
   */
  private detectCrisis(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return MAMA_GRACE_CONFIG.crisisKeywords.some(keyword => 
      lowerMessage.includes(keyword.replace('_', ' '))
    );
  }

  /**
   * Build conversation context for Claude
   */
  private buildConversation(
    userMessage: string, 
    context?: ConversationContext, 
    isCrisis: boolean = false
  ): any[] {
    const messages = [];

    // Add context if provided
    if (context?.previousMessages) {
      messages.push(...context.previousMessages);
    }

    // Add crisis context if needed
    if (isCrisis) {
      messages.push({
        role: 'user',
        content: `Mama Grace, this seems like a crisis situation. Here's what's happening: ${userMessage}`
      });
    } else {
      messages.push({
        role: 'user',
        content: userMessage
      });
    }

    return messages;
  }

  /**
   * Categorize the type of support needed
   */
  private categorizeSupport(message: string): string {
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
    if (lowerMessage.includes('relationship') || lowerMessage.includes('future') || lowerMessage.includes('marriage')) {
      return 'long_term';
    }
    
    return 'daily_support';
  }

  /**
   * Generate follow-up suggestions based on the conversation
   */
  private generateFollowUpSuggestions(message: string, isCrisis: boolean): string[] {
    if (isCrisis) {
      return [
        "What should I do if this happens again?",
        "How can I prepare better for difficult moments?",
        "When should I be worried and seek professional help?"
      ];
    }

    const category = this.categorizeSupport(message);
    
    switch (category) {
      case 'communication':
        return [
          "What are some other things I should never say?",
          "How do I know when she wants to talk vs when she needs space?",
          "What are the magic phrases that always work?"
        ];
      
      case 'intimacy':
        return [
          "How has intimacy changed for other couples during menopause?",
          "What can I do to stay connected without pressure?",
          "How do I show affection when she's not interested in sex?"
        ];
      
      case 'daily_support':
        return [
          "What are some small daily gestures that make a big difference?",
          "How can I anticipate her needs before she has to ask?",
          "What practical things should I have ready at home?"
        ];
      
      default:
        return [
          "What else should I know about supporting her?",
          "How can I take better care of myself during this time?",
          "What are the most common mistakes men make?"
        ];
    }
  }

  /**
   * Emergency response when AI service is down
   */
  private getEmergencyResponse(message: string): MamaGraceResponse {
    const isCrisis = this.detectCrisis(message);
    
    if (isCrisis) {
      return {
        wisdom: "Honey, I'm having trouble connecting right now, but if this is a crisis, here's what you need to do immediately: Stay calm, be present with her, don't try to fix or reason - just listen and hold space. If she's in real danger, don't hesitate to call a professional. I'll be back online soon to help you more.",
        isCrisis: true,
        supportCategory: 'crisis_management',
        followUpSuggestions: [
          "Try asking Mama Grace again in a moment",
          "If this is urgent, consider calling a mental health professional",
          "Remember: just being present and caring is often enough"
        ],
        timestamp: new Date().toISOString()
      };
    }

    return {
      wisdom: "Sweetie, I'm having a little trouble connecting right now - must be my internet acting up! Try asking me again in a moment. In the meantime, remember that just the fact you're here trying to learn how to support her better shows what a caring partner you are.",
      isCrisis: false,
      supportCategory: 'daily_support',
      followUpSuggestions: [
        "Try asking Mama Grace again in a moment",
        "Browse the community for similar situations",
        "Check out the quick tips while you wait"
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get a random greeting from Mama Grace
   */
  async getGreeting(): Promise<string> {
    try {
      return await apiClient.getGreeting();
    } catch (error) {
      console.error('Error getting greeting:', error);
      return "Well hello there, honey! I can tell by the way you found this app that you're trying to be a good partner. That's already a wonderful start. What's going on with your lady?";
    }
  }

  /**
   * Get conversation starters for new users
   */
  async getConversationStarters(): Promise<string[]> {
    try {
      return await apiClient.getConversationStarters();
    } catch (error) {
      console.error('Error getting conversation starters:', error);
      return [
        "My partner seems angry all the time - is this normal?",
        "What should I do when she has a hot flash?",
        "How do I know when to give her space vs when to support her?",
        "She says she's fine but clearly isn't - what do I do?",
        "I feel like I'm walking on eggshells - how do I fix this?",
        "What are the biggest mistakes men make during menopause?"
      ];
    }
  }
}

// Type definitions
export interface ConversationContext {
  previousMessages?: Array<{role: string, content: string}>;
  partnerAge?: number;
  menopauseStage?: string;
  relationshipLength?: number;
  previousTopics?: string[];
}

export interface MamaGraceResponse {
  wisdom: string;
  isCrisis: boolean;
  supportCategory: string;
  followUpSuggestions: string[];
  timestamp: string;
}

// Export singleton instance
export const mamaGraceAI = new MamaGraceAI();