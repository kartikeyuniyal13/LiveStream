
/**This wrapper is a client component because it uses a hook to detect whether its collapased or not. The sidebar which is being passed to this as a children is a server component where we fetch the important info.Therefore its passed as children */

/**We use children-provider set-up because sometimes we have to import server component in the client component and so if we directly import the component and use it it will become a client component and therefore pass the component as the {children} 
 */
import { Toggle, ToggleSkeleton } from "./toggle"
import { Wrapper } from "./wrapper"
import {Recommended, RecommendedSkeleton} from "./recommended"
import { getRecommended } from "@/lib/recommended-service"
import { getFollowedUsers } from "@/lib/follow-service"
import { Following, FollowingSkeleton } from "./following"

export const Sidebar=async ()=>{

    const data= await getRecommended();
    const follows=await getFollowedUsers();
    return(
   <Wrapper>
    <Toggle/>
     <div className="space-y-4 pt-4 lg:pt-0">
      <Following data={follows}/>
      <Recommended data={data} />
     </div>
   </Wrapper>
    )
}

//this skeleton will load and would solve the issue where the useEffects checks for the screen size and its takes a bit and if the screen is small/mobile it make the sidebar go from expand to collapse with a flicker doesnt look good.So skeleton will be there untill it happens
export const SidebarSkeleton =()=>{
  return(
    <aside className="fixed left-0 flex flex-col w-[70px] lg:w-60 h-full bg-background border-r border-[#2D2E35] z-50">
      <ToggleSkeleton/>
      <FollowingSkeleton/>
     <RecommendedSkeleton/>
    </aside>
  )
}