"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Fullscreen, KeyRound, MessagesSquare, Users } from "lucide-react";

import { NavItem, NavItemSkeleton } from "./nav-item";

export function Navigation() {
  const pathname = usePathname();

  //takes little time to get the info from clerk so added a loading state
  const { user } = useUser();

  const routes = [
    {
      label: "Stream",
      href: `/u/${user?.username}`,
      icon: Fullscreen,
    },
    {
      label: "Keys",
      href: `/u/${user?.username}/keys`,
      icon: KeyRound,
    },
    {
      label: "Chat",
      href: `/u/${user?.username}/chat`,
      icon: MessagesSquare,
    },
    {
      label: "Community",
      href: `/u/${user?.username}/community`,
      icon: Users,
    },
  ];
  

  //untill we got the username from clerk load the skeleton
  if (!user?.username) {
    return (
      <ul className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <NavItemSkeleton key={i} />
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2 px-2 pt-4 lg:pt-0">
      {routes.map((route) => (
        <NavItem
          key={route.href}
          {...route}
          isActive={pathname === route.href}
        />
      ))}
    </ul>
  );
}