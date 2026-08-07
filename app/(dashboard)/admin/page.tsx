"use client";

import Link from "next/link";
import { Users, Image as ImageIcon, Heart, AlertTriangle, ArrowUpRight, TrendingUp, Shield, Activity } from "lucide-react";

export default function AdminOverviewPage() {
  const metrics = [
    {
      title: "Total Users",
      value: "14,892",
      change: "+12.4% this month",
      icon: Users,
    },
    {
      title: "Published Photos",
      value: "98,420",
      change: "+8.1% this week",
      icon: ImageIcon,
    },
    {
      title: "Total Engagement",
      value: "1.42M",
      change: "+24.3% this month",
      icon: Heart,
    },
    {
      title: "Flagged Queue",
      value: "18",
      change: "Action required",
      icon: AlertTriangle,
    },
  ];

  const recentActivities = [
    { id: 1, user: "Elena Rostova", action: "Uploaded new photo in #landscape", time: "10m ago" },
    { id: 2, user: "Marcus Chen", action: "Reported post #8492 for copyright review", time: "25m ago" },
    { id: 3, user: "Sarah Jenkins", action: "Registered new creator account", time: "1h ago" },
    { id: 4, user: "David Vance", action: "Updated profile avatar & bio", time: "2h ago" },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Overview Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            System Overview
            <TrendingUp className="w-4 h-4 text-zinc-400" />
          </h1>
          <p className="text-xs text-zinc-400">Platform activity and moderation metrics</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 bg-black border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium px-3.5 py-2 rounded-lg transition-all"
          >
            Users
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-sm"
          >
            Moderation
            <Shield className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-2 hover:border-zinc-700 transition-colors shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">{metric.title}</span>
              <metric.icon className="w-4 h-4 text-zinc-400" />
            </div>

            <div>
              <span className="font-heading text-2xl font-bold text-white tracking-tight">{metric.value}</span>
              <p className="text-[11px] font-mono text-zinc-500 pt-0.5">{metric.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h2 className="font-heading text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-400" />
            Live Audit Log
          </h2>
          <span className="font-mono text-[10px] text-zinc-500">REALTIME</span>
        </div>

        <div className="divide-y divide-zinc-900">
          {recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white font-heading">{act.user}</span>
                <p className="text-[11px] text-zinc-400">{act.action}</p>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
