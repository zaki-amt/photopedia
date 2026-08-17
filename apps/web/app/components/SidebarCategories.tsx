"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Loader2 } from "lucide-react";
import { api } from "@/app/lib/api";

const CATEGORY_SLUGS: Record<string, string> = {
  Landscape: "landscape",
  "Urban & Street": "urban-street",
  Portraits: "portraits",
  Architecture: "architecture",
  "Astro & Night": "astro-night",
  Seascape: "seascape",
  Wildlife: "wildlife",
  "Fine Art": "fine-art",
};

const CATEGORY_ICONS: Record<string, string> = {
  Landscape: "🏔️",
  "Urban & Street": "🌆",
  Portraits: "📸",
  Architecture: "🏛️",
  "Astro & Night": "🌌",
  Seascape: "🌊",
};

export interface SidebarCategoriesProps {
  categories?: any[];
  activeCategory?: string;
  selectedCategory?: string;
  onSelectCategory?: (name: string) => void;
}

export function SidebarCategories({
  categories: propCategories,
  activeCategory = "",
  selectedCategory = "All",
  onSelectCategory,
}: SidebarCategoriesProps) {
  const [categories, setCategories] = useState<any[]>(propCategories || []);
  const [loading, setLoading] = useState(!propCategories);

  useEffect(() => {
    if (propCategories && propCategories.length > 0) {
      setCategories(propCategories);
      setLoading(false);
      return;
    }
    async function loadTopCategories() {
      try {
        const data = await api.getTopCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load categories:", e);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadTopCategories();
  }, [propCategories]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Compass className="w-4 h-4 text-zinc-400" />
          Top Categories
        </h3>
        <Link href="/category" className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors">
          VIEW ALL
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-black border border-zinc-900">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded shimmer-effect shrink-0" />
                <div className="w-24 h-3 rounded shimmer-effect" />
              </div>
              <div className="w-10 h-3 rounded shimmer-effect" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => {
            const slug = CATEGORY_SLUGS[cat.name] || cat.name.toLowerCase().replace(/\s+/g, "-");
            const isSelected = activeCategory === cat.name;
            return (
              <Link
                key={cat.name}
                href={`/category/${slug}`}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all group ${
                  isSelected
                    ? "bg-zinc-900 border-zinc-700 text-white"
                    : "bg-black border-zinc-900 hover:border-zinc-800 text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{CATEGORY_ICONS[cat.name] || "📷"}</span>
                  <span className="text-xs font-medium group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SidebarCategories;
