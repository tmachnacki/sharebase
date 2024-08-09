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

export const useGetUserTaggedPosts = () => {
  const [taggedPosts, setTaggedPosts] = useState<
    Array<PostDocument | DocumentData>
  >([]);
  const [isLoadingTaggedPosts, setIsLoadingTaggedPosts] = useState(false);

  const getUserTaggedPosts = async (profileUserId: string) => {
    if (!profileUserId) return;
    const q = query(
      collection(firestore, "posts"),
      where("tags", "array-contains", profileUserId),
      limit(12),
    );

    try {
      setIsLoadingTaggedPosts(true);
      const querySnapshot = await getDocs(q);
      const fetchedPosts: DocumentData[] = [];
      querySnapshot.forEach((postDoc) => {
        fetchedPosts.push({ ...postDoc.data(), id: postDoc.id });
      });
      fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);
      setTaggedPosts(fetchedPosts);
      setIsLoadingTaggedPosts(false);
    } catch (error) {
      console.error(error);
      toast.error("Error getting tagged posts", { description: `${error}` });
      setIsLoadingTaggedPosts(false);
    }
  };

  return { taggedPosts, isLoadingTaggedPosts, getUserTaggedPosts };
};
