"use client";

import { useUser } from "@/app/(dashboard)/layout";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  if (user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-3 font-sans shadow-sm">
        <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <h2 className="font-heading text-lg font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-zinc-400">
          You need administrator privileges to access system management tools.
        </p>
        <Link
          href="/feed"
          className="inline-block bg-white hover:bg-zinc-200 text-black font-semibold px-4 py-2 rounded-lg text-xs transition-all shadow-sm"
        >
          Return to Feed
        </Link>
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
        <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-md font-mono text-[10px]">
          ROLE: ADMIN
        </span>
      </div>

      {children}
    </div>
  );
}
