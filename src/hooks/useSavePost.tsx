import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { DocumentData, arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { PostDocument } from "@/types";
import { toast } from "sonner";

const useSavePost = (post: PostDocument | DocumentData) => {
	const [isSaving, setIsSaving] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const [isSaved, setIsSaved] = useState<boolean>(authUser?.saves.includes(post.id));

	const handleLikePost = async () => {
		if (isSaving) return;
		if (!authUser) return toast.error("Error", { description: "you must be logged in to save a post" });
		setIsSaving(true);

		try {
      // get auth user ref
      const authUserRef = doc(firestore, "users", authUser.uid);
      // update auth user doc saves
      await updateDoc(authUserRef, {
        saves: 
      })
      // update zustand auth user state


			const postRef = doc(firestore, "posts", post.id);
			await updateDoc(postRef, {
				likes: isLiked ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
			});

			setIsLiked(!isLiked);
			isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
		} catch (error) {
			toast.error("Error", { description: `${error}` });
		} finally {
			setIsUpdating(false);
		}
	};

	return { isLiked, likes, handleLikePost, isUpdating };
};

export { useSavePost };
