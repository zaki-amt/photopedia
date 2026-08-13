"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/app/(dashboard)/layout";
import {
  Edit3,
  Image as ImageIcon,
  Heart,
  Eye,
  MapPin,
  Globe,
  Phone,
  ShieldCheck,
  Camera,
  Layers,
  Award,
  Loader2,
  Sparkles,
  Aperture,
} from "lucide-react";
import { api } from "@/app/lib/api";

export default function ProfilePage() {
  const { user } = useUser();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileFromDb() {
      if (!user?.username) return;
      setLoading(true);
      try {
        const data = await api.getProfile(user.username);
        setProfileData(data);
      } catch (err) {
        console.warn("Failed to load DB profile, fallback to session context:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileFromDb();
  }, [user?.username]);

  const activeUser = profileData || user || {
    name: "Creator User",
    username: "creator",
    email: "creator@example.com",
    role: "user",
    avatar: "/avatar.jpg",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    bio: "Landscape & outdoor photographer documenting natural light reflections.",
    location: "San Francisco, CA",
    website: "https://photopedia.com",
    phone: "+1 (555) 234-5678",
    cameraBody: "Sony A7IV",
    backupCamera: "Leica Q2",
    lenses: "24mm f/1.4 GM, 85mm f/1.4 GM",
    accessories: "Profoto A1X, PolarPro ND Filters",
  };

  const userPosts = profileData?.posts || [];

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            Creator Profile
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </h1>
          <p className="text-xs text-zinc-400">View public portfolio and gear specifications</p>
        </div>
        {activeUser.role?.toLowerCase() === "admin" ? (
          <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
            {activeUser.role}
          </span>
        ) : null}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Profile Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Custom Cover Photo Banner */}
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeUser.avatar || "/avatar.jpg"}
                    alt={activeUser.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-zinc-950 shadow-md"
                  />
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                </div>

                {/* Single Edit Profile Button */}
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </Link>
              </div>

              {/* Creator Bio & Custom Metadata Fields */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-heading text-xl font-bold text-white">{activeUser.name}</h2>
                  <p className="text-xs font-mono text-zinc-400">@{activeUser.username}</p>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                  {activeUser.bio || "Landscape & outdoor photographer documenting natural light reflections."}
                </p>

                {/* Custom Metadata Badges: Location, Website, Phone */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-1 border-t border-zinc-900">
                  {activeUser.location && (
                    <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {activeUser.location}
                    </span>
                  )}
                  {activeUser.website && (
                    <a
                      href={activeUser.website.startsWith("http") ? activeUser.website : `https://${activeUser.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-zinc-500" />
                      {activeUser.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {activeUser.phone && (
                    <span className="flex items-center gap-1.5 font-medium text-zinc-300 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      {activeUser.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* User Published Photographs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h2 className="font-heading text-sm font-semibold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                Public Photography
              </h2>
              <span className="text-xs font-mono text-zinc-500">{userPosts.length} items</span>
            </div>

            {userPosts.length === 0 ? (
              <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <Camera className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">No published photographs yet</p>
                <Link
                  href="/feed/new"
                  className="inline-block bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Publish First Shot
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userPosts.map((post: any) => (
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
              <span className="text-[10px] font-mono text-zinc-500">LIVE</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-black rounded-xl border border-zinc-900">
                <span className="font-heading block text-base font-bold text-white">{userPosts.length}</span>
                <span className="text-[10px] text-zinc-500 font-mono">Posts</span>
              </div>
              <div className="p-3 bg-black rounded-xl border border-zinc-900">
                <span className="font-heading block text-base font-bold text-white">
                  {profileData?.stats?.followers || 0}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Followers</span>
              </div>
              <div className="p-3 bg-black rounded-xl border border-zinc-900">
                <span className="font-heading block text-base font-bold text-white">
                  {profileData?.stats?.following || 0}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Following</span>
              </div>
            </div>
          </div>

          {/* Camera & Gear Listing Custom Fields Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-zinc-400" />
                Camera & Gear Listing
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">EXIF</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Primary Camera</span>
                  <Camera className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <p className="text-xs font-semibold text-white font-heading">
                  {activeUser.cameraBody || "Sony A7IV"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Secondary / Backup</span>
                  <Aperture className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <p className="text-xs font-semibold text-white font-heading">
                  {activeUser.backupCamera || "Leica Q2"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Lenses & Optics</span>
                  <Layers className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <p className="text-xs font-medium text-zinc-300 font-mono">
                  {activeUser.lenses || "24mm f/1.4 GM, 85mm f/1.4 GM"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-900 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Accessories & Lighting</span>
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <p className="text-xs font-medium text-zinc-300 font-mono">
                  {activeUser.accessories || "Profoto A1X, PolarPro ND Filters"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
