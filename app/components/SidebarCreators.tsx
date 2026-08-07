"use client";

import { UserPlus } from "lucide-react";

interface CreatorItem {
  name: string;
  username: string;
  avatar?: string;
}

interface SidebarCreatorsProps {
  creators: CreatorItem[];
  followingMap?: { [key: string]: boolean };
  onToggleFollow?: (username: string) => void;
}

export function SidebarCreators({
  creators,
  followingMap = {},
  onToggleFollow,
}: SidebarCreatorsProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-zinc-400" />
          Suggested For You
        </h3>
      </div>

      <div className="space-y-3">
        {creators.map((creator) => {
          const isFollowing = followingMap[creator.username];
          return (
            <div key={creator.username} className="flex items-center justify-between gap-3 p-1.5">
              <div className="flex items-center gap-3 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    creator.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  }
                  alt={creator.name}
                  className="w-9 h-9 rounded-full object-cover border border-zinc-800 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-heading text-xs font-semibold text-white truncate leading-tight">
                    {creator.name}
                  </h4>
                  <p className="text-[11px] font-mono text-zinc-500 truncate">@{creator.username}</p>
                </div>
              </div>

              {onToggleFollow && (
                <button
                  onClick={() => onToggleFollow(creator.username)}
                  className={`text-xs font-medium px-3 py-1 rounded-lg transition-all shrink-0 border ${
                    isFollowing
                      ? "bg-zinc-900 text-zinc-400 border-zinc-800"
                      : "bg-white hover:bg-zinc-200 text-black border-white"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
