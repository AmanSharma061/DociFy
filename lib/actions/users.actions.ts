'use server'
import { parseStringify } from "@/utils";
import { liveblocks } from "@/utils/liveblocks";
import { clerkClient } from "@clerk/nextjs/server";

export const getClerkUsers = async ({ userIds }:{userIds:  string[]}) => {
    try {
        const { data } = await clerkClient.users.getUserList({
            emailAddress: userIds
        });

        const users = data?.map((user) => ({
            id: user?.id,
            name: `${user?.firstName} ${user?.lastName}`,
            avatar: user?.imageUrl, 
            email: user?.emailAddresses[0]?.emailAddress
        }))
        const sortedUsers = userIds?.map((email) => users.find((user) => user.email == email))

        return parseStringify(sortedUsers)

    } catch (error) {
        console.log(`Error finding users from clerk`, error)
    }


}

export const getUsersList=async({text,roomId}:{text:string,roomId:string})=>{
    try {
        const room=await liveblocks.getRoom(roomId);

        const roomUsers= Object.keys(room?.usersAccesses);

        if(text.length>0){
            let users=roomUsers.filter((email)=>email.toLowerCase()?.includes(text?.toLowerCase()));
            return users
        }

        return parseStringify(roomUsers);
    } catch (error) {
        
    }

}