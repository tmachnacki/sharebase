import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  DocumentData,
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { PostDocument } from "@/types";
import { toast } from "sonner";

const useLikePost = (post: PostDocument | DocumentData) => {
  const [isLiking, setIsLiking] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const [likes, setLikes] = useState<number>(post?.likes?.length ?? 0);
  const [isLiked, setIsLiked] = useState<boolean>(
    post.likes.includes(authUser?.uid),
  );

  const handleLikePost = async () => {
    if (isLiking) return;
    if (!authUser)
      return toast.error("Error", {
        description: "you must be logged in to like a post",
      });
    setIsLiking(true);
    console.log(post);

    try {
      const postRef = doc(firestore, "posts", post.id);
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
      });

      setIsLiked(!isLiked);
      isLiked
        ? setLikes((prevLikes) => prevLikes - 1)
        : setLikes((prevLikes) => prevLikes + 1);
    } catch (error) {
      toast.error("Error", { description: `${error}` });
    } finally {
      setIsLiking(false);
    }
  };

  return { isLiked, likes, handleLikePost, isLiking };
};

export default useLikePost;
