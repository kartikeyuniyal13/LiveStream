import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { cva,VariantProps } from "class-variance-authority";
import { LiveBadge } from "./live-badge";
import { Skeleton } from "./ui/skeleton";

const avatarSizes= cva(
    "",
    {
        variants:{
            size:{
                default:"h-8 w-8",
                lg:"h-14 w-14"
            },
        },

        defaultVariants:{
            size:"default"
        }
    }
)


interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
    username :string
    imageUrl:string
    isLive?:boolean
    showBadge?:boolean

}


export const UserAvatar = ({
    username,
    isLive,
    imageUrl,
    size,showBadge
}:UserAvatarProps) => {
  
    const canShowBadge=showBadge && isLive
    return (
        <div className="relative">
          <Avatar
            className={cn(
              isLive && "ring-2 ring-rose-500 border border-background",
              avatarSizes({ size })
            )}
          >
            <AvatarImage src={imageUrl} className="object-cover" />

            {/**if the url isn't working then we would have the first alphabet and last alphabet of username as his avatar */}
            <AvatarFallback>
              {username[0]}
              {username[username.length - 1]}
            </AvatarFallback>
          </Avatar>
          {canShowBadge && (
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <LiveBadge />
            </div>
          )}
        </div>
      );
}

type UserAvatarSkeletonProps = VariantProps<typeof avatarSizes>;

export const UserAvatarSkeleton=({size}:UserAvatarSkeletonProps)=>{
    return(
        <Skeleton className={
            cn("rounded-full",avatarSizes({size}))
        }/>
    )
}

