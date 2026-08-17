"use client";

import React from "react";
import Link from "next/link";
import { Users } from "lucide-react";

export function FollowingEmptyState() {
  return (
    <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
      <Users className="w-8 h-8 text-zinc-600 mx-auto" />
      <div className="space-y-1">
        <h3 className="font-heading text-sm font-semibold text-white">
          You're not following anyone yet
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          Follow visual storytellers to see their latest photographs in your customized Following feed.
        </p>
      </div>
      <Link
        href="/creators"
        className="inline-block bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:bg-zinc-200 transition-all"
      >
        Explore Creators Directory
      </Link>
    </div>
  );
}

export default FollowingEmptyState;
