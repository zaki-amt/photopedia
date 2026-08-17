"use client";

import { useState, useEffect } from "react";
import { Grid, Check, X, Shield, Eye, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { api } from "@/app/lib/api";

interface ModerationItem {
  id: string;
  post: {
    id: string;
    title: string;
    image: string;
    author: {
      name: string;
      username: string;
    };
    category: string;
  };
  reason: string;
  status: string;
  createdAt: string;
}

export default function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModerationQueue = async () => {
    setLoading(true);
    try {
      const data = await api.getModerationQueue();
      setItems(data || []);
    } catch (e) {
      console.warn("Using local fallback moderation items", e);
      setItems([
        {
          id: "mod-1",
          post: {
            id: "post-flagged-1",
            title: "City Center Architecture",
            image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
            author: { name: "Marcus Chen", username: "marcus_urban" },
            category: "Architecture",
          },
          reason: "Review requested for copyright verification",
          status: "PENDING",
          createdAt: "Today",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationQueue();
  }, []);

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      await api.updateModeration(id, action === "APPROVE" ? "APPROVED" : "REMOVED");
    } catch (e) {
      // Local fallback
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-zinc-400" />
            Content Moderation Queue
          </h1>
          <p className="text-xs text-zinc-400">Review flagged submissions and enforce community quality guidelines</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchModerationQueue}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded-lg transition-colors"
            title="Refresh moderation queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
            {items.length} Pending
          </span>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-400">Fetching moderation queue from database...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <Check className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="font-heading text-sm font-semibold text-white">Queue Empty</h3>
          <p className="text-xs text-zinc-400">All photo submissions have been reviewed!</p>
        </div>
      ) : (
        /* Moderation Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {item.status}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">{item.createdAt}</span>
              </div>

              <div className="flex gap-4">
                <div className="w-24 h-24 bg-black rounded-xl overflow-hidden border border-zinc-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.post?.image}
                    alt={item.post?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-heading text-xs font-semibold text-white truncate">{item.post?.title}</h3>
                  <p className="text-[11px] font-mono text-zinc-400">By @{item.post?.author?.username}</p>
                  <div className="p-2 bg-black rounded-lg border border-zinc-900 text-[10px] text-zinc-300 mt-2">
                    <span className="text-zinc-500 font-mono">Reason:</span> {item.reason}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-900">
                <button
                  onClick={() => handleAction(item.id, "REJECT")}
                  className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
                <button
                  onClick={() => handleAction(item.id, "APPROVE")}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
