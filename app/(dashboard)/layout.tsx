"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

// User Context Definition
interface UserContextType {
  user: {
    name: string;
    username: string;
    email: string;
    role: "admin" | "user";
    avatar: string;
  };
  setUser: React.Dispatch<React.SetStateAction<UserContextType["user"]>>;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState<UserContextType["user"]>({
    name: "Alex Morgan",
    username: "alexmorgan",
    email: "alex@photopedia.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  });

  const navigation = [
    { name: "Feed", href: "/feed", icon: Home },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/profile/edit", icon: Settings },
  ];

  const adminNavigation = [
    { name: "Overview", href: "/admin", icon: Shield },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Moderation", href: "/admin/posts", icon: Grid },
  ];

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
          } md:block w-full md:w-60 bg-black border-r border-zinc-800/80 p-5 flex flex-col justify-between fixed md:sticky top-0 h-auto md:h-screen z-40`}
        >
          <div className="space-y-7">
            {/* Logo */}
            <Link href="/feed" className="hidden md:flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-white text-black flex items-center justify-center font-bold">
                <Camera className="w-4 h-4" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-white">Photopedia</span>
            </Link>

            {/* Nav Menu */}
            <nav className="space-y-6">
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-widest mb-2">
                  Navigation
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

              {/* Admin Links */}
              {user.role === "admin" && (
                <div className="space-y-1 pt-4 border-t border-zinc-900">
                  <div className="flex items-center justify-between px-3 mb-2">
                    <p className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-widest">
                      Admin
                    </p>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      SYS
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

          {/* User Profile Card */}
          <div className="pt-4 border-t border-zinc-900 space-y-2 mt-auto">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-zinc-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate font-heading">{user.name}</p>
                <p className="text-[10px] text-zinc-500 font-mono truncate">@{user.username}</p>
              </div>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white px-2.5 py-1.5 transition-colors w-full"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </Link>
          </div>
        </aside>

        {/* Main Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="border-b border-zinc-800/80 bg-black/80 backdrop-blur-md px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 ml-4">
              <button className="relative p-2 text-zinc-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-zinc-800">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full" />
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  );
}
