"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  Home,
  PlusCircle,
  Users,
  User,
  Settings,
  Shield,
  Layers,
  ChevronRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

interface SidebarNavProps {
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

const CATEGORIES = [
  { name: "All Categories", href: "/category", icon: "🌐" },
  { name: "Landscape", href: "/category/landscape", icon: "🏔️" },
  { name: "Urban & Street", href: "/category/urban-street", icon: "🌆" },
  { name: "Portraits", href: "/category/portraits", icon: "📸" },
  { name: "Architecture", href: "/category/architecture", icon: "🏛️" },
  { name: "Astro & Night", href: "/category/astro-night", icon: "🌌" },
  { name: "Seascape", href: "/category/seascape", icon: "🌊" },
];

export function SidebarNav({ mobileMenuOpen, onCloseMobileMenu }: SidebarNavProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const exploreLinks = [
    { name: "Feed", href: "/feed", icon: Home }
  ];

  const communityLinks = [
    { name: "Creators Directory", href: "/creators", icon: Users },
  ];

  const accountLinks = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Edit Profile", href: "/profile/edit", icon: Settings },
  ];

  return (
    <aside
      className={`${
        mobileMenuOpen ? "block" : "hidden"
      } md:flex w-full md:w-64 bg-zinc-950 border-r border-zinc-800/80 p-4 flex-col justify-between fixed md:sticky top-0 h-screen z-40 overflow-y-auto shrink-0`}
    >
      <div className="space-y-5">
        {/* Brand Header */}
        <Link
          href="/"
          onClick={onCloseMobileMenu}
          className="hidden md:flex items-center gap-2.5 px-2 py-1 group"
        >
          <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-bold text-base text-white tracking-tight block">
              Photopedia
            </span>
          </div>
        </Link>

        {/* Explore Navigation */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
            Explore
          </p>
          {exploreLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobileMenu}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Community Navigation */}
        <div className="space-y-1">
          <p className="px-2 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
            Network
          </p>
          {communityLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobileMenu}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Collapsible Categories Menu */}
        <div className="space-y-1">
          <button
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="w-full flex items-center justify-between px-2 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider hover:text-white transition-colors"
          >
            <span>Categories</span>
            <ChevronRight
              className={`w-3 h-3 transition-transform ${categoriesOpen ? "rotate-90" : ""}`}
            />
          </button>

          {categoriesOpen && (
            <div className="space-y-0.5 pt-1">
              {CATEGORIES.map((cat) => {
                const isActive = pathname === cat.href;
                return (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={onCloseMobileMenu}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      isActive
                        ? "bg-zinc-900 text-white font-medium border border-zinc-800"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Account Links */}
        {isAuthenticated && (
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">
              Account
            </p>
            {accountLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onCloseMobileMenu}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Admin Section */}
        {isAdmin && (
          <div className="space-y-1 pt-2 border-t border-zinc-900">
            <p className="px-2 text-[10px] font-mono font-semibold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Admin Console</span>
            </p>
            <Link
              href="/admin"
              onClick={onCloseMobileMenu}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30"
                  : "text-zinc-400 hover:text-amber-400 hover:bg-zinc-900"
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Panel</span>
            </Link>
          </div>
        )}
      </div>

      {/* User Footer Profile Summary */}
      {isAuthenticated && user && (
        <div className="pt-4 border-t border-zinc-900 space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user.avatar || "/avatar.jpg"}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/avatar.jpg";
                }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] font-mono text-zinc-500 truncate">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
