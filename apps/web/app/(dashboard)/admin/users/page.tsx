"use client";

import { useState, useEffect } from "react";
import { Users, Search, Shield, CheckCircle2, AlertCircle, RefreshCw, Ban, Trash2 } from "lucide-react";
import { api } from "@/app/lib/api";

interface UserItem {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
  postsCount?: number;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDatabaseUsers = async () => {
    setLoading(true);
    try {
      const dbUsers = await api.getAdminUsers();
      setUsers(dbUsers || []);
    } catch (e) {
      console.warn("Using local fallback users directory", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabaseUsers();
  }, []);

  const toggleRole = async (id: string) => {
    try {
      await api.toggleUserRole(id);
    } catch (e) {
      // Local optimistic update
    }
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            role: user.role?.toLowerCase() === "admin" ? "user" : "admin",
          };
        }
        return user;
      })
    );
  };

  const toggleStatus = async (id: string) => {
    try {
      const res = await api.toggleUserStatus(id);
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === id) {
            return {
              ...u,
              status: res?.status || (u.status?.toLowerCase() === "blocked" ? "active" : "blocked"),
            };
          }
          return u;
        })
      );
    } catch (e) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === id) {
            return {
              ...u,
              status: u.status?.toLowerCase() === "blocked" ? "active" : "blocked",
            };
          }
          return u;
        })
      );
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to remove this creator account?")) return;
    try {
      await api.deleteUser(id);
    } catch (e) {
      // Local optimistic update
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
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
          <p className="text-xs text-zinc-400 font-sans">Manage platform user accounts, block status, and role permissions</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDatabaseUsers}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 rounded-lg transition-colors"
            title="Refresh user directory"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-black border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>
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
              {filteredUsers.map((user) => {
                const isBlocked = user.status?.toLowerCase() === "blocked";
                const isAdmin = user.role?.toLowerCase() === "admin";
                return (
                  <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white font-heading">{user.name}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">@{user.username} • {user.email}</div>
                    </td>

                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleRole(user.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-medium border transition-colors ${
                          isAdmin
                            ? "bg-white text-black border-white font-bold"
                            : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </button>
                    </td>

                    <td className="px-5 py-3.5">
                      {isBlocked ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border bg-rose-500/10 text-rose-400 border-rose-500/20">
                          <AlertCircle className="w-3 h-3" />
                          BLOCKED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          ACTIVE
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-[11px] font-mono text-zinc-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-white font-mono">{user.postsCount || 0}</td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Block / Unblock Toggle Button */}
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className={`p-1.5 rounded-lg text-xs border transition-colors ${
                            isBlocked
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                          }`}
                          title={isBlocked ? "Unblock user account" : "Block user account"}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>

                        {/* Soft Delete User Button */}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 rounded-lg text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                          title="Delete user account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
