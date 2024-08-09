import { useEffect, useState } from "react";
import {
  DocumentData,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import { UserDocument } from "@/types";
import { useAuthStore } from "@/store/authStore";

const PAGE_SIZE = 5;
export const useGetSuggestedUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<
    Array<UserDocument | DocumentData>
  >([]);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const getSuggestedUsers = async () => {
      if (!authUser) return;
      setIsLoading(true);

      try {
        const q =
          authUser?.following && authUser.following.length > 0
            ? query(
                collection(firestore, "users"),
                where("uid", "not-in", authUser?.following),
                limit(PAGE_SIZE),
              )
            : query(
                collection(firestore, "users"),
                where("uid", "!=", authUser?.uid),
                limit(PAGE_SIZE),
              );

        const querySnapshot = await getDocs(q);
        const fetchedUsers: DocumentData[] = [];

        querySnapshot.forEach((userDoc) => {
          if (userDoc.data().uid !== authUser?.uid)
            fetchedUsers.push({ ...userDoc.data(), id: userDoc.id });
        });
        setIsLoading(false);
        setSuggestedUsers(fetchedUsers);
      } catch (error) {
        toast.error("Error", { description: `${error}` });
        setIsLoading(false);
      }
    };
    getSuggestedUsers();
  }, []);

  return { isLoading, setIsLoading, suggestedUsers, setSuggestedUsers };
};
