'use server'
import { parseStringify } from "@/utils";
import { liveblocks } from "@/utils/liveblocks";
import { nanoid } from 'nanoid'
import { revalidatePath } from "next/cache";

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
        return room;
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