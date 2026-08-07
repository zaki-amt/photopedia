"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";

export function useLike(postId: string, initialLikes: number = 0, initialIsLiked: boolean = false) {
  const router = useRouter();
  const [likeCount, setLikeCount] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(initialLikes > 0 && initialIsLiked);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLikeCount(initialLikes);
    if (initialLikes === 0) {
      setIsLiked(false);
    } else if (typeof window !== "undefined") {
      const storedLikes = JSON.parse(localStorage.getItem("photopedia_user_likes") || "{}");
      if (storedLikes[postId] !== undefined) {
        setIsLiked(!!storedLikes[postId]);
      } else {
        setIsLiked(!!initialIsLiked);
      }
    }
  }, [postId, initialLikes, initialIsLiked]);

  const toggleLike = async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("photopedia_token")) {
      router.push("/login");
      return;
    }

    const nextLiked = !isLiked;
    const nextCount = nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setIsLiked(nextLiked);
    setLikeCount(nextCount);
    setLoading(true);

    if (typeof window !== "undefined") {
      const storedLikes = JSON.parse(localStorage.getItem("photopedia_user_likes") || "{}");
      storedLikes[postId] = nextLiked;
      localStorage.setItem("photopedia_user_likes", JSON.stringify(storedLikes));
    }

    try {
      const res: any = await api.toggleLike(postId);
      if (typeof res?.liked === "boolean") {
        setIsLiked(res.liked);
        if (typeof window !== "undefined") {
          const storedLikes = JSON.parse(localStorage.getItem("photopedia_user_likes") || "{}");
          storedLikes[postId] = res.liked;
          localStorage.setItem("photopedia_user_likes", JSON.stringify(storedLikes));
        }
      }
      if (typeof res?.count === "number") {
        setLikeCount(res.count);
        if (res.count === 0) {
          setIsLiked(false);
        }
      }
    } catch (err: any) {
      console.warn("Like toggle error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLiked,
    likeCount,
    loading,
    toggleLike,
  };
}

export default useLike;
