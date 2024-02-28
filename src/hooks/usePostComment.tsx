import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { usePostStore } from "../store/postStore";
import { toast } from "sonner";
import { CommentDocument } from "@/types";

const usePostComment = () => {
	const [isCommenting, setIsCommenting] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const addComment = usePostStore((state) => state.addComment);

	const handlePostComment = async (postId: string, commentContent: string) => {
		if (!authUser || isCommenting) return;

		setIsCommenting(true);
		const newComment: CommentDocument = {
			comment: commentContent,
			createdAt: new Date(Date.now()),
			createdBy: authUser.uid,
			postId,
		};
		try {
			await updateDoc(doc(firestore, "posts", postId), {
				comments: arrayUnion(newComment),
			});
			addComment(postId, newComment);
			setIsCommenting(false);
		} catch (error) {
      toast.error("Error posting comment", { description: `${error}` })
			setIsCommenting(false);
		} 
	};

	return { isCommenting, handlePostComment };
};

export default usePostComment;