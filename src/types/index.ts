// Global types for SupportPartner app

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}

// Ecosystem types
export interface EcosystemInsight {
  id: string;
  type: 'communication' | 'emergency_response' | 'emotional_support' | 'practical_help' | 'celebration';
  insight: string;
  confidence: number;
  timestamp: string;
  correlationData?: any;
}

export interface ProgressData {
  totalPoints: number;
  currentLevel: number;
  currentLevelName: string;
  nextLevelName: string;
  pointsToNextLevel: number;
  weeklyProgress: number;
  weeklyGoal: number;
  communicationScore: number;
  emergencyResponseScore: number;
  partnerSatisfactionScore: number;
  learningStreak: number;
  longestStreak: number;
}

export interface CorrelationData {
  correlationScore: number;
  supportEffectiveness: number;
  relationshipTrends: any[];
  predictiveInsights: any[];
  recommendedActions: any[];
}

// Mama Grace types
export interface MamaGraceResponse {
  wisdom: string;
  isCrisis: boolean;
  supportCategory: string;
  followUpSuggestions: string[];
  timestamp: string;
}

// PWA types are now in vite-env.d.ts