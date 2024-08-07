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
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useGetMorePostsFromAuthor = (
  authorId: string | undefined,
  postId: string | undefined,
) => {
  const [isLoadingAuthorPosts, setIsLoadingAuthorPosts] = useState(false);
  const [moreAuthorPosts, setMoreAuthorPosts] = useState<
    Array<PostDocument | DocumentData>
  >([]);

  const PAGE_SIZE = 7;
  useEffect(() => {
    const getMorePostsFromAuthor = async () => {
      if (!authorId || !postId) return;
      setIsLoadingAuthorPosts(true);
      setMoreAuthorPosts([]);

      try {
        const q = query(
          collection(firestore, "posts"),
          where("createdBy", "==", authorId),
          limit(PAGE_SIZE),
        );
        const querySnapshot = await getDocs(q);

        const posts: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          if (doc.id !== postId) posts.push({ ...doc.data(), id: doc.id });
        });

        posts.sort((a, b) => b.createdAt - a.createdAt);

        setMoreAuthorPosts(posts);
        setIsLoadingAuthorPosts(false);
      } catch (error) {
        toast.error("Error loading posts", { description: `${error}` });
        setMoreAuthorPosts([]);
        setIsLoadingAuthorPosts(false);
      }
    };

    getMorePostsFromAuthor();
  }, [authorId, postId]);

  return { isLoadingAuthorPosts, moreAuthorPosts };
};
