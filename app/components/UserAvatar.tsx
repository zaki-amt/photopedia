"use client";

import React from "react";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function UserAvatar({
  src,
  alt = "User Avatar",
  className = "",
  size = "md",
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-20 h-20 sm:w-24 sm:h-24",
  };

  const avatarSrc = src || "/avatar.jpg";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarSrc}
      alt={alt}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/avatar.jpg";
      }}
      className={`${sizeClasses[size]} rounded-full object-cover border border-zinc-800 shrink-0 ${className}`}
    />
  );
}

export default UserAvatar;
