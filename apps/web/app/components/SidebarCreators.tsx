"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Loader2 } from "lucide-react";
import { api } from "@/app/lib/api";
import { UserAvatar } from "./UserAvatar";
import { UserNameLink } from "./UserNameLink";
import { FollowButton } from "./FollowButton";

interface SidebarCreatorsProps {
  creators?: any[];
  followingMap?: { [key: string]: boolean };
  onToggleFollow?: (username: string) => void;
}

export function SidebarCreators({
  creators: propsCreators,
  followingMap: propsFollowingMap,
  onToggleFollow,
}: SidebarCreatorsProps) {
  const [creators, setCreators] = useState<any[]>(propsCreators || []);
  const [loading, setLoading] = useState<boolean>(!propsCreators);
  const [localFollowingMap, setLocalFollowingMap] = useState<{ [key: string]: boolean }>(propsFollowingMap || {});

  useEffect(() => {
    if (propsFollowingMap) {
      setLocalFollowingMap(propsFollowingMap);
    }
  }, [propsFollowingMap]);

  useEffect(() => {
    if (!propsCreators) {
      async function loadCreators() {
        try {
          const data = await api.getSuggestedCreators(5);
          setCreators(data || []);
        } catch (e) {
          setCreators([]);
        } finally {
          setLoading(false);
        }
      }
      loadCreators();
    } else {
      setCreators(propsCreators);
      setLoading(false);
    }
  }, [propsCreators]);

  useEffect(() => {
    async function loadFollowingState() {
      if (typeof window !== "undefined" && localStorage.getItem("photopedia_token")) {
        try {
          const userStr = localStorage.getItem("photopedia_user");
          if (userStr) {
            const parsedUser = JSON.parse(userStr);
            if (parsedUser.username) {
              const followingList = await api.getFollowing(parsedUser.username);
              const map: { [key: string]: boolean } = {};
              (followingList || []).forEach((f: any) => {
                if (f.id) map[f.id] = true;
                if (f.username) map[f.username] = true;
              });
              setLocalFollowingMap((prev) => ({ ...prev, ...map }));
              return;
            }
          }

          const followingIds = await api.getFollowingIds();
          const map: { [key: string]: boolean } = {};
          (followingIds || []).forEach((id: string) => {
            map[id] = true;
          });
          setLocalFollowingMap((prev) => ({ ...prev, ...map }));
        } catch (e) {}
      }
    }
    loadFollowingState();
  }, []);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <h3 className="font-heading text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-zinc-400" />
          Suggested Creators
        </h3>
        <Link href="/creators" className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors">
          VIEW ALL
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full shimmer-effect shrink-0" />
                <div className="space-y-1.5 min-w-0">
                  <div className="w-24 h-3 rounded shimmer-effect" />
                  <div className="w-16 h-2.5 rounded shimmer-effect" />
                </div>
              </div>
              <div className="w-14 h-6 rounded-lg shimmer-effect shrink-0" />
            </div>
          ))}
        </div>
      ) : creators.length === 0 ? (
        <p className="text-xs text-zinc-500 py-2">No suggested creators found</p>
      ) : (
        <div className="space-y-3">
          {creators.slice(0, 5).map((creator) => {
            const isFollowing = !!(
              localFollowingMap[creator.id] || localFollowingMap[creator.username]
            );
            return (
              <div key={creator.username} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Link href={`/creators/${creator.username}`}>
                    <UserAvatar src={creator.avatar} alt={creator.name} size="md" />
                  </Link>
                  <UserNameLink name={creator.name} username={creator.username} showHandle={true} />
                </div>

                <FollowButton
                  usernameOrId={creator.username}
                  initialFollowing={isFollowing}
                  onFollowChange={(nextState) => {
                    setLocalFollowingMap((prev) => ({
                      ...prev,
                      [creator.username]: nextState,
                      ...(creator.id ? { [creator.id]: nextState } : {}),
                    }));
                    if (onToggleFollow) onToggleFollow(creator.username);
                  }}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SidebarCreators;
