"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { useUser } from "@/app/(dashboard)/layout";

export function useFeed() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState<{ [key: string]: boolean }>({});

  const fetchFeed = useCallback(async (tab: "for-you" | "following" = activeTab) => {
    setLoading(true);
    try {
      const feedType = tab === "following" ? "following" : undefined;
      const dbPosts = await api.getPosts(undefined, feedType);
      setPosts(dbPosts || []);

      const dbCats = await api.getTopCategories();
      setCategories(
        (dbCats || []).map((c: any) => ({
          name: c.name,
          count: c.count,
          icon: c.name.includes("Urban") ? "🌆" : c.name.includes("Portrait") ? "📸" : "🏔️",
        }))
      );

      const dbCreators = await api.getSuggestedCreators();
      setCreators(dbCreators || []);

      if (user?.username) {
        try {
          const followingList = await api.getFollowing(user.username);
          const map: { [key: string]: boolean } = {};
          (followingList || []).forEach((f: any) => {
            if (f.id) map[f.id] = true;
            if (f.username) map[f.username] = true;
          });
          setFollowingMap(map);
        } catch (e) {
          try {
            const followingIds = await api.getFollowingIds();
            const map: { [key: string]: boolean } = {};
            (followingIds || []).forEach((id: string) => {
              map[id] = true;
            });
            setFollowingMap(map);
          } catch (e2) {}
        }
      }
    } catch (err: any) {
      console.warn("Feed fetch notice:", err.message);
      if (tab === "following") {
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchFeed(activeTab);
  }, [activeTab, fetchFeed]);

  const changeTab = (tab: "for-you" | "following") => {
    if (tab === "following" && !user) {
      router.push("/login");
      return;
    }
    setActiveTab(tab);
  };

  const handleLike = async (id: string) => {
    try {
      await api.toggleLike(id);
    } catch (e) {
      // Local fallback
    }
  };

  const toggleFollow = async (usernameOrId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    const isCurrentlyFollowing = !!(followingMap[usernameOrId]);
    setFollowingMap((prev) => ({
      ...prev,
      [usernameOrId]: !isCurrentlyFollowing,
    }));

    try {
      const res = await api.toggleFollow(usernameOrId);
      setFollowingMap((prev) => ({
        ...prev,
        [usernameOrId]: res.following,
        ...(res.targetUserId ? { [res.targetUserId]: res.following } : {}),
        ...(res.targetUsername ? { [res.targetUsername]: res.following } : {}),
      }));
      if (activeTab === "following") {
        fetchFeed("following");
      }
    } catch (e) {
      // Keep optimistic
    }
  };

  return {
    user,
    activeTab,
    changeTab,
    posts,
    categories,
    creators,
    loading,
    followingMap,
    fetchFeed,
    handleLike,
    toggleFollow,
  };
}

export default useFeed;
