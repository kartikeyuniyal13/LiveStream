/**
 * 
useTransition is a React hook introduced in React 18 that allows you to:

Tell React: “Hey, this part of the UI might take a moment to update. While it’s updating, don’t block the rest of the UI — keep it responsive.”

So instead of locking up the UI while you fetch data or call an API, React lets that update happen in the background, and gives you a flag (isPending) so you can show a loading state.
 
 */



"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { onFollow, onUnfollow } from "@/actions/follow";
import { onBlock, onUnblock } from "@/actions/block";

export function Actions({
  isFollowing,
  userId,
}: {
  isFollowing: boolean;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong, failed to follow"));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) =>
          toast.success(`You have unfollowed ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong, failed to follow"));
    });
  };

  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) =>
          !!data
            ? toast.success(`You have blocked ${data?.blocked.username}`)
            : toast.success("Blocked guest")
        )
        .catch(() => toast.error("Something went wrong, failed to block"));
    });
  };

  const handleUnblock = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((data) =>
          toast.success(`You have unblocked ${data.blocked.username}`)
        )
        .catch(() => toast.error("Something went wrong, failed to unblock"));
    });
  };

  const onClick = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <>
      <Button variant="primary" disabled={isPending} onClick={onClick}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Button onClick={handleBlock} disabled={isPending}>
        Block
      </Button>
      <Button onClick={handleUnblock} disabled={isPending}>
        UnBlock
      </Button>
    </>
  );
}