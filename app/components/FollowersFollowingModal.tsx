"use client";

import React from "react";
import { X, Users, Loader2 } from "lucide-react";
import { useFollowList } from "@/app/hooks/useFollowList";
import { UserListItem } from "./UserListItem";

interface FollowersFollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  initialMode?: "followers" | "following";
  onListChange?: () => void;
}

export function FollowersFollowingModal({
  isOpen,
  onClose,
  username,
  initialMode = "followers",
  onListChange,
}: FollowersFollowingModalProps) {
  const [mode, setMode] = React.useState<"followers" | "following">(initialMode);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const { users, loading, followingMap, refetch } = useFollowList(username, mode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-sans animate-fade-in">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-black/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-400" />
            <h3 className="font-heading text-sm font-bold text-white">@{username}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-zinc-900 bg-zinc-950 text-xs font-semibold">
          <button
            onClick={() => setMode("followers")}
            className={`py-3 text-center border-b-2 transition-all ${
              mode === "followers"
                ? "border-white text-white font-bold bg-zinc-900/50"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Followers
          </button>
          <button
            onClick={() => setMode("following")}
            className={`py-3 text-center border-b-2 transition-all ${
              mode === "following"
                ? "border-white text-white font-bold bg-zinc-900/50"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Following
          </button>
        </div>

        {/* Modal Content List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 min-h-[250px]">
          {loading ? (
            <div className="py-12 text-center space-y-2">
              <Loader2 className="w-6 h-6 text-white animate-spin mx-auto" />
              <p className="text-xs font-mono text-zinc-500">Loading {mode} list...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center space-y-1">
              <p className="text-xs text-zinc-400 font-medium">No {mode} found</p>
              <p className="text-[11px] text-zinc-500">
                {mode === "followers"
                  ? "This creator currently has no public followers."
                  : "This creator is not following anyone yet."}
              </p>
            </div>
          ) : (
            users.map((u) => (
              <UserListItem
                key={u.id || u.username}
                user={u}
                isFollowing={!!(followingMap[u.id] || followingMap[u.username])}
                onFollowChange={() => {
                  refetch();
                  if (onListChange) onListChange();
                }}
                onClickUser={onClose}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowersFollowingModal;
