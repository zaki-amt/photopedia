"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { PlusCircle, Loader2, RefreshCw, Search, X } from "lucide-react";
import { useFeed } from "@/app/hooks/useFeed";
import { PostCard } from "@/app/components/PostCard";
import { PostFeedSkeleton } from "@/app/components/PostCardSkeleton";
import { UserAvatar } from "@/app/components/UserAvatar";
import { SidebarCategories } from "@/app/components/SidebarCategories";
import { SidebarCreators } from "@/app/components/SidebarCreators";
import { FeedTabs } from "./components/FeedTabs";
import { FollowingEmptyState } from "./components/FollowingEmptyState";

function FeedContent() {
  const {
    user,
    activeTab,
    changeTab,
    searchQuery,
    clearSearch,
    posts,
    categories,
    creators,
    loading,
    followingMap,
    fetchFeed,
    handleLike,
    toggleFollow,
  } = useFeed();

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Tab Bar Header & Search Active Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <FeedTabs activeTab={activeTab} onTabChange={changeTab} />

        <div className="flex items-center gap-3">
          {searchQuery && (
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg font-mono text-xs text-zinc-300">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>
                Search: <strong className="text-white">&quot;{searchQuery}&quot;</strong>
              </span>
              <button
                onClick={clearSearch}
                className="p-0.5 hover:text-white text-zinc-400 transition-colors ml-1"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => fetchFeed(activeTab)}
            className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout: Feed + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Compose Box + Posts Feed */}
        <div className="lg:col-span-8 space-y-6">
          {/* Share Photograph Compose Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <UserAvatar src={user?.avatar} alt={user?.name || "Your Avatar"} size="md" />
              <Link
                href="/feed/new"
                className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all flex items-center justify-between"
              >
                <span>Share a photograph with camera EXIF details...</span>
                <PlusCircle className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>

          {/* Posts Feed or Loading / Empty States */}
          {loading ? (
            <PostFeedSkeleton count={3} />
          ) : posts.length === 0 ? (
            searchQuery ? (
              <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <Search className="w-8 h-8 text-zinc-500 mx-auto" />
                <h3 className="font-heading text-sm font-semibold text-white">No Results Found</h3>
                <p className="text-xs text-zinc-400">
                  No photographs or creators matched &quot;{searchQuery}&quot;
                </p>
                <button
                  onClick={clearSearch}
                  className="inline-block bg-white text-black px-4 py-2 rounded-xl text-xs font-semibold hover:bg-zinc-200 transition-all mt-2"
                >
                  Clear Search Filter
                </button>
              </div>
            ) : activeTab === "following" ? (
              <FollowingEmptyState />
            ) : (
              <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <p className="text-xs text-zinc-400">No posts found</p>
                <Link
                  href="/feed/new"
                  className="inline-block bg-white text-black px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Publish First Shot
                </Link>
              </div>
            )
          ) : (
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
                  isFollowing={followingMap[post.author?.username] || followingMap[post.author?.id]}
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

export default function FeedPage() {
  return (
    <Suspense fallback={
      <div className="p-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">Loading feed...</p>
      </div>
    }>
      <FeedContent />
    </Suspense>
  );
}
