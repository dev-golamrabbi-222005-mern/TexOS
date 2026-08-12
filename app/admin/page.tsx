'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full glass-panel p-8 rounded-2xl shadow-xl border border-purple-500/20 text-center">
        <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M9 8h.01M15 16h.01M15 12h.01M15 8h.01" />
          </svg>
        </div>

        <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold rounded-full uppercase tracking-wider">
          Operations Control Center
        </span>

        <h1 className="text-3xl font-extrabold mt-4 text-white">
          Welcome, {session?.user?.fullName || 'Manager / Admin'}!
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Factory Operations, Grievances Management & Production Analytics
        </p>

        <div className="mt-6 p-4 glass-card rounded-xl text-left text-xs space-y-2 font-mono text-slate-300">
          <div><span className="text-slate-500">Phone:</span> {session?.user?.phone}</div>
          <div><span className="text-slate-500">Role:</span> {session?.user?.userType}</div>
          <div><span className="text-slate-500">User ID:</span> {session?.user?.id}</div>
          <div><span className="text-slate-500">Factory ID:</span> {session?.user?.factoryId || 'Assigned'}</div>
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
