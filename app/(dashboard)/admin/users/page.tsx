"use client";

import { useState } from "react";
import { Users, Search, Shield, ShieldOff, CheckCircle2, AlertCircle } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "suspended";
  joined: string;
  posts: number;
}

const INITIAL_USERS: UserItem[] = [
  {
    id: "1",
    name: "Alex Morgan",
    username: "alexmorgan",
    email: "alex@photopedia.com",
    role: "admin",
    status: "active",
    joined: "Jan 2024",
    posts: 6,
  },
  {
    id: "2",
    name: "Elena Rostova",
    username: "elena_photos",
    email: "elena@example.com",
    role: "user",
    status: "active",
    joined: "Mar 2024",
    posts: 42,
  },
  {
    id: "3",
    name: "Marcus Chen",
    username: "marcus_urban",
    email: "marcus@example.com",
    role: "user",
    status: "active",
    joined: "Apr 2024",
    posts: 28,
  },
  {
    id: "4",
    name: "Spam Bot Account",
    username: "spambot99",
    email: "spambot@suspicious.io",
    role: "user",
    status: "suspended",
    joined: "Aug 2026",
    posts: 1,
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            status: user.status === "active" ? "suspended" : "active",
          };
        }
        return user;
      })
    );
  };

  const toggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            role: user.role === "admin" ? "user" : "admin",
          };
        }
        return user;
      })
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-400" />
            User Directory
          </h1>
          <p className="text-xs text-zinc-400">Manage user permissions and account status</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-black text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5">Posts</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white font-heading">{user.name}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">@{user.username} • {user.email}</div>
                  </td>

                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleRole(user.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-medium border transition-colors ${
                        user.role === "admin"
                          ? "bg-white text-black border-white"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {user.role.toUpperCase()}
                    </button>
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                        user.status === "active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {user.status === "active" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {user.status}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-[11px] font-mono text-zinc-500">{user.joined}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-white font-mono">{user.posts}</td>

                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`p-1.5 rounded-lg text-xs transition-colors border ${
                        user.status === "active"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                      }`}
                      title={user.status === "active" ? "Suspend user" : "Activate user"}
                    >
                      {user.status === "active" ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
