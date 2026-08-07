"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { api } from "@/app/lib/api";

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [postDetails, setPostDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    async function loadPostData() {
      if (!postId) return;
      setLoading(true);
      try {
        const data = await api.getPostById(postId);
        setPostDetails(data);
        setLikeCount(data.likesCount || data._count?.likes || 0);
        setComments(data.comments || []);
      } catch (err) {
        console.warn("Failed to load DB post, using dynamic route preview:", err);
        // Minimal fallback for dynamic preview
        setPostDetails({
          id: postId,
          title: "Alpine Horizon Glow & Natural Light Reflections",
          category: "Landscape",
          author: {
            name: "Elena Rostova",
            username: "elena_photos",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          },
          createdAt: new Date().toISOString(),
          image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
          caption: "Golden hour reflection over the alpine lake. Filtered through natural misty light 🏔️✨",
          exif: {
            camera: "Sony A7IV",
            lens: "24mm f/1.4 GM",
            aperture: "f/2.8",
            shutter: "1/1000s",
            iso: "100",
          },
        });
      } finally {
        setLoading(false);
      }
    }
    loadPostData();
  }, [postId]);

  const handleLike = async () => {
    try {
      await api.toggleLike(postId);
    } catch (e) {
      // Local fallback
    }
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const created = await api.addComment(postId, replyText);
      setComments([created, ...comments]);
    } catch (err) {
      setComments([
        {
          id: Date.now().toString(),
          user: {
            name: "You",
            username: "me",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
          },
          createdAt: new Date().toISOString(),
          content: replyText,
        },
        ...comments,
      ]);
    }
    setReplyText("");
  };

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">Loading photograph record from database...</p>
      </div>
    );
  }

  if (!postDetails) {
    return (
      <div className="p-12 text-center space-y-3 font-sans">
        <p className="text-xs text-zinc-400">Photograph record not found</p>
        <button
          onClick={() => router.back()}
          className="bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Header Breadcrumbs */}
      <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-3 py-1.5 rounded-lg transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <div className="flex items-center gap-1.5 text-zinc-500">
          <span>Photos</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{postDetails.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white font-medium">{postDetails.title || "Detail View"}</span>
        </div>
      </div>

      {/* Main Full Hero Image Card */}
      <div className="relative aspect-[21/9] w-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={postDetails.image}
          alt={postDetails.title || "Photograph"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Columns: Left Details & Comments + Right Sidebar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-snug">
              {postDetails.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {postDetails.caption}
            </p>
          </div>

          {/* Engagement Bar */}
          <div className="flex items-center justify-between py-3 border-y border-zinc-900 text-xs text-zinc-400">
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  isLiked ? "text-rose-500" : "hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
                <span>{likeCount}</span>
              </button>

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-zinc-400" />
                <span>{comments.length}</span>
              </div>
            </div>
          </div>

          {/* Reply Comment Box */}
          <form onSubmit={handleAddComment} className="flex items-center gap-3 bg-zinc-950 p-2 pl-3 rounded-xl border border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="User"
              className="w-7 h-7 rounded-full object-cover border border-zinc-800 shrink-0"
            />
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply..."
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-zinc-900 hover:bg-white hover:text-black text-zinc-300 rounded-lg transition-all border border-zinc-800 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comments Thread */}
          <div className="space-y-4 pt-2">
            {comments.map((c: any) => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                  alt={c.user?.name || "Commenter"}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-800 shrink-0 mt-0.5"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xs font-semibold text-white">{c.user?.name || "User"}</span>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Just now"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300">{c.content || c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-900 pb-3">
              Details
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Creator</span>
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={postDetails.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt={postDetails.author?.name || "Creator"}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-semibold text-white font-heading">{postDetails.author?.name || "Creator"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Published</span>
                <span className="font-mono text-zinc-300 text-[11px]">
                  {postDetails.createdAt ? new Date(postDetails.createdAt).toLocaleDateString() : "Jan 2026"}
                </span>
              </div>

              {postDetails.exif && (
                <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                  <span className="text-zinc-400 font-medium">Camera & Lens</span>
                  <span className="font-mono text-zinc-300 text-[10px]">
                    {postDetails.exif.camera || "Sony A7IV"} • {postDetails.exif.lens || "24mm"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
