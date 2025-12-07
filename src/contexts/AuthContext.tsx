import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type UserRole = "admin" | "owner" | "tenant";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: UserRole
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch role from Supabase user_roles table
  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("uuid", userId)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return null;
    }

    return data?.role || null;
  };

  // Sign Up
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    role: UserRole
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        toast.error("Signup failed");
        return { error };
      }

      const userId = data.user?.id;
      if (!userId) {
        toast.error("User ID missing after signup");
        return { error: new Error("User ID missing") };
      }

      // Insert user role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ uuid: userId, role });

      if (roleError) {
        toast.error("Failed to assign role");
        return { error: roleError };
      }

      toast.success("Account created successfully!");
      return { error: null };
    } catch (err) {
      console.error("Signup crashed:", err);
      return { error: err };
    }
  };

  // Sign In
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    window.location.href = "/";
  };

  // Auth Listener + Redirect Logic
  useEffect(() => {
    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const role = await fetchUserRole(data.session.user.id);

        setUser(data.session.user);
        setSession(data.session);
        setUserRole(role);

        // Redirect based on role
        if (role === "owner") window.location.href = "/owner";
        if (role === "tenant") window.location.href = "/tenant";
        if (role === "admin") window.location.href = "/admin";
      }

      setLoading(false);
    };

    getInitialSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);

          setUser(session.user);
          setSession(session);
          setUserRole(role);

          // Redirect
          if (role === "owner") window.location.href = "/owner";
          if (role === "tenant") window.location.href = "/tenant";
          if (role === "admin") window.location.href = "/admin";
        } else {
          setUser(null);
          setSession(null);
          setUserRole(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used inside AuthProvider");
  return context;
};