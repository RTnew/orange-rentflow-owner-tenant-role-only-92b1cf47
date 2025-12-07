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

  // Fetch user role
  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("uuid", userId)
      .single();

    if (error) {
      console.error("Role fetch error:", error);
      return null;
    }

    return data?.role || null;
  };

  // Sign Up
  const signUp = async (email, password, fullName, phone, role) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      });

      if (error) return { error };

      if (!data.user?.id) return { error: new Error("User ID missing") };

      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ uuid: data.user.id, role });

      if (roleError) return { error: roleError };

      toast.success("Account created!");

      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  // Sign In
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    window.location.href = "/";
  };

  // Redirect user based on role
  const redirectByRole = (role: UserRole | null) => {
    if (!role) return;

    if (role === "owner") {
      window.location.href = "/owner/OwnerDashboard";
    } else if (role === "tenant") {
      window.location.href = "/tenant/TenantDashboard";
    } else if (role === "admin") {
      window.location.href = "/admin";
    }
  };

  // Auth Listener
  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const role = await fetchUserRole(data.session.user.id);
        setUser(data.session.user);
        setSession(data.session);
        setUserRole(role);

        redirectByRole(role);
      }

      setLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setUser(session.user);
          setSession(session);
          setUserRole(role);

          redirectByRole(role);
        } else {
          setUser(null);
          setSession(null);
          setUserRole(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
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
  if (!context)
    throw new Error("useAuth must be used inside AuthProvider");

  return context;
};