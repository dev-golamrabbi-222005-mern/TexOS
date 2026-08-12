'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function QCDashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 p-6 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full glass-panel p-8 rounded-2xl shadow-xl border border-cyan-500/20 text-center">
        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold rounded-full uppercase tracking-wider">
          QC Inspection Station
        </span>

        <h1 className="text-3xl font-extrabold mt-4 text-white">
          Welcome, {session?.user?.fullName || 'QC Inspector'}!
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Quality Inspection & Defect Compliance Audit Workstation
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
