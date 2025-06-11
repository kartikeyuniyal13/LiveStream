"use client";

import React from "react";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

import { useSidebar } from "@/store/use-sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Hint } from "@/components/hint";

export function Toggle() {
  const { collapsed, onExpand, onCollapse } = useSidebar((state) => state);

  const label = collapsed ? "Expand" : "Collapse";

  return (
    <>
      {collapsed && (
        <div className="hidden lg:flex w-full items-center justify-center pt-4 mb-4">
          {/**this below line hint wraps the button inside tooltip so that on hover the button show expand */}

          <Hint label={label} side="right" asChild>
            <Button variant="ghost" onClick={onExpand} className="h-auto p-2">
              <ArrowRightFromLine className="w-4 h-4" />
            </Button>
          </Hint>
        </div>
      )}
      {!collapsed && (
        <div className="p-3 pl-6 mb-2 flex items-center w-full">
          <p className="font-semibold text-primary">For you</p>
          <Hint label={label} side="right" asChild>
            <Button
              className="h-auto ml-auto p-2"
              variant="ghost"
              onClick={onCollapse}
            >
              <ArrowLeftFromLine className="w-4 h-4" />
            </Button>
          </Hint>
        </div>
      )}
    </>
  );
}

export function ToggleSkeleton() {
  return (
    <div className="p-3 pl-6 mb-2 hidden lg:flex items-center justify-between w-full">
      <Skeleton className="h-6 w-[100px]" />
      <Skeleton className="h-6 w-6" />
    </div>
  );
}


{/**  So, What Does asChild Actually Do?
	•	Tells TooltipTrigger (inside your Hint component) to use your child element directly (like a button), not wrap it in anything.
	•	It’s critical for:
	•	Avoiding layout issues
	•	Preventing unexpected DOM nesting
	•	Maintaining cleaner, semantic HTML
	•	You’re passing a custom component like <Button> or <Link>
	•	You want to avoid DOM nesting or CSS issues.You need tooltip on complex layout elements*/}
