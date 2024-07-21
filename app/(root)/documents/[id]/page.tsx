"use client";
import Provider from "@/app/Provider";
import CollaborativeRoom from "@/components/CollaborativeRoom";
import { Editor } from "@/components/editor/Editor";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";

const Document = () => {
  return (
    <Provider>
      <main className="flex w-full flex-col items-center">
      <CollaborativeRoom>
      </CollaborativeRoom>
        {/* <Editor /> */}
      </main>
    </Provider>
  );
};

export default Document;
