import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type UserRole = "admin" | "owner" | "tenant";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      if (userRole && !allowedRoles.includes(userRole)) {
        toast.error("You don't have permission to access this page");
        
        // Redirect based on user's role
        switch (userRole) {
          case "admin":
            navigate("/admin", { replace: true });
            break;
          case "owner":
            navigate("/owner/dashboard", { replace: true });
            break;
          case "tenant":
            navigate("/tenant/dashboard", { replace: true });
            break;
          default:
            navigate("/auth", { replace: true });
        }
      }
    }
  }, [user, userRole, loading, allowedRoles, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !userRole || !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};
