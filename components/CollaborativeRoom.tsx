"use client";
import React from "react";
import Header from "./Header";
import { Editor } from "./editor/Editor";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import Loader from "./Loader";
import ActiveCollaboratorsList from "./ActiveCollaboratorsList";

const CollaborativeRoom = () => {
  const {id}=useParams();
  
  return (
    <RoomProvider id={id?.toString()}>
      <ClientSideSuspense fallback={<Loader/>}>
        <div className="collaborative-room">
          <Header>
            <div className=" flex w-fit items-center justify-center gap-2">
              <p>Share</p>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
            <ActiveCollaboratorsList/>
          </Header>
          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;