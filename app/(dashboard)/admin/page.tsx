"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Image as ImageIcon, Heart, AlertTriangle, ArrowUpRight, TrendingUp, Shield, Activity, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/app/lib/api";

export default function AdminOverviewPage() {
  const [metricsData, setMetricsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminMetrics();
      setMetricsData(data);
    } catch (e) {
      console.warn("Using local fallback metrics", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const metrics = [
    {
      title: "Total Users",
      value: metricsData?.totalUsers !== undefined ? metricsData.totalUsers.toLocaleString() : "0",
      change: "Active user accounts",
      icon: Users,
    },
    {
      title: "Published Photos",
      value: metricsData?.publishedPhotos !== undefined ? metricsData.publishedPhotos.toLocaleString() : "0",
      change: "Public feed submissions",
      icon: ImageIcon,
    },
    {
      title: "Total Engagement",
      value: metricsData?.totalEngagement !== undefined ? metricsData.totalEngagement.toLocaleString() : "0",
      change: "Likes & comments",
      icon: Heart,
    },
    {
      title: "Flagged Queue",
      value: metricsData?.flaggedQueue !== undefined ? metricsData.flaggedQueue.toString() : "0",
      change: "Action required",
      icon: AlertTriangle,
    },
  ];

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">Loading system metrics...</p>
      </div>
    );
  }

  const recentActivities = metricsData?.recentActivity || [];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Overview Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            System Overview
            <TrendingUp className="w-4 h-4 text-zinc-400" />
          </h1>
          <p className="text-xs text-zinc-400">Real-time platform metrics and content moderation overview</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadMetrics}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded-lg transition-colors"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 bg-black border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium px-3.5 py-2 rounded-xl transition-all"
          >
            Users Directory
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            Moderation Queue
            <Shield className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.title} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium font-sans">{m.title}</span>
              <div className="p-2 rounded-xl bg-black border border-zinc-900 text-zinc-400">
                <m.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="font-heading text-2xl font-bold text-white block">{m.value}</span>
              <span className="text-[10px] font-mono text-zinc-500">{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Moderation & Activity Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-400" />
              Moderation Activity Logs
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">LIVE FEED</span>
          </div>

          {recentActivities.length === 0 ? (
            <div className="py-8 text-center space-y-1">
              <p className="text-xs text-zinc-400">No recent moderation activity</p>
              <p className="text-[11px] text-zinc-500">All photo submissions are clear of reports.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((act: any) => (
                <div key={act.id} className="p-3 bg-black rounded-xl border border-zinc-900 flex items-center justify-between gap-4 text-xs">
                  <div className="min-w-0">
                    <span className="font-semibold text-white font-heading block truncate">
                      {act.post?.title || "Reported Photograph"}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      By @{act.post?.author?.username || "creator"} • {act.reason || "Flagged for review"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Action Panel */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Shield className="w-4 h-4 text-zinc-400" />
            Quick Admin Controls
          </h3>

          <div className="space-y-2.5">
            <Link
              href="/admin/posts"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-900 hover:border-zinc-800 text-xs font-semibold text-white transition-all group"
            >
              <span>Review Pending Queue</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/users"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-900 hover:border-zinc-800 text-xs font-semibold text-white transition-all group"
            >
              <span>Manage User Status & Roles</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/support"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-black border border-zinc-900 hover:border-zinc-800 text-xs font-semibold text-white transition-all group"
            >
              <span>Support Contact Desk</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
