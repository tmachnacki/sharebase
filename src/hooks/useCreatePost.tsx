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
	updateDoc,
	DocumentData,
	setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

type NewPost = Omit<PostDocument, "id">;

const useCreatePost = () => {
	const [isPending, setIsPending] = useState(false);
	const [createPostError, setCreatePostError] = useState(false);
	const authUser = useAuthStore((state) => state.user);
	const createPost = usePostStore((state) => state.createPost);
	const addPost = useUserProfileStore((state) => state.addPost);
	const userProfile = useUserProfileStore((state) => state.userProfile);

	const { pathname } = useLocation();

	const handleCreatePost = async (
		caption: string | undefined,
		tags: string[],
		location: string | undefined,
		action: "create" | "edit",
		selectedFile?: string | ArrayBuffer | null,
		post?: PostDocument | DocumentData | null
	) => {
		if (isPending) return;
		if (!selectedFile && action === 'create') return;
		if (!post && action === 'edit') return;

		try {
			setIsPending(true);
			setCreatePostError(false);
			const newPost: NewPost = {
				caption: caption ?? "",
				likes: [],
				comments: [],
				createdAt: new Date(Date.now()),
				createdBy: authUser?.uid,
				location: location ?? "",
				tags: tags ?? [],
				imgUrl: "",
			};

			if (action === 'create') {
				const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
				const userDocRef = doc(firestore, "users", authUser?.uid);
				const imageRef = ref(storage, `posts/${postDocRef.id}`);

				await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
				await uploadString(imageRef, selectedFile.toString(), "data_url");
				const downloadURL = await getDownloadURL(imageRef);

				await updateDoc(postDocRef, { imgUrl: downloadURL });

				newPost.imgUrl = downloadURL;

				if (userProfile?.uid === authUser?.uid)
					createPost({ ...newPost, id: postDocRef.id });

				if (pathname !== "/" && userProfile?.uid === authUser?.uid)
					addPost({ ...newPost, id: postDocRef.id });

				toast.success("Post created successfully");
			} else {
				const postDocRef = doc(firestore, "posts", post?.id);
				// const userDocRef = doc(firestore, "users", authUser?.uid);

				await setDoc(postDocRef, {
					caption: caption ? caption : post?.caption,
					tags: tags ? tags : post?.tags,
					location: location ? location : post?.location,
				}, { merge: true })

				if (userProfile?.uid === authUser?.uid) {
					// setPosts()
				}
			}


			setIsPending(false);
		} catch (error) {
			toast.error("Error", { description: `${error}` });
			setIsPending(false);
			setCreatePostError(true);
		}
	};

	return { isPending, handleCreatePost, createPostError };
};

export { useCreatePost };
