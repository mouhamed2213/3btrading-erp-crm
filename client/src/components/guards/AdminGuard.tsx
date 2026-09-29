import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import AdminLoginForm from "../layout/AdminLoginForm";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          <p className="text-sm text-slate-300">Vérification de votre session…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLoginForm />;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-900/60 bg-slate-900 p-8 text-center text-white shadow-2xl">
          <h1 className="text-2xl font-bold">Accès non autorisé</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Votre compte est bien connecté, mais il ne possède pas le rôle administrateur requis pour cette console.
          </p>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={() => void logout()}
              variant="outline"
              className="flex-1 border-slate-700 bg-transparent text-white hover:bg-slate-800"
            >
              Se déconnecter
            </Button>
            <Link to="/" className="flex-1">
              <Button className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400">
                Vitrine
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
