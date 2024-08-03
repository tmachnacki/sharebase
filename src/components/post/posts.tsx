import { useGetFeedPosts } from "@/hooks/useGetFeedPosts";
import { Post } from "./post";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePostStore } from "@/store/postStore";
import {
  DocumentData,
  Query,
  collection,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  where,
  startAfter,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";

const Posts = ({ scrollableTargetId }: { scrollableTargetId?: string }) => {
  // const { isLoadingPosts, posts } = useGetFeedPosts();
  const { posts, setPosts } = usePostStore();

  const authUser = useAuthStore((state) => state.user);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentData | null>(
    null,
  );
  const [firestoreQuery, setFirestoreQuery] = useState<Query | null>(null);
  // const [loadMore, setLoadMore] = useState(true);

  const PAGE_SIZE = 10;
  const onLoadMoreFeedPosts = async () => {
    if (!authUser) return;
    // if (!loadMore) return;
    const noFollowing = authUser?.following.length === 0;
    const noPosts = authUser?.posts.length === 0;
    if (noFollowing && noPosts) {
      console.log("no posts");
      setIsLoadingPosts(false);
      setPosts([]);
      // setLoadMore(false);
      return;
    }

    try {
      setIsLoadingPosts(true);
      const q = noFollowing
        ? lastVisibleDoc
          ? query(
              collection(firestore, "posts"),
              where("createdBy", "==", authUser?.uid),
              orderBy("createdAt", "desc"),
              startAfter(lastVisibleDoc),
              limit(PAGE_SIZE),
            )
          : query(
              collection(firestore, "posts"),
              where("createdBy", "==", authUser?.uid),
              orderBy("createdAt", "desc"),
              limit(PAGE_SIZE),
            )
        : lastVisibleDoc
          ? query(
              collection(firestore, "posts"),
              or(
                where("createdBy", "in", authUser?.following),
                where("createdBy", "==", authUser?.uid),
              ),
              orderBy("createdAt", "desc"),
              startAfter(lastVisibleDoc),
              limit(PAGE_SIZE),
            )
          : query(
              collection(firestore, "posts"),
              or(
                where("createdBy", "in", authUser?.following),
                where("createdBy", "==", authUser?.uid),
              ),
              orderBy("createdAt", "desc"),
              limit(PAGE_SIZE),
            );
      const querySnapshot = await getDocs(q);
      // setLastVisibleDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      const feedPosts: DocumentData[] = [];

      querySnapshot.forEach((postDoc) => {
        feedPosts.push({ ...postDoc.data(), id: postDoc.id });
      });

      // feedPosts.sort((a, b) => b.createdAt - a.createdAt);

      setPosts(feedPosts);
      setIsLoadingPosts(false);
      // setLoadMore(false);
    } catch (error) {
      toast.error("Error loading posts", { description: `${error}` });
      setIsLoadingPosts(false);
      // setLoadMore(false);
    }
  };
  useEffect(() => {
    onLoadMoreFeedPosts();
  }, []);

  const loadMorePosts = () => {
    // setLoadMore(true);
  };

  return (
    // <InfiniteScroll
    // 	dataLength={posts.length}
    // 	next={onLoadMoreFeedPosts}
    // 	hasMore={true}
    // 	loader={<Loader2 className="h-6 w-6 animate-spin" />}
    // 	scrollableTarget={scrollableTargetId}

    // >
    <div className="flex max-w-lg grow flex-col items-center gap-8 md:gap-12 ">
      {!!posts &&
        posts.map((post, index) => (
          <Post post={post} key={`${post.id}-${index}`} />
        ))}
    </div>
    // </InfiniteScroll>
  );
};

export { Posts };
