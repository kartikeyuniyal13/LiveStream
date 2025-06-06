import { db } from "./db";
import { currentUser } from "@clerk/nextjs/server";

export const getSelf=async ()=>{

    //getting the selfUser from clerk
    const selfUserData=await currentUser();
    if(!selfUserData){
        throw new Error("Unauthorised");
    }
    
    //fetching the data of selfUser from out db
    const user=await db.user.findUnique({
        where:{
            externalUserId:selfUserData.id
        }
    })

    if(!user){
        throw new Error('User not found!');
    }

    return user;
}