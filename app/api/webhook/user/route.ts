
import { connectDB } from '@/app/database/connection';
import User from '@/app/database/models/user.model';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
type Payload = {
    data: any;
    type: string;
};

export async function POST(request: Request) {
    const payload: WebhookEvent = await request.json()
    const { data: clerkData, type }: Payload = payload;
    if (clerkData) {

        const user = {
            clerkUserId: clerkData?.id,
            name: `${clerkData?.first_name} ${clerkData?.last_name}`,
            imageUrl: clerkData?.image_url,
            email: clerkData?.email_addresses?.[0]?.email_address,

        }
        if (type == "user.created") {
            await connectDB();
            const userExists = await User.findOne({ email: user?.email });

            if (!userExists) {
                const createdUser = await User.create(user)
console.log(createdUser)
                if (createdUser) {
                    await clerkClient.users.updateUserMetadata(clerkData?.id, {
                        publicMetadata: {
                            userId: createdUser?._id
                        }
                    })
                }
                return NextResponse.json({ message: 'OK', user: createdUser })
            }
        } else if (type === "user.deleted") {
            await connectDB();
            // const userExists = await User.({ clerkUserId: clerkData?.id });

        }
    }
    return NextResponse.json("", { status: 200 })
}