/**
 * Subscription Tester Component - For demo purposes
 * Allows testing different subscription tiers
 */

import React, { useState } from 'react';
import { Settings, Crown, Lock, Zap } from 'lucide-react';
import { subscriptionService, SUBSCRIPTION_TIERS } from '../services/subscription-service';

const SubscriptionTester: React.FC = () => {
  const [currentTier, setCurrentTier] = useState(subscriptionService.getCurrentTier());
  const [showTester, setShowTester] = useState(false);

  const handleTierChange = (tierId: string) => {
    subscriptionService.updateSubscription(tierId);
    setCurrentTier(subscriptionService.getCurrentTier());
    // Refresh the page to update all components
    window.location.reload();
  };

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'basic':
        return <Lock className="w-4 h-4 text-blue-500" />;
      case 'complete':
        return <Zap className="w-4 h-4 text-purple-500" />;
      case 'therapy':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      default:
        return <Lock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!showTester && (
        <button
          onClick={() => setShowTester(true)}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          title="Test Subscription Tiers"
        >
          <Settings className="w-5 h-5" />
        </button>
      )}

      {showTester && (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Demo: Test Subscription Tiers</h3>
            <button
              onClick={() => setShowTester(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {Object.values(SUBSCRIPTION_TIERS).map((tier) => (
              <button
                key={tier.id}
                onClick={() => handleTierChange(tier.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  currentTier.id === tier.id
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTierIcon(tier.id)}
                    <span className="font-medium">{tier.name}</span>
                  </div>
                  <span className="text-sm font-bold">${tier.price}/month</span>
                </div>
                <div className="text-xs text-gray-600">
                  {tier.mamaGraceQueries === -1 
                    ? 'Unlimited Mama Grace' 
                    : `${tier.mamaGraceQueries} daily questions`}
                </div>
                {currentTier.id === tier.id && (
                  <div className="text-xs text-blue-600 mt-1 font-medium">
                    Currently Active
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Demo Mode:</strong> Click to test different subscription tiers. 
              In production, this would integrate with Stripe payments.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTester;