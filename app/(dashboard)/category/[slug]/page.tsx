"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Grid,
  ArrowLeft,
  Camera,
  Layers,
  Sparkles,
  Loader2,
  ChevronRight,
  Filter,
} from "lucide-react";
import { PostCard } from "@/app/components/PostCard";
import { SidebarCategories } from "@/app/components/SidebarCategories";
import { SidebarCreators } from "@/app/components/SidebarCreators";
import { api } from "@/app/lib/api";

const SLUG_TO_CATEGORY: Record<string, string> = {
  landscape: "Landscape",
  "urban-street": "Urban & Street",
  urban: "Urban & Street",
  portraits: "Portraits",
  portrait: "Portraits",
  architecture: "Architecture",
  "astro-night": "Astro & Night",
  seascape: "Seascape",
  wildlife: "Wildlife",
  "fine-art": "Fine Art",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Landscape: "Explore mountains, horizons, golden hour light, and natural wilderness captures.",
  "Urban & Street": "Raw city life, neon rain reflections, street portraiture, and architectural shadows.",
  Portraits: "Natural light portraiture, editorial studio lighting, and expressive human faces.",
  Architecture: "Clean lines, structural geometry, urban shadows, and minimalist spatial design.",
  "Astro & Night": "Deep space long exposures, milky way galaxy arches, and night cityscapes.",
  Seascape: "Ocean waves, coastal cliffs, tide reflections, and horizon waters.",
  Wildlife: "Fauna in natural habitats, telephoto wildlife behavior, and outdoor instinct.",
  "Fine Art": "Abstract compositions, creative exposure, conceptual visual art, and monochrome.",
};

export default function CategoryArchivePage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params.slug as string) || "";
  const slugLower = rawSlug.toLowerCase();

  const categoryName = SLUG_TO_CATEGORY[slugLower] || rawSlug.charAt(0).toUpperCase() + rawSlug.slice(1);
  const categoryDesc = CATEGORY_DESCRIPTIONS[categoryName] || `Curated photograph archives in ${categoryName}.`;

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryPosts() {
      setLoading(true);
      try {
        const fetched = await api.getPosts(categoryName);
        setPosts(fetched);
      } catch (err) {
        console.warn("Failed to fetch category posts from backend API:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryPosts();
  }, [categoryName]);

  const CATEGORY_NAV = [
    { name: "Landscape", slug: "landscape" },
    { name: "Urban & Street", slug: "urban-street" },
    { name: "Portraits", slug: "portraits" },
    { name: "Architecture", slug: "architecture" },
    { name: "Astro & Night", slug: "astro-night" },
    { name: "Seascape", slug: "seascape" },
  ];

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* Category Hero Banner */}
      <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden shadow-sm space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-black text-zinc-300 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span>Category Showcase</span>
          <span className="text-white font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            {posts.length} {posts.length === 1 ? "SHOT" : "SHOTS"}
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
          {categoryName} Photography
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          {categoryDesc}
        </p>

        {/* Category Pills Switcher */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {CATEGORY_NAV.map((c) => {
            const isActive = c.name === categoryName;
            return (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "bg-black border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid View & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Posts Grid */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="p-16 text-center space-y-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
              <p className="text-xs font-mono text-zinc-400">Loading {categoryName} archive...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
              <Camera className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">No published photographs in {categoryName} yet</p>
              <Link
                href="/feed/new"
                className="inline-block bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Publish First Shot in {categoryName}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          <SidebarCategories activeCategory={categoryName} />
          <SidebarCreators />
        </div>
      </div>
    </div>
  );
}
