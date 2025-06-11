/**
 * useMamaGrace Hook - Connect with grandmother wisdom
 * Pure Human-Claude collaboration for menopause support
 */

import { useState, useCallback } from 'react';
import { mamaGraceAI, MamaGraceResponse, ConversationContext } from '../services/mama-grace-ai';

interface ChatMessage {
  id: string;
  role: 'user' | 'mama_grace';
  content: string;
  timestamp: string;
  isCrisis?: boolean;
  supportCategory?: string;
}

interface UseMamaGraceReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  askMamaGrace: (question: string) => Promise<void>;
  startNewConversation: () => void;
  getGreeting: () => string;
  getConversationStarters: () => string[];
}

export const useMamaGrace = (): UseMamaGraceReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Ask Mama Grace for wisdom
   */
  const askMamaGrace = useCallback(async (question: string) => {
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: question.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Build conversation context from previous messages
      const context: ConversationContext = {
        previousMessages: messages.slice(-6).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      };

      // Add realistic typing delay (1-3 seconds based on question length)
      const typingDelay = Math.max(1000, Math.min(3000, question.length * 50));
      await new Promise(resolve => setTimeout(resolve, typingDelay));

      // Get wisdom from Mama Grace
      const response: MamaGraceResponse = await mamaGraceAI.getWisdom(question, context);

      // Add Mama Grace's response
      const mamaGraceMessage: ChatMessage = {
        id: `mama_grace_${Date.now()}`,
        role: 'mama_grace',
        content: response.wisdom,
        timestamp: response.timestamp,
        isCrisis: response.isCrisis,
        supportCategory: response.supportCategory
      };

      setMessages(prev => [...prev, mamaGraceMessage]);

    } catch (err) {
      setError('I\'m having trouble connecting with Mama Grace right now. Please try again in a moment.');
      console.error('Mama Grace error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  /**
   * Start a new conversation
   */
  const startNewConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  /**
   * Get a greeting from Mama Grace
   */
  const getGreeting = useCallback(async () => {
    try {
      return await mamaGraceAI.getGreeting();
    } catch (error) {
      console.error('Error getting greeting:', error);
      return "Well hello there, honey! I can tell by the way you found this app that you're trying to be a good partner. That's already a wonderful start. What's going on with your lady?";
    }
  }, []);

  /**
   * Get conversation starters
   */
  const getConversationStarters = useCallback(async () => {
    try {
      return await mamaGraceAI.getConversationStarters();
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
  }, []);

  return {
    messages,
    isLoading,
    error,
    askMamaGrace,
    startNewConversation,
    getGreeting,
    getConversationStarters
  };
};

export default useMamaGrace;