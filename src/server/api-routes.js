/**
 * SupportPartner API Routes
 * Express endpoints using intelligent database routing
 */

const express = require('express');
const { supportPartnerAPI } = require('../api/supportpartner-api');
const router = express.Router();

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware for user authentication (basic for now)
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  // Extract user ID from token (simplified for demo)
  const token = authHeader.substring(7);
  req.userId = token; // In production, verify JWT and extract user ID
  
  next();
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

router.get('/health', asyncHandler(async (req, res) => {
  const health = await supportPartnerAPI.healthCheck();
  res.json(health);
}));

router.get('/routing', asyncHandler(async (req, res) => {
  const routing = supportPartnerAPI.getRoutingInfo();
  res.json({ routing });
}));

// ============================================================================
// USER PROFILE ROUTES
// ============================================================================

// Get user profile
router.get('/profile', requireAuth, asyncHandler(async (req, res) => {
  const result = await supportPartnerAPI.getUserProfile(req.userId);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  if (result.data.length === 0) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  
  res.json(result.data[0]);
}));

// Update user profile
router.put('/profile', requireAuth, asyncHandler(async (req, res) => {
  const updates = req.body;
  
  // Remove sensitive fields that shouldn't be updated via API
  delete updates.id;
  delete updates.created_at;
  
  const result = await supportPartnerAPI.updateUserProfile(req.userId, updates);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data[0]);
}));

// Update last active
router.post('/profile/activity', requireAuth, asyncHandler(async (req, res) => {
  const result = await supportPartnerAPI.updateLastActive(req.userId);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json({ success: true });
}));

// ============================================================================
// SUBSCRIPTION ROUTES
// ============================================================================

// Get user subscription
router.get('/subscription', requireAuth, asyncHandler(async (req, res) => {
  const result = await supportPartnerAPI.getUserSubscription(req.userId);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data[0] || null);
}));

// Track feature usage
router.post('/subscription/usage', requireAuth, asyncHandler(async (req, res) => {
  const { feature, count = 1 } = req.body;
  
  if (!feature) {
    return res.status(400).json({ error: 'Feature name required' });
  }
  
  const result = await supportPartnerAPI.trackUsage(req.userId, feature, count);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json({ success: true });
}));

// ============================================================================
// SUPPORT ACTION ROUTES
// ============================================================================

// Log support action
router.post('/support-actions', requireAuth, asyncHandler(async (req, res) => {
  const action = {
    user_id: req.userId,
    ...req.body
  };
  
  const result = await supportPartnerAPI.logSupportAction(action);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.status(201).json(result.data[0]);
}));

// Get user support actions
router.get('/support-actions', requireAuth, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const result = await supportPartnerAPI.getUserSupportActions(req.userId, limit);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data);
}));

// Get partner support actions
router.get('/support-actions/partner/:partnerId', requireAuth, asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  
  const result = await supportPartnerAPI.getPartnerSupportActions(partnerId, limit);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data);
}));

// ============================================================================
// DAILY CHECK-IN ROUTES
// ============================================================================

// Create daily check-in
router.post('/checkins', requireAuth, asyncHandler(async (req, res) => {
  const checkin = {
    user_id: req.userId,
    checkin_date: req.body.checkin_date || new Date().toISOString().split('T')[0],
    ...req.body
  };
  
  const result = await supportPartnerAPI.createDailyCheckin(checkin);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.status(201).json(result.data[0]);
}));

// Get user daily check-ins
router.get('/checkins', requireAuth, asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const result = await supportPartnerAPI.getUserDailyCheckins(req.userId, days);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data);
}));

// Get today's check-in
router.get('/checkins/today', requireAuth, asyncHandler(async (req, res) => {
  const result = await supportPartnerAPI.getTodayCheckin(req.userId);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data[0] || null);
}));

// ============================================================================
// MAMA GRACE CONVERSATION ROUTES
// ============================================================================

// Save Mama Grace conversation
router.post('/mama-grace/conversations', requireAuth, asyncHandler(async (req, res) => {
  const conversation = {
    user_id: req.userId,
    ...req.body
  };
  
  // Track usage for subscription limits
  await supportPartnerAPI.trackUsage(req.userId, 'mama_grace_daily');
  
  const result = await supportPartnerAPI.saveMamaGraceConversation(conversation);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.status(201).json(result.data[0]);
}));

// Get Mama Grace conversations
router.get('/mama-grace/conversations', requireAuth, asyncHandler(async (req, res) => {
  const sessionId = req.query.session_id;
  const limit = parseInt(req.query.limit) || 50;
  
  const result = await supportPartnerAPI.getMamaGraceConversations(req.userId, sessionId, limit);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data);
}));

// Get conversation sessions
router.get('/mama-grace/sessions', requireAuth, asyncHandler(async (req, res) => {
  const result = await supportPartnerAPI.getConversationSessions(req.userId);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  // Group by session_id and count
  const sessions = {};
  result.data.forEach(conv => {
    if (!sessions[conv.session_id]) {
      sessions[conv.session_id] = {
        session_id: conv.session_id,
        count: 0,
        last_message: conv.created_at
      };
    }
    sessions[conv.session_id].count++;
    if (conv.created_at > sessions[conv.session_id].last_message) {
      sessions[conv.session_id].last_message = conv.created_at;
    }
  });
  
  res.json(Object.values(sessions));
}));

// ============================================================================
// PARTNER CONNECTION ROUTES
// ============================================================================

// Create partner connection
router.post('/partner-connections', requireAuth, asyncHandler(async (req, res) => {
  const connection = {
    supporter_id: req.userId,
    ...req.body
  };
  
  const result = await supportPartnerAPI.createPartnerConnection(connection);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.status(201).json(result.data[0]);
}));

// Get user partner connections
router.get('/partner-connections', requireAuth, asyncHandler(async (req, res) => {
  const result = await supportPartnerAPI.getUserPartnerConnections(req.userId);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data);
}));

// Update partner connection status
router.put('/partner-connections/:connectionId/status', requireAuth, asyncHandler(async (req, res) => {
  const { connectionId } = req.params;
  const { status } = req.body;
  
  if (!['pending', 'active', 'paused', 'ended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const result = await supportPartnerAPI.updatePartnerConnectionStatus(connectionId, status);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data[0]);
}));

// ============================================================================
// AI INSIGHTS ROUTES
// ============================================================================

// Get user insights
router.get('/insights', requireAuth, asyncHandler(async (req, res) => {
  const unreadOnly = req.query.unread === 'true';
  const result = await supportPartnerAPI.getUserInsights(req.userId, unreadOnly);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data);
}));

// Mark insight as read
router.put('/insights/:insightId/read', requireAuth, asyncHandler(async (req, res) => {
  const { insightId } = req.params;
  const result = await supportPartnerAPI.markInsightAsRead(insightId);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json({ success: true });
}));

// ============================================================================
// CRISIS MANAGEMENT ROUTES
// ============================================================================

// Create crisis situation
router.post('/crisis', requireAuth, asyncHandler(async (req, res) => {
  const crisis = {
    user_id: req.userId,
    ...req.body
  };
  
  const result = await supportPartnerAPI.createCrisisSituation(crisis);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.status(201).json(result.data[0]);
}));

// Get active crisis situations
router.get('/crisis/active', requireAuth, asyncHandler(async (req, res) => {
  const result = await supportPartnerAPI.getActiveCrisisSituations(req.userId);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data);
}));

// Resolve crisis situation
router.put('/crisis/:crisisId/resolve', requireAuth, asyncHandler(async (req, res) => {
  const { crisisId } = req.params;
  const { resolutionNotes } = req.body;
  
  if (!resolutionNotes) {
    return res.status(400).json({ error: 'Resolution notes required' });
  }
  
  const result = await supportPartnerAPI.resolveCrisisSituation(crisisId, resolutionNotes);
  
  if (result.error) {
    return res.status(500).json({ error: result.error });
  }
  
  res.json(result.data[0]);
}));

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

router.use((error, req, res, next) => {
  console.error('API Error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

module.exports = router;