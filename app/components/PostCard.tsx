"use client";

import Link from "next/link";
import { Heart, MessageCircle, Share2, ArrowRight } from "lucide-react";

export interface PostCardProps {
  id: string;
  title?: string;
  author: {
    name?: string;
    username?: string;
    avatar?: string;
  };
  category: string;
  image: string;
  caption?: string;
  likes: number;
  comments: number;
  timeAgo?: string;
  isLiked?: boolean;
  onLike?: (id: string) => void;
  onFollow?: (username: string) => void;
  isFollowing?: boolean;
}

export function PostCard({
  id,
  author,
  category,
  image,
  caption,
  likes,
  comments,
  timeAgo,
  isLiked,
  onLike,
  onFollow,
  isFollowing,
}: PostCardProps) {
  const authorName = author?.name || "Creator";
  const authorUsername = author?.username || "user";
  const authorAvatar =
    author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  return (
    <article className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors hover:border-zinc-700/80">
      {/* Post Author Bar */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-900">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-9 h-9 rounded-full object-cover border border-zinc-800"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-xs font-semibold text-white leading-tight">
                {authorName}
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                {category}
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500">
              @{authorUsername} • {timeAgo || "Recently"}
            </p>
          </div>
        </div>

        {onFollow && (
          <button
            onClick={() => onFollow(authorUsername)}
            className={`text-xs font-medium px-3 py-1 rounded-lg transition-all border ${
              isFollowing
                ? "bg-zinc-900 text-zinc-300 border-zinc-800"
                : "bg-white hover:bg-zinc-200 text-black border-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Post Caption */}
      {caption && (
        <div className="p-4 pb-3">
          <p className="text-xs text-zinc-200 leading-relaxed">{caption}</p>
        </div>
      )}

      {/* Post Image Link */}
      <Link href={`/feed/${id}`} className="block group">
        <div className="relative aspect-[16/10] bg-black overflow-hidden border-y border-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={caption || "Photograph"}
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Post Footer Actions */}
      <div className="p-4 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-5">
          <button
            onClick={() => onLike && onLike(id)}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              isLiked ? "text-rose-500" : "hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
            <span>{likes}</span>
          </button>

          <Link href={`/feed/${id}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span>{comments}</span>
          </Link>

          <button className="hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <Link href={`/feed/${id}`} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono">
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
