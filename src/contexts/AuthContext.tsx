
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export type UserRole = 'owner' | 'vendor' | 'customer' | null;

// Extended User type that includes our custom properties
export interface ExtendedUser extends SupabaseUser {
  role?: UserRole;
  approved?: boolean;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  verifyOwnerCode: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ? {...newSession.user} : null);

        // If we have a session, fetch additional user data
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ? {...currentSession.user} : null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data including role
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role, approved, name, avatar')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      // Enhance user object with additional information
      if (data) {
        setUser(prevUser => {
          if (!prevUser) return prevUser;
          return { 
            ...prevUser, 
            role: data.role as UserRole, // Cast to UserRole type
            approved: data.approved,
            name: data.name || prevUser.email?.split('@')[0], // Use email as fallback for name
            avatar: data.avatar
          };
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Verify owner code against the database
  const verifyOwnerCode = async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('owner_codes')
        .select('*')
        .eq('code', code)
        .eq('used', false)
        .single();
      
      if (error || !data) {
        console.error('Invalid owner code:', error);
        return false;
      }
      
      // Mark the code as used
      const { error: updateError } = await supabase
        .from('owner_codes')
        .update({ used: true })
        .eq('code', code);
      
      if (updateError) {
        console.error('Error updating owner code status:', updateError);
      }
      
      // Update the user's role to owner in the users table
      if (user) {
        const { error: roleUpdateError } = await supabase
          .from('users')
          .update({ 
            role: 'owner',
            approved: true,
            owner_code: code
          })
          .eq('id', user.id);
        
        if (roleUpdateError) {
          console.error('Error updating user role:', roleUpdateError);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error verifying owner code:', error);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      // User data is handled by onAuthStateChange
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      // Session and user state handled by onAuthStateChange
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      // Then create the user record with role
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email: email,
          role: role,
          // Default values handled by database
        });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          toast({
            title: "Profile creation failed",
            description: "Your account was created, but we couldn't set up your profile.",
            variant: "destructive"
          });
        }
      }
      
      // User data is handled by onAuthStateChange
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      isAuthenticated: !!user, 
      isLoading,
      login,
      logout,
      signup,
      verifyOwnerCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
