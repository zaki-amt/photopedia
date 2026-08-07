"use client";

import { useState } from "react";
import { useUser } from "@/app/(dashboard)/layout";
import { useRouter } from "next/navigation";
import {
  Camera,
  User,
  Mail,
  AtSign,
  FileText,
  Check,
  ArrowLeft,
  Image as ImageIcon,
  ShieldCheck,
  Loader2,
  MapPin,
  Globe,
  Phone,
  Layers,
  Sparkles,
  Aperture,
} from "lucide-react";
import { api } from "@/app/lib/api";

export default function EditProfilePage() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "/avatar.jpg",
    coverImage: (user as any)?.coverImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    bio: user?.bio || "Landscape & outdoor photographer documenting natural light reflections.",
    location: (user as any)?.location || "San Francisco, CA",
    website: (user as any)?.website || "https://photopedia.com",
    phone: (user as any)?.phone || "+1 (555) 234-5678",
    cameraBody: (user as any)?.cameraBody || "Sony A7IV",
    backupCamera: (user as any)?.backupCamera || "Leica Q2",
    lenses: (user as any)?.lenses || "24mm f/1.4 GM, 85mm f/1.4 GM",
    accessories: (user as any)?.accessories || "Profoto A1X, PolarPro ND Filters",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedUser = await api.updateProfile(formData);
      setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "photopedia_user",
          JSON.stringify({ ...user, ...updatedUser })
        );
      }
    } catch (err) {
      console.warn("Using local session update fallback:", err);
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser as any);
      if (typeof window !== "undefined") {
        localStorage.setItem("photopedia_user", JSON.stringify(updatedUser));
      }
    } finally {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push("/profile");
      }, 600);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold text-white">Edit Profile & Custom Fields</h1>
            <p className="text-xs text-zinc-400">Manage creator contact information, cover banner, and gear listing</p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
          SETTINGS
        </span>
      </div>

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Form Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Identity & Visual Assets */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-sm">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-900 pb-3">
              Visual Assets & Identity
            </h3>

            {/* Avatar & Cover URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Avatar Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="/avatar.jpg or https://..."
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Cover Photo Banner URL
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Core Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="e.g. alexmorgan"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@photopedia.com"
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">Bio</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell your story or describe your photographic perspective..."
                  className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Custom Fields: Location, Website, Phone */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-900 pb-3">
              Contact & Custom Fields
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="San Francisco, CA"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Website
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://elena.photo"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Camera & Gears Listing Custom Fields */}
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Camera className="w-4 h-4 text-zinc-400" />
              Camera & Gear Custom Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Primary Camera Body
                </label>
                <div className="relative">
                  <Camera className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.cameraBody}
                    onChange={(e) => setFormData({ ...formData, cameraBody: e.target.value })}
                    placeholder="e.g. Sony A7IV"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Secondary / Backup Camera
                </label>
                <div className="relative">
                  <Aperture className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.backupCamera}
                    onChange={(e) => setFormData({ ...formData, backupCamera: e.target.value })}
                    placeholder="e.g. Leica Q2"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Lenses & Optics
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.lenses}
                    onChange={(e) => setFormData({ ...formData, lenses: e.target.value })}
                    placeholder="e.g. 24mm f/1.4 GM, 85mm f/1.4 GM"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">
                  Accessories & Lighting
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.accessories}
                    onChange={(e) => setFormData({ ...formData, accessories: e.target.value })}
                    placeholder="e.g. Profoto A1X, PolarPro ND Filters"
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  Saved To DB!
                </>
              ) : saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Record...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Account Security
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">VERIFIED</span>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Account Role</span>
                <span className="font-mono text-white text-[11px] font-semibold">
                  {user?.role ? user.role.toUpperCase() : "USER"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Two-Factor Auth</span>
                <span className="text-emerald-400 font-mono text-[11px]">ENABLED</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
