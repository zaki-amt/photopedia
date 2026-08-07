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
  Key,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function EditProfilePage() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: "Commercial & landscape photographer based in San Francisco. Documenting outdoor perspectives, architectural geometry, and natural color depth. 📷✨",
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: formData.name,
      username: formData.username,
      email: formData.email,
      avatar: formData.avatar,
    }));

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.push("/profile");
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header Bar Matching Feed Spacing */}
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
            <h1 className="font-heading text-xl font-bold text-white">Profile Settings</h1>
            <p className="text-xs text-zinc-400">Manage creator identity, email, and avatar asset</p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md uppercase tracking-wider">
          SETTINGS
        </span>
      </div>

      {/* Main Grid: Left Form Column + Right Sidebar (Identical to Feed Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Form Column */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-sm">
            {/* Avatar Upload Preview */}
            <div className="flex items-center gap-5 pb-6 border-b border-zinc-900">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.avatar}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-2xl object-cover border border-zinc-800 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-white text-black p-1 rounded-md shadow">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex-1 space-y-1.5">
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
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
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
                    className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Saved
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar Column (Matches Feed Right Sidebar Layout) */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          {/* Account Security Summary Card */}
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
                <span className="font-mono text-white text-[11px] font-semibold">{user.role.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Two-Factor Auth</span>
                <span className="text-emerald-400 font-mono text-[11px]">ENABLED</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                <span className="text-zinc-400">Session Status</span>
                <span className="font-mono text-zinc-400 text-[10px]">ACTIVE (SF, CA)</span>
              </div>
            </div>
          </div>

          {/* Guidelines Card */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Sparkles className="w-4 h-4 text-zinc-400" />
              Creator Standards
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Photopedia preserves EXIF camera metadata and original color gamuts. Updating your profile details ensures verified portfolio ownership across feeds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
