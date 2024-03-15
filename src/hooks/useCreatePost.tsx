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
	const editPost = usePostStore((state) => state.editPost);
	const addPost = useUserProfileStore((state) => state.addPost);
	const userProfile = useUserProfileStore((state) => state.userProfile);

	const { pathname } = useLocation();

	const handleCreatePost = async (
		{
			caption,
			tags,
			location,
			action,
			selectedFile,
			post,
		}: {
			caption: string | undefined;
			tags: string[];
			location: string | undefined;
			action: "create" | "edit";
			selectedFile?: string | ArrayBuffer | null;
			post?: PostDocument | DocumentData | null;
		}
	) => {
		console.log({
			action,
			post
		})

		if (isPending) return;
		if (!selectedFile && action === 'create') return;
		if (!post && action === 'edit') return;

		try {
			setIsPending(true);
			setCreatePostError(false);

			if (action === 'create') {
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
				const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
				const userDocRef = doc(firestore, "users", authUser?.uid);
				const imageRef = ref(storage, `posts/${postDocRef.id}`);

				await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });
				await uploadString(imageRef, selectedFile?.toString() ?? "", "data_url");
				const downloadURL = await getDownloadURL(imageRef);

				await updateDoc(postDocRef, { imgUrl: downloadURL });

				newPost.imgUrl = downloadURL;

				// if (userProfile?.uid === authUser?.uid)
				createPost({ ...newPost, id: postDocRef.id });

				if (pathname !== "/" && userProfile?.uid === authUser?.uid)
					addPost({ ...newPost, id: postDocRef.id });

				toast.success("Post created successfully");
				setIsPending(false);
			} else {
				console.log("edited post", post);
				const postDocRef = doc(firestore, "posts", post?.id);
				// const userDocRef = doc(firestore, "users", authUser?.uid);

				await updateDoc(postDocRef, {
					caption: caption ? caption : post?.caption,
					tags: tags ? tags : post?.tags,
					location: location ? location : post?.location,
				})

				// if (userProfile?.uid === authUser?.uid) 
				editPost({
					updatedPostId: post?.id,
					caption: caption ? caption : post?.caption,
					tags: tags ? tags : post?.tags,
					location: location ? location : post?.location,
				})

				toast.success("Post updated successfully");
				setIsPending(false);
			}

		} catch (error) {
			toast.error("Error updating post", { description: `${error}` });
			setIsPending(false);
			setCreatePostError(true);
		}
	};

	return { isPending, handleCreatePost, createPostError };
};

export { useCreatePost };
