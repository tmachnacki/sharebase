import { useState, useEffect } from "react";
import {
  DocumentData,
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

import { toast } from "sonner";
import { ProfilePost } from "@/components/profile/profile-post";
import { PostDocument } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { PostsGrid } from "@/components/shared/posts-grid";
import { Loader2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Saves = () => {
  const [loadingSaves, setLoadingSaves] = useState(false);
  const [savedPosts, setSavedPosts] = useState<
    Array<PostDocument | DocumentData>
  >([]);
  const authUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const getPosts = async () => {
      if (!authUser) return;
      if (authUser?.saves.length === 0 || !authUser.saves) return;

      try {
        setLoadingSaves(true);
        const q = query(
          collection(firestore, "posts"),
          where(documentId(), "in", authUser.saves),
        );
        const querySnapshot = await getDocs(q);

        const posts: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });

        posts.sort((a, b) => b.id - a.id);

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

  if (loadingSaves) {
    return (
      <div className="p-content container space-y-8 px-4 md:px-6">
        <div className="flex w-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (!loadingSaves && savedPosts.length === 0) {
    return (
      <div className="p-content container space-y-8 px-4 md:px-6">
        <div className="flex  w-full items-center justify-center">
          <span className="text-slate-500 dark:text-slate-400">
            You haven't saved any posts yet.
          </span>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-content container space-y-8 px-4 md:px-6">
        <PostsGrid loading={loadingSaves}>
          {savedPosts.map((post: DocumentData) => (
            <ProfilePost post={post} key={post.id} />
          ))}
        </PostsGrid>
      </div>
      <ScrollBar />
    </ScrollArea>
  );
};

export { Saves };
