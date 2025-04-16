
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

export type UserRole = 'owner' | 'vendor' | 'customer' | null;

// Extended User type that includes our custom properties
export interface ExtendedUser extends Omit<SupabaseUser, 'role'> {
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
        
        // Convert SupabaseUser to ExtendedUser
        if (newSession?.user) {
          const extendedUser: ExtendedUser = {
            ...newSession.user as Omit<SupabaseUser, 'role'>
          };
          setUser(extendedUser);

          // If we have a session, fetch additional user data
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      // Convert SupabaseUser to ExtendedUser
      if (currentSession?.user) {
        const extendedUser: ExtendedUser = {
          ...currentSession.user as Omit<SupabaseUser, 'role'>
        };
        setUser(extendedUser);
        
        fetchUserProfile(currentSession.user.id);
      } else {
        setUser(null);
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
        console.error("Signup error:", error);
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
          throw profileError;
        }
        
        toast({
          title: "Account created successfully",
          description: role === 'vendor' ? "Your vendor account is pending approval." : "Welcome to the marketplace!",
        });
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
      signup
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
