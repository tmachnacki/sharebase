import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { ChatUser } from "./ChatUser";
import { ButtonLoader } from "../shared/button-loader";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useChatStore } from "@/store/chatStore";
import { useGetChatByUserIds } from "@/hooks/useGetChatByUserIds";
import { useAuthStore } from "@/store/authStore";
import { UserDocument } from "@/types";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

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

  const [message, setMessage] = useState("");

  const [isCreatingNewMessage, setIsCreatingNewMessage] = useState(false);
  const { setCurrentChatId } = useChatStore();
  const { getChatByUserIds } = useGetChatByUserIds();
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const authUser = useAuthStore((state) => state.user);

  const [recipientUser, setRecipientUser] = useState<{
    uid: string;
    username: string;
    fullName: string;
    profilePicUrl: string;
  } | null>(null);

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
        await addDoc(collection(firestore, "messages"), {
          text: message,
          createdAt: timeStamp,
          createdBy: authUser?.uid,
          chatId: chatData.chat.id,
        });

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

        await addDoc(collection(firestore, "messages"), {
          text: message,
          createdAt: timeStamp,
          createdBy: authUser?.uid,
          chatId: newChatDocRef.id,
        });

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
          <div className="flex flex-row items-center ">
            <p className="w-24 flex-shrink-0 text-sm font-semibold">To:</p>
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative w-full min-w-36 items-center justify-start rounded-b-none rounded-t-sm border-b-[1px] border-slate-200 bg-transparent pb-2 pr-8 pt-0 hover:border-slate-300 hover:bg-transparent dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-transparent"
                >
                  {recipientUser ? (
                    <ChatUser
                      fullName={recipientUser?.fullName}
                      profilePicUrl={recipientUser?.profilePicUrl}
                      avatarClassName="h-8 w-8 text-xs"
                    />
                  ) : (
                    <span>Select Recipient</span>
                  )}
                  <ChevronsUpDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-[50%]  opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="bottom" align="center">
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
                            className={cn("relative pr-8")}
                          >
                            <ChatUser
                              fullName={user.fullName}
                              profilePicUrl={user.profilePicUrl}
                              username={user.username}
                              avatarClassName="h-8 w-8 text-xs"
                            />

                            {recipientUser?.uid === user.uid && (
                              <Check className="absolute right-2 top-1/2 h-4 w-4 -translate-y-[50%]  " />
                            )}
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-row items-center">
            <Label htmlFor="message" className="w-24 flex-shrink-0">
              Message
            </Label>
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
              disabled={
                isCreatingNewMessage ||
                !recipientUser ||
                !message ||
                isLoadingChat
              }
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
