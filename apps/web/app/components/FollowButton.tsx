"use client";

import React from "react";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useFollow } from "@/app/hooks/useFollow";

interface FollowButtonProps {
  usernameOrId: string;
  initialFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
  size?: "sm" | "md";
}

export function FollowButton({
  usernameOrId,
  initialFollowing = false,
  onFollowChange,
  className = "",
  size = "md",
}: FollowButtonProps) {
  const { isFollowing, loading, toggleFollow } = useFollow(initialFollowing, usernameOrId);

  const handleClick = async () => {
    await toggleFollow();
    if (onFollowChange) {
      onFollowChange(!isFollowing);
    }
  };

  const py = size === "sm" ? "py-1 px-3 text-[11px]" : "py-2 px-5 text-xs";

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-xl transition-all shadow-sm border ${py} ${
        isFollowing
          ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700"
          : "bg-white border-white text-black hover:bg-zinc-200"
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
}

export default FollowButton;
