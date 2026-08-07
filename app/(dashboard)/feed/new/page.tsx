"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Image as ImageIcon,
  Tag,
  Sliders,
  Sparkles,
  ArrowLeft,
  Check,
  Eye,
  Layers,
  Upload,
} from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    caption: "",
    category: "Landscape",
    tags: "landscape, nature, goldenhour",
    camera: "Sony A7IV",
    lens: "24mm f/1.4 GM",
    aperture: "f/2.8",
    shutter: "1/1000s",
    iso: "100",
  });

  const [publishing, setPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const CATEGORIES = [
    "Landscape",
    "Urban & Street",
    "Portraits",
    "Architecture",
    "Astro & Night",
    "Seascape",
    "Wildlife",
    "Fine Art",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);

    // Simulate creation delay & redirect to feed
    setTimeout(() => {
      setPublishing(false);
      setPublishedSuccess(true);

      setTimeout(() => {
        router.push("/feed");
      }, 600);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 font-sans">
      {/* Header & Back Breadcrumbs */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              Publish New Photograph
              <Sparkles className="w-4 h-4 text-white" />
            </h1>
            <p className="text-xs text-zinc-400">Share your raw captures with camera EXIF details and tags</p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
          SUBMISSION
        </span>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Input & Live Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
              <ImageIcon className="w-4 h-4 text-zinc-400" />
              Photograph Asset
            </h3>

            <div className="space-y-2">
              <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                Photo Image URL *
              </label>
              <div className="relative">
                <Upload className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            {/* Live Image Preview Frame */}
            <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden border border-zinc-800/80 flex items-center justify-center">
              {formData.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.image}
                  alt="Live Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-8 h-8 text-zinc-700 mx-auto" />
                  <p className="text-xs text-zinc-500">Paste image URL above to preview live shot</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Title, Caption, Category, Tags & EXIF Metadata */}
        <div className="lg:col-span-7 space-y-6">
          {/* General Post Details Card */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-900 pb-3">
              Photo Story & Category
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Alpine Horizon Glow"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-zinc-500" />
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-zinc-500" />
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="landscape, nature, sony"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Caption & Description
                </label>
                <textarea
                  rows={4}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Tell the story behind this shot, lighting conditions, and location..."
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Camera EXIF Metadata Card */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Sliders className="w-4 h-4 text-zinc-400" />
              Camera EXIF Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Camera Body
                </label>
                <input
                  type="text"
                  value={formData.camera}
                  onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                  placeholder="e.g. Sony A7IV"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Lens Spec
                </label>
                <input
                  type="text"
                  value={formData.lens}
                  onChange={(e) => setFormData({ ...formData, lens: e.target.value })}
                  placeholder="e.g. 24mm f/1.4 GM"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Aperture & Shutter
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.aperture}
                    onChange={(e) => setFormData({ ...formData, aperture: e.target.value })}
                    placeholder="f/2.8"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                  <input
                    type="text"
                    value={formData.shutter}
                    onChange={(e) => setFormData({ ...formData, shutter: e.target.value })}
                    placeholder="1/1000s"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  ISO Sensitivity
                </label>
                <input
                  type="text"
                  value={formData.iso}
                  onChange={(e) => setFormData({ ...formData, iso: e.target.value })}
                  placeholder="ISO 100"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={publishing || publishedSuccess}
              className="inline-flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {publishedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Photograph Published!
                </>
              ) : publishing ? (
                "Publishing..."
              ) : (
                "Publish Photograph"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
