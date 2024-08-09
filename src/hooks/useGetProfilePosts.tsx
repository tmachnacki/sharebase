import { firestore } from "@/lib/firebase";
import { PostDocument } from "@/types";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";

export const useGetProfilePosts = () => {
  const [profilePosts, setProfilePosts] = useState<
    Array<PostDocument | DocumentData>
  >([]);
  const [isLoadingProfilePosts, setIsLoadingProfilePosts] = useState(false);

  const getProfilePosts = async (profileUserId: string) => {
    if (!profileUserId) return;
    const q = query(
      collection(firestore, "posts"),
      where("createdBy", "==", profileUserId),
      limit(12),
    );

    try {
      setIsLoadingProfilePosts(true);
      const querySnapshot = await getDocs(q);
      const fetchedPosts: DocumentData[] = [];
      querySnapshot.forEach((postDoc) => {
        fetchedPosts.push({ ...postDoc.data(), id: postDoc.id });
      });
      fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);
      setProfilePosts(fetchedPosts);
      setIsLoadingProfilePosts(false);
    } catch (error) {
      console.error(error);
      toast.error("Error getting profile posts", { description: `${error}` });
      setIsLoadingProfilePosts(false);
    }
  };

  return { profilePosts, isLoadingProfilePosts, getProfilePosts };
};
