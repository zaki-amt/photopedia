"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Camera,
  Calendar,
  ShieldCheck,
  Tag,
  ChevronRight,
  Eye,
} from "lucide-react";

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(456);
  const [comments, setComments] = useState([
    {
      id: "c1",
      author: "Hanmiru Lee",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      timeAgo: "1mo ago",
      text: "Wow it's clean! Perfect color exposure and framing.",
    },
    {
      id: "c2",
      author: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      timeAgo: "2w ago",
      text: "Love the lighting reflections on this shot!",
    },
  ]);
  const [replyText, setReplyText] = useState("");

  const postDetails = {
    id: postId || "1",
    title: "Alpine Horizon Glow & Natural Light Reflections",
    category: "Landscape",
    subCategory: "Alpine Photography",
    creator: {
      name: "Omer Mirza",
      username: "omermirza",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    publishedDate: "June 20, 2026",
    license: "Limited Creator License",
    camera: "Sony A7IV • 24mm f/2.8 GM",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    description:
      "The Alpine Horizon Glow is a high-resolution photograph captured during golden hour over the mountain ridge. The defining feature is the natural misty light reflecting off the glacier lake. Tuned to preserve original RAW color depth, dynamic range, and shadow detail without aggressive compression.",
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        author: "Alex Morgan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        timeAgo: "Just now",
        text: replyText,
      },
    ]);
    setReplyText("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Header Breadcrumbs (Matching Screenshot 2!) */}
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
          <span className="text-white font-medium">{postDetails.subCategory}</span>
        </div>
      </div>

      {/* Main Full Hero Image Card (Matching Screenshot 2!) */}
      <div className="relative aspect-[21/9] w-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={postDetails.image}
          alt={postDetails.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Columns: Left Details & Comments + Right Sidebar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
        {/* Left Column: Description, Actions, Comment Input & Thread */}
        <div className="lg:col-span-8 space-y-8">
          {/* Post Description Paragraphs */}
          <div className="space-y-4">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-snug">
              {postDetails.title}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              The <strong className="text-white font-semibold">{postDetails.title}</strong> is a production-ready capture built to recreate the polished behavior and visual feel of golden hour landscapes. Its defining feature is a smooth natural gradient that reflects over the alpine lake, paired with crisp EXIF camera details.
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              At its default settings, the photo is tuned to preserve fine highlight and shadow tones with zero artifacts. Perfect for editorial showcases, digital galleries, and photography portfolios.
            </p>
          </div>

          {/* Engagement Action Bar (Matching Screenshot 2!) */}
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

            <a href="#" className="hover:text-white transition-colors font-mono text-[11px]">
              View activity
            </a>
          </div>

          {/* Reply Comment Box (Matching Screenshot 2!) */}
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

          {/* Comments Thread (Matching Screenshot 2!) */}
          <div className="space-y-4 pt-2">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.avatar}
                  alt={c.author}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-800 shrink-0 mt-0.5"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-xs font-semibold text-white">{c.author}</span>
                    <span className="font-mono text-[10px] text-zinc-500">{c.timeAgo}</span>
                  </div>
                  <p className="text-xs text-zinc-300">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Details Card + Categories Card (Matching Screenshot 2!) */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          {/* Details Card (Matching Screenshot 2!) */}
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
                    src={postDetails.creator.avatar}
                    alt={postDetails.creator.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="font-semibold text-white font-heading">{postDetails.creator.name}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">Published</span>
                <span className="font-mono text-zinc-300 text-[11px]">{postDetails.publishedDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400 font-medium">License</span>
                <span className="font-mono text-zinc-300 text-[11px]">{postDetails.license}</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                <span className="text-zinc-400 font-medium">Camera & Lens</span>
                <span className="font-mono text-zinc-300 text-[10px]">{postDetails.camera}</span>
              </div>
            </div>
          </div>

          {/* Categories Card (Matching Screenshot 2!) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider">
                Categories
              </h3>
              <a href="#" className="text-[11px] text-zinc-500 hover:text-white transition-colors">
                See all
              </a>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800">
                Featured
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800">
                Landscape
              </span>
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800">
                Alpine Glow
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
