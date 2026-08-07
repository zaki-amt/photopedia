"use client";

import React from "react";
import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import { UserNameLink } from "./UserNameLink";
import { FollowButton } from "./FollowButton";

interface UserListItemProps {
  user: {
    id?: string;
    name?: string;
    username?: string;
    avatar?: string;
    bio?: string;
  };
  isFollowing?: boolean;
  onFollowChange?: (targetUsername: string, isFollowing: boolean) => void;
  onClickUser?: () => void;
}

export function UserListItem({
  user,
  isFollowing = false,
  onFollowChange,
  onClickUser,
}: UserListItemProps) {
  const username = user.username || "user";
  const name = user.name || "Photopedia Creator";

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 transition-colors">
      <div className="flex items-center gap-3 min-w-0" onClick={onClickUser}>
        <Link href={`/creators/${username}`}>
          <UserAvatar src={user.avatar} alt={name} size="md" />
        </Link>
        <div className="min-w-0">
          <UserNameLink name={name} username={username} showHandle={true} />
          {user.bio && (
            <p className="text-[11px] text-zinc-400 font-sans truncate max-w-xs leading-tight">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      <FollowButton
        usernameOrId={username}
        initialFollowing={isFollowing}
        onFollowChange={(nextState) => {
          if (onFollowChange) onFollowChange(username, nextState);
        }}
        size="sm"
      />
    </div>
  );
}

export default UserListItem;
