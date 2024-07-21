
'use client'
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { createDocument } from "@/lib/actions/room.actions";
import { useRouter } from "next/navigation";

const AddComponentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const router = useRouter();
  const addbuttonHandler = async () => {
    console.log("enjenj")
    try {
      const room = await createDocument({ userId, email });
      console.log(room)
      if (room) {
        router.push(`/documents/${room?.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button className="gradient-blue gap flex shadow-md" type="submit" onClick={addbuttonHandler}>
      <Image width={24} height={40} alt="add" src={"/assets/icons/add.svg"} />
      <p className="hidden sm:block "> Start a blank document</p>
    </Button>
  );
};

export default AddComponentBtn;
