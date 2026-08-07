"use client";

import { Compass } from "lucide-react";

interface CategoryItem {
  name: string;
  count: number | string;
  icon?: string;
}

interface SidebarCategoriesProps {
  categories: CategoryItem[];
  onSelectCategory?: (categoryName: string) => void;
  selectedCategory?: string;
}

export function SidebarCategories({
  categories,
  onSelectCategory,
  selectedCategory = "All",
}: SidebarCategoriesProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Compass className="w-4 h-4 text-zinc-400" />
          Top Categories
        </h3>
        <span className="text-[10px] font-mono text-zinc-500">DATABASE</span>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <div
              key={cat.name}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer group ${
                isSelected
                  ? "bg-zinc-900 border-zinc-700 text-white"
                  : "bg-black border-zinc-900 hover:border-zinc-800 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">{cat.icon || "📷"}</span>
                <span className="text-xs font-medium group-hover:text-white transition-colors">
                  {cat.name}
                </span>
              </div>
              <span className="font-mono text-[10px] font-semibold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
