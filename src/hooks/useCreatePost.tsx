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
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";

type NewPost = Omit<PostDocument, "id">;

const useCreatePost = () => {
  const [isPending, setIsPending] = useState(false);
  const [ isError, setIsError] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  const posts = usePostStore((state) => state.posts);
  const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);

  const { pathname } = useLocation();

  const handleCreatePost = async (
    selectedFile: string | ArrayBuffer | null,
    caption: string | undefined,
    tags: string[],
    location: string | undefined
  ) => {
    if (isPending) return;
    if (!selectedFile) return;

    setIsPending(true);
    setIsError(false);
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

    try {
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
      setIsPending(false);
    } catch (error) {
      toast.error("Error", { description: `${error}` });
      setIsPending(false);
      setIsError(true);
    }
  };

  return { isPending, handleCreatePost, isError };
};

export { useCreatePost };
