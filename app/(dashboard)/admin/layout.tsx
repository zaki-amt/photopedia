"use client";

import { useUser } from "@/app/(dashboard)/layout";
import { ShieldAlert, ShieldCheck, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, toggleRole } = useUser();

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-4 font-sans shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h2 className="font-heading text-lg font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-zinc-400">
            Your current active role is <strong className="font-mono text-white">USER</strong>. System management tools require administrator privileges.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={toggleRole}
            className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-semibold px-4 py-2.5 rounded-lg text-xs transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Switch to Admin Role
          </button>

          <Link
            href="/feed"
            className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-2.5 rounded-lg text-xs font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Admin Status Banner */}
      <div className="bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs text-zinc-300 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Admin Session Verified: <strong className="font-mono text-white">{user.email}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-md font-mono text-[10px]">
            ROLE: ADMIN
          </span>
          <button
            onClick={toggleRole}
            className="text-[10px] font-mono text-zinc-400 hover:text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 transition-colors flex items-center gap-1"
            title="Switch to User mode"
          >
            <RefreshCw className="w-3 h-3" />
            Switch
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
