"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Layers,
  Users,
  Grid,
  ArrowLeft,
  Activity,
  AlertTriangle,
} from "lucide-react";

export function AdminSidebarNav() {
  const pathname = usePathname();

  const adminLinks = [
    { name: "System Overview", href: "/admin", icon: Activity },
    { name: "Category Manager", href: "/admin/categories", icon: Layers },
    { name: "User Directory", href: "/admin/users", icon: Users },
    { name: "Moderation Queue", href: "/admin/posts", icon: AlertTriangle },
  ];

  return (
    <div className="w-full lg:w-64 bg-zinc-950 border-r border-zinc-800/80 p-4 space-y-6 shrink-0 min-h-screen">
      {/* Admin Panel Header */}
      <div className="space-y-3">
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-mono transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Main App</span>
        </Link>

        <div className="flex items-center gap-2 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Admin Console</h2>
            <p className="text-[10px] font-mono text-zinc-400">Platform Controls</p>
          </div>
        </div>
      </div>

      {/* Admin Navigation Links */}
      <div className="space-y-1">
        <p className="px-2 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
          Management
        </p>
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-amber-500 text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
