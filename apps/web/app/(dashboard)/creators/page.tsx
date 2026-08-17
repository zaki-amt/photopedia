"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  ArrowLeft,
  ChevronRight,
  Camera,
  Layers,
  Sparkles,
  Loader2,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { api } from "@/app/lib/api";

export default function PublicCreatorsDirectoryPage() {
  const router = useRouter();
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCreators() {
      try {
        const data = await api.getSuggestedCreators();
        setCreators(data || []);
      } catch (e) {
        setCreators([
          { id: "1", name: "Photopedia Admin", username: "admin", avatar: "/avatar.jpg", bio: "Photopedia Platform Curator" },
          { id: "2", name: "Elena Rostova", username: "elena_photos", avatar: "/avatar.jpg", bio: "Landscape & outdoor photographer documenting natural light." },
          { id: "3", name: "Marcus Chen", username: "marcus_urban", avatar: "/avatar.jpg", bio: "Urban architecture and street photography specialist." },
          { id: "4", name: "Sophia Martinez", username: "sophia_portraits", avatar: "/avatar.jpg", bio: "Natural light portraiture & editorial studio series." },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadCreators();
  }, []);

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* Hero Banner */}
      <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden shadow-sm space-y-3">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-black text-zinc-300 text-xs font-mono">
          <Users className="w-3.5 h-3.5 text-zinc-400" />
          <span>Creator Network Archive</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
          Visual Storytellers & Photographers
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Discover creators, view public portfolios, explore gear lists, and follow their photographic journeys.
        </p>
      </div>

      {/* Creators Grid */}
      {loading ? (
        <div className="p-16 text-center space-y-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-400">Loading creators directory from database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((c) => (
            <div
              key={c.username}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.avatar || "/avatar.jpg"}
                  alt={c.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-zinc-800 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-heading text-base font-bold text-white truncate">{c.name}</h3>
                  <p className="text-xs font-mono text-zinc-400 truncate">@{c.username}</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-sans">
                {c.bio || "Photographer documenting visual light reflections."}
              </p>

              <div className="pt-3 border-t border-zinc-900 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">
                  {c._count?.posts || 0} Posts
                </span>

                <Link
                  href={`/creators/${c.username}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-zinc-200 text-black px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
                >
                  View Public Profile
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
