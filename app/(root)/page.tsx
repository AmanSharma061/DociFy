import AddComponentBtn from "@/components/AddComponentBtn";
import { DeleteModal } from "@/components/DeteletModal";
import Header from "@/components/Header";
import Notifications from "@/components/Notifications";
import { getDocuments } from "@/lib/actions/room.actions";
import { dateConverter } from "@/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import Provider from "../Provider";
const documents = [];
const Home = async () => {
  const user = await currentUser();
  const { data: rooms } = await getDocuments({
    email: user?.emailAddresses[0]?.emailAddress
  });
  if (!user) redirect("/sign-in");

  return (
    // <Provider>

    <main className="home-container">
      <Header className="sticky top-0 left-0">
        <div className="flex items-center gap-2 lg:gap-4">
          <Notifications/>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>
      {rooms?.length > 0 ? (
        <div className="document-list-container">
          <div className="document-list-title">
            <h3 className="text-28-semibold">All documents</h3>
            <AddComponentBtn
              userId={user?.id}
              email={user?.emailAddresses[0]?.emailAddress}
            />
          </div>
          <ul className="document-ul">
            {rooms?.map((room: any, index: number) => (
              <li key={index} className="document-list-item">
                <Link
                  href={`/documents/${room?.id}`}
                  className="flex flex-1 items-center gap-4"
                >
                  <div className="hidden rounded-md bg-drak-500 p-2 sm:block">
                    <Image
                      src={"/assets/icons/doc.svg"}
                      alt="file"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-lg">
                      {room?.metadata?.title}
                    </p>
                    <p className="text-sm font-light text-blue-100">
                      Created about {dateConverter(room?.createdAt)}
                    </p>
                  </div>
                </Link>
                <DeleteModal roomId={room?.id} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            height={40}
            width={40}
            alt="Document"
            src={"/assets/icons/doc.svg"}
          />
          <AddComponentBtn
            userId={user?.id}
            email={user?.emailAddresses[0]?.emailAddress}
          />
        </div>
      )}
    </main>
    // </Provider>
  );
};

export default Home;
