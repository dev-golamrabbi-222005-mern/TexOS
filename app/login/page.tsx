'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [phone, setPhone] = useState('+8801700000005');
  const [otpCode, setOtpCode] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper function to handle role-based redirection
  const handleRedirect = (userType: string) => {
    switch (userType) {
      case 'Worker':
        router.push('/worker');
        break;
      case 'LineSupervisor':
        router.push('/supervisor');
        break;
      case 'QCInspector':
        router.push('/qc');
        break;
      case 'HRManager':
      case 'FactoryAdmin':
      case 'SuperAdmin':
        router.push('/admin');
        break;
      default:
        router.push('/admin');
    }
  };

  // Automatically redirect if user is already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.userType) {
      handleRedirect(session.user.userType);
    }
  }, [status, session]);

  const handleSendOtp = async () => {
    setMessage(null);
    setSendingOtp(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      setMessage({ type: 'success', text: data.message });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending OTP';
      setMessage({ type: 'error', text: msg });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        phone,
        otpCode,
        redirect: false,
      });

      if (res?.error) {
        setMessage({ type: 'error', text: res.error });
        setLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Authentication successful! Redirecting...' });

      // Fetch active session to perform exact role redirect
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      if (sessionData?.user?.userType) {
        handleRedirect(sessionData.user.userType);
      } else {
        router.push('/admin');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setMessage({ type: 'error', text: msg });
      setLoading(false);
    }
  };

  const fillQuickAccount = (phoneNum: string) => {
    setPhone(phoneNum);
    setOtpCode('123456');
    setMessage({ type: 'success', text: `Selected account: ${phoneNum}. Test OTP set to 123456.` });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/40 via-slate-900 to-[#090d16]">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-3 shadow-inner">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457-.39-2.823-1.07-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">TexOS</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">RMG Worker Safety & Production Tracking</p>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-xs font-medium mb-6 flex items-start gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}
          >
            <span className="mt-0.5">{message.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+8801700000001"
                required
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm transition"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || !phone}
                className="absolute right-2 top-2 bottom-2 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-medium rounded-lg transition border border-slate-700 disabled:opacity-50"
              >
                {sendingOtp ? 'Sending...' : 'Request OTP'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              OTP Verification Code
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              required
              maxLength={6}
              className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm tracking-widest text-center font-mono transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition transform active:scale-[0.98]"
          >
            {loading ? 'Authenticating...' : 'Sign In with OTP'}
          </button>
        </form>

        {/* Quick Test Login Accounts */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs text-slate-400 font-semibold mb-3 text-center uppercase tracking-wider">
            Quick Test Accounts (OTP: 123456)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => fillQuickAccount('+8801700000005')}
              className="p-2 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 text-left transition flex items-center justify-between"
            >
              <span>Worker 1</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">/worker</span>
            </button>

            <button
              onClick={() => fillQuickAccount('+8801700000003')}
              className="p-2 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 text-left transition flex items-center justify-between"
            >
              <span>Supervisor</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">/supervisor</span>
            </button>

            <button
              onClick={() => fillQuickAccount('+8801700000004')}
              className="p-2 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 text-left transition flex items-center justify-between"
            >
              <span>QC Inspector</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">/qc</span>
            </button>

            <button
              onClick={() => fillQuickAccount('+8801700000002')}
              className="p-2 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 text-left transition flex items-center justify-between"
            >
              <span>HR Manager</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">/admin</span>
            </button>

            <button
              onClick={() => fillQuickAccount('+8801700000001')}
              className="col-span-2 p-2 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 transition flex items-center justify-between"
            >
              <span>Factory Admin (+8801700000001)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">/admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
