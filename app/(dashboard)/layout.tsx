"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Camera,
  Home,
  User,
  Settings,
  Shield,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  Users,
  Grid,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  Loader2,
} from "lucide-react";

interface UserContextType {
  user: {
    id?: string;
    name: string;
    username: string;
    email: string;
    role: "admin" | "user";
    avatar: string;
    bio?: string;
  } | null;
  setUser: React.Dispatch<React.SetStateAction<UserContextType["user"]>>;
  toggleRole?: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within DashboardLayout");
  }
  return context;
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);

  const [user, setUser] = useState<UserContextType["user"]>(null);

  // Read logged in user session from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("photopedia_token");
      const storedUser = localStorage.getItem("photopedia_user");

      if (!storedToken || !storedUser) {
        setLoadingSession(false);
        setUser(null);
        router.push("/login");
        return;
      }

      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          id: parsed.id,
          name: parsed.name,
          username: parsed.username,
          email: parsed.email,
          role: (parsed.role?.toString().toLowerCase() === "admin" ? "admin" : "user") as "admin" | "user",
          avatar: parsed.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          bio: parsed.bio,
        });
      } catch (e) {
        console.error("Failed to parse stored user session:", e);
        router.push("/login");
      } finally {
        setLoadingSession(false);
      }
    }
  }, [router]);

  const toggleRole = () => {
    if (!user || user.role !== "admin") return;
    const newRole = user.role === "admin" ? "user" : "admin";
    const updated = { ...user, role: newRole as "admin" | "user" };
    setUser(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("photopedia_user", JSON.stringify(updated));
    }
    if (newRole === "user" && pathname.startsWith("/admin")) {
      router.push("/feed");
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("photopedia_token");
      localStorage.removeItem("photopedia_user");
    }
    setUser(null);
    router.push("/login");
  };

  const navigation = [
    { name: "Feed", href: "/feed", icon: Home },
    { name: "New Shot", href: "/feed/new", icon: PlusCircle },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/profile/edit", icon: Settings },
  ];

  const adminNavigation = [
    { name: "Overview", href: "/admin", icon: Shield },
    { name: "Users Directory", href: "/admin/users", icon: Users },
    { name: "Moderation Queue", href: "/admin/posts", icon: Grid },
  ];

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-black text-[#ededed] flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-xs font-mono text-zinc-400">Loading user session from database...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === "admin";

  return (
    <UserContext.Provider value={{ user, setUser, toggleRole, logout }}>
      <div className="min-h-screen bg-black text-[#ededed] flex flex-col md:flex-row font-sans selection:bg-white selection:text-black">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between border-b border-zinc-800 p-4 bg-black sticky top-0 z-50">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center font-bold">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-base text-white">Photopedia</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-black border-r border-zinc-800/80 p-5 flex flex-col justify-between fixed md:sticky top-0 h-auto md:h-screen z-40`}
        >
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/feed" className="hidden md:flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center font-bold shadow-sm">
                <Camera className="w-4 h-4" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-white">Photopedia</span>
            </Link>

            {/* Nav Menu */}
            <nav className="space-y-6">
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-widest mb-2">
                  Creator Space
                </p>
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-zinc-900 text-white border border-zinc-800"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                      }`}
                    >
                      <item.icon className="w-4 h-4 text-zinc-400" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Admin Navigation */}
              {isAdmin && (
                <div className="space-y-1 pt-4 border-t border-zinc-900">
                  <div className="flex items-center justify-between px-3 mb-2">
                    <p className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-widest">
                      Admin Controls
                    </p>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      ADMIN
                    </span>
                  </div>
                  {adminNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "bg-zinc-900 text-white border border-zinc-800"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                        }`}
                      >
                        <item.icon className="w-4 h-4 text-zinc-400" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>
          </div>

          {/* Logged In User Card */}
          <div className="pt-4 border-t border-zinc-900 space-y-2.5 mt-auto">
            {isAdmin && (
              <button
                onClick={toggleRole}
                className="w-full flex items-center justify-between gap-2 p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
                title="Admin Role Toggle"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px]">ADMIN MODE</span>
                </div>
                <RefreshCw className="w-3 h-3 text-zinc-500" />
              </button>
            )}

            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate font-heading">{user.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono truncate">@{user.username}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white px-2.5 py-1.5 transition-colors w-full"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Main Section */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b border-zinc-800/80 bg-black/80 backdrop-blur-md px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search photos, creators, EXIF tags..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 ml-4">
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-zinc-900 text-zinc-300 px-3 py-1 rounded-lg text-xs font-mono border border-zinc-800">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                @{user.username}
              </span>

              <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-zinc-800">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full" />
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  );
}
