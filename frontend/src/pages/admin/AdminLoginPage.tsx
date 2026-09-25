import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { BUSINESS_NAME } from '../../config/business';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@carzz.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-950 text-white font-bold text-xl rounded-xl flex items-center justify-center mx-auto shadow">
            <span className="text-amber-400">A</span>D
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">{BUSINESS_NAME}</h2>
          <p className="text-xs text-slate-500">Staff & Operations Management Portal</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500">
            <span>Demo credentials pre-filled: <strong>admin@carzz.com</strong> / <strong>admin123</strong></span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow transition-colors disabled:bg-slate-400"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};