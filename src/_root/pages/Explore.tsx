import { ProfilePost } from "@/components/profile/profile-post";
import { firestore } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { PostDocument } from "@/types";
import {
  collection,
  query,
  limit,
  DocumentData,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PostsGrid } from "@/components/shared/posts-grid";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Explore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [explorePosts, setExplorePosts] = useState<
    Array<PostDocument | DocumentData>
  >([]);
  const authUser = useAuthStore((state) => state.user);

  const PAGE_SIZE = 12;
  useEffect(() => {
    const getExplorePosts = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(firestore, "posts"), limit(PAGE_SIZE));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) return toast.warning("No posts found");

        const fetchedPosts: DocumentData[] = [];
        querySnapshot.forEach((postDoc) => {
          if (
            postDoc.data().createdBy !== authUser?.uid &&
            !authUser?.following.includes(postDoc.data().createdBy)
          )
            fetchedPosts.push({ ...postDoc.data(), id: postDoc.id });
        });

        fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);
        setExplorePosts(fetchedPosts);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Error getting posts", { description: `${error}` });

        setIsLoading(false);
      }
    };

    if (authUser) getExplorePosts();
  }, [authUser]);

  const noPostsFound = !isLoading && explorePosts.length === 0;

  if (noPostsFound) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-slate-500 dark:text-slate-400">
          I guess you've seen it all...
        </span>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-content container px-4 md:px-6">
        <PostsGrid loading={isLoading}>
          {explorePosts.map((post: DocumentData) => (
            <ProfilePost post={post} key={post.id} />
          ))}
        </PostsGrid>
      </div>
      <ScrollBar />
    </ScrollArea>
  );
};

export { Explore };
