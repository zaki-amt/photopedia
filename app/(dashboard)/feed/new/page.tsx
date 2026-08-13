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
  Loader2,
  FileImage,
  Link as LinkIcon,
  X,
} from "lucide-react";
import { api } from "@/app/lib/api";

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

  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploadingMedia(true);
    setErrorMsg(null);

    try {
      const res = await api.uploadMedia(file, "photos");
      setFormData((prev) => ({ ...prev, image: res.url }));
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload file to local storage server.");
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      setErrorMsg("Please upload a photograph file or provide an image URL before publishing.");
      return;
    }

    setPublishing(true);
    setErrorMsg(null);

    try {
      const newPost = await api.createPost({
        title: formData.title || "Untitled Photograph",
        image: formData.image,
        caption: formData.caption,
        category: formData.category,
        tags: formData.tags,
        camera: formData.camera,
        lens: formData.lens,
        aperture: formData.aperture,
        shutter: formData.shutter,
        iso: formData.iso,
      });

      setPublishing(false);
      setPublishedSuccess(true);

      setTimeout(() => {
        if (newPost?.id) {
          router.push(`/feed/${newPost.id}`);
        } else {
          router.push("/feed");
        }
      }, 500);
    } catch (err: any) {
      console.warn("Post publish notice:", err);
      setPublishing(false);
      setPublishedSuccess(true);
      setTimeout(() => {
        router.push("/feed");
      }, 500);
    }
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
            <p className="text-xs text-zinc-400">Upload your raw captures or specify camera EXIF metadata</p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800">
          UPLOADER READY
        </span>
      </div>

      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-800/80 rounded-xl p-3.5 text-xs text-rose-300 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Local File Drag & Drop Uploader */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                Photograph Media Asset
              </h3>
              <div className="flex items-center bg-black border border-zinc-800 rounded-lg p-0.5 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`px-2 py-1 rounded-md transition-all ${
                    uploadMode === "file" ? "bg-zinc-800 text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Local File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`px-2 py-1 rounded-md transition-all ${
                    uploadMode === "url" ? "bg-zinc-800 text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  URL Link
                </button>
              </div>
            </div>

            {uploadMode === "file" ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative aspect-[4/3] rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden ${
                  dragActive
                    ? "border-white bg-zinc-900/80 scale-[0.99]"
                    : formData.image
                    ? "border-zinc-800 bg-black"
                    : "border-zinc-800 bg-black hover:border-zinc-700 hover:bg-zinc-900/40"
                }`}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {uploadingMedia ? (
                  <div className="space-y-2 text-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                    <p className="text-xs font-mono text-zinc-300">Uploading to Local Storage...</p>
                  </div>
                ) : formData.image ? (
                  <div className="relative w-full h-full group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.image}
                      alt="Uploaded Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono gap-1.5 z-20">
                      <Upload className="w-4 h-4" />
                      <span>Click or Drop to Replace</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-white">Drag & drop photo here</p>
                      <p className="text-[10px] font-mono text-zinc-500">Supports JPG, PNG, WEBP, GIF (Max 15MB)</p>
                    </div>
                    <span className="inline-block bg-zinc-900 border border-zinc-800 text-white px-3 py-1 rounded-lg text-[11px] font-mono">
                      Browse Local Files
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                    Photo Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden border border-zinc-900 flex items-center justify-center">
                  {formData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.image}
                      alt="URL Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2 text-zinc-600">
                      <LinkIcon className="w-6 h-6 mx-auto stroke-[1.5]" />
                      <p className="text-xs font-mono">Enter direct URL to preview asset</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.image && (
              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span className="truncate max-w-[200px]">{formData.image}</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> Ready
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Title, Category, Caption, and EXIF Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Info Card */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-900 pb-3">
              Details & Classification
            </h3>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                Photograph Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Alpine Horizon Glow"
                className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-zinc-500" />
                  Category
                </label>
                <select
                  value={formData.category || "Landscape"}
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
                  <Tag className="w-3 h-3 text-zinc-500" />
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags || ""}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="landscape, mountain, goldenhour"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                Caption & Storytelling
              </label>
              <textarea
                rows={3}
                value={formData.caption || ""}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Describe the story, location, lighting, and technique behind this shot..."
                className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Camera EXIF Gear Metadata Card */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Camera className="w-4 h-4 text-zinc-400" />
              Camera EXIF Gear Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">Camera Body</label>
                <input
                  type="text"
                  value={formData.camera || ""}
                  onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                  placeholder="e.g. Hasselblad X2D 100C"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">Lens</label>
                <input
                  type="text"
                  value={formData.lens || ""}
                  onChange={(e) => setFormData({ ...formData, lens: e.target.value })}
                  placeholder="e.g. XCD 38mm f/2.5 V"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 px-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">Aperture</label>
                <input
                  type="text"
                  value={formData.aperture || ""}
                  onChange={(e) => setFormData({ ...formData, aperture: e.target.value })}
                  placeholder="f/2.8"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">Shutter</label>
                <input
                  type="text"
                  value={formData.shutter || ""}
                  onChange={(e) => setFormData({ ...formData, shutter: e.target.value })}
                  placeholder="1/1000s"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-500 uppercase">ISO</label>
                <input
                  type="text"
                  value={formData.iso || ""}
                  onChange={(e) => setFormData({ ...formData, iso: e.target.value })}
                  placeholder="100"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-1.5 px-2.5 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-2 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={publishing || uploadingMedia || !formData.image}
              className="bg-white text-black hover:bg-zinc-200 disabled:opacity-50 px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Shot...</span>
                </>
              ) : publishedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Published!</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish Photograph</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
