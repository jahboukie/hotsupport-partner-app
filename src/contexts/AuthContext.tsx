/**
 * Authentication Context for SupportPartner
 * Integrates Supabase Auth with user profile management
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

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
  created_at: string;
  updated_at: string;
  last_active_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await loadUserProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
      
      if (event === 'SIGNED_OUT') {
        // Clear any cached data
        setProfile(null);
        localStorage.removeItem('supportpartner-user-id');
        localStorage.removeItem('supportpartner-user-name');
        localStorage.removeItem('supportpartner-user-email');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user profile from Supabase
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
        // Update localStorage for backward compatibility
        localStorage.setItem('supportpartner-user-id', data.id);
        localStorage.setItem('supportpartner-user-name', data.name || '');
        localStorage.setItem('supportpartner-user-email', data.email || '');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Create user profile
  const createUserProfile = async (user: User, userData: Partial<UserProfile>) => {
    try {
      const profileData: Partial<UserProfile> = {
        id: user.id,
        email: user.email!,
        name: userData.name || user.email!.split('@')[0],
        preferred_name: userData.preferred_name,
        partner_name: userData.partner_name,
        relationship_duration: userData.relationship_duration,
        timezone: userData.timezone || 'UTC',
        language: userData.language || 'en',
        support_style: userData.support_style,
        goals: userData.goals || [],
        profile_data: {
          onboarding_completed: false,
          app_name: 'supportpartner'
        }
      };

      const { error } = await supabase
        .from('user_profiles')
        .insert(profileData);

      if (error) {
        console.error('Error creating profile:', error);
        return { success: false, error: error.message };
      }

      await loadUserProfile(user.id);
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: 'Failed to create user profile' };
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || email.split('@')[0],
            partner_name: userData.partner_name
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user profile
        const profileResult = await createUserProfile(data.user, userData);
        if (!profileResult.success) {
          return profileResult;
        }

        return { 
          success: true, 
          message: 'Sign up successful! Please check your email to verify your account.' 
        };
      }

      return { success: false, error: 'Unknown error occurred' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Sign up failed' };
    } finally {
      setLoading(false);
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Update last active timestamp
      if (data.user) {
        await supabase
          .from('user_profiles')
          .update({ last_active_at: new Date().toISOString() })
          .eq('id', data.user.id);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Sign in failed' };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      // Reload profile
      await loadUserProfile(user.id);
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Failed to send reset email' };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export for use in other parts of the app
export default AuthContext;