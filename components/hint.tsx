import React from "react";


/*** Tooltip is used to wrap the button inside a tooltip so that on hover the button shows some description or hint about its action */
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Hint({
  children,
  label,
  side,
  align,
  asChild,
}: {
  label: string;
  children: React.ReactNode;
  asChild?: boolean;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent
          className="text-black bg-white"
          side={side}
          align={align}
        >
          <p className="font-semibold">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}