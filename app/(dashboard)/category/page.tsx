"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  ChevronRight,
  Camera,
  Layers,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { api } from "@/app/lib/api";

const ALL_CATEGORIES = [
  {
    name: "Landscape",
    slug: "landscape",
    icon: "🏔️",
    desc: "Mountains, horizons, golden hour light, and natural wilderness captures.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Urban & Street",
    slug: "urban-street",
    icon: "🌆",
    desc: "Raw city life, neon rain reflections, street portraiture, and architectural shadows.",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Portraits",
    slug: "portraits",
    icon: "📸",
    desc: "Natural light portraiture, editorial studio lighting, and expressive faces.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Architecture",
    slug: "architecture",
    icon: "🏛️",
    desc: "Clean lines, structural geometry, urban shadows, and spatial design.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Astro & Night",
    slug: "astro-night",
    icon: "🌌",
    desc: "Deep space long exposures, milky way galaxy arches, and night cityscapes.",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Seascape",
    slug: "seascape",
    icon: "🌊",
    desc: "Ocean waves, coastal cliffs, tide reflections, and horizon waters.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
];

export default function AllCategoriesArchivePage() {
  const router = useRouter();
  const [topCategories, setTopCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getTopCategories();
        setTopCategories(data || []);
      } catch (e) {
        setTopCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getCount = (categoryName: string) => {
    const found = topCategories.find((c) => c.name === categoryName);
    return found ? found.count : 0;
  };

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* Hero Banner */}
      <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden shadow-sm space-y-3">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-black text-zinc-300 text-xs font-mono">
          <Compass className="w-3.5 h-3.5 text-zinc-400" />
          <span>Curated Photography Directory</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
          Explore All Categories
        </h1>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Discover photographs grouped by visual genres, lighting conditions, and artistic styles.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_CATEGORIES.map((cat) => {
          const count = getCount(cat.name);
          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-2xl overflow-hidden shadow-sm transition-all block flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] bg-black overflow-hidden border-b border-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 text-xs text-white font-medium flex items-center gap-1.5">
                  <span>{cat.icon}</span>
                  <span className="font-heading font-semibold">{cat.name}</span>
                </div>

                <div className="absolute top-3 right-3 bg-white text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                  {count} {count === 1 ? "SHOT" : "SHOTS"}
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-2">
                  {cat.desc}
                </p>

                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-semibold text-white group-hover:text-white transition-colors">
                  <span>Browse Category Archive</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
