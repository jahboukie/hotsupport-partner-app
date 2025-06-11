import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Users, TrendingUp, Clock, Award, Share2, ThumbsUp } from 'lucide-react';

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  category: 'success' | 'question' | 'tip' | 'support';
  likes: number;
  replies: number;
  timeAgo: string;
  tags: string[];
}

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  recentActivity: string;
}

const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'challenges'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for community posts
  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: 'Mike_Thompson',
      avatar: '👨‍💼',
      content: 'My wife started using the symptom tracker 3 weeks ago and it\'s already helping us both understand her patterns so much better. Communication has improved dramatically!',
      category: 'success',
      likes: 24,
      replies: 8,
      timeAgo: '2 hours ago',
      tags: ['communication', 'tracking', 'success']
    },
    {
      id: '2',
      author: 'DadOfThree',
      avatar: '👨‍👧‍👦',
      content: 'How do you handle it when your partner is having a really tough day with hot flashes? I want to help but don\'t know what to say or do.',
      category: 'question',
      likes: 16,
      replies: 12,
      timeAgo: '4 hours ago',
      tags: ['hot-flashes', 'support', 'advice-needed']
    },
    {
      id: '3',
      author: 'SupportiveSam',
      avatar: '👨‍🦲',
      content: 'Pro tip: Keep a small cooling towel in the freezer. When my wife has a hot flash, I can quickly grab it for her. She says it\'s a game-changer!',
      category: 'tip',
      likes: 31,
      replies: 6,
      timeAgo: '6 hours ago',
      tags: ['hot-flashes', 'practical-tips', 'cooling']
    },
    {
      id: '4',
      author: 'NewPartner22',
      avatar: '👨‍🎓',
      content: 'Just joined this community. My partner was recently diagnosed with early menopause and I feel lost. This app is helping me learn so much.',
      category: 'support',
      likes: 18,
      replies: 15,
      timeAgo: '8 hours ago',
      tags: ['new-member', 'early-menopause', 'learning']
    }
  ];

  // Mock data for community groups
  const communityGroups: CommunityGroup[] = [
    {
      id: '1',
      name: 'New Partners Support',
      description: 'For partners just starting their menopause support journey',
      members: 1247,
      category: 'Support',
      recentActivity: '5 min ago'
    },
    {
      id: '2',
      name: 'Communication Masters',
      description: 'Sharing effective communication strategies and tips',
      members: 892,
      category: 'Skills',
      recentActivity: '12 min ago'
    },
    {
      id: '3',
      name: 'Practical Solutions',
      description: 'Real-world tips and solutions that actually work',
      members: 2156,
      category: 'Tips',
      recentActivity: '18 min ago'
    },
    {
      id: '4',
      name: 'Success Stories',
      description: 'Celebrating wins and positive outcomes together',
      members: 743,
      category: 'Motivation',
      recentActivity: '1 hour ago'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'success': return <Award className="w-4 h-4 text-green-500" />;
      case 'question': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'tip': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'support': return <Heart className="w-4 h-4 text-red-500" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'question': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'tip': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'support': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredPosts = selectedCategory === 'all' 
    ? communityPosts 
    : communityPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Partner Community</h1>
              <p className="text-gray-600">Connect, learn, and support each other</p>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5.2K</div>
              <div className="text-sm text-gray-600">Active Partners</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12.8K</div>
              <div className="text-sm text-gray-600">Success Stories</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">8.4K</div>
              <div className="text-sm text-gray-600">Tips Shared</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'feed', label: 'Community Feed', icon: MessageCircle },
              { id: 'groups', label: 'Support Groups', icon: Users },
              { id: 'challenges', label: 'Challenges', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Community Feed Tab */}
        {activeTab === 'feed' && (
          <div>
            {/* Category Filter */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Posts' },
                  { id: 'success', label: 'Success Stories' },
                  { id: 'question', label: 'Questions' },
                  { id: 'tip', label: 'Tips & Advice' },
                  { id: 'support', label: 'Support Needed' }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{post.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{post.author}</span>
                        <div className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(post.category)}`}>
                          <div className="flex items-center gap-1">
                            {getCategoryIcon(post.category)}
                            {post.category}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{post.timeAgo}</span>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          {post.likes} likes
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {post.replies} replies
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            {communityGroups.map((group) => (
              <div key={group.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                    <p className="text-gray-600 mb-3">{group.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {group.members.toLocaleString()} members
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Active {group.recentActivity}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {group.category}
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Join Group
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="grid gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Challenges</h3>
              
              <div className="space-y-4">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-green-900">7-Day Communication Challenge</h4>
                      <p className="text-green-700 text-sm">Practice one new communication technique each day</p>
                    </div>
                    <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-green-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-sm text-green-700">Day 5/7</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-green-700">
                    <span>🏆 1,247 participants</span>
                    <span>⭐ 892 completed</span>
                  </div>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-blue-900">Mindful Support Week</h4>
                      <p className="text-blue-700 text-sm">Focus on mindful listening and presence</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full">Starting Soon</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">Starts in 3 days • Duration: 7 days</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Join Challenge
                  </button>
                </div>

                <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-purple-900">Knowledge Building Challenge</h4>
                      <p className="text-purple-700 text-sm">Learn something new about menopause each day</p>
                    </div>
                    <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full">Monthly</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-purple-700">
                    <span>📚 2,156 learning together</span>
                    <span>🎯 30-day commitment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;