import AddComponentBtn from "@/components/AddComponentBtn";
import Header from "@/components/Header";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
const documents = [];
const Home = async() => {

  const user=await currentUser()
  if(!user) redirect('/sign-in')
  return (
    <main className="home-container">
      <Header className="sticky top-0 left-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {documents?.length > 0 ? (
        <div></div>
      ) : (
        <div className="document-list-empty">
          <Image
            height={40}
            width={40}
            alt="Document"
            src={"/assets/icons/doc.svg"}
          />
          <AddComponentBtn userId={user?.id} email={user?.emailAddresses[0]?.emailAddress}/>
        </div>
      )}


    </main>
  );
};

export default Home;
