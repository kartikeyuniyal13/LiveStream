import React from "react";
import Link from "next/link";
import {LayoutDashboard  } from "lucide-react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

import { Button } from "@/components/ui/button";

export async function Actions() {
  const user = await currentUser();

  return (
    <div className="flex items-center justify-end gap-x-2 ml-4 lg:ml-0">
      {!user && (
        <SignInButton>
          <Button variant="primary">Login</Button>
        </SignInButton>
      )}
      {!!user && (
        <div className="flex items-center gap-x-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-primary"
            asChild
          >
            <Link href={`/u/${user.username}`}>
              <LayoutDashboard className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </Button>
          {/**the afterSignOutUrl is deprecated in the userbutton and is shifted to the clerk Provider in layout */}
          <UserButton

/>
        </div>
      )}
    </div>
  );
}