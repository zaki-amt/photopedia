"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, Check, Camera } from "lucide-react";
import { api } from "@/app/lib/api";

const CATEGORIES = [
  "Landscape",
  "Urban & Street",
  "Portraits",
  "Architecture",
  "Astro & Night",
  "Seascape",
];

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Landscape");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");

  const [camera, setCamera] = useState("");
  const [lens, setLens] = useState("");
  const [aperture, setAperture] = useState("");
  const [shutter, setShutter] = useState("");
  const [iso, setIso] = useState("");

  useEffect(() => {
    async function loadPost() {
      try {
        const post = await api.getPostById(postId);
        if (post) {
          setTitle(post.title || "Beautiful Landscape");
          setCaption(post.caption || "Amazing photograph captured by me!");
          setCategory(post.category || "Landscape");
          setTags(post.tags || "nature,photography");
          setImage(post.image || "");

          if (post.exif) {
            setCamera(post.exif.camera || "");
            setLens(post.exif.lens || "");
            setAperture(post.exif.aperture || "");
            setShutter(post.exif.shutter || "");
            setIso(post.exif.iso || "");
          }
        }
      } catch (e) {
        console.warn("Error loading post for editing:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updatePost(postId, {
        title,
        caption,
        category,
        tags,
        camera,
        lens,
        aperture,
        shutter,
        iso,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        router.push(`/feed/${postId}`);
      }, 1000);
    } catch (e: any) {
      alert(e.message || "Failed to update photograph");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">Loading photograph details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 font-sans">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <Link
          href={`/feed/${postId}`}
          className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel
        </Link>
        <div>
          <h1 className="font-heading text-xl font-bold text-white">Edit Photograph</h1>
          <p className="text-xs text-zinc-400">Update title, caption, category, and camera EXIF metadata</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Preview Image */}
        {image && (
          <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden aspect-[16/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Basic Info Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-900 pb-3">
            Photograph Details
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 block">Title</label>
            <input
              type="text"
              required
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 block">Category</label>
            <select
              value={category || "Landscape"}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 block">Caption</label>
            <textarea
              rows={3}
              value={caption || ""}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-zinc-700 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 block">Tags (comma separated)</label>
            <input
              type="text"
              value={tags || ""}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* EXIF Metadata Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
            <Camera className="w-4 h-4 text-zinc-400" />
            Camera EXIF Gear Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 block">Camera Body</label>
              <input
                type="text"
                value={camera || ""}
                onChange={(e) => setCamera(e.target.value)}
                placeholder="e.g. Sony A7 IV"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 block">Lens</label>
              <input
                type="text"
                value={lens || ""}
                onChange={(e) => setLens(e.target.value)}
                placeholder="e.g. FE 24-70mm GM II"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 block">Aperture</label>
              <input
                type="text"
                value={aperture || ""}
                onChange={(e) => setAperture(e.target.value)}
                placeholder="e.g. f/2.8"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 block">Shutter Speed</label>
              <input
                type="text"
                value={shutter || ""}
                onChange={(e) => setShutter(e.target.value)}
                placeholder="e.g. 1/1000s"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-300 block">ISO Sensitivity</label>
              <input
                type="text"
                value={iso || ""}
                onChange={(e) => setIso(e.target.value)}
                placeholder="e.g. ISO 100"
                className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl text-xs font-semibold shadow-sm hover:bg-zinc-200 transition-all"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              Changes Saved! Redirecting...
            </>
          ) : saving ? (
            <>
              <Loader2 className="w-4 h-4 text-black animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Photograph Details
            </>
          )}
        </button>
      </form>
    </div>
  );
}
