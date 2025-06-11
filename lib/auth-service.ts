import { db } from "./db";
import { currentUser } from "@clerk/nextjs/server";

export const getSelf = async () => {
    // Getting the selfUser from Clerk
    const selfUserData = await currentUser();
    if (!selfUserData) {
        return null;
    }

    // Fetching the data of selfUser from our database
    const user = await db.user.findUnique({
        where: {
            externalUserId: selfUserData.id,
        },
    });

    if (!user) {
        return null;
    }

    return user;
};

export const getSelfByUsername = async (username: string) => {
    const self = await currentUser();
  
    if (!self || !self.username) {
      throw new Error("Unauthorized");
    }
  
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    if (self.username !== username) {
      throw new Error("Unauthorized");
    }
  
    return user;
  };