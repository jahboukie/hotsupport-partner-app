-- SupportPartner Database Schema
-- Enhanced security and data management for partner support platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('basic', 'complete', 'therapy');
CREATE TYPE support_action_type AS ENUM ('communication', 'emotional', 'practical', 'crisis');
CREATE TYPE crisis_level AS ENUM ('low', 'medium', 'high', 'emergency');

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(100),
    partner_name VARCHAR(255),
    relationship_duration VARCHAR(50),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    support_style VARCHAR(100),
    goals TEXT[],
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions for auth management
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SUBSCRIPTION MANAGEMENT
-- ============================================================================

-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    tier subscription_tier NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_annual DECIMAL(10,2),
    stripe_price_id VARCHAR(255),
    features JSONB NOT NULL DEFAULT '{}',
    limits JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    usage_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking for feature limits
CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    feature_name VARCHAR(100) NOT NULL,
    usage_count INTEGER DEFAULT 0,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PARTNER CONNECTION & ECOSYSTEM INTEGRATION
-- ============================================================================

-- Partner connections (links to MenoWellness users)
CREATE TABLE partner_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supporter_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    partner_id UUID NOT NULL, -- External user ID from MenoWellness
    connection_code VARCHAR(20) UNIQUE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, paused, ended
    sharing_preferences JSONB DEFAULT '{}',
    permissions JSONB DEFAULT '{}',
    connected_at TIMESTAMP WITH TIME ZONE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-app data sync status
CREATE TABLE ecosystem_sync (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_id UUID REFERENCES partner_connections(id) ON DELETE CASCADE,
    data_type VARCHAR(100) NOT NULL,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    metadata JSONB DEFAULT '{}'
);

-- ============================================================================
-- SUPPORT ACTIVITIES & TRACKING
-- ============================================================================

-- Support actions logged by users
CREATE TABLE support_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    partner_id UUID, -- From partner_connections
    action_type support_action_type NOT NULL,
    description TEXT NOT NULL,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    context JSONB DEFAULT '{}',
    outcome TEXT,
    points_earned INTEGER DEFAULT 0,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Progress tracking metrics
CREATE TABLE progress_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    calculation_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily check-ins and mood tracking
CREATE TABLE daily_checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    partner_mood_rating INTEGER CHECK (partner_mood_rating >= 1 AND partner_mood_rating <= 10),
    support_confidence INTEGER CHECK (support_confidence >= 1 AND support_confidence <= 10),
    relationship_quality INTEGER CHECK (relationship_quality >= 1 AND relationship_quality <= 10),
    notes TEXT,
    challenges TEXT[],
    successes TEXT[],
    goals_for_tomorrow TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, checkin_date)
);

-- ============================================================================
-- AI INTERACTIONS & MAMA GRACE
-- ============================================================================

-- Mama Grace conversations
CREATE TABLE mama_grace_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    session_id UUID DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    response_category VARCHAR(100),
    sentiment_score DECIMAL(3,2),
    crisis_detected BOOLEAN DEFAULT false,
    crisis_level crisis_level,
    usage_tier subscription_tier,
    tokens_used INTEGER,
    response_time_ms INTEGER,
    context_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI-generated insights and recommendations
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    insight_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'medium',
    tags TEXT[],
    is_read BOOLEAN DEFAULT false,
    is_actionable BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    generated_from JSONB DEFAULT '{}', -- Source data for insight
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CRISIS MANAGEMENT & EMERGENCY SUPPORT
-- ============================================================================

-- Crisis situations and escalations
CREATE TABLE crisis_situations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    crisis_level crisis_level NOT NULL,
    description TEXT NOT NULL,
    detected_via VARCHAR(100), -- 'mama_grace', 'manual', 'ecosystem_alert'
    escalation_needed BOOLEAN DEFAULT false,
    escalation_contacts JSONB DEFAULT '[]',
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    follow_up_required BOOLEAN DEFAULT true,
    follow_up_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency contacts and resources
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    contact_type VARCHAR(50) NOT NULL, -- 'healthcare', 'family', 'friend', 'professional'
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    relationship VARCHAR(100),
    notes TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- NOTIFICATION & COMMUNICATION
-- ============================================================================

-- Notification preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    daily_checkins BOOLEAN DEFAULT true,
    symptom_alerts BOOLEAN DEFAULT true,
    mood_updates BOOLEAN DEFAULT true,
    appointment_reminders BOOLEAN DEFAULT true,
    weekly_reports BOOLEAN DEFAULT true,
    emergency_alerts BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled notifications
CREATE TABLE scheduled_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    notification_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_method VARCHAR(50) DEFAULT 'push', -- 'push', 'email', 'sms'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- AUDIT TRAIL & SECURITY
-- ============================================================================

-- Comprehensive audit logging
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    user_id UUID,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security events and monitoring
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id),
    event_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'info', -- info, warning, error, critical
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User-related indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);

-- Subscription indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_usage_tracking_user_feature ON usage_tracking(user_id, feature_name);

-- Partner connection indexes
CREATE INDEX idx_partner_connections_supporter ON partner_connections(supporter_id);
CREATE INDEX idx_partner_connections_partner ON partner_connections(partner_id);
CREATE INDEX idx_partner_connections_code ON partner_connections(connection_code);

-- Support activity indexes
CREATE INDEX idx_support_actions_user_id ON support_actions(user_id);
CREATE INDEX idx_support_actions_logged_at ON support_actions(logged_at);
CREATE INDEX idx_daily_checkins_user_date ON daily_checkins(user_id, checkin_date);

-- AI and conversation indexes
CREATE INDEX idx_mama_grace_user_id ON mama_grace_conversations(user_id);
CREATE INDEX idx_mama_grace_session_id ON mama_grace_conversations(session_id);
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);

-- Crisis management indexes
CREATE INDEX idx_crisis_situations_user_id ON crisis_situations(user_id);
CREATE INDEX idx_crisis_situations_level ON crisis_situations(crisis_level);

-- Audit trail indexes
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partner_connections_updated_at BEFORE UPDATE ON partner_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit trail trigger
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (table_name, operation, record_id, old_data, new_data)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_user_profiles AFTER INSERT OR UPDATE OR DELETE ON user_profiles FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_support_actions AFTER INSERT OR UPDATE OR DELETE ON support_actions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_crisis_situations AFTER INSERT OR UPDATE OR DELETE ON crisis_situations FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ============================================================================
-- INSERT DEFAULT SUBSCRIPTION PLANS
-- ============================================================================

INSERT INTO subscription_plans (name, tier, price_monthly, price_annual, stripe_price_id, features, limits) VALUES
('Basic Support', 'basic', 9.99, 99.99, 'price_1RYnQqELGHd3NbdJ5eEbaYbw', 
 '{"mama_grace_access": true, "basic_insights": true, "daily_checkins": true}',
 '{"mama_grace_daily": 5, "ai_insights_monthly": 10}'
),
('Complete Partner', 'complete', 19.99, 199.99, 'price_1RYnRdELGHd3NbdJ8UAOxdJq',
 '{"mama_grace_unlimited": true, "advanced_insights": true, "progress_tracking": true, "crisis_support": true}',
 '{"mama_grace_daily": -1, "ai_insights_monthly": -1}'
),
('Couples Therapy Plus', 'therapy', 29.99, 299.99, 'price_1RYnSTELGHd3NbdJQ9OyjJsZ',
 '{"everything": true, "couples_therapy": true, "provider_integration": true, "priority_support": true}',
 '{"unlimited": true}'
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on user data tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE mama_grace_conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY user_profiles_policy ON user_profiles FOR ALL USING (id = current_setting('app.current_user_id')::UUID);
CREATE POLICY user_subscriptions_policy ON user_subscriptions FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);
CREATE POLICY support_actions_policy ON support_actions FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);
CREATE POLICY daily_checkins_policy ON daily_checkins FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);
CREATE POLICY mama_grace_conversations_policy ON mama_grace_conversations FOR ALL USING (user_id = current_setting('app.current_user_id')::UUID);

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '🎉 SupportPartner database schema created successfully!';
    RAISE NOTICE '📊 Tables created: %', (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public');
    RAISE NOTICE '🔒 Row Level Security enabled for user data protection';
    RAISE NOTICE '📝 Audit trails configured for compliance';
    RAISE NOTICE '🚀 Ready for application deployment!';
END $$;