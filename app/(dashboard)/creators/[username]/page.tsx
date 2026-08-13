"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/app/(dashboard)/layout";
import {
  ArrowLeft,
  ChevronRight,
  MapPin,
  Globe,
  Phone,
  Camera,
  Award,
  Heart,
  Eye,
  Loader2,
} from "lucide-react";
import { api } from "@/app/lib/api";
import { FollowButton } from "@/app/components/FollowButton";
import { UserAvatar } from "@/app/components/UserAvatar";
import { UserNameLink } from "@/app/components/UserNameLink";
import { FollowersFollowingModal } from "@/app/components/FollowersFollowingModal";

export default function PublicCreatorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const { user: currentUser } = useUser();

  const [creatorData, setCreatorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"followers" | "following">("followers");

  const loadCreatorData = async () => {
    if (!username) return;
    try {
      const data = await api.getProfile(username);
      setCreatorData(data);
      setFollowerCount(data.stats?.followers || 0);
      setFollowingCount(data.stats?.following || 0);

      if (currentUser) {
        try {
          const followingIds = await api.getFollowingIds();
          if (data.id && followingIds.includes(data.id)) {
            setIsFollowing(true);
          }
        } catch (e) {
          // Fallback
        }
      }
    } catch (err) {
      console.warn("Failed to load creator profile from API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCreatorData();
  }, [username, currentUser]);

  const handleFollowChange = (nextState: boolean) => {
    setIsFollowing(nextState);
    setFollowerCount((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));
  };

  const openArchiveModal = (mode: "followers" | "following") => {
    setModalMode(mode);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">Loading creator archive @{username}...</p>
      </div>
    );
  }

  const activeUser = creatorData || {
    name: username.charAt(0).toUpperCase() + username.slice(1),
    username: username,
    avatar: "/avatar.jpg",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    bio: "Photographer documenting visual light reflections.",
    location: "San Francisco, CA",
    website: "https://photopedia.com",
    cameraBody: "Sony A7IV",
    lenses: "24mm f/1.4 GM",
  };

  const posts = creatorData?.posts || [];

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Followers & Following Modal Archive */}
      <FollowersFollowingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        username={activeUser.username}
        initialMode={modalMode}
        onListChange={loadCreatorData}
      />



      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Cover Banner */}
            <div className="h-40 bg-black relative border-b border-zinc-800/80 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  activeUser.coverImage && activeUser.coverImage !== "/cover.jpg"
                    ? activeUser.coverImage
                    : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
                }
                alt="Cover Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
            </div>

            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex items-end justify-between gap-4 -mt-12 mb-4">
                <div className="relative">
                  <UserAvatar
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    size="xl"
                    className="border-4 border-zinc-950 shadow-md rounded-2xl"
                  />
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                </div>

                {/* FollowButton Component */}
                <FollowButton
                  usernameOrId={activeUser.username}
                  initialFollowing={isFollowing}
                  onFollowChange={handleFollowChange}
                />
              </div>

              {/* Creator Bio & Custom Metadata */}
              <div className="space-y-4">
                <div>
                  <UserNameLink
                    name={activeUser.name}
                    username={activeUser.username}
                    showHandle={true}
                    className="text-lg"
                  />
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                  {activeUser.bio || "Photographer documenting visual light reflections."}
                </p>

                {/* Custom Metadata Badges */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1 border-t border-zinc-900">
                  {activeUser.location && (
                    <div className="mt-2">
                      <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {activeUser.location}
                      </span>
                    </div>
                  )}
                  {activeUser.website && (
                    <div className="mt-2">
                    <a
                      href={activeUser.website.startsWith("http") ? activeUser.website : `https://${activeUser.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                      {activeUser.website.replace(/^https?:\/\//, "")}
                    </a>
                    </div>
                  )}
                  {activeUser.phone && (
                    <div className="mt-2">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-300 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      {activeUser.phone}
                    </span>
                  </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Published Photographs Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h2 className="font-heading text-sm font-semibold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-zinc-400" />
                Public Photography ({posts.length})
              </h2>
            </div>

            {posts.length === 0 ? (
              <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                <Camera className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">No public photographs published yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/feed/${post.id}`}
                    className="group relative aspect-square bg-black rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors shadow-sm block"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                      <span className="text-[10px] font-mono text-zinc-400">{post.title}</span>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          {post._count?.likes || 0}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-zinc-400" />
                          {post._count?.comments || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          {/* Portfolio Metrics Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-zinc-400" />
                Portfolio Metrics
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-black rounded-xl border border-zinc-900">
                <span className="font-heading block text-base font-bold text-white">{posts.length}</span>
                <span className="text-[10px] text-zinc-500 font-mono">Posts</span>
              </div>
              <button
                onClick={() => openArchiveModal("followers")}
                className="p-3 bg-black hover:bg-zinc-900 rounded-xl border border-zinc-900 hover:border-zinc-700 transition-all text-center group cursor-pointer"
              >
                <span className="font-heading block text-base font-bold text-white group-hover:underline">
                  {followerCount}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-300">Followers</span>
              </button>
              <button
                onClick={() => openArchiveModal("following")}
                className="p-3 bg-black hover:bg-zinc-900 rounded-xl border border-zinc-900 hover:border-zinc-700 transition-all text-center group cursor-pointer"
              >
                <span className="font-heading block text-base font-bold text-white group-hover:underline">
                  {followingCount}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-300">Following</span>
              </button>
            </div>
          </div>

          {/* Camera & Gear Listing Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-zinc-400" />
                Camera & Gear Listing
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Primary Camera</span>
                <p className="text-xs font-semibold text-white font-heading">
                  {activeUser.cameraBody || "Sony A7IV"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Lenses & Optics</span>
                <p className="text-xs font-medium text-zinc-300 font-mono">
                  {activeUser.lenses || "24mm f/1.4 GM, 85mm f/1.4 GM"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
