"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  Search,
  PlusCircle,
  Shield,
  Bell,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";

interface HeaderNavProps {
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export function HeaderNav({ mobileMenuOpen, onToggleMobileMenu }: HeaderNavProps) {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/feed?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-zinc-800/80 px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          aria-label="Toggle mobile navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link href="/feed" className="flex md:hidden items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center font-bold">
            <Camera className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-base text-white">Photopedia</span>
        </Link>
      </div>

      {/* Middle: Universal Real-Time Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search photos, camera EXIF, tags, or creator handles..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all shadow-inner"
        />
      </form>

      {/* Right: Quick Actions & User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Publish Action */}
        <Link
          href="/feed/new"
          className="hidden sm:inline-flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish</span>
        </Link>

        {/* Admin Overview Link if Admin */}
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full ring-2 ring-black" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-zinc-950 border border-zinc-800 rounded-xl p-3 shadow-2xl z-50 space-y-2 font-sans">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Live Activity</span>
              </div>
              <div className="space-y-2">
                {user ? (
                  <>
                    <div className="p-2 hover:bg-zinc-900 rounded-lg text-xs transition-colors space-y-0.5">
                      <p className="text-zinc-300">Welcome back, <strong className="text-white">{user.name}</strong>!</p>
                      <span className="text-[10px] text-zinc-500 font-mono">Session active</span>
                    </div>
                    <div className="p-2 hover:bg-zinc-900 rounded-lg text-xs transition-colors space-y-0.5">
                      <p className="text-zinc-300">High-resolution EXIF camera metadata pipeline operational.</p>
                      <span className="text-[10px] text-zinc-500 font-mono">System update</span>
                    </div>
                  </>
                ) : (
                  <div className="p-2 text-xs text-zinc-400 text-center">
                    Sign in to receive real-time creator notifications.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Avatar Dropdown */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-900 transition-colors text-left"
            >
              <img
                src={user.avatar || "/avatar.jpg"}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/avatar.jpg";
                }}
              />
              <span className="hidden lg:inline-block text-xs font-medium text-white max-w-[100px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden lg:inline-block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-xl p-2 shadow-2xl z-50 space-y-1">
                <div className="px-3 py-2 border-b border-zinc-900">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] font-mono text-zinc-500 truncate">@{user.username}</p>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/profile/edit"
                  onClick={() => setUserDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </Link>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-semibold text-black bg-white hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
