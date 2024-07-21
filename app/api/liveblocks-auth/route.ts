import { getUserColor } from "@/utils";
import { liveblocks } from "@/utils/liveblocks";
import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";



export async function POST(request: Request) {
    // Get the current user from your database
    const clerkUser = await currentUser()
    if (!clerkUser) {
        redirect('/sign-in')
    }
    const { firstName, lastName, id, imageUrl, emailAddresses } = clerkUser
    const user = {
        id: clerkUser?.id,
        info: {
            name: `${firstName + " " + lastName}`,
            avatar: imageUrl,
            id,
            email: emailAddresses[0]?.emailAddress,
            color: getUserColor(id)

        }
    }

    //   // Identify the user and return the result
    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.id,
            groupIds: [], // Optional
        },
        { userInfo: user.info },
    );
    
    return new Response(body, { status });
}