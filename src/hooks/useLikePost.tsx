
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { DocumentData, arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { PostDocument } from "@/types";
import { toast } from "sonner";

const useLikePost = (post: PostDocument | DocumentData) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const [likes, setLikes] = useState<number>(post.likes.length);
	const [isLiked, setIsLiked] = useState<boolean>(post.likes.includes(authUser?.uid));

	const handleLikePost = async () => {
		if (isUpdating) return;
		if (!authUser) return toast.error("Error", { description: "you must be logged in to like a post" });
		setIsUpdating(true);

		try {
			const postRef = doc(firestore, "posts", post.id);
			await updateDoc(postRef, {
				likes: isLiked ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
			});

			setIsLiked(!isLiked);
			isLiked ? setLikes((prevLikes) => prevLikes - 1) : setLikes((prevLikes) => prevLikes + 1);
		} catch (error) {
			toast.error("Error", { description: `${error}` });
		} finally {
			setIsUpdating(false);
		}
	};

	return { isLiked, likes, handleLikePost, isUpdating };
};

export default useLikePost;