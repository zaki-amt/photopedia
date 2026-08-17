"use client";

import Link from "next/link";
import { Camera, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black text-zinc-400 py-10 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <span className="font-heading font-bold text-sm text-white">Photopedia</span>
          </Link>
          <p className="text-xs text-zinc-500 leading-relaxed">
            High-performance visual storytelling platform for photography creators and visual curators.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono font-semibold text-white uppercase tracking-wider">
            Platform
          </p>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/feed" className="hover:text-white transition-colors">
                Explore Feed
              </Link>
            </li>
            <li>
              <Link href="/creators" className="hover:text-white transition-colors">
                Creators Network
              </Link>
            </li>
            <li>
              <Link href="/category" className="hover:text-white transition-colors">
                Categories Archive
              </Link>
            </li>
          </ul>
        </div>

        {/* Support & Legal Column */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono font-semibold text-white uppercase tracking-wider">
            Resources & Help
          </p>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link href="/support" className="hover:text-white transition-colors">
                Support Desk
              </Link>
            </li>
            <li>
              <Link href="/profile/edit" className="hover:text-white transition-colors">
                Account Settings
              </Link>
            </li>
            <li>
              <span className="text-zinc-600">Privacy & Terms</span>
            </li>
          </ul>
        </div>

        {/* System Status Column */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono font-semibold text-white uppercase tracking-wider">
            System Status
          </p>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>API Server Online</span>
          </div>
          <p className="text-[10px] text-zinc-600 font-mono">
            v2.4.0 • NestJS + Next.js App Router
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Photopedia. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for visual storytellers.
        </p>
      </div>
    </footer>
  );
}
