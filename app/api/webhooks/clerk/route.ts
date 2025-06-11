
/** A webhook is an event-driven method of communication between applications.

Unlike typical APIs where you would need to poll for data very frequently to get it "real-time", webhooks only send data when there is an event to trigger the webhook. This makes webhooks seem "real-time", but it's important to note that they are asynchronous.

For example, if you are onboarding a new user, you can't rely on the webhook delivery as part of that flow. Typically the delivery will happen quickly, but it's not guaranteed to be delivered immediately or at all. Webhooks are best used for things like sending a notification or updating a database, but not for synchronous flows where you need to know the webhook was delivered before moving on to the next step. If you need a synchronous flow, see the onboarding guide for an example.*/

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import {db} from "@/lib/db";

// This route handles Clerk webhooks. It verifies the webhook signature and processes the event.

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error(
            "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
        );
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    const eventType = evt.type;

    if(eventType==="user.created"){

    //model User imported as user
      await db.user.create({
        data:{
            externalUserId:payload.data.id,
            username:payload.data.username,
            imageUrl:payload.data.image_url,
            stream:{
                create:{
                    name:`${payload.data.username}'s stream`
                }
            }
        }
      })
    }

    if(eventType==="user.updated"){
        const currentUser=await db.user.findUnique({
            where:{
                externalUserId:payload.data.id,
            }
        })

        if(!currentUser){
            return new Response("User not found",{status:400})
        }

        await db.user.update({
            where:{
                externalUserId:payload.data.id,
            },
            data:{
                username:payload.data.username,
                imageUrl:payload.data.image_url
            }
        })
    }

    if(eventType==='user.deleted'){
        await db.user.delete({
            where:{
                externalUserId:payload.data.id
            }
        })
    }


    return new Response('Webhook received', { status: 200 })

}
