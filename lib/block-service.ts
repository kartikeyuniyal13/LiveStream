import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export const isBlockedByUser = async (id: string) => {
  try {
    const self = await getSelf();
    if (!self) return false;

    const otherUser = await db.user.findUnique({
      where: { id },
    });

    if (!otherUser) throw new Error("User not found");

    if (otherUser.id === self.id) return false;
    

    /**
     * this would have worked too but we can use findUnique this would use the index on the unique constraint(  @@unique([blockerId,blockedId])) we made in the Block model instead of going through all the records
     * 
     * const existingBlock=await db.block.findFirst({
     * where:{
     * blockerId:otherUser.id,
     * blockedId:self.id}})
     */
    const existingBlock = await db.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: otherUser.id,
          blockedId: self.id,
        },
      },
    });

    return !!existingBlock;
  } catch {
    return false;
  }
};

export const blockUser = async (id: string) => {
  const self = await getSelf();
  if (!self) {
    throw new Error("You must be logged in to block users");
  }

  if (self.id === id) throw new Error("Cannot block yourself");

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) throw new Error("User not found");

  const existingBlock = await db.block.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: self.id,
        blockedId: otherUser.id,
      },
    },
  });

  if (existingBlock) throw new Error("User is already blocked");

  const block = await db.block.create({
    data: {
      blockerId: self.id,
      blockedId: otherUser.id,
    },
    include: {
      blocked: true,
    },
  });

  return block;
};

export const unblockUser = async (id: string) => {
  const self = await getSelf();
  if (!self) {
    throw new Error("You must be logged in to unblock users");
  }

  if (self.id === id) throw new Error("Cannot unblock yourself");

  const otherUser = await db.user.findUnique({
    where: { id },
  });

  if (!otherUser) throw new Error("User not found");

  const existingBlock = await db.block.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: self.id,
        blockedId: otherUser.id,
      },
    },
  });

  if (!existingBlock) throw new Error("User is not blocked");

  const unblock = await db.block.delete({
    where: {
      id: existingBlock.id,
    },
    include: {
      blocked: true,
    },
  });

  return unblock;
};

export const getBlockedUsers = async () => {
  const self = await getSelf();
  if (!self) {
    return [];
  }

  const blockedUsers = await db.block.findMany({
    where: {
      blockerId: self.id,
    },
    include: {
      blocked: true,
    },
  });

  return blockedUsers;
};