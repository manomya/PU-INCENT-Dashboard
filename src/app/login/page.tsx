'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
      } else {
        // Native redirect is much faster than router.push + router.refresh
        window.location.href = '/';
      }
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant shadow-2xl">
        <div className="text-center mb-8">
          <img 
            alt="PU-iNCENT Logo" 
            className="h-12 w-auto mx-auto mb-4" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDw8RG7islAC7a6nT-0wWr4MtgLNuO7ra0O_KkizFiA0MRlf5v8b7PLjcdbppYtD7MCSUgOVNtbKv6ogzV3ZqKlJUCARmPuHjDiBoEqWAtUq9Jv4cf3iqjghXJRg-DCa_xX4hadln40Ei9jaCUVj1qhWvP-J-G-7kd9fl1f82c3CHKhcihzB3pVAj64CMJHPb-sfKoxJzmBOrdOLGGwEqQzsVvR5SSS6GxqlV-WQTn4I9TPjF9TA-puqWETFPRu3RgaP6rh-ihHKnz" 
          />
          <h1 className="text-2xl font-headline-md font-bold text-on-surface">Welcome Back</h1>
          <p className="text-sm text-on-surface-variant mt-1">Sign in to the Incubation Dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 text-red-600 text-sm font-medium border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-variant/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-on-surface"
              placeholder="admin@pu-incent.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-variant/50 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all text-on-surface"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              isLoading 
                ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
                : 'bg-brand-orange text-white hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.23)]'
            }`}
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">login</span>
            )}
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
