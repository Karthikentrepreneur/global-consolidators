
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  role: string;
}

// Define the shape of our context
type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isAdmin: false,
  isStaff: false
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app and makes auth object available
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is admin or staff - simplified for now
  const isAdmin = user?.email === 'admin@oecl.sg';
  const isStaff = profile?.role === 'staff';

  // Fetch user profile - simplified since we don't have profiles table yet
  const fetchProfile = useCallback(
    async (userId: string) => {
      try {
        setProfile({ id: userId, role: user?.email === 'admin@oecl.sg' ? 'admin' : 'user' });
      } catch (error: unknown) {
        const err = error as Error;
        console.error('Error fetching profile:', err.message);
      }
    },
    [user?.email]
  );

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message,
      });
      throw err;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Welcome to OECL!",
      });
      navigate('/dashboard');
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err.message,
      });
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logged out successfully",
      });
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: err.message,
      });
    }
  };

  // Make the provider with its value available to children components
  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      isAdmin,
      isStaff
    }}>
      {children}
    </AuthContext.Provider>
  );
};
