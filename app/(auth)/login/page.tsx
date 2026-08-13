"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Mail, Lock, ArrowRight, AlertCircle, Key, CheckCircle2 } from "lucide-react";
import { api } from "@/app/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto redirect if already logged in
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("photopedia_token");
      const user = localStorage.getItem("photopedia_user");
      if (token && user) {
        router.push("/");
      }
    }
  }, [router]);

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    setError(null);

    const cleanEmail = loginEmail.trim().toLowerCase();

    try {
      // Authenticate strictly with backend NestJS server API
      const data = await api.login({ email: cleanEmail, password: loginPass });
      if (typeof window !== "undefined") {
        localStorage.setItem("photopedia_token", data.accessToken);
        localStorage.setItem("photopedia_user", JSON.stringify(data.user));
      }
      setLoading(false);
      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Invalid credentials. Please check your email and password.");
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const quickFillAndLogin = (demoEmail: string) => {
    const demoPassword = "AdminPass123!";
    setEmail(demoEmail);
    setPassword(demoPassword);
    performLogin(demoEmail, demoPassword);
  };

  return (
    <div className="min-h-screen bg-black text-[#ededed] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-sm space-y-6 bg-zinc-950 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-white">Photopedia</span>
          </Link>
          <h2 className="font-heading text-lg font-semibold text-white">Log in to Photopedia</h2>
          <p className="text-xs text-zinc-400">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

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
                placeholder="elena@example.com"
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
                placeholder="Password"
                className="w-full bg-black border border-zinc-800 rounded-lg py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 text-black font-semibold py-2.5 px-4 rounded-lg transition-all text-xs flex items-center justify-center gap-2 mt-2 shadow-sm"
          >
            {loading ? "Authenticating..." : "Log In"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Clickable Quick Fill Demo Accounts Card */}
        <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Key className="w-3.5 h-3.5 text-zinc-400" />
            <span>Click Demo Account to Login:</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => quickFillAndLogin("elena@example.com")}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-black border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-left group"
            >
              <span>Elena: <strong className="text-white">elena@example.com</strong></span>
              <span className="text-[10px] text-zinc-500 group-hover:text-white flex items-center gap-1">
                Fill & Login <ArrowRight className="w-3 h-3" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => quickFillAndLogin("admin@photopedia.com")}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-black border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all text-left group"
            >
              <span>Admin: <strong className="text-white">admin@photopedia.com</strong></span>
              <span className="text-[10px] text-zinc-500 group-hover:text-white flex items-center gap-1">
                Fill & Login <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>

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
