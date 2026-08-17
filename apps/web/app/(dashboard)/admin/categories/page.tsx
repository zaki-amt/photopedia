"use client";

import React, { useState } from "react";
import { Layers, Plus, Check, Loader2, RefreshCw } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: "1", name: "Landscape", icon: "🏔️", desc: "Mountains, forests, and natural vistas", count: 4 },
    { id: "2", name: "Urban & Street", icon: "🌆", desc: "City streets and architectural rain reflections", count: 2 },
    { id: "3", name: "Portraits", icon: "📸", desc: "Natural light portraiture and studio lighting", count: 1 },
    { id: "4", name: "Architecture", icon: "🏛️", desc: "Structural geometry and spatial design", count: 1 },
    { id: "5", name: "Astro & Night", icon: "🌌", desc: "Deep space long exposures and night cityscapes", count: 0 },
    { id: "6", name: "Seascape", icon: "🌊", desc: "Ocean waves and coastal ocean horizons", count: 0 },
  ]);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📷");
  const [desc, setDesc] = useState("");
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCat = {
      id: Date.now().toString(),
      name: name.trim(),
      icon: icon.trim() || "📷",
      desc: desc.trim() || "Category collection",
      count: 0,
    };

    setCategories((prev) => [newCat, ...prev]);
    setName("");
    setDesc("");
    setCreatedSuccess(true);
    setTimeout(() => setCreatedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-zinc-400" />
            Category Management
          </h1>
          <p className="text-xs text-zinc-400">Add and manage platform photography categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Category Form */}
        <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Plus className="w-4 h-4 text-zinc-400" />
            Add New Category
          </h3>

          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 block">Category Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wildlife & Nature"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 block">Category Icon / Emoji</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="🦅"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 block">Description</label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Brief category description..."
                className="w-full bg-black border border-zinc-800 rounded-xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-black py-2.5 rounded-xl text-xs font-semibold shadow-sm hover:bg-zinc-200 transition-all"
            >
              {createdSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Category Added!
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Category
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center justify-between border-b border-zinc-900 pb-3">
            <span>Platform Categories ({categories.length})</span>
            <span className="text-[10px] font-mono text-zinc-500">LIVE</span>
          </h3>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="p-3.5 rounded-xl bg-black border border-zinc-900 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{cat.icon}</span>
                  <div className="min-w-0">
                    <h4 className="font-heading text-xs font-semibold text-white truncate">{cat.name}</h4>
                    <p className="text-[11px] text-zinc-400 font-sans truncate">{cat.desc}</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md shrink-0">
                  {cat.count} photos
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
