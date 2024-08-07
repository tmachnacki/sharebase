import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import { usePostStore } from "@/store/postStore";

const useGetPostDetailsById = (postId: string | undefined) => {
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const { posts, setPosts } = usePostStore();

  useEffect(() => {
    const getPost = async () => {
      if (!postId) return;
      try {
        setIsLoadingPost(true);

        const postDocRef = doc(firestore, "posts", postId);
        const postSnapShot = await getDoc(postDocRef);

        if (!postSnapShot.exists()) {
          setPosts([]);
          setIsLoadingPost(false);
          return toast.error("Post not found");
        }

        setPosts([{ ...postSnapShot.data(), id: postSnapShot.id }]);
        setIsLoadingPost(false);
      } catch (error) {
        setPosts([]);
        toast.error("Error loading posts", { description: `${error}` });
        setIsLoadingPost(false);
      }
    };

    getPost();
  }, [postId, setPosts]);

  return { isLoadingPost, posts };
};

export { useGetPostDetailsById };
