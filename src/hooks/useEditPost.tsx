import { useState } from "react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/authStore";
// import { usePostStore } from "@/store/postStore";
import { useUserProfileStore } from "@/store/userProfileStore";
import { PostDocument } from "@/types";
import { doc, setDoc, DocumentData } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

const useCreatePost = () => {
  const [isPending, setIsPending] = useState(false);
  const [editPostError, setEditPostError] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  // const setPosts = usePostStore((state) => state.setPosts);
  // const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);

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

      await setDoc(
        postDocRef,
        {
          caption: caption ? caption : post.caption,
          tags: tags ? tags : post.tags,
          location: location ? location : post.location,
        },
        { merge: true },
      );

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
