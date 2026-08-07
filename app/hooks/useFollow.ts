"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";

export function useFollow(initialFollowing: boolean = false, targetUsernameOrId: string = "") {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState<boolean>(initialFollowing);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const toggleFollow = async (targetOverride?: string) => {
    const target = targetOverride || targetUsernameOrId;
    if (!target) return;

    if (typeof window !== "undefined" && !localStorage.getItem("photopedia_token")) {
      router.push("/login");
      return;
    }

    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setLoading(true);

    try {
      const res = await api.toggleFollow(target);
      if (typeof res?.following === "boolean") {
        setIsFollowing(res.following);
      }
    } catch (err: any) {
      console.warn("Follow toggle notice:", err.message);
      setIsFollowing(!nextState);
    } finally {
      setLoading(false);
    }
  };

  return {
    isFollowing,
    setIsFollowing,
    loading,
    toggleFollow,
  };
}

export default useFollow;
