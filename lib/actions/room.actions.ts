'use server'
import { connectDB } from "@/app/database/connection";
import Room from "@/app/database/models/room.model";
import User from "@/app/database/models/user.model";
import { getAccessType, parseStringify } from "@/utils";
import { liveblocks } from "@/utils/liveblocks";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { AwardIcon } from "lucide-react";
import { nanoid } from 'nanoid'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
  const room_id = nanoid(10)
  const user = await currentUser()
  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled"
    }
    const usersAccesses: RoomAccesses = { [`${email}`]: ['room:write'] }
    const room = await liveblocks.createRoom(room_id, {
      metadata,
      defaultAccesses: [],
      usersAccesses,
    }
    )

    if (room) {
      await connectDB()
      const newRoom = {
        roomId: room_id,
        title: room?.metadata?.title,
        creatorId: room?.metadata?.creatorId,
        userId: user?.publicMetadata?.userId,
        userAccess: [{
          accessType: "creator",
          email: email,
        }]
      }
      const createdRoom = await Room.create(newRoom);

    }

    return parseStringify(room);
  } catch (error) {
    console.log(`Error while creating room`, error)
  }

}
export const updateDocument = async ({ roomId, title }: { roomId: string, title: string }) => {

  try {
    const metadata = {
      title
    }

    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata,

    }
    )
    const dbUpdatedRoom = await Room.updateOne({
      roomId: roomId
    }, {
      $set: { title }
    })
    revalidatePath(`documents/${roomId}`)
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error while creating room`, error)
  }

}



export const getDocument = async ({ roomId, userId }: { roomId: string, userId: string | undefined }) => {
  try {
    const room = await liveblocks.getRoom(roomId);



    return parseStringify(room)
  } catch (error) {
    console.log(`Error getting document details`, error)

  }
}

export const getDocuments = async ({ email }: { email: string | undefined }) => {
  const rooms = await liveblocks.getRooms({ userId: email });
  return parseStringify(rooms)
}

export const removeCollaborator = async ({ roomId, email, userId }: { roomId: string, email: string, userId: string }) => {
  try {
    const room = await liveblocks.getRoom(roomId)

    if (room.metadata.email === email) {
      throw new Error('You cannot remove yourself from the document');
    }
    await liveblocks.deleteAllInboxNotifications({ userId })
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null
      }
    })

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error happened while removing a collaborator: ${error}`);
  }
}

export const deleteDocument = async (roomId: string) => {
  try {
    await connectDB()
    await liveblocks.deleteRoom(roomId);
    const existingRoom = await Room.findOne({ roomId: roomId });
    if (existingRoom) await Room.deleteOne({ roomId: roomId })
    revalidatePath('/');
    redirect('/');
    return NextResponse.json({ error: false, status: 200 })
  } catch (error) {
    console.log(`Error happened while deleting a room: ${error}`);
  }
}

export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
  try {
    const clerkUser = await currentUser()

    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    }

    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses
    })

    if (room) {
      const notificationId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: '$documentAccess',
        subjectId: notificationId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
          updatedBy: updatedBy.name,
          avatar: updatedBy.avatar,
          email: updatedBy.email
        },
        roomId
      })

      await connectDB();
      const dbRoom = await Room.findOne({ roomId });

      if (dbRoom) {
        let accessess: any = [...(dbRoom.userAccess)];
        let emailExists = false;

        accessess.forEach((em: any) => {
          if (em?.email === email) {
            em.accessType = userType;
            emailExists = true;
          }
        });

        // If email does not exist, add a new entry
        if (!emailExists) {
          accessess.push({
            email: email,
            accessType: userType
          });
        }

        dbRoom.userAccess = accessess;

        await dbRoom.save();

      }
    }

    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while updating a room access: ${error}`);
  }
}
