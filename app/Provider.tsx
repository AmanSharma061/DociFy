import { getClerkUsers } from "@/lib/actions/users.actions";
import {
  LiveblocksProvider,

} from "@liveblocks/react/suspense";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth"
    resolveUsers={async ({userIds})=>{
       const users=await getClerkUsers({userIds});
       return users;
    }}
    >
      {children}
    </LiveblocksProvider>
  ); 
};

export default Provider;
