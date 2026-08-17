"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/app/lib/api";

export function useFollowList(username: string, mode: "followers" | "following") {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [followingMap, setFollowingMap] = useState<{ [key: string]: boolean }>({});

  const fetchList = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const data =
        mode === "followers"
          ? await api.getFollowers(username)
          : await api.getFollowing(username);
      setUsers(data || []);

      // Fetch active user's following list to show correct FollowButton state
      if (typeof window !== "undefined" && localStorage.getItem("photopedia_token")) {
        try {
          const myFollowingIds = await api.getFollowingIds();
          const map: { [key: string]: boolean } = {};
          (myFollowingIds || []).forEach((id: string) => {
            map[id] = true;
          });
          setFollowingMap(map);
        } catch (e) {
          // Fallback
        }
      }
    } catch (err: any) {
      console.warn("Follow list fetch error:", err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [username, mode]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return {
    users,
    loading,
    followingMap,
    refetch: fetchList,
  };
}

export default useFollowList;
