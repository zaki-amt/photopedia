"use client";

import { useState } from "react";
import { Grid, Trash2, AlertTriangle, Check } from "lucide-react";

interface ModerationPost {
  id: string;
  author: string;
  image: string;
  caption: string;
  reason: string;
  status: "pending" | "approved" | "removed";
  date: string;
}

const INITIAL_MODERATION_POSTS: ModerationPost[] = [
  {
    id: "101",
    author: "@spambot99",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    caption: "Click link in bio to win free crypto prizes fast!!!",
    reason: "Flagged for Spam / Promotional Content",
    status: "pending",
    date: "10m ago",
  },
  {
    id: "102",
    author: "@unknown_user",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80",
    caption: "Unfiltered photo submission from city center.",
    reason: "Unclear copyright ownership claim",
    status: "pending",
    date: "45m ago",
  },
  {
    id: "103",
    author: "@marcus_urban",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    caption: "Misty mountain range photo session.",
    reason: "Automated keyword flag (false positive)",
    status: "approved",
    date: "2h ago",
  },
];

export default function ContentModerationPage() {
  const [posts, setPosts] = useState<ModerationPost[]>(INITIAL_MODERATION_POSTS);

  const handleAction = (id: string, newStatus: "approved" | "removed") => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          return { ...post, status: newStatus };
        }
        return post;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-zinc-400" />
            Content Moderation
          </h1>
          <p className="text-xs text-zinc-400">Review reported posts and enforce platform safety</p>
        </div>
      </div>

      {/* Grid of Moderation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              {/* Image preview */}
              <div className="relative aspect-[16/10] bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt="Flagged Content"
                  className="w-full h-full object-cover"
                />

                <span
                  className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
                    post.status === "pending"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : post.status === "approved"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                  }`}
                >
                  {post.status}
                </span>
              </div>

              {/* Details */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-semibold text-white">{post.author}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{post.date}</span>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{post.caption}</p>

                <div className="flex items-start gap-2 bg-black border border-zinc-900 p-2.5 rounded-xl text-xs text-zinc-400">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-tight">{post.reason}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-3 px-5 border-t border-zinc-900 flex items-center justify-between bg-black/40">
              {post.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleAction(post.id, "removed")}
                    className="inline-flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-500/20 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>

                  <button
                    onClick={() => handleAction(post.id, "approved")}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                </>
              ) : (
                <div className="w-full text-center text-[11px] font-mono text-zinc-500 py-0.5">
                  RESOLVED: {post.status.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
