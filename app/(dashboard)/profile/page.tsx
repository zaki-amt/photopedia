"use client";

import Link from "next/link";
import { useUser } from "@/app/(dashboard)/layout";
import {
  Settings,
  Image as ImageIcon,
  Heart,
  Eye,
  PlusCircle,
  MapPin,
  Link as LinkIcon,
  ShieldCheck,
  Camera,
  Layers,
  Award,
  ArrowRight,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();

  const userPosts = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      likes: 420,
      views: "2.4k",
      title: "Natural Portraiture Series",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80",
      likes: 890,
      views: "5.1k",
      title: "Alpine Horizon Glow",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
      likes: 630,
      views: "3.8k",
      title: "Studio Monochrome Reflection",
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      likes: 1120,
      views: "8.9k",
      title: "Glacier Lake Mirror",
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80",
      likes: 950,
      views: "6.2k",
      title: "Tokyo Neon Streets",
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
      likes: 740,
      views: "4.5k",
      title: "Coastline Horizon Lines",
    },
  ];

  const GEAR_ITEMS = [
    { camera: "Sony A7IV", lens: "24-70mm f/2.8 GM" },
    { camera: "Leica Q2", lens: "28mm f/1.7 Fixed" },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header Bar Matching Feed Spacing */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            Creator Profile
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </h1>
          <p className="text-xs text-zinc-400">View public portfolio and creator activity</p>
        </div>

        <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
          PORTFOLIO LIVE
        </span>
      </div>

      {/* Main Grid: Left Column + Right Sidebar (Identical to Feed Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Column: Profile Card + Photo Gallery */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            {/* Banner */}
            <div className="h-36 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 relative border-b border-zinc-800/80" />

            <div className="px-6 pb-6 pt-0 relative">
              {/* Avatar & Header Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-zinc-950 shadow-md"
                  />
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    href="/feed/new"
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    New Post
                  </Link>
                  <Link
                    href="/profile/edit"
                    className="inline-flex items-center gap-1.5 bg-black hover:bg-zinc-900 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium border border-zinc-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    Settings
                  </Link>
                </div>
              </div>

              {/* Bio & Links */}
              <div className="space-y-3">
                <div>
                  <h2 className="font-heading text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-xs font-mono text-zinc-400">@{user.username}</p>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed max-w-xl">
                  Commercial & landscape photographer based in San Francisco. Documenting outdoor perspectives, architectural geometry, and natural color depth. 📷✨
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    San Francisco, CA
                  </span>
                  <span className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                    alexmorgan.photo
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h2 className="font-heading text-sm font-semibold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                Public Photography
              </h2>
              <span className="text-xs font-mono text-zinc-500">{userPosts.length} items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {userPosts.map((post) => (
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
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-zinc-400" />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column (Matches Feed Right Sidebar Layout) */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          {/* Creator Metrics Widget */}
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
                <span className="font-heading block text-base font-bold text-white">14.2k</span>
                <span className="text-[10px] text-zinc-500 font-mono">Followers</span>
              </div>
              <div className="p-3 bg-black rounded-xl border border-zinc-900">
                <span className="font-heading block text-base font-bold text-white">892</span>
                <span className="text-[10px] text-zinc-500 font-mono">Following</span>
              </div>
            </div>
          </div>

          {/* Camera Gear Equipment Widget */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-zinc-400" />
                Primary Camera Gear
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">EXIF</span>
            </div>

            <div className="space-y-2.5">
              {GEAR_ITEMS.map((gear, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-black border border-zinc-900 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-white font-heading">{gear.camera}</p>
                    <p className="text-[11px] font-mono text-zinc-500">{gear.lens}</p>
                  </div>
                  <Layers className="w-4 h-4 text-zinc-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-900 pb-3">
              Quick Management
            </h3>

            <div className="space-y-2">
              <Link
                href="/profile/edit"
                className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-900 hover:border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <span>Edit Profile Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
              <Link
                href="/feed/new"
                className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-900 hover:border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                <span>Upload New Photograph</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
