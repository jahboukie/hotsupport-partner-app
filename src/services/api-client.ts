/**
 * API Client for SupportPartner Backend
 * Handles communication with our Express server
 */

export class APIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3021';
  }

  /**
   * Chat with Mama Grace through our backend
   */
  async chatWithMamaGrace(message: string, context?: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/mama-grace/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Client Error:', error);
      throw error;
    }
  }

  /**
   * Get conversation starters
   */
  async getConversationStarters(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/mama-grace/starters`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      return data.starters || [];
    } catch (error) {
      console.error('Error fetching conversation starters:', error);
      // Return fallback starters
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

  /**
   * Get a greeting from Mama Grace
   */
  async getGreeting(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/mama-grace/greeting`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      return data.greeting;
    } catch (error) {
      console.error('Error fetching greeting:', error);
      // Return fallback greeting
      return "Well hello there, honey! I can tell by the way you found this app that you're trying to be a good partner. That's already a wonderful start. What's going on with your lady?";
    }
  }
}

export const apiClient = new APIClient();