"use server"

import { db } from "@/lib/db";

import { Stream } from "@prisma/client";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

export const updateStream = async (values: Partial<Stream>) => {
    try {
        const self = await getSelf();
        if (!self) return false;

        const selfStream = await db.stream.findUnique({
            where: {
                userId: self.id,
            }
        })

        if (!selfStream) {
            throw new Error("Stream not found!")
        }

        const validData={
            name:values.name,
            isChatEnabled:values.isChatEnabled,
            isChatDelayed:values.isChatDelayed,
            isChatFollowersOnly:values.isChatFollowersOnly
        }

        const streamData=await db.stream.update({
            where:{
                id:selfStream.id
            },
            data:{
                ...validData
            }
        })

        revalidatePath(`/u/${self.username}/chat`)
        revalidatePath(`/u/${self.username}`)
        revalidatePath(`/${self.username}`)

        return streamData;

    } catch (error) {
        throw new Error(`Error:${error}`)
    }
}