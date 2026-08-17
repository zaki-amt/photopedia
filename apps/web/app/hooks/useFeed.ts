"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/lib/api";
import { useUser } from "@/app/hooks/useAuth";

export function useFeed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followingMap, setFollowingMap] = useState<{ [key: string]: boolean }>({});

  const fetchFeed = useCallback(async (tab: "for-you" | "following" = activeTab, searchStr: string = searchQuery) => {
    setLoading(true);
    try {
      const feedType = tab === "following" ? "following" : undefined;
      const dbPosts = await api.getPosts(undefined, feedType, searchStr);
      setPosts(dbPosts || []);

      const dbCats = await api.getTopCategories();
      setCategories(
        (dbCats || []).map((c: any) => ({
          name: c.name,
          count: c.count,
          icon: c.name.includes("Urban") ? "🌆" : c.name.includes("Portrait") ? "📸" : "🏔️",
        }))
      );

      const dbCreators = await api.getSuggestedCreators(5);
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
  }, [activeTab, user, searchQuery]);

  useEffect(() => {
    fetchFeed(activeTab, searchQuery);
  }, [activeTab, searchQuery, fetchFeed]);

  const changeTab = (tab: "for-you" | "following") => {
    setActiveTab(tab);
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          const nextCount = nextLiked ? (p.likes || 0) + 1 : Math.max(0, (p.likes || 0) - 1);
          return { ...p, isLiked: nextLiked, likes: nextCount, likesCount: nextCount };
        }
        return p;
      })
    );
  };

  const toggleFollow = (username: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  const clearSearch = () => {
    router.push("/feed");
  };

  return {
    user,
    activeTab,
    changeTab,
    searchQuery,
    clearSearch,
    posts,
    categories,
    creators,
    loading,
    error,
    followingMap,
    fetchFeed,
    handleLike,
    toggleFollow,
  };
}

export default useFeed;
