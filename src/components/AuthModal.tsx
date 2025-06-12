/**
 * Authentication Modal Component
 * Handles sign in, sign up, and password reset
 */

import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'signup';
  onSuccess?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'reset';

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  mode: propMode = 'signup',
  onSuccess 
}) => {
  const { signIn, signUp, resetPassword, loading } = useAuth();
  const [mode, setMode] = useState<AuthMode>(propMode === 'login' ? 'signin' : 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    partnerName: '',
    relationshipDuration: '',
    supportStyle: 'Active Listener'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string>('');

  if (!isOpen) return null;

  const clearForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      partnerName: '',
      relationshipDuration: '',
      supportStyle: 'Active Listener'
    });
    setErrors({});
    setSuccess('');
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation for signin and signup
    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (mode === 'signup' && formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      // Confirm password for signup
      if (mode === 'signup') {
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }

        // Name validation for signup
        if (!formData.name.trim()) {
          newErrors.name = 'Your name is required';
        }

        if (!formData.partnerName.trim()) {
          newErrors.partnerName = 'Partner name is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setErrors({});
    setSuccess('');

    try {
      if (mode === 'signin') {
        const result = await signIn(formData.email, formData.password);
        if (result.success) {
          onClose();
          clearForm();
          if (onSuccess) onSuccess();
        } else {
          setErrors({ submit: result.error || 'Sign in failed' });
        }
      } else if (mode === 'signup') {
        const result = await signUp(formData.email, formData.password, {
          name: formData.name,
          partner_name: formData.partnerName,
          relationship_duration: formData.relationshipDuration,
          support_style: formData.supportStyle,
          goals: ['Better Communication', 'Understanding Symptoms', 'Emotional Support']
        });
        
        if (result.success) {
          setSuccess('Account created successfully! Please check your email to verify your account.');
          setTimeout(() => {
            onClose();
            clearForm();
            if (onSuccess) onSuccess();
          }, 2000);
        } else {
          setErrors({ submit: result.error || 'Sign up failed' });
        }
      } else if (mode === 'reset') {
        const result = await resetPassword(formData.email);
        if (result.success) {
          setSuccess('Password reset email sent! Check your inbox.');
        } else {
          setErrors({ submit: result.error || 'Password reset failed' });
        }
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'signin' && 'Welcome Back'}
                {mode === 'signup' && 'Join SupportPartner'}
                {mode === 'reset' && 'Reset Password'}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === 'signin' && 'Sign in to continue supporting your partner'}
                {mode === 'signup' && 'Start your journey as a supportive partner'}
                {mode === 'reset' && 'Enter your email to reset your password'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{errors.submit}</span>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
            </div>
          )}

          {/* Confirm Password Field - Only for signup */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          {/* Name Fields - Only for signup */}
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partner's Name
                  </label>
                  <input
                    type="text"
                    value={formData.partnerName}
                    onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.partnerName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Partner's name"
                  />
                  {errors.partnerName && <p className="text-sm text-red-600 mt-1">{errors.partnerName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship Duration
                </label>
                <select
                  value={formData.relationshipDuration}
                  onChange={(e) => setFormData({ ...formData, relationshipDuration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select duration</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-5 years">1-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10-20 years">10-20 years</option>
                  <option value="20+ years">20+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Support Style
                </label>
                <select
                  value={formData.supportStyle}
                  onChange={(e) => setFormData({ ...formData, supportStyle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active Listener">Active Listener</option>
                  <option value="Problem Solver">Problem Solver</option>
                  <option value="Emotional Support">Emotional Support</option>
                  <option value="Practical Helper">Practical Helper</option>
                  <option value="Research Oriented">Research Oriented</option>
                </select>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === 'signin' && 'Signing In...'}
                {mode === 'signup' && 'Creating Account...'}
                {mode === 'reset' && 'Sending Email...'}
              </div>
            ) : (
              <>
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Send Reset Email'}
              </>
            )}
          </button>

          {/* Mode Switching */}
          <div className="text-center space-y-2">
            {mode === 'signin' && (
              <>
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
                <p className="text-sm text-gray-600">
                  Forgot your password?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('reset')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reset it
                  </button>
                </p>
              </>
            )}

            {mode === 'signup' && (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'reset' && (
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;