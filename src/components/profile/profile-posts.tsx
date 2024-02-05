import { useState, useEffect } from "react"
import { DocumentData, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";


import { usePostStore } from "@/store/postStore"
import { useUserProfileStore } from "@/store/userProfileStore";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { ProfilePost } from "./profile-post";
import { PostDocument } from "@/types";

const ProfilePosts = () => {
  const [loadingPosts, setLoadingPosts] = useState(false)
  const { posts, setPosts } = usePostStore();
  const userProfile = useUserProfileStore((state) => state.userProfile);

  const noPostsFound = !loadingPosts && userProfile && posts.length === 0;

  useEffect(() => {
    const getPosts = async () => {
      if (!userProfile) return;
      setLoadingPosts(true);
      setPosts([]);

      try {
        const q = query(collection(firestore, "posts"), where("createdBy", "==", userProfile.uid));
        const querySnapshot = await getDocs(q);

        const posts: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });

        posts.sort((a, b) => b.createdAt - a.createdAt);
        setPosts(posts);
      } catch (error) {
        toast.error("Error loading posts", { description: `${error}` });
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    getPosts();
  }, []);

  if (noPostsFound) return null;
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 group/posts ">
      {loadingPosts ? (
        <>
          <Skeleton className="w-full h-full aspect-square rounded-none" />
          <Skeleton className="w-full h-full aspect-square rounded-none" />
          <Skeleton className="w-full h-full aspect-square rounded-none" />
        </>
      ) : (
        posts.map((post: DocumentData) => (
          <ProfilePost post={post} key={post.id} />
        ))
      )}

    </div>
  )
}

export default ProfilePosts