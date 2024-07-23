"use client";
import Provider from "@/app/Provider";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import ActiveCollaboratorsList from "./ActiveCollaboratorsList";
import Header from "./Header";
import Loader from "./Loader";
import { Editor } from "./editor/Editor";
import { useEffect, useRef, useState } from "react";
import { Pen, PencilIcon, PenIcon, PenSquare, Trash } from "lucide-react";
import { Input } from "./ui/input";
import { updateDocument } from "@/lib/actions/room.actions";
import ShareModal from "./ShareModal";
const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  users,
  currentUserType
}: CollaborativeRoomProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [documentTitle, setDocumentTitle] = useState<string>(
    roomMetadata?.title
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      try {
        if (documentTitle !== roomMetadata?.title) {
          const updatedDocument = await updateDocument({
            roomId,
            title: documentTitle
          });
          if (updatedDocument) {
            setEditing(false);
          }
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    const handleClickOutside = async (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        const updatedDocument = await updateDocument({
          roomId,
          title: documentTitle
        });
        if (updatedDocument) {
          setEditing(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [documentTitle, roomId]);

  useEffect(() => {
    if (inputRef.current && editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  return (
    // <Provider>
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className=" flex w-fit items-center justify-center gap-2"
            >
              {editing ? (
                <>
                  <Input
                    ref={inputRef}
                    type="text"
                    value={documentTitle}
                    onKeyDown={updateTitleHandler}
                    onChange={(e) => {
                      setDocumentTitle(e.target.value);
                    }}
                    className="document-title-input"
                  />
                </>
              ) : (
                <>
                  {" "}
                  <p className="document-title">{documentTitle}</p>
                </>
              )}

              {!editing && currentUserType === "editor" && (
                <span
                  className="cursor-pointer"
                  onClick={() => setEditing(true)}
                >
                  <PenSquare />
                </span>
              )}
            </div>

            <div className="w-full flex-1 flex  justify-end h-full gap-x-2  items-center">
              <ActiveCollaboratorsList />
              <ShareModal 
              roomId={roomId}
              collaborators={users}
              creatorId={roomMetadata?.creatorId}
              currentUserType={currentUserType}
              />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
    // </Provider>
  );
};

export default CollaborativeRoom;
