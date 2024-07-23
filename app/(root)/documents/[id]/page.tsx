'use server'
import CollaborativeRoom from "@/components/CollaborativeRoom";
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/users.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Document = async ({params:{id}}:SearchParamProps) => {
 const clerkUser = await  currentUser();
//  const {id}=useParams()
  if(!clerkUser) redirect('/sign-in');

    const room = await getDocument({
      roomId: id,
      userId: clerkUser?.emailAddresses[0].emailAddress,
    });

    const userIds=Object.keys(room.usersAccesses)
    const clerkUsers= await getClerkUsers({userIds})

const userData=clerkUsers.map((user:User)=>({
  ...user,
  userType:room.userAccesses?.[user?.email]?.includes('room:write')?"editor":"viewer"
}))
const userEmail=(clerkUser.emailAddresses[0].emailAddress)

const currentUserType=room?.usersAccesses[userEmail]?.includes("room:write")?"editor":"viewer"
// const currentUserType=room.userAccesses[clerkUser?.emailAddresses[0].emailAddress]?.includes('room:write')?"editor":"viewer"
  return (
 
      <main className="flex w-full flex-col items-center">
      <CollaborativeRoom 
      roomId={id}
      users={userData}
      currentUserType={currentUserType}
      roomMetadata={room?.metadata}
       
      >
      </CollaborativeRoom>
        {/* <Editor /> */}
      </main>
  
  );
};

export default Document;