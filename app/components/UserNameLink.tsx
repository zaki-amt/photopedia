"use client";

import React from "react";
import Link from "next/link";

interface UserNameLinkProps {
  name?: string;
  username?: string;
  className?: string;
  showHandle?: boolean;
}

export function UserNameLink({
  name = "Photopedia Creator",
  username = "creator",
  className = "",
  showHandle = true,
}: UserNameLinkProps) {
  const cleanUsername = username ? username.replace(/^@/, "") : "creator";

  return (
    <Link
      href={`/creators/${cleanUsername}`}
      className={`group/user inline-block min-w-0 ${className}`}
    >
      <span className="font-heading text-xs font-semibold text-white group-hover/user:underline block truncate">
        {name}
      </span>
      {showHandle && (
        <span className="text-[10px] font-mono text-zinc-500 block truncate">
          @{cleanUsername}
        </span>
      )}
    </Link>
  );
}

export default UserNameLink;
