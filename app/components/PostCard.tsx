"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight, Flag, Check, Trash2, Pencil } from "lucide-react";
import { api } from "@/app/lib/api";
import { useUser } from "@/app/(dashboard)/layout";
import { UserAvatar } from "./UserAvatar";
import { UserNameLink } from "./UserNameLink";
import { LikeButton } from "./LikeButton";

export interface PostCardProps {
  id?: string;
  title?: string;
  author?: {
    id?: string;
    name?: string;
    username?: string;
    avatar?: string;
  };
  category?: string;
  image?: string;
  caption?: string;
  likes?: number;
  comments?: number;
  timeAgo?: string;
  isLiked?: boolean;
  onLike?: (id: string) => void;
  onFollow?: (username: string) => void;
  isFollowing?: boolean;
  post?: any;
}

export function PostCard(props: PostCardProps) {
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const p = props.post || props;

  const id = p.id || "1";
  const title = p.title || "Untitled Photograph";
  const author = p.author;
  const category = p.category || "Landscape";
  const image = p.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
  const caption = p.caption || "";

  const initialLikes = typeof p.likes === "number" ? p.likes : typeof p.likesCount === "number" ? p.likesCount : p._count?.likes || 0;
  const initialComments = typeof p.comments === "number" ? p.comments : typeof p.commentsCount === "number" ? p.commentsCount : p._count?.comments || 0;

  const authorName = author?.name || "Photopedia Creator";
  const authorUsername = author?.username || "creator";
  const authorAvatar = author?.avatar || "/avatar.jpg";

  const isAuthor = user && (user.username === authorUsername || user.id === author?.id);

  const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const [flagged, setFlagged] = useState(false);
  const [flagging, setFlagging] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleFlag = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (flagged || flagging) return;
    setFlagging(true);
    try {
      await api.flagPost(id, `Reported by community member from ${category} feed`);
      setFlagged(true);
    } catch (err) {
      setFlagged(true);
    } finally {
      setFlagging(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (deleting) return;
    if (!confirm(isAdmin ? "Admin Action: Delete this photograph from platform?" : "Are you sure you want to delete your photograph?")) return;
    setDeleting(true);
    try {
      await api.deletePost(id);
      setDeleted(true);
    } catch (err) {
      setDeleted(true);
    } finally {
      setDeleting(false);
    }
  };

  if (deleted) {
    return null;
  }

  return (
    <article className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors hover:border-zinc-700/80 font-sans">
      {/* Card Header: Author Bar & Action Controls */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Link href={`/creators/${authorUsername}`}>
              <UserAvatar src={authorAvatar} alt={authorName} size="md" />
            </Link>
            <UserNameLink name={authorName} username={authorUsername} showHandle={true} />
          </div>

          {/* Category Archive Link Badge */}
          <Link
            href={`/category/${categorySlug}`}
            className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded hover:border-zinc-700 hover:text-white transition-all ml-1"
          >
            {category}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Author Edit Button */}
          {isAuthor && (
            <Link
              href={`/feed/${id}/edit`}
              className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all"
              title="Edit your photograph details"
            >
              <Pencil className="w-3 h-3 text-zinc-400" />
              <span>Edit</span>
            </Link>
          )}

          {/* Author or Admin Delete Button */}
          {(isAuthor || isAdmin) && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
              title="Delete photograph"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Delete</span>
            </button>
          )}

          {/* Community Flag / Report Button */}
          {!isAuthor && (
            <button
              onClick={handleFlag}
              disabled={flagged || flagging}
              className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg transition-all border ${
                flagged
                  ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  : "text-zinc-500 hover:text-amber-400 hover:bg-zinc-900 border-transparent"
              }`}
              title={flagged ? "Flagged for Content Moderation Queue" : "Flag photograph for moderation"}
            >
              {flagged ? (
                <>
                  <Check className="w-3 h-3 text-amber-400" />
                  <span>Flagged</span>
                </>
              ) : (
                <>
                  <Flag className="w-3 h-3" />
                  <span>Flag</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Card Media Section */}
      <Link href={`/feed/${id}`} className="block relative bg-black aspect-[16/10] overflow-hidden group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
      </Link>

      {/* Card Footer: Caption & Actions */}
      <div className="p-4 space-y-3">
        {caption && (
          <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-2">
            {caption}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-zinc-900/80 text-xs text-zinc-400">
          <div className="flex items-center gap-4">
            <LikeButton
              postId={id}
              initialLikes={initialLikes}
              initialIsLiked={!!p.isLiked}
              onLikeChange={(liked, count) => {
                if (props.onLike) props.onLike(id);
              }}
            />

            <Link href={`/feed/${id}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MessageCircle className="w-4 h-4 text-zinc-400" />
              <span>{initialComments}</span>
            </Link>
          </div>

          <Link
            href={`/feed/${id}`}
            className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
