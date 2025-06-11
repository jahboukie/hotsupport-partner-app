/**
 * Mama Grace Chat Interface
 * Where men get authentic grandmother wisdom about menopause support
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, MessageCircle, AlertCircle, Lightbulb, Crown, Lock } from 'lucide-react';
import { useMamaGrace } from '../hooks/useMamaGrace';
import { subscriptionService } from '../services/subscription-service';

const MamaGraceChat: React.FC = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    isLoading,
    error,
    askMamaGrace,
    startNewConversation,
    getGreeting,
    getConversationStarters
  } = useMamaGrace();

  const [showWelcome, setShowWelcome] = useState(messages.length === 0);
  const [greeting, setGreeting] = useState('');
  const [conversationStarters, setConversationStarters] = useState<string[]>([]);
  const [currentTier, setCurrentTier] = useState(subscriptionService.getCurrentTier());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load greeting and conversation starters on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [greetingText, starters] = await Promise.all([
          getGreeting(),
          getConversationStarters()
        ]);
        setGreeting(greetingText);
        setConversationStarters(starters);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setGreeting("Well hello there, honey! I can tell by the way you found this app that you're trying to be a good partner. That's already a wonderful start. What's going on with your lady?");
        setConversationStarters([
          "My partner seems angry all the time - is this normal?",
          "What should I do when she has a hot flash?",
          "How do I know when to give her space vs when to support her?",
          "She says she's fine but clearly isn't - what do I do?",
          "I feel like I'm walking on eggshells - how do I fix this?",
          "What are the biggest mistakes men make during menopause?"
        ]);
      }
    };

    loadInitialData();
  }, [getGreeting, getConversationStarters]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check subscription limits
    const accessCheck = subscriptionService.canAskMamaGrace();
    if (!accessCheck.allowed) {
      setError(accessCheck.reason || 'Subscription limit reached');
      return;
    }

    const question = input;
    setInput('');
    setShowWelcome(false);
    
    // Record the query for usage tracking
    subscriptionService.recordQuery();
    
    await askMamaGrace(question);
  };

  const handleStarterClick = async (starter: string) => {
    // Check subscription limits
    const accessCheck = subscriptionService.canAskMamaGrace();
    if (!accessCheck.allowed) {
      setError(accessCheck.reason || 'Subscription limit reached');
      return;
    }

    setInput('');
    setShowWelcome(false);
    
    // Record the query for usage tracking
    subscriptionService.recordQuery();
    
    await askMamaGrace(starter);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'crisis_management':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'communication':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'intimacy':
        return <Heart className="w-4 h-4 text-pink-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
    }
  };

  const handleUpgrade = async (tierType: string) => {
    try {
      // For demo purposes, simulate upgrade
      if (tierType === 'complete') {
        subscriptionService.updateSubscription('complete');
        setCurrentTier(subscriptionService.getCurrentTier());
        setError('');
        alert('Upgraded to Complete Partner! You now have unlimited access to Mama Grace.');
      } else if (tierType === 'therapy') {
        subscriptionService.updateSubscription('therapy');
        setCurrentTier(subscriptionService.getCurrentTier());
        setError('');
        alert('Upgraded to Couples Therapy Plus! You now have unlimited access plus therapy features.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center text-3xl">
                👵🏽
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chat with Mama Grace</h1>
                <p className="text-gray-600">75 years of wisdom, zero BS. Your menopause support grandmother.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Subscription Status */}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  {currentTier.id === 'basic' && <Lock className="w-4 h-4 text-blue-500" />}
                  {currentTier.id === 'complete' && <Lightbulb className="w-4 h-4 text-purple-500" />}
                  {currentTier.id === 'therapy' && <Crown className="w-4 h-4 text-yellow-500" />}
                  <span className="font-medium text-gray-900">{currentTier.name}</span>
                </div>
                {currentTier.mamaGraceQueries !== -1 && (
                  <div className="text-sm text-gray-600">
                    {(() => {
                      const accessCheck = subscriptionService.canAskMamaGrace();
                      return accessCheck.remaining !== undefined 
                        ? `${accessCheck.remaining} questions left today`
                        : 'Questions used up';
                    })()}
                  </div>
                )}
                {currentTier.mamaGraceQueries === -1 && (
                  <div className="text-sm text-green-600">Unlimited questions</div>
                )}
              </div>
              
              {messages.length > 0 && (
                <button
                  onClick={() => {
                    startNewConversation();
                    setShowWelcome(true);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  New Chat
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Welcome Screen */}
        {showWelcome && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👵🏽💕</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {greeting || "Loading..."}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                I've been through menopause myself, helped my three daughters through theirs, 
                and watched my Harold learn the hard way. Whatever you're facing, we'll figure it out together.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Common Questions:</h3>
                <div className="space-y-2">
                  {conversationStarters.slice(0, 3).map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => handleStarterClick(starter)}
                      className="w-full text-left p-3 text-sm bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors text-gray-700"
                    >
                      "{starter}"
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">More Situations:</h3>
                <div className="space-y-2">
                  {conversationStarters.slice(3, 6).map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => handleStarterClick(starter)}
                      className="w-full text-left p-3 text-sm bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-gray-700"
                    >
                      "{starter}"
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Your Conversation with Mama Grace</h3>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-rose-100 text-rose-600'
                    }`}>
                      {message.role === 'user' ? '👨‍💼' : '👵🏽'}
                    </div>
                    
                    <div className={`max-w-lg ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : message.isCrisis
                          ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-md'
                          : 'bg-gray-100 text-gray-900 rounded-bl-md'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        
                        {message.supportCategory && message.role === 'mama_grace' && (
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                            {getCategoryIcon(message.supportCategory)}
                            <span className="text-xs font-medium text-gray-600 capitalize">
                              {message.supportCategory.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                      👵🏽
                    </div>
                    <div className="bg-rose-50 border border-rose-200 rounded-2xl rounded-bl-md p-4 max-w-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                          <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                        </div>
                        <span className="text-sm text-rose-700 font-medium">Mama Grace is sharing her wisdom...</span>
                      </div>
                      <div className="mt-2 text-xs text-rose-600 italic">
                        "Let me think about this, honey..."
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
            {error.includes('daily limit') && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white">
                <h4 className="font-bold mb-2">Upgrade for Unlimited Access!</h4>
                <p className="text-sm mb-3">Get unlimited conversations with Mama Grace plus advanced features.</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleUpgrade('complete')}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                  >
                    Complete Partner - $19.99/month
                  </button>
                  <button 
                    onClick={() => handleUpgrade('therapy')}
                    className="bg-purple-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-900 transition-colors"
                  >
                    Couples Therapy Plus - $29.99/month
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Mama Grace anything about supporting your partner..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              Ask
            </button>
          </form>
          
          <p className="text-sm text-gray-500 mt-3 text-center">
            Mama Grace gives relationship advice, not medical advice. For health concerns, consult a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MamaGraceChat;