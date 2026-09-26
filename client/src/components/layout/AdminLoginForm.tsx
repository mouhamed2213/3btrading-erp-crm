import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth';

export default function AdminLoginForm() {
  const { login, loginPending } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl">
        <img src="/files/3btrading/logo.png" alt="3BTRADING" className="mx-auto mb-5 h-14 w-14 object-contain" />
        <h1 className="text-2xl font-bold text-center">Accès à la console interne</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300 text-center">
          Connectez-vous avec un compte autorisé pour gérer les publications, les stocks et les opérations 3BTRADING.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" disabled={loginPending} className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400">
            {loginPending ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
        <Link to="/" className="mt-4 inline-block text-sm text-slate-400 hover:text-white">
          Retour à la vitrine
        </Link>
      </div>
    </div>
  );
}
