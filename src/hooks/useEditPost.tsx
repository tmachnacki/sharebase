import { useState } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
import { usePostStore } from "@/store/postStore";
import { useUserProfileStore } from "@/store/userProfileStore";

import { useLocation } from "react-router-dom";
import { PostDocument } from "@/types";
import {
	addDoc,
	collection,
	doc,
	arrayUnion,
	setDoc,
	DocumentData,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

type NewPost = Omit<PostDocument, "id">;

const useCreatePost = () => {
	const [isPending, setIsPending] = useState(false);
	const [editPostError, setEditPostError] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const setPosts = usePostStore((state) => state.setPosts);
	// const addPost = useUserProfileStore((state) => state.addPost);
	const userProfile = useUserProfileStore((state) => state.userProfile);

	const { pathname } = useLocation();

	const handleUpdatePost = async (
		caption: string | undefined,
		tags: string[],
		location: string | undefined,
		post: PostDocument | DocumentData,
	) => {
		if (isPending) return;

		try {
			setIsPending(true);
			setEditPostError(false);

			const postDocRef = doc(firestore, "posts", post.id);
			// const userDocRef = doc(firestore, "users", authUser?.uid);

			await setDoc(postDocRef, {
				caption: caption ? caption : post.caption,
				tags: tags ? tags : post.tags, 
				location: location ? location : post.location,
			}, { merge: true })


			if (userProfile?.uid === authUser?.uid) {
				// setPosts()
			}

			toast.success("Post updated");
			setIsPending(false);
		} catch (error) {
			toast.error("Error", { description: `${error}` });
			setIsPending(false);
			setEditPostError(true);
		}
	};

	return { isPending, handleUpdatePost, editPostError };
};

export { useCreatePost };
