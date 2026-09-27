import { Navigate } from "react-router-dom";
import { useAuth } from "@/_core/hooks/useAuth";

interface UserGuardProps {
  children: React.ReactNode;
}

export default function UserGuard({ children }: UserGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
          aria-label="Vérification de votre session"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "USER") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
