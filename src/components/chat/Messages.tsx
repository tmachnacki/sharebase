import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { ChatDocument, MessageDocument } from "@/types";
import { toast } from "sonner";
import { Message } from "./Message";
import { useChatStore } from "@/store/chatStore";
import { cn, toTimeAgo } from "@/lib/utils";
import { ChatUser } from "./ChatUser";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ButtonLoader } from "../shared/button-loader";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ArrowUp, Send, SendHorizonal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type MessagesProps = {
  // otherUser name,
  // otherUser profilePicUrl,
  // otherUser username,
  authUserId: string;
  chat: ChatDocument | DocumentData | null | undefined;
  // className?: string;
};

const Messages = ({ authUserId, chat }: MessagesProps) => {
  const [messages, setMessages] = useState<
    Array<MessageDocument | DocumentData>
  >([]);

  const { currentChatId, setCurrentChatId } = useChatStore();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUserId || !chat)
      return toast.error("Chat or auth user not defined");

    if (!message) return toast.error("Message cannot be empty");

    setIsSending(true);
    const timeStamp = new Date(Date.now());
    try {
      const newMessageDocRef = await addDoc(collection(firestore, "messages"), {
        text: message,
        createdAt: timeStamp,
        createdBy: authUserId,
        chatId: chat.id,
      });

      await updateDoc(doc(firestore, "chats", chat.id), {
        lastMessageText: message,
        lastUpdatedAt: timeStamp,
      });
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Error sending message", { description: `${error}` });
    }
    setIsSending(false);
  };

  useEffect(() => {
    const q = query(
      collection(firestore, "messages"),
      where("chatId", "==", currentChatId),
      orderBy("createdAt"),
    );

    const unSub = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedMessages: DocumentData[] = [];
        querySnapshot.forEach((messageDoc) => {
          fetchedMessages.push({ ...messageDoc.data(), id: messageDoc.id });
        });
        setMessages(fetchedMessages);
      },
      (error) => {
        console.error(error);
        toast.error("Error getting messages", { description: `${error}` });
      },
    );

    return () => {
      unSub();
    };
  }, [currentChatId]);

  if (!chat || !authUserId) return null;

  return (
    <div className="flex h-full w-full flex-col">
      {/* user */}
      <header className="flex items-center justify-between border-b-[1px] border-slate-200  p-4 dark:border-slate-800 sm:p-6">
        <ChatUser
          fullName={
            chat.userOneUid === authUserId
              ? chat.userTwoFullName
              : chat.userOneFullName
          }
          username={
            chat.userOneUid === authUserId
              ? chat.userTwoUsername
              : chat.userOneUsername
          }
          profilePicUrl={
            chat.userOneUid === authUserId
              ? chat.userTwoProfilePicUrl
              : chat.userOneProfilePicUrl
          }
          avatarClassName="h-10 w-10 text-sm"
          className="text-base"
          asLink={true}
        ></ChatUser>
      </header>

      <div className="relative h-auto w-full flex-grow overflow-hidden">
        <ScrollArea className="h-full w-full">
          <ul className="flex min-h-48 flex-shrink flex-grow flex-col gap-4 overflow-y-auto p-6">
            {messages.map((message) => {
              const isAuthUserMessage = message.createdBy === authUserId;

              // <Message message={message} key={message.id} />
              return (
                <li
                  className={cn(
                    "flex items-center text-sm",
                    isAuthUserMessage
                      ? "ml-6 justify-end"
                      : "mr-6 justify-start",
                  )}
                  key={message.id}
                >
                  <div
                    className={cn(
                      "flex flex-col gap-1",
                      isAuthUserMessage ? "items-end" : "items-start",
                    )}
                  >
                    <span
                      className={cn(
                        "flex max-w-sm items-center text-wrap rounded-lg px-3 py-2",
                        isAuthUserMessage ? "rounded-br-sm" : "rounded-bl-sm",
                        isAuthUserMessage
                          ? "bg-purple-7 text-slate-50 dark:bg-purple-6"
                          : "bg-slate-200 dark:bg-slate-800",
                      )}
                    >
                      {message.text}
                    </span>
                    <p className="text-xs text-slate-400 dark:text-slate-600">
                      {message.createdAt && toTimeAgo(message.createdAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          {/* dummyRef */}
          <ScrollBar />
        </ScrollArea>
      </div>

      {/* send */}
      <form
        className="flex items-center justify-center gap-2 border-t-[1px] border-slate-200 px-4 pb-14 pt-2 dark:border-slate-800 md:px-6 md:py-4"
        onSubmit={handleSendMessage}
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say something..."
          max={1000}
          autoFocus
        />
        <TooltipProvider delayDuration={400}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                disabled={isSending || message.length === 0}
                type="submit"
                variant={"primary"}
              >
                <SendHorizonal className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Send</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </div>
  );
};

export default Messages;
