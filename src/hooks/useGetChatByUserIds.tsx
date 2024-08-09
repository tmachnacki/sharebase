import { firestore } from "@/lib/firebase";
import { ChatDocument } from "@/types";
import {
  collection,
  query,
  or,
  and,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { toast } from "sonner";

type ChatData = {
  status: "success" | "error" | null;
  chat: ChatDocument | DocumentData | null;
};

export const useGetChatByUserIds = () => {
  const getChatByUserIds = async (
    currentUserId: string,
    recipientUserId: string,
  ) => {
    let chatData: ChatData = {
      status: null,
      chat: null,
    };

    try {
      const chatsRef = collection(firestore, "chats");
      const q = query(
        chatsRef,
        or(
          and(
            where("userOne.uid", "==", currentUserId),
            where("userTwo.uid", "==", recipientUserId),
          ),
          and(
            where("userOne.uid", "==", recipientUserId),
            where("userTwo.uid", "==", currentUserId),
          ),
        ),
      );

      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);

      if (querySnapshot.empty) {
        chatData = {
          status: "success",
          chat: null,
        };
      } else {
        chatData = {
          status: "success",
          chat: {
            ...querySnapshot.docs[0].data(),
            id: querySnapshot.docs[0].id,
          },
        };
      }
    } catch (error) {
      console.error(error);
      toast.error("Error getting chat", { description: `${error}` });

      chatData = {
        status: "error",
        chat: null,
      };
    }

    return chatData;
  };

  return { getChatByUserIds };
};
