import { firestore } from "@/lib/firebase";
import { UserDocument } from "@/types";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";

export const useGetOtherUsers = () => {
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [users, setUsers] = useState<Array<UserDocument | DocumentData>>([]);

  const getOtherUsers = async (authUserId: string) => {
    try {
      setIsLoadingUsers(true);
      const q = query(
        collection(firestore, "users"),
        where("uid", "!=", authUserId),
      );
      const querySnapshot = await getDocs(q);
      const fetchedUsers: DocumentData[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        fetchedUsers.push({ ...doc.data(), id: doc.id });
      });
      setUsers(fetchedUsers);
      setIsLoadingUsers(false);
    } catch (error) {
      toast.error("Error getting users", { description: `${error}` });
      setUsers([]);
      setIsLoadingUsers(false);
    }
  };

  return { isLoadingUsers, getOtherUsers, users, setUsers };
};
