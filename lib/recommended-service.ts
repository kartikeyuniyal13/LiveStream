import { db } from "./db";
import { getSelf } from "./auth-service";
import { User } from "@prisma/client";

export const getRecommended = async (): Promise<User[]> => {
    const self = await getSelf();
    let users: User[] = [];

    if (self) {
        // Fetch recommended users excluding the current user
        users = await db.user.findMany({
            where: {
                AND: [
                    {
                        NOT: {
                            id: self.id,
                        },
                    },
                    {
                        // NOT: { followedBy: { some: { followerId: userId } } } means:
                        // Exclude users who have at least one follower with the followerId equal to userId.
                        /**followedBy is a relation, not a scalar field. You cannot directly compare it to userId because it represents a collection of related records (e.g., an array of Follow records).
                        Prisma requires you to specify how the condition applies to the related records using keywords like some, every, or none.*/
                        NOT: {
                            followedBy: {
                                some: {
                                    followerId: self.id
                                }
                            }
                        }
                    },
                    {
                        NOT: {
                            blocking: {
                                some: {
                                    blockedId: self.id
                                }
                            }
                        }
                    },
                    {
                        NOT: {
                            blockedBy: {
                                some: {
                                    blockerId: self.id
                                }
                            }
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    } else {
        // Fetch all users if no user is logged in
        users = await db.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 50, // Limit the number of users fetched
        });
    }

    return users;
};