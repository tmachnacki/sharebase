import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
// import useSearchUser from "@/hooks/useSearchUser";
import { ChatUser } from "./ChatUser";
import { ButtonLoader } from "../shared/button-loader";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { useChatStore } from "@/store/chatStore";
import { useGetChatByUserIds } from "@/hooks/useGetChatByUserIds";
import { useAuthStore } from "@/store/authStore";
import { MessageDocument, UserDocument } from "@/types";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useDebounce } from "@/hooks/useDebounce";

import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useGetOtherUsers } from "@/hooks/useGetOtherUsers";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";

type NewMessageProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  users: Array<UserDocument | DocumentData>;
  isLoadingUsers: boolean;
};

export const CreateNewMessage = ({
  open,
  setOpen,
  users,
  isLoadingUsers,
}: NewMessageProps) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  // const { isLoadingUsers, getUserProfile, users, setUsers } = useSearchUser();
  // const { isLoadingUsers, getOtherUsers, users, setUsers } = useGetOtherUsers();
  const [isCreatingNewMessage, setIsCreatingNewMessage] = useState(false);
  const { currentChatId, setCurrentChatId } = useChatStore();
  const { getChatByUserIds } = useGetChatByUserIds();
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const authUser = useAuthStore((state) => state.user);

  const [recipientUser, setRecipientUser] = useState<{
    uid: string;
    username: string;
    fullName: string;
    profilePicUrl: string;
  } | null>(null);

  const handleSelectUser = (value: string) => {
    const selectedUser = users.find((user) => user.fullName === value);
    setRecipientUser({
      uid: selectedUser?.uid,
      username: selectedUser?.username,
      fullName: selectedUser?.fullName,
      profilePicUrl: selectedUser?.profilePicUrl,
    });
  };

  const handleCreateNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingNewMessage(true);

    if (!authUser)
      return toast.error("You must be logged in to create a message");

    // check user selecetd and message not empty
    if (!recipientUser || !message) {
      return toast.error("You must select a recipient and enter a message");
    }

    // if chat already exists, udpate
    // check for chat with current user and recipient
    setIsLoadingChat(true);
    const chatData = await getChatByUserIds(authUser?.uid, recipientUser.uid);
    setIsLoadingChat(false);

    const timeStamp = new Date(Date.now());

    if (chatData.status === "success" && chatData.chat) {
      // add message to chat and update current chat
      try {
        const newMessageDocRef = await addDoc(
          collection(firestore, "messages"),
          {
            text: message,
            createdAt: timeStamp,
            createdBy: authUser?.uid,
            chatId: chatData.chat.id,
          },
        );

        await updateDoc(doc(firestore, "chats", chatData.chat.id), {
          lastMessageText: message,
          lastUpdatedAt: timeStamp,
        });

        setCurrentChatId(chatData.chat.id);
        setOpen(false);
        setIsCreatingNewMessage(false);
        setMessage("");
        setRecipientUser(null);
      } catch (error) {
        toast.error("Error sending message", { description: `${error}` });
        setIsCreatingNewMessage(false);
      }
    }
    // create new chat
    else if (chatData.status === "success" && !chatData.chat) {
      try {
        const newChatDocRef = await addDoc(collection(firestore, "chats"), {
          userOneUid: authUser?.uid,
          userOneUsername: authUser?.username,
          userOneFullName: authUser?.fullName,
          userOneProfilePicUrl: authUser?.profilePicUrl,
          userTwoUid: recipientUser.uid,
          userTwoUsername: recipientUser.username,
          userTwoFullName: recipientUser.fullName,
          userTwoProfilePicUrl: recipientUser.profilePicUrl,
          createdAt: timeStamp,
          lastUpdatedAt: timeStamp,
          lastMessageText: message,
        });

        const newMessageDocRef = await addDoc(
          collection(firestore, "messages"),
          {
            text: message,
            createdAt: timeStamp,
            createdBy: authUser?.uid,
            chatId: newChatDocRef.id,
          },
        );

        setCurrentChatId(newChatDocRef.id);
        setOpen(false);
        setIsCreatingNewMessage(false);
        setMessage("");
        setRecipientUser(null);
      } catch (error) {
        toast.error("Error sending message", { description: `${error}` });
        setIsCreatingNewMessage(false);
      }
    } else {
      console.error("Chat data resulted in status: error");
      toast.error("Chat data resulted in status: error");
      setIsCreatingNewMessage(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>New Message</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleCreateNewMessage} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-semibold">To:</p>
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-fit min-w-36 ">
                  {recipientUser ? (
                    <ChatUser
                      fullName={recipientUser?.fullName}
                      profilePicUrl={recipientUser?.profilePicUrl}
                      avatarClassName="h-6 w-6"
                    />
                  ) : (
                    <>Select Recipient</>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="right" align="start">
                <Command>
                  <CommandInput placeholder="" />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {isLoadingUsers ? (
                        <div className="flex w-full items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : (
                        users.map((user) => (
                          <CommandItem
                            key={user.uid}
                            value={user.fullName}
                            onSelect={(value) => {
                              const selectedUser = users.find(
                                (user) => user.fullName === value,
                              );

                              selectedUser
                                ? setRecipientUser({
                                    uid: selectedUser?.uid,
                                    fullName: selectedUser?.fullName,
                                    username: selectedUser?.username,
                                    profilePicUrl: selectedUser?.profilePicUrl,
                                  })
                                : setRecipientUser(null);
                              setOpenPopover(false);
                            }}
                          >
                            <ChatUser
                              fullName={user.fullName}
                              profilePicUrl={user.profilePicUrl}
                              username={user.username}
                            />
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="message">Message</Label>
            <Input
              id="message"
              placeholder="Slide in a DM..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full flex-grow"
            />
          </div>
          <AlertDialogFooter>
            <Button
              type="reset"
              variant={"outline"}
              onClick={() => {
                setRecipientUser(null);
                setMessage("");
                setOpen(false);
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="mb-2 flex-shrink-0 sm:mb-0"
              disabled={isCreatingNewMessage || !recipientUser || !message}
              variant={"primary"}
            >
              {isCreatingNewMessage && <ButtonLoader />}
              Send
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
