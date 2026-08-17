"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useLike } from "@/app/hooks/useLike";

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  initialIsLiked?: boolean;
  onLikeChange?: (isLiked: boolean, count: number) => void;
  className?: string;
  showCount?: boolean;
  size?: "sm" | "md";
}

export function LikeButton({
  postId,
  initialLikes = 0,
  initialIsLiked = false,
  onLikeChange,
  className = "",
  showCount = true,
  size = "md",
}: LikeButtonProps) {
  const { isLiked, likeCount, toggleLike } = useLike(postId, initialLikes, initialIsLiked);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLike();
    if (onLikeChange) {
      onLikeChange(!isLiked, !isLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
    }
  };

  const isFilled = isLiked && likeCount > 0;
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 font-medium transition-all ${
        isFilled ? "text-rose-500 font-semibold" : "text-zinc-400 hover:text-white"
      } ${className}`}
      title={isFilled ? "Unlike photograph" : "Like photograph"}
    >
      <Heart
        className={`${iconSize} transition-transform active:scale-125 ${
          isFilled ? "fill-rose-500 text-rose-500" : "text-zinc-400"
        }`}
      />
      {showCount && (
        <span className={isFilled ? "text-rose-500 font-bold" : "text-zinc-400"}>
          {likeCount}
        </span>
      )}
    </button>
  );
}

export default LikeButton;
