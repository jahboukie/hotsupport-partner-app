/**
 * SupportPartner API Service
 * Handles all data operations with intelligent database routing
 */

import { databaseRouter, QueryResult } from '../lib/database-router';

// Types
interface UserProfile {
  id: string;
  email: string;
  name: string;
  preferred_name?: string;
  partner_name?: string;
  relationship_duration?: string;
  timezone?: string;
  language?: string;
  support_style?: string;
  goals?: string[];
  profile_data?: any;
  created_at?: string;
  updated_at?: string;
  last_active_at?: string;
}

interface SupportAction {
  id?: string;
  user_id: string;
  partner_id?: string;
  action_type: 'communication' | 'emotional' | 'practical' | 'crisis';
  description: string;
  effectiveness_rating?: number;
  context?: any;
  outcome?: string;
  points_earned?: number;
  logged_at?: string;
  created_at?: string;
}

interface DailyCheckin {
  id?: string;
  user_id: string;
  checkin_date: string;
  partner_mood_rating?: number;
  support_confidence?: number;
  relationship_quality?: number;
  notes?: string;
  challenges?: string[];
  successes?: string[];
  goals_for_tomorrow?: string[];
  created_at?: string;
}

interface MamaGraceConversation {
  id?: string;
  user_id: string;
  session_id?: string;
  question: string;
  response: string;
  response_category?: string;
  sentiment_score?: number;
  crisis_detected?: boolean;
  crisis_level?: 'low' | 'medium' | 'high' | 'emergency';
  usage_tier?: 'basic' | 'complete' | 'therapy';
  tokens_used?: number;
  response_time_ms?: number;
  context_data?: any;
  created_at?: string;
}

interface PartnerConnection {
  id?: string;
  supporter_id: string;
  partner_id: string;
  connection_code?: string;
  status?: 'pending' | 'active' | 'paused' | 'ended';
  sharing_preferences?: any;
  permissions?: any;
  connected_at?: string;
  last_sync_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface Subscription {
  id?: string;
  user_id: string;
  plan_id: string;
  stripe_subscription_id?: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  trial_end?: string;
  usage_data?: any;
  created_at?: string;
  updated_at?: string;
}

class SupportPartnerAPI {
  
  // ============================================================================
  // USER PROFILE MANAGEMENT (Non-PHI - Supabase)
  // ============================================================================

