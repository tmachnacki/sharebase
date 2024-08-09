import { useState } from "react";
import { toast } from "sonner";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { UserDocument } from "@/types";

const useSearchUser = () => {
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [users, setUsers] = useState<Array<UserDocument | DocumentData>>([]);

  const getUserProfile = async (searchQuery: string) => {
    setIsLoadingUsers(true);
    setUsers([]);
    try {
      // const q = query(
      //   collection(firestore, "users"),
      //   where("username", ">=", searchQuery),
      //   where("fullName", "<=", searchQuery + "\uf8ff"),
      // );
      const q = query(
        collection(firestore, "users"),
        where("username", "==", searchQuery),
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setUsers([]);
        setIsLoadingUsers(false);
        return;
      }

      const fetchedUsers: DocumentData[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        fetchedUsers.push({ ...doc.data(), id: doc.id });
      });
      setUsers(fetchedUsers);
      setIsLoadingUsers(false);
    } catch (error) {
      toast.error("Error", { description: `${error}` });
      setUsers([]);
      setIsLoadingUsers(false);
    }
  };

  return { isLoadingUsers, getUserProfile, users, setUsers };
};

export default useSearchUser;
