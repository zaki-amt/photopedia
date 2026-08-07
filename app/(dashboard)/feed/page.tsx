"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/app/lib/api";
import { PostCard } from "@/app/components/PostCard";
import { SidebarCategories } from "@/app/components/SidebarCategories";
import { SidebarCreators } from "@/app/components/SidebarCreators";

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [followingMap, setFollowingMap] = useState<{ [key: string]: boolean }>({});

  const fetchFeedDataFromDb = async () => {
    setLoadingDb(true);
    try {
      const dbPosts = await api.getPosts();
      setPosts(dbPosts || []);

      const dbCats = await api.getTopCategories();
      setCategories(
        (dbCats || []).map((c: any) => ({
          name: c.name,
          count: c.count,
          icon: c.name.includes("Urban") ? "🌆" : c.name.includes("Portrait") ? "📸" : "🏔️",
        }))
      );

      const dbCreators = await api.getSuggestedCreators();
      setCreators(dbCreators || []);
    } catch (err) {
      console.warn("Async API database fetch:", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchFeedDataFromDb();
  }, []);

  const handleLike = async (id: string) => {
    try {
      await api.toggleLike(id);
    } catch (e) {
      // Local fallback
    }
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const toggleFollow = async (username: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Tab Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
          <button
            onClick={() => setActiveTab("for-you")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "for-you"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "following"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Following
          </button>
        </div>

        <button
          onClick={fetchFeedDataFromDb}
          className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${loadingDb ? "animate-spin" : ""}`} />
          <span>SYNC DB</span>
        </button>
      </div>

      {/* Main Grid: Feed + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Compose Box + Posts Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Share Something Compose Box */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Your Avatar"
                className="w-9 h-9 rounded-full object-cover border border-zinc-800"
              />
              <Link
                href="/feed/new"
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-between"
              >
                <span>Publish photograph to database with camera EXIF details...</span>
                <PlusCircle className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>

          {/* Loading Indicator */}
          {loadingDb ? (
            <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
              <Loader2 className="w-6 h-6 text-white animate-spin mx-auto" />
              <p className="text-xs font-mono text-zinc-400">Executing async SQL query via NestJS API...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
              <p className="text-xs text-zinc-400">No database posts found</p>
              <Link
                href="/feed/new"
                className="inline-block bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Publish First Shot
              </Link>
            </div>
          ) : (
            /* Posts Feed List */
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  author={post.author}
                  category={post.category}
                  image={post.image}
                  caption={post.caption}
                  likes={post.likes || 0}
                  comments={post.comments || 0}
                  timeAgo={post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recently"}
                  isLiked={post.isLiked}
                  onLike={handleLike}
                  onFollow={toggleFollow}
                  isFollowing={followingMap[post.author?.username]}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          <SidebarCategories categories={categories} />
          <SidebarCreators
            creators={creators}
            followingMap={followingMap}
            onToggleFollow={toggleFollow}
          />
        </div>
      </div>
    </div>
  );
}
