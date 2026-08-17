"use client";

import React from "react";

interface FeedTabsProps {
  activeTab: "for-you" | "following";
  onTabChange: (tab: "for-you" | "following") => void;
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
      <button
        onClick={() => onTabChange("for-you")}
        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          activeTab === "for-you"
            ? "bg-zinc-800 text-white shadow-sm"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        For You
      </button>
      <button
        onClick={() => onTabChange("following")}
        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          activeTab === "following"
            ? "bg-zinc-800 text-white shadow-sm"
            : "text-zinc-400 hover:text-white"
        }`}
      >
        Following
      </button>
    </div>
  );
}

export default FeedTabs;
