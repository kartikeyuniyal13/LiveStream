"use client"
/**This wrapper is a client component because it uses a hook to detect whether its collapased or not. The sidebar which is being passed to this as a children is a server component where we fetch the important info.Therefore its passed as children */

import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
/**We use children-provider set-up because sometimes we have to import server component in the client component and so if we directly import the component and use it it will become a client component and therefore pass the component as the {children} 
 */
interface WrapperProps{
    children:React.ReactNode;
}

export const Wrapper=({children}:WrapperProps)=>{
    const {collapsed}=useSidebar((state)=>state)
    return(
        <aside className={cn(
            "fixed left-0 flex flex-col w-60 h-full bg-background border-r border-[#2D2E35] z-50",
            collapsed && "w-[70px]"
          )}>
            {children}
        </aside>
    )
}