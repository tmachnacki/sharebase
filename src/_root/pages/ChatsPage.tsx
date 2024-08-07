import { ChatUser } from "@/components/chat/ChatUser";
import { CreateNewMessage } from "@/components/chat/CreateNewMessage";
import Messages from "@/components/chat/Messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetOtherUsers } from "@/hooks/useGetOtherUsers";
import { cn, getInitials, toTimeAgo } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { Loader2, PenSquare, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  DocumentData,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";

export const ChatsPage = () => {
  const authUser = useAuthStore((state) => state.user);
  const { isLoadingUsers, getOtherUsers, users } = useGetOtherUsers();
  const { currentChatId, setCurrentChatId } = useChatStore();
  const [newMessageOpen, setNewMessageOpen] = useState(false);

  const q = authUser
    ? query(
        collection(firestore, "chats"),
        or(
          where("userOneUid", "==", authUser?.uid),
          where("userTwoUid", "==", authUser?.uid),
        ),
        orderBy("lastUpdatedAt", "desc"),
      )
    : null;

  const [chats, chatsLoading, chatsError] = useCollection(q);

  const noChatsFound = !chatsLoading && chats?.docs && chats.docs.length === 0;

  const location = useLocation();

  useEffect(() => {
    if (authUser) getOtherUsers(authUser.uid);
  }, [authUser]);

  // reset to null on route change
  useEffect(() => {
    setCurrentChatId(null);
  }, [location]);

  useEffect(() => {
    if (authUser && chatsError) {
      console.error(chatsError);
      toast.error("Error getting chats", { description: `${chatsError}` });
    }
  }, [chatsError, authUser]);

  const getCurrentChatData = () => {
    if (!currentChatId || !chats) return null;

    const chat = chats.docs.find((chatDoc) => chatDoc.id === currentChatId);
    return {
      ...chat?.data(),
      id: chat?.id,
    };
  };

  return (
    <div className=" flex w-full flex-row ">
      <section className="flex h-full w-24 flex-shrink-0 flex-grow-0 flex-col border-r-[1px] border-slate-200 dark:border-slate-800 lg:w-80 2xl:w-96">
        <header className="mb-8 flex items-center justify-between p-6">
          <ChatUser
            profilePicUrl={authUser?.profilePicUrl}
            fullName={authUser?.fullName}
            avatarClassName="h-10 w-10"
            className="hidden text-base lg:flex"
          />
          <TooltipProvider delayDuration={400}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => setNewMessageOpen(true)}
                  className="flex-shrink-0 "
                >
                  <PenSquare className="h-5 w-5 md:h-4 md:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New Message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </header>
        <h1 className="mb-2 px-6 text-base font-semibold">Chats</h1>

        <div className="w-full flex-grow overflow-hidden">
          {noChatsFound ? (
            <div className="flex w-full items-center justify-center text-slate-500">
              No chats started
            </div>
          ) : chatsLoading ? (
            <div className="flex w-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-full w-full">
              <ul className="flex w-24 flex-col items-start pb-14 md:pb-0 lg:w-80 2xl:w-96">
                {chats &&
                  chats.docs.map((chatDoc: DocumentData) => {
                    const chat = { ...chatDoc.data(), id: chatDoc.id };
                    return (
                      <li
                        className={cn(
                          "block  w-full cursor-pointer overflow-x-hidden  border-b-[1px] border-slate-100 px-6 py-3 last:border-b-0 hover:bg-slate-200 dark:border-slate-900 dark:hover:bg-slate-900",
                          chat.id === currentChatId &&
                            "bg-slate-100 dark:bg-slate-900/50",
                          chat.id !== currentChatId && "",
                        )}
                        onClick={() => setCurrentChatId(chat.id)}
                        key={chat.id}
                      >
                        {/* desktop */}
                        <ChatUser
                          fullName={
                            chat.userOneUid === authUser?.uid
                              ? chat.userTwoFullName
                              : chat.userOneFullName
                          }
                          username={
                            chat.userOneUid === authUser?.uid
                              ? chat.userTwoUsername
                              : chat.userOneUsername
                          }
                          profilePicUrl={
                            chat.userOneUid === authUser?.uid
                              ? chat.userTwoProfilePicUrl
                              : chat.userOneProfilePicUrl
                          }
                          lastMessageText={chat.lastMessageText}
                          className="hidden lg:flex"
                        >
                          <div className="ml-2 flex h-full flex-shrink-0 flex-grow-0 flex-col self-start pt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {toTimeAgo(chat.lastUpdatedAt)}
                          </div>
                        </ChatUser>

                        {/* mobile */}
                        <Avatar
                          className={cn("block h-12 w-12 text-sm lg:hidden")}
                        >
                          <AvatarImage
                            src={
                              chat.userOneUid === authUser?.uid
                                ? chat.userTwoProfilePicUrl
                                : chat.userOneProfilePicUrl
                            }
                            alt={`${
                              chat.userOneUid === authUser?.uid
                                ? chat.userTwoFullName
                                : chat.userOneFullName
                            } profile picture`}
                          ></AvatarImage>
                          <AvatarFallback className="aspect-square h-full w-full rounded-full text-inherit">
                            {getInitials(
                              chat.userOneUid === authUser?.uid
                                ? chat.userTwoFullName
                                : chat.userOneFullName,
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </li>
                    );
                  })}
              </ul>
              <ScrollBar />
            </ScrollArea>
          )}
        </div>
      </section>
      <section className="h-full w-full flex-shrink flex-grow ">
        {currentChatId ? (
          <Messages authUserId={authUser?.uid} chat={getCurrentChatData()} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full border-[1px] border-slate-200 dark:border-slate-800"
              aria-hidden="true"
            >
              <Send className="h-8 w-8 -translate-x-0.5 translate-y-0.5 text-slate-600 dark:text-slate-400" />
            </span>

            <p className="text-center text-slate-600 dark:text-slate-400">
              Select a chat or start a new one
            </p>

            <Button onClick={() => setNewMessageOpen(true)} variant={"default"}>
              New Message
            </Button>
          </div>
        )}
      </section>

      <CreateNewMessage
        open={newMessageOpen}
        setOpen={setNewMessageOpen}
        users={users}
        isLoadingUsers={isLoadingUsers}
      />
    </div>
  );
};
