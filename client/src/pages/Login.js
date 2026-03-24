import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center p-4 font-manrope">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-primary-dim to-secondary bg-clip-text text-transparent mb-2">
            CAREER ARCHITECT
          </h1>
          <p className="text-on-surface-variant text-sm">Welcome back to your command center</p>
        </div>

        <div className="glass-panel p-8 rounded-[1.5rem] relative overflow-hidden">
          {/* Toggle */}
          <div className="flex bg-surface-container-lowest p-1 rounded-xl mb-8">
            <div className="w-1/2 flex items-center justify-center py-2 bg-surface-variant rounded-lg text-on-surface font-bold text-sm shadow-lg shadow-black/20">
              Sign In
            </div>
            <Link to="/register" className="w-1/2 flex items-center justify-center py-2 text-on-surface-variant hover:text-on-surface font-medium text-sm transition-colors">
              Create Account
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-error-container/20 border border-error/50 rounded-lg text-error text-sm text-center">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface-variant block">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-surface-container-lowest border border-transparent focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline outline-none transition-all"
                placeholder="alex.mercer@architect.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-on-surface-variant block">Password</label>
                <button type="button" className="text-xs text-secondary hover:underline">Forgot password?</button>
              </div>
              <input
                type="password"
                required
                className="w-full bg-surface-container-lowest border border-transparent focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full kinetic-gradient text-on-primary-fixed font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 mt-8 disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
