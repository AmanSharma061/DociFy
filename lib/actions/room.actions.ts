'use server'
import { liveblocks } from "@/utils/liveblocks";
import { nanoid } from 'nanoid'

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const room_id = nanoid(10)
    try {
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled"
        }
        const usersAccesses: RoomAccesses = { [`${email}`]: ['room:write']}
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