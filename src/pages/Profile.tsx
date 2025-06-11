/**
 * Profile & Settings Page - SupportPartner
 * Comprehensive profile management and ecosystem settings
 */

import React, { useState, useEffect } from 'react';
import { 
  User, Settings, Heart, Shield, Bell, Link2, 
  Camera, Edit3, Save, X, CheckCircle, AlertCircle,
  Smartphone, Globe, Lock, Eye, EyeOff, Crown
} from 'lucide-react';
import { useEcosystem } from '../hooks/useEcosystem';
import { subscriptionService } from '../services/subscription-service';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  partnerName: string;
  relationshipDuration: string;
  preferredName: string;
  timezone: string;
  language: string;
  menopauseStage: string;
  goals: string[];
  supportStyle: string;
}

interface NotificationSettings {
  dailyCheckIns: boolean;
  symptomAlerts: boolean;
  moodUpdates: boolean;
  appointmentReminders: boolean;
  weeklyReports: boolean;
  emergencyAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface PrivacySettings {
  shareWithPartner: boolean;
  anonymousData: boolean;
  researchParticipation: boolean;
  dataRetention: string;
  twoFactorAuth: boolean;
}

const Profile: React.FC = () => {
  const { partnerData, isConnected, getSharingPreferences, updateSharingPreferences } = useEcosystem();
  const [currentTier] = useState(subscriptionService.getCurrentTier());
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    id: localStorage.getItem('supportpartner-user-id') || '',
    name: localStorage.getItem('supportpartner-user-name') || 'John Doe',
    email: localStorage.getItem('supportpartner-user-email') || 'john@example.com',
    partnerName: partnerData?.name || 'Sarah',
    relationshipDuration: '8 years',
    preferredName: 'John',
    timezone: 'EST',
    language: 'English',
    menopauseStage: partnerData?.currentStage || 'Perimenopause',
    goals: ['Better Communication', 'Understanding Symptoms', 'Emotional Support'],
    supportStyle: 'Active Listener'
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    dailyCheckIns: true,
    symptomAlerts: true,
    moodUpdates: true,
    appointmentReminders: true,
    weeklyReports: true,
    emergencyAlerts: true,
    emailNotifications: true,
    pushNotifications: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    shareWithPartner: true,
    anonymousData: false,
    researchParticipation: true,
    dataRetention: '2 years',
    twoFactorAuth: false
  });

  // Load saved preferences
  useEffect(() => {
    const savedProfile = localStorage.getItem('supportpartner-profile');
    const savedNotifications = localStorage.getItem('supportpartner-notifications');
    const savedPrivacy = localStorage.getItem('supportpartner-privacy');

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedPrivacy) setPrivacy(JSON.parse(savedPrivacy));
  }, []);

  const handleSaveProfile = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('supportpartner-profile', JSON.stringify(profile));
      localStorage.setItem('supportpartner-user-name', profile.name);
      localStorage.setItem('supportpartner-user-email', profile.email);
      
      // Save to ecosystem if connected
      if (isConnected) {
        await updateSharingPreferences({
          shareWithPartner: privacy.shareWithPartner,
          profile: profile
        });
      }
      
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('supportpartner-notifications', JSON.stringify(updated));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    const updated = { ...privacy, [key]: value };
    setPrivacy(updated);
    localStorage.setItem('supportpartner-privacy', JSON.stringify(updated));
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'ecosystem', name: 'Ecosystem', icon: Link2 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                  {profile.name.charAt(0)}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600">Supporting {profile.partnerName} through menopause</p>
                <div className="flex items-center gap-2 mt-1">
                  {currentTier.id === 'therapy' && <Crown className="w-4 h-4 text-yellow-500" />}
                  <span className="text-sm font-medium text-blue-600">{currentTier.name}</span>
                </div>
              </div>
            </div>
            
            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Settings saved successfully!</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Partner's Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.partnerName}
                          onChange={(e) => setProfile({...profile, partnerName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.partnerName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Duration</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.relationshipDuration}
                          onChange={(e) => setProfile({...profile, relationshipDuration: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.relationshipDuration}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.preferredName}
                          onChange={(e) => setProfile({...profile, preferredName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.preferredName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      {isEditing ? (
                        <select
                          value={profile.timezone}
                          onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="EST">Eastern Time (EST)</option>
                          <option value="CST">Central Time (CST)</option>
                          <option value="MST">Mountain Time (MST)</option>
                          <option value="PST">Pacific Time (PST)</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profile.timezone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Style</label>
                      {isEditing ? (
                        <select
                          value={profile.supportStyle}
                          onChange={(e) => setProfile({...profile, supportStyle: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Active Listener">Active Listener</option>
                          <option value="Problem Solver">Problem Solver</option>
                          <option value="Emotional Support">Emotional Support</option>
                          <option value="Practical Helper">Practical Helper</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profile.supportStyle}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Menopause Stage</label>
                      <p className="text-gray-900">{profile.menopauseStage}</p>
                      <p className="text-sm text-gray-500 mt-1">Based on partner's data from MenoWellness app</p>
                    </div>
                  </div>
                </div>

                {/* Support Goals */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Support Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.goals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Password Change */}
                <div className="border-t pt-6">
                  <button
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                  
                  {showPasswordChange && (
                    <div className="mt-4 space-y-4 max-w-md">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Update Password
                        </button>
                        <button 
                          onClick={() => setShowPasswordChange(false)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Partner Updates</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'symptomAlerts', label: 'Symptom Alerts', desc: 'When your partner logs severe symptoms' },
                        { key: 'moodUpdates', label: 'Mood Changes', desc: 'Daily mood tracking updates' },
                        { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Upcoming doctor visits and treatments' },
                        { key: 'emergencyAlerts', label: 'Emergency Alerts', desc: 'Crisis situations requiring immediate attention' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(item.key as keyof NotificationSettings)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[item.key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">App Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'dailyCheckIns', label: 'Daily Check-ins', desc: 'Remind me to check in with my partner' },
                        { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Summary of progress and insights' },
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                        { key: 'pushNotifications', label: 'Push Notifications', desc: 'Mobile and browser notifications' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(item.key as keyof NotificationSettings)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[item.key as keyof NotificationSettings] ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Security Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Data Sharing</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Share with Partner</p>
                          <p className="text-sm text-gray-500">Allow your partner to see your support activities</p>
                        </div>
                        <button
                          onClick={() => handlePrivacyChange('shareWithPartner', !privacy.shareWithPartner)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            privacy.shareWithPartner ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacy.shareWithPartner ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Anonymous Analytics</p>
                          <p className="text-sm text-gray-500">Help improve the app with anonymous usage data</p>
                        </div>
                        <button
                          onClick={() => handlePrivacyChange('anonymousData', !privacy.anonymousData)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            privacy.anonymousData ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacy.anonymousData ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Research Participation</p>
                          <p className="text-sm text-gray-500">Participate in menopause support research studies</p>
                        </div>
                        <button
                          onClick={() => handlePrivacyChange('researchParticipation', !privacy.researchParticipation)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            privacy.researchParticipation ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacy.researchParticipation ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button
                          onClick={() => handlePrivacyChange('twoFactorAuth', !privacy.twoFactorAuth)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            privacy.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              privacy.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="py-3">
                        <p className="font-medium text-gray-900 mb-2">Data Retention</p>
                        <select
                          value={privacy.dataRetention}
                          onChange={(e) => handlePrivacyChange('dataRetention', e.target.value)}
                          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="1 year">1 Year</option>
                          <option value="2 years">2 Years</option>
                          <option value="5 years">5 Years</option>
                          <option value="indefinite">Indefinite</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">How long to keep your data after account deletion</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ecosystem Tab */}
            {activeTab === 'ecosystem' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Ecosystem Integration</h2>
                
                <div className="space-y-6">
                  {/* Connection Status */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {isConnected ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-orange-500" />
                      )}
                      <h3 className="text-lg font-medium text-gray-900">
                        {isConnected ? 'Connected to Ecosystem' : 'Not Connected'}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {isConnected 
                        ? `You're connected to ${profile.partnerName}'s MenoWellness account. You'll receive real-time updates and insights.`
                        : 'Connect with your partner\'s MenoWellness account to receive personalized insights and support recommendations.'
                      }
                    </p>
                    {!isConnected && (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Connect to Partner
                      </button>
                    )}
                  </div>

                  {/* Connected Apps */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Applications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                            <Heart className="w-5 h-5 text-pink-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">MenoWellness</p>
                            <p className="text-sm text-gray-500">
                              {isConnected ? 'Connected' : 'Not Connected'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isConnected && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Active
                            </span>
                          )}
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            {isConnected ? 'Manage' : 'Connect'}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Dr. Alex AI</p>
                            <p className="text-sm text-gray-500">Clinical Assistant</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            Available
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Insights */}
                  {isConnected && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Cross-App Insights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Support Effectiveness</h4>
                          <p className="text-2xl font-bold text-blue-600 mb-1">84%</p>
                          <p className="text-sm text-gray-500">Based on partner feedback</p>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Communication Score</h4>
                          <p className="text-2xl font-bold text-green-600 mb-1">8.2/10</p>
                          <p className="text-sm text-gray-500">Improving trend</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
