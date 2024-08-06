import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { toast } from "sonner";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { ChatDocument } from "@/types";

export const useGetChats = (authUserId?: string) => {
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  // const { chats, setChats } = useChatStore();
  // const authUser = useAuthStore((state) => state.user);
  const [chats, setChats] = useState<Array<ChatDocument | DocumentData>>([]);

  // useEffect(() => {
  //   const getChats = async () => {
  //     if (!authUserId) return;
  //     setIsLoadingChats(true);
  //     try {
  //       const q = query(
  //         collection(firestore, "chats"),
  //         or(
  //           where("userOneUid", "==", authUserId),
  //           where("userTwoUid", "==", authUserId),
  //         ),
  //         orderBy("lastUpdatedAt", "desc"),
  //       );
  //       const querySnapshot = await getDocs(q);

  //       const fetchedChats: DocumentData[] = [];
  //       querySnapshot.forEach((chatDoc) => {
  //         fetchedChats.push({ ...chatDoc.data(), id: chatDoc.id });
  //       });
  //       setChats(fetchedChats);
  //       setIsLoadingChats(false);
  //     } catch (error) {
  //       toast.error("Error", { description: `${error}` });
  //       setIsLoadingChats(false);
  //     }
  //   };
  //   getChats();
  // }, [setChats, authUserId]);

  useEffect(() => {
    const getChats = () => {
      const q = query(
        collection(firestore, "chats"),
        or(
          where("userOneUid", "==", authUserId),
          where("userTwoUid", "==", authUserId),
        ),
      );

      const unsub = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedChats: DocumentData[] = [];
          querySnapshot.forEach((chatDoc) => {
            fetchedChats.push({ ...chatDoc.data(), id: chatDoc.id });
          });
          fetchedChats.sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt);
          setChats(fetchedChats);
        },
        (error) => {
          console.error(error);
          toast.error("Error updating chats", { description: `${error}` });
        },
      );

      return () => {
        unsub();
      };
    };

    if (authUserId) getChats();
  }, [authUserId]);

  return { chats };
};