  /**
   * Create user profile
   */
  async createUserProfile(profile: Partial<UserProfile>): Promise<QueryResult<UserProfile>> {
    return await databaseRouter.insert('user_profiles', {
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_active_at: new Date().toISOString()
    }, { returning: ['*'] });
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<QueryResult<UserProfile>> {
    return await databaseRouter.select('user_profiles', {
      where: { id: userId }
    });
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<QueryResult<UserProfile>> {
    return await databaseRouter.update('user_profiles', {
      ...updates,
      updated_at: new Date().toISOString(),
      last_active_at: new Date().toISOString()
    }, { id: userId }, { returning: ['*'] });
  }

  /**
   * Update last active timestamp
   */
  async updateLastActive(userId: string): Promise<QueryResult<UserProfile>> {
    return await databaseRouter.update('user_profiles', {
      last_active_at: new Date().toISOString()
    }, { id: userId });
  }

  // ============================================================================
  // SUBSCRIPTION MANAGEMENT (Non-PHI - Supabase)
  // ============================================================================

  /**
   * Create subscription
   */
  async createSubscription(subscription: Partial<Subscription>): Promise<QueryResult<Subscription>> {
    return await databaseRouter.insert('user_subscriptions', {
      ...subscription,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { returning: ['*'] });
  }

  /**
   * Get user subscription
   */
  async getUserSubscription(userId: string): Promise<QueryResult<Subscription>> {
    return await databaseRouter.select('user_subscriptions', {
      where: { user_id: userId, status: 'active' },
      orderBy: { column: 'created_at', ascending: false },
      limit: 1
    });
  }

  /**
   * Update subscription
   */
  async updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<QueryResult<Subscription>> {
    return await databaseRouter.update('user_subscriptions', {
      ...updates,
      updated_at: new Date().toISOString()
    }, { id: subscriptionId }, { returning: ['*'] });
  }

  /**
   * Track usage for subscription limits
   */
  async trackUsage(userId: string, featureName: string, usageCount: number = 1): Promise<QueryResult> {
    const today = new Date();
    const periodStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000);

    return await databaseRouter.insert('usage_tracking', {
      user_id: userId,
      feature_name: featureName,
      usage_count: usageCount,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      metadata: {},
      created_at: new Date().toISOString()
    });
  }

  // ============================================================================
  // SUPPORT ACTIONS (Sensitive - AWS RDS)
  // ============================================================================

  /**
   * Log support action
   */
  async logSupportAction(action: Partial<SupportAction>): Promise<QueryResult<SupportAction>> {
    return await databaseRouter.insert('support_actions', {
      ...action,
      logged_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    }, { returning: ['*'] });
  }

  /**
   * Get user support actions
   */
  async getUserSupportActions(userId: string, limit: number = 50): Promise<QueryResult<SupportAction>> {
    return await databaseRouter.select('support_actions', {
      where: { user_id: userId },
      orderBy: { column: 'logged_at', ascending: false },
      limit
    });
  }

  /**
   * Get partner support actions
   */
  async getPartnerSupportActions(partnerId: string, limit: number = 50): Promise<QueryResult<SupportAction>> {
    return await databaseRouter.select('support_actions', {
      where: { partner_id: partnerId },
      orderBy: { column: 'logged_at', ascending: false },
      limit
    });
  }

  // ============================================================================
  // DAILY CHECK-INS (Sensitive - AWS RDS)
  // ============================================================================

  /**
   * Create daily check-in
   */
  async createDailyCheckin(checkin: Partial<DailyCheckin>): Promise<QueryResult<DailyCheckin>> {
    return await databaseRouter.insert('daily_checkins', {
      ...checkin,
      created_at: new Date().toISOString()
    }, { returning: ['*'] });
  }

  /**
   * Get user daily check-ins
   */
  async getUserDailyCheckins(userId: string, days: number = 30): Promise<QueryResult<DailyCheckin>> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await databaseRouter.select('daily_checkins', {
      where: { user_id: userId },
      orderBy: { column: 'checkin_date', ascending: false },
      limit: days
    });
  }

  /**
   * Get today's check-in
   */
  async getTodayCheckin(userId: string): Promise<QueryResult<DailyCheckin>> {
    const today = new Date().toISOString().split('T')[0];
    
    return await databaseRouter.select('daily_checkins', {
      where: { user_id: userId, checkin_date: today }
    });
  }

  // ============================================================================
  // MAMA GRACE CONVERSATIONS (Sensitive - AWS RDS)
  // ============================================================================

  /**
   * Save Mama Grace conversation
   */
  async saveMamaGraceConversation(conversation: Partial<MamaGraceConversation>): Promise<QueryResult<MamaGraceConversation>> {
    return await databaseRouter.insert('mama_grace_conversations', {
      ...conversation,
      created_at: new Date().toISOString()
    }, { returning: ['*'] });
  }

  /**
   * Get user's Mama Grace conversations
   */
  async getMamaGraceConversations(userId: string, sessionId?: string, limit: number = 50): Promise<QueryResult<MamaGraceConversation>> {
    const where: any = { user_id: userId };
    if (sessionId) {
      where.session_id = sessionId;
    }

    return await databaseRouter.select('mama_grace_conversations', {
      where,
      orderBy: { column: 'created_at', ascending: false },
      limit
    });
  }

  /**
   * Get conversation sessions
   */
  async getConversationSessions(userId: string): Promise<QueryResult<{ session_id: string; count: number; last_message: string }>> {
    // This would require a more complex query - for now, return basic data
    return await databaseRouter.select('mama_grace_conversations', {
      columns: ['session_id', 'created_at'],
      where: { user_id: userId },
      orderBy: { column: 'created_at', ascending: false }
    });
  }

  // ============================================================================
  // PARTNER CONNECTIONS (Sensitive - AWS RDS)
  // ============================================================================

  /**
   * Create partner connection
   */
  async createPartnerConnection(connection: Partial<PartnerConnection>): Promise<QueryResult<PartnerConnection>> {
    return await databaseRouter.insert('partner_connections', {
      ...connection,
      connection_code: this.generateConnectionCode(),
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { returning: ['*'] });
  }

  /**
   * Get user's partner connections
   */
  async getUserPartnerConnections(userId: string): Promise<QueryResult<PartnerConnection>> {
    return await databaseRouter.select('partner_connections', {
      where: { supporter_id: userId },
      orderBy: { column: 'created_at', ascending: false }
    });
  }

  /**
   * Update partner connection status
   */
  async updatePartnerConnectionStatus(
    connectionId: string, 
    status: 'pending' | 'active' | 'paused' | 'ended'
  ): Promise<QueryResult<PartnerConnection>> {
    const updateData: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };

    if (status === 'active') {
      updateData.connected_at = new Date().toISOString();
    }

    return await databaseRouter.update('partner_connections', updateData, 
      { id: connectionId }, { returning: ['*'] });
  }

  // ============================================================================
  // AI INSIGHTS AND ANALYTICS (Sensitive - AWS RDS)
  // ============================================================================

  /**
   * Create AI insight
   */
  async createAIInsight(insight: {
    user_id: string;
    insight_type: string;
    title: string;
    content: string;
    priority?: string;
    tags?: string[];
    is_actionable?: boolean;
    expires_at?: string;
    generated_from?: any;
  }): Promise<QueryResult> {
    return await databaseRouter.insert('ai_insights', {
      ...insight,
      is_read: false,
      created_at: new Date().toISOString()
    }, { returning: ['*'] });
  }

  /**
   * Get user insights
   */
  async getUserInsights(userId: string, unreadOnly: boolean = false): Promise<QueryResult> {
    const where: any = { user_id: userId };
    if (unreadOnly) {
      where.is_read = false;
    }

    return await databaseRouter.select('ai_insights', {
      where,
      orderBy: { column: 'created_at', ascending: false },
      limit: 50
    });
  }

  /**
   * Mark insight as read
   */
  async markInsightAsRead(insightId: string): Promise<QueryResult> {
    return await databaseRouter.update('ai_insights', {
      is_read: true
    }, { id: insightId });
  }

  // ============================================================================
  // CRISIS MANAGEMENT (Sensitive - AWS RDS)
  // ============================================================================

  /**
   * Create crisis situation
   */
  async createCrisisSituation(crisis: {
    user_id: string;
    crisis_level: 'low' | 'medium' | 'high' | 'emergency';
    description: string;
    detected_via?: string;
    escalation_needed?: boolean;
    escalation_contacts?: any[];
  }): Promise<QueryResult> {
    return await databaseRouter.insert('crisis_situations', {
      ...crisis,
      follow_up_required: true,
      follow_up_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      created_at: new Date().toISOString()
    }, { returning: ['*'] });
  }

  /**
   * Get active crisis situations
   */
  async getActiveCrisisSituations(userId: string): Promise<QueryResult> {
    return await databaseRouter.select('crisis_situations', {
      where: { user_id: userId, resolved_at: null },
      orderBy: { column: 'created_at', ascending: false }
    });
  }

  /**
   * Resolve crisis situation
   */
  async resolveCrisisSituation(crisisId: string, resolutionNotes: string): Promise<QueryResult> {
    return await databaseRouter.update('crisis_situations', {
      resolution_notes: resolutionNotes,
      resolved_at: new Date().toISOString(),
      follow_up_required: false
    }, { id: crisisId }, { returning: ['*'] });
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Generate unique connection code
   */
  private generateConnectionCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  /**
   * Health check for all systems
   */
  async healthCheck(): Promise<{
    database: any;
    timestamp: string;
    version: string;
  }> {
    const dbHealth = await databaseRouter.healthCheck();
    
    return {
      database: dbHealth,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * Get database routing information
   */
  getRoutingInfo(): Record<string, string> {
    const health = databaseRouter.healthCheck();
    return health.routing || {};
  }
}

// Export singleton instance
export const supportPartnerAPI = new SupportPartnerAPI();

// Export types
export type {
  UserProfile,
  SupportAction,
  DailyCheckin,
  MamaGraceConversation,
  PartnerConnection,
  Subscription
};

export default supportPartnerAPI;