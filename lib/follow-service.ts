import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export const getFollowedUsers = async () => {
  const self = await getSelf();
  if (!self) {
    return [];
  }

  const followedUsers = await db.follow.findMany({
    where: {
      followerId: self.id,
      following:{
        blocking:{
          none:{
            blockedId:self.id
          }
        }
      }
    },
    include: {
      following: true,
    }
  })

  return followedUsers;
}

export const isFollowingUser = async (id: string) => {
  try {
    const self = await getSelf();
    if (!self) return false;

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) throw new Error("User not found");

    if (otherUser.id === self.id) return true;

    /**   this would have worked too but we can use findUnique this would use the index on the unique constraint we made in the follow model instead of going through all the records
     * const existingFollow = await db.follow.findFirst({
       where: {
         followerId: self.id,
         followingId: otherUser.id,
       },
     });*/
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: self.id,
          followingId: otherUser.id,
        }
      }
    })
    return !!existingFollow;
  } catch {
    return false;
  }
};

export const followUser = async (id: string) => {
  const self = await getSelf();
  if (!self) {
    throw new Error("You must be logged in to follow users");
  }

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) throw new Error("User not found");

  if (otherUser.id === self.id) throw new Error("You can't follow yourself");

  const existingFollow = await db.follow.findFirst({
    where: {
      followerId: self.id,
      followingId: otherUser.id,
    },
  });

  if (existingFollow) throw new Error("You are already following this user");

  const follow = await db.follow.create({
    data: {
      followerId: self.id,
      followingId: otherUser.id,
    },
    include: {
      follower: true,
      following: true,
    },
  });

  return follow;
};

export const unfollowUser = async (id: string) => {
  try {
    const self = await getSelf();
    if (!self) {
      throw new Error("You must be logged in to unfollow users");
    }

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) {
      throw new Error("User not found!");
    }

    if (otherUser.id === self.id) {
      throw new Error("Cannot unfollow yourself");
    }

    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: self.id,
        followingId: otherUser.id,
      }
    })

    if (!existingFollow) {
      throw new Error("Not following");
    }

    const follow = await db.follow.delete({
      where: {
        id: existingFollow.id,
      },
      include: {
        following: true
      }
    })
    return follow;
  } catch (error) {
    throw new Error(`Error:${error}`)
  }
}