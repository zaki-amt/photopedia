"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  Check,
  Compass,
  ChevronRight,
  Sparkles,
  Layers,
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
  toggleRole: () => void;
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

const CATEGORIES_LIST = [
  { name: "All Categories", href: "/category", icon: "🌐" },
  { name: "Landscape", href: "/category/landscape", icon: "🏔️" },
  { name: "Urban & Street", href: "/category/urban-street", icon: "🌆" },
  { name: "Portraits", href: "/category/portraits", icon: "📸" },
  { name: "Architecture", href: "/category/architecture", icon: "🏛️" },
  { name: "Astro & Night", href: "/category/astro-night", icon: "🌌" },
  { name: "Seascape", href: "/category/seascape", icon: "🌊" },
];

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const items = [{ name: "Feed", href: "/feed" }];

  if (segments.length === 0 || (segments.length === 1 && segments[0] === "feed")) {
    return items;
  }

  let currentPath = "";
  segments.forEach((segment, idx) => {
    currentPath += `/${segment}`;
    if (segment === "feed" && idx === 0) return;

    let label = segment;
    if (segment === "category") label = "Categories";
    else if (segment === "creators") label = "Creators";
    else if (segment === "profile") label = "Profile";
    else if (segment === "edit") label = "Edit Profile";
    else if (segment === "admin") label = "Admin";
    else if (segment === "users") label = "Users";
    else if (segment === "posts") label = "Moderation";
    else if (segment === "new") label = "New Shot";
    else if (segments[idx - 1] === "category") {
      label = segment.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    } else if (segments[idx - 1] === "creators") {
      label = `@${segment}`;
    } else if (segments[idx - 1] === "feed") {
      label = "Photograph Details";
    }

    items.push({ name: label, href: currentPath });
  });

  return items;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingSession, setLoadingSession] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);

  const [user, setUser] = useState<UserContextType["user"]>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("photopedia_token");
      const storedUser = localStorage.getItem("photopedia_user");

      const isProtected =
        pathname === "/feed/new" ||
        pathname === "/profile/edit" ||
        pathname.startsWith("/admin");

      if (!storedToken || !storedUser) {
        setLoadingSession(false);
        setUser(null);
        if (isProtected) {
          router.push("/login");
        }
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
          avatar: parsed.avatar || "/avatar.jpg",
          bio: parsed.bio,
        });
      } catch (e) {
        console.error("Failed to parse stored user session:", e);
        setUser(null);
        if (isProtected) {
          router.push("/login");
        }
      } finally {
        setLoadingSession(false);
      }
    }
  }, [pathname, router]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/feed?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const exploreNavigation = [
    { name: "Feed", href: "/feed", icon: Home },
    { name: "New Shot", href: "/feed/new", icon: PlusCircle },
  ];

  const communityNavigation = [
    { name: "Creators", href: "/creators", icon: Users },
  ];

  const accountNavigation = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/profile/edit", icon: Settings },
  ];

  const adminNavigation = [
    { name: "Overview", href: "/admin", icon: Shield },
    { name: "Categories Manager", href: "/admin/categories", icon: Layers },
    { name: "Users Directory", href: "/admin/users", icon: Users },
    { name: "Moderation Queue", href: "/admin/posts", icon: Grid },
  ];

  const NOTIFICATIONS = [
    { id: 1, text: "Elena Rostova published a new photo in Landscape", time: "10m ago" },
    { id: 2, text: "Marcus Chen liked your recent submission", time: "1h ago" },
    { id: 3, text: "Sophia Martinez started following you", time: "2h ago" },
  ];

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-black text-[#ededed] flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-xs font-mono text-zinc-400">Loading session...</p>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const breadcrumbs = getBreadcrumbs(pathname);

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

        {/* Framer/Vercel Styled Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } md:flex w-full md:w-64 bg-zinc-950 border-r border-zinc-800/80 p-4 flex-col justify-between fixed md:sticky top-0 h-screen z-40 overflow-y-auto shrink-0`}
        >
          <div className="space-y-5">
            {/* Sidebar Header Logo (Links directly to /feed) */}
            <Link href="/feed" className="hidden md:flex items-center gap-2.5 px-2 py-1">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm">
                <Camera className="w-4 h-4" />
              </div>
              <span className="font-heading text-base font-bold tracking-tight text-white">Photopedia</span>
            </Link>

            {/* Sidebar Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative px-1">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </form>

            <nav className="space-y-5">
              {/* SECTION: EXPLORE */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider mb-1">
                  Explore
                </p>
                {exploreNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-zinc-800 text-white font-semibold shadow-sm"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                      }`}
                    >
                      <item.icon className="w-4 h-4 text-zinc-400" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* SECTION: CATEGORIES (Expandable Submenu) */}
              <div className="space-y-1">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="w-full flex items-center justify-between px-3 text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider mb-1 hover:text-zinc-300 transition-colors group"
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3 h-3 text-zinc-500" />
                    Categories
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
                      categoriesOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {categoriesOpen && (
                  <div className="space-y-0.5 pl-2 border-l border-zinc-800/80 ml-3">
                    {CATEGORIES_LIST.map((cat) => {
                      const isActive = pathname === cat.href;
                      return (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                            isActive
                              ? "bg-zinc-800 text-white font-semibold"
                              : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="text-xs">{cat.icon}</span>
                            {cat.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION: COMMUNITY */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider mb-1">
                  Community
                </p>
                {communityNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-zinc-800 text-white font-semibold shadow-sm"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                      }`}
                    >
                      <item.icon className="w-4 h-4 text-zinc-400" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* SECTION: ACCOUNT */}
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider mb-1">
                  Account
                </p>
                {accountNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-zinc-800 text-white font-semibold shadow-sm"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                      }`}
                    >
                      <item.icon className="w-4 h-4 text-zinc-400" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* SECTION: ADMIN CONTROLS */}
              {isAdmin && (
                <div className="space-y-1 pt-3 border-t border-zinc-900">
                  <div className="flex items-center justify-between px-3 mb-1">
                    <p className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
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
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? "bg-zinc-800 text-white font-semibold shadow-sm"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
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

          {/* Bottom Sidebar User Profile / Auth State */}
          <div className="pt-4 border-t border-zinc-900 space-y-3">
            {user ? (
              <div className="flex items-center justify-between bg-black p-2 rounded-xl border border-zinc-900">
                <Link href="/profile" className="flex items-center gap-2.5 min-w-0 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar || "/avatar.jpg"}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-800 shrink-0 group-hover:border-zinc-500 transition-colors"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate font-heading group-hover:underline">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono truncate">@{user.username}</p>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 rounded-lg transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="w-full text-center bg-white text-black py-2 rounded-xl text-xs font-semibold hover:bg-zinc-200 transition-all shadow-sm"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center bg-zinc-900 text-zinc-300 border border-zinc-800 py-2 rounded-xl text-xs font-semibold hover:text-white hover:border-zinc-700 transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Bar Header (Breadcrumbs Only) */}
          <header className="hidden md:flex items-center justify-between h-14 px-8 border-b border-zinc-800/80 bg-black/50 backdrop-blur-sm sticky top-0 z-30">
            {/* Clean Breadcrumb Navigation */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.href + idx}>
                    {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                    {isLast ? (
                      <span className="text-white font-semibold">{crumb.name}</span>
                    ) : (
                      <Link href={crumb.href} className="hover:text-white transition-colors">
                        {crumb.name}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              {/* Admin Role Toggle Indicator */}
              {user?.role === "admin" && (
                <button
                  onClick={toggleRole}
                  className="flex items-center gap-1.5 font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ADMIN ROLE</span>
                </button>
              )}

              {/* Notifications Center Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-black" />
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 shadow-2xl space-y-3 z-50">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                      <h4 className="font-heading text-xs font-bold text-white">Notifications</h4>
                      <span className="text-[10px] font-mono text-zinc-500">REALTIME</span>
                    </div>

                    <div className="space-y-2">
                      {NOTIFICATIONS.map((n) => (
                        <div key={n.id} className="p-2 bg-black rounded-xl border border-zinc-900 text-xs space-y-1">
                          <p className="text-zinc-300 leading-tight">{n.text}</p>
                          <span className="text-[10px] font-mono text-zinc-500">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Workspace Render */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  );
}
