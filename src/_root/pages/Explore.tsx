import { ProfilePost } from "@/components/profile/profile-post";
import { firestore } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { PostDocument } from "@/types";
import {
  collection,
  query,
  where,
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

  const PAGE_SIZE = 15;
  useEffect(() => {
    const getExplorePosts = async () => {
      if (!authUser || isLoading) return;

      setIsLoading(true);
      try {
        const q =
          authUser?.following && authUser.following.length > 0
            ? query(
                collection(firestore, "posts"),
                where("createdBy", "not-in", authUser?.following),
                limit(PAGE_SIZE),
              )
            : query(
                collection(firestore, "posts"),
                where("createdBy", "!=", authUser?.uid),
                limit(PAGE_SIZE),
              );
        const querySnapshot = await getDocs(q);
        const fetchedPosts: DocumentData[] = [];

        querySnapshot.forEach((postDoc) => {
          if (postDoc.data().createdBy !== authUser?.uid)
            fetchedPosts.push({ ...postDoc.data(), id: postDoc.id });
        });

        fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);
        setExplorePosts(fetchedPosts);

        setIsLoading(false);
      } catch (error) {
        toast.error("Error getting posts", { description: `${error}` });
        setIsLoading(false);
      }
    };

    getExplorePosts();
  }, [authUser]);

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
