"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push("/feed");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-6 bg-zinc-950 border border-zinc-800 p-8 rounded-xl backdrop-blur-xl shadow-2xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-white">Photopedia</span>
          </Link>
          <h2 className="font-heading text-lg font-semibold text-white">Log in to Photopedia</h2>
          <p className="text-xs text-zinc-400">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-zinc-400 hover:text-white transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-semibold py-2.5 px-4 rounded-lg transition-all text-xs flex items-center justify-center gap-2 mt-2 shadow-sm"
          >
            {loading ? "Logging in..." : "Log In"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400 pt-2 border-t border-zinc-900">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-white hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
