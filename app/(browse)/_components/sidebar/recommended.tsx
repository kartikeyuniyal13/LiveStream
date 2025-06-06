'use client'

import { User } from "@prisma/client";

import { useSidebar } from "@/store/use-sidebar";
import { UserItem, UserItemSkeleton } from "./user-item";

interface RecommendedProps {
    data: User[]
}

export const Recommended = ({ data }: RecommendedProps) => {
    const { collapsed } = useSidebar((state) => state);

    const showLabel = !collapsed && data.length > 0;

    console.log(data,showLabel,collapsed)


    return (
        <div>
            {showLabel && (
                <div className="pl-6 mb-4">
                    <p className="text-xs text-muted-foreground">Recommended</p>
                </div>
            )}
            <ul className="space-y-2 px-2">
                {data.map((user) => (
                    <UserItem
                        key={user.id}
                        imageUrl={user.imageUrl}
                        username={user.username}
                        isLive={false}

                    />
                ))}
            </ul>
        </div>
    )
}

export const RecommendedSkeleton=()=>{
    return(
        <ul className="px-2">
            {
                [...Array(3)].map((_,i)=>(
                    <UserItemSkeleton key={i}/>
                ))
            }

        </ul>
    )
}