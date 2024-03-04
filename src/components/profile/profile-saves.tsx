import { useState, useEffect } from "react"
import { DocumentData, collection, documentId, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";


import { usePostStore } from "@/store/postStore"
import { useUserProfileStore } from "@/store/userProfileStore";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { ProfilePost } from "./profile-post";
import { PostDocument } from "@/types";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const ProfileSaves = () => {
  const [loadingSaves, setLoadingSaves] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Array<PostDocument | DocumentData>>([]);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const getPosts = async () => {
      if (!authUser) return;
      if (authUser?.saves.length === 0 || !authUser.saves) return;
      
      try {
        setLoadingSaves(true);
        const q = query(collection(firestore, "posts"), where(documentId(), "in", authUser.saves));
        const querySnapshot = await getDocs(q);

        const posts: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });

        posts.sort((a, b) => b.id - a.id);

        console.log(posts);
        setSavedPosts(posts);
        setLoadingSaves(false);
      } catch (error) {
        toast.error("Error loading posts", { description: `${error}` });
        setSavedPosts([]);
        setLoadingSaves(false);
      }
    };

    getPosts();
  }, [authUser]);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 group/posts ">
      {loadingSaves ? (
        <>
          {/* <Skeleton className="w-full h-full aspect-square rounded-none" />
          <Skeleton className="w-full h-full aspect-square rounded-none" />
          <Skeleton className="w-full h-full aspect-square rounded-none" /> */}
          <div className="col-span-full w-full flex items-center justify-center ">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </>
      ) : (
        savedPosts.map((post: DocumentData) => (
          <ProfilePost post={post} key={post.id} />
        ))
      )}

    </div>
  )
}

export { ProfileSaves };