"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/(dashboard)/layout";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  ChevronRight,
  Loader2,
  Flag,
  Trash2,
  Pencil,
} from "lucide-react";
import { api } from "@/app/lib/api";
import { LikeButton } from "@/app/components/LikeButton";
import { PhotoLightboxModal } from "@/app/components/PhotoLightboxModal";
import { Maximize2 } from "lucide-react";

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  const [postDetails, setPostDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const isAuthor = user && (user.username === postDetails?.author?.username || user.id === postDetails?.authorId);

  const [flagged, setFlagged] = useState(false);
  const [flagging, setFlagging] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeletePost = async () => {
    if (!confirm("Admin Action: Are you sure you want to delete this photograph from the platform?")) return;
    setDeleting(true);
    try {
      await api.deletePost(postId);
      router.push("/feed");
    } catch (e) {
      router.push("/feed");
    }
  };

  const handleFlag = async () => {
    if (flagged || flagging) return;
    setFlagging(true);
    try {
      await api.flagPost(postId, "Reported by user from detail page");
      setFlagged(true);
    } catch (e) {
      setFlagged(true);
    } finally {
      setFlagging(false);
    }
  };
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
        setLikeCount(data.likesCount ?? data.likes ?? data._count?.likes ?? 0);
        setComments(data.comments || []);

        // Check if liked in database or local session store
        const storedLikes = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("photopedia_user_likes") || "{}") : {};
        setIsLiked(!!data.isLiked || !!storedLikes[postId]);
      } catch (err) {
        console.warn("Failed to load DB post, using dynamic route preview:", err);
        setPostDetails({
          id: postId,
          title: "Alpine Horizon Glow & Natural Light Reflections",
          category: "Landscape",
          author: {
            name: "Elena Rostova",
            username: "elena_photos",
            avatar: "/avatar.jpg",
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
    if (typeof window !== "undefined" && !localStorage.getItem("photopedia_token")) {
      router.push("/login");
      return;
    }

    const nextLiked = !isLiked;
    const nextCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setIsLiked(nextLiked);
    setLikeCount(nextCount);

    if (typeof window !== "undefined") {
      const storedLikes = JSON.parse(localStorage.getItem("photopedia_user_likes") || "{}");
      storedLikes[postId] = nextLiked;
      localStorage.setItem("photopedia_user_likes", JSON.stringify(storedLikes));
    }

    try {
      const res: any = await api.toggleLike(postId);
      if (typeof res?.liked === "boolean") {
        setIsLiked(res.liked);
        if (typeof window !== "undefined") {
          const storedLikes = JSON.parse(localStorage.getItem("photopedia_user_likes") || "{}");
          storedLikes[postId] = res.liked;
          localStorage.setItem("photopedia_user_likes", JSON.stringify(storedLikes));
        }
      }
      if (typeof res?.count === "number") {
        setLikeCount(res.count);
      }
    } catch (e) {
      // Keep optimistic state
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (typeof window !== "undefined" && !localStorage.getItem("photopedia_token")) {
      router.push("/login");
      return;
    }

    const commentContent = replyText.trim();
    setReplyText("");

    try {
      const created = await api.addComment(postId, commentContent);
      setComments((prev) => [
        {
          id: created.id || Date.now().toString(),
          content: created.content || commentContent,
          user: created.user || {
            name: user?.name || "Elena Rostova",
            username: user?.username || "elena_photos",
            avatar: user?.avatar || "/avatar.jpg",
          },
          createdAt: created.createdAt || new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setComments((prev) => [
        {
          id: Date.now().toString(),
          content: commentContent,
          user: {
            name: user?.name || "Elena Rostova",
            username: user?.username || "elena_photos",
            avatar: user?.avatar || "/avatar.jpg",
          },
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">Loading photograph...</p>
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

      {/* Main Full Hero Image Card */}
      <div
        className="relative aspect-[21/9] w-full bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group cursor-pointer"
        onClick={() => setLightboxOpen(true)}
        title="Click to view full photo"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={postDetails.image}
          alt={postDetails.title || "Photograph"}
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
        />
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md border border-zinc-800 text-white px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 shadow-lg group-hover:bg-white group-hover:text-black transition-all">
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="font-semibold">View Full Photo</span>
        </div>
      </div>

      <PhotoLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        image={postDetails.image}
        title={postDetails.title}
        category={postDetails.category}
        authorName={postDetails.author?.name}
        authorUsername={postDetails.author?.username}
        exifCamera={postDetails.exif?.camera}
        exifLens={postDetails.exif?.lens}
      />

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
              <LikeButton
                postId={postId}
                initialLikes={likeCount}
                initialIsLiked={isLiked}
              />

              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-zinc-400" />
                <span>{comments.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthor && (
                <Link
                  href={`/feed/${postId}/edit`}
                  className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:text-white transition-all"
                  title="Edit your photograph details"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>
              )}

              {(isAuthor || isAdmin) && (
                <button
                  onClick={handleDeletePost}
                  disabled={deleting}
                  className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                  title="Delete photograph"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Delete</span>
                </button>
              )}

              {!isAuthor && (
                <button
                  onClick={handleFlag}
                  disabled={flagged || flagging}
                  className={`flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    flagged
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      : "text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 border-zinc-800"
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flagged ? "Flagged for Moderation" : "Flag Photograph"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Reply Comment Box with User Profile Avatar */}
          <form onSubmit={handleAddComment} className="flex items-center gap-3 bg-zinc-950 p-2 pl-3 rounded-xl border border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.avatar || "/avatar.jpg"}
              alt={user?.name || "User Avatar"}
              className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
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
              <div key={c.id || Math.random()} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.user?.avatar || "/avatar.jpg"}
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
                <Link
                  href={`/creators/${postDetails.author?.username || "admin"}`}
                  className="flex items-center gap-2 group hover:text-white transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={postDetails.author?.avatar || "/avatar.jpg"}
                    alt={postDetails.author?.name || "Creator"}
                    className="w-5 h-5 rounded-full object-cover border border-zinc-800 group-hover:border-zinc-500 transition-colors"
                  />
                  <span className="font-semibold text-white font-heading group-hover:underline">
                    {postDetails.author?.name || "Creator"}
                  </span>
                </Link>
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
