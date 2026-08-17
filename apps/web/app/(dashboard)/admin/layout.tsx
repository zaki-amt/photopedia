"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { AdminSidebarNav } from "@/app/components/layout/AdminSidebarNav";
import { ShieldAlert, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-4 font-sans shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="font-heading text-lg font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-zinc-400">
            Your current active account does not have administrator privileges. System management tools are restricted to platform administrators.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/feed"
            className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Main Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 font-sans items-start">
      {/* Admin Panel Sidebar */}
      <AdminSidebarNav />

      {/* Admin Content Area */}
      <div className="flex-1 space-y-6 w-full min-w-0">
        {/* Admin Session Header Bar */}
        <div className="bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              Admin Verified: <strong className="font-mono text-white">{user.email}</strong>
            </span>
          </div>
          <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-md font-mono text-[10px] uppercase">
            Platform Administrator
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
