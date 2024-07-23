'use server'
import { getAccessType, parseStringify } from "@/utils";
import { liveblocks } from "@/utils/liveblocks";
import { nanoid } from 'nanoid'
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const room_id = nanoid(10)
    try {
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled"
        }
        const usersAccesses: RoomAccesses = { [`${email}`]: ['room:write'] }
        const room = await liveblocks.createRoom(room_id, {
            metadata,
            defaultAccesses: ['room:write'],
            usersAccesses,
        }
        )
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

export const removeCollaborator = async ({ roomId, email }: {roomId: string, email: string}) => {
    try {
      const room = await liveblocks.getRoom(roomId)
  
      if(room.metadata.email === email) {
        throw new Error('You cannot remove yourself from the document');
      }
  
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
      await liveblocks.deleteRoom(roomId);
      revalidatePath('/');
      redirect('/');
    } catch (error) {
      console.log(`Error happened while deleting a room: ${error}`);
    }
  }

  export const updateDocumentAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    try {
      const usersAccesses: RoomAccesses = {
        [email]: getAccessType(userType) as AccessType,
      }
  
      const room = await liveblocks.updateRoom(roomId, { 
        usersAccesses
      })
  
      if(room) {
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
      }
  
      revalidatePath(`/documents/${roomId}`);
      return parseStringify(room);
    } catch (error) {
      console.log(`Error happened while updating a room access: ${error}`);
    }
  }
  