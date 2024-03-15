import { useGetFeedPosts } from "@/hooks/useGetFeedPosts";
import { Post } from "./post";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { usePostStore } from "@/store/postStore";
import { DocumentData, Query, collection, getDocs, limit, or, orderBy, query, where, startAfter } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import InfiniteScroll from "react-infinite-scroll-component";

const Posts = ({ scrollableTargetId }: { scrollableTargetId?: string }) => {
	// const { isLoadingPosts, posts } = useGetFeedPosts();
	const { posts, setPosts } = usePostStore();

	const authUser = useAuthStore((state) => state.user);
	const [isLoadingPosts, setIsLoadingPosts] = useState(true);
	const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentData | null>(null);
	const [firestoreQuery, setFirestoreQuery] = useState<Query | null>(null);
	const [loadMore, setLoadMore] = useState(false);

	const PAGE_SIZE = 10

	const onLoadMoreFeedPosts = () => {
		setLoadMore(true);
	}

	useEffect(() => {
		const getFeedPosts = async () => {
			if(!authUser) return;
			const noFollowing = authUser?.following.length === 0;
			const noPosts = authUser?.posts.length === 0;
			if (noFollowing && noPosts) {
				setIsLoadingPosts(false);
				setPosts([]);
				return;
			}

			try {
				setIsLoadingPosts(true);
				const q = noFollowing
					? query(collection(firestore, "posts"), where("createdBy", "==", authUser?.uid), orderBy("createdAt", "desc"), startAfter(lastVisibleDoc), limit(PAGE_SIZE))
					: query(collection(firestore, "posts"), or(where("createdBy", "in", authUser?.following), where("createdBy", "==", authUser?.uid)), orderBy("createdAt", "desc"), startAfter(lastVisibleDoc), limit(PAGE_SIZE));
				const querySnapshot = await getDocs(q);
				setLastVisibleDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
				const feedPosts: DocumentData[] = [];

				querySnapshot.forEach((postDoc) => {
					feedPosts.push({ ...postDoc.data(), id: postDoc.id });
				});

				// feedPosts.sort((a, b) => b.createdAt - a.createdAt);
				if(!loadMore) {
					setPosts(feedPosts);
				} else {
					setPosts([ ...posts, feedPosts])
				}

				setPosts(feedPosts);
				if (loadMore) setLoadMore(false)
				setIsLoadingPosts(false);
			} catch (error) {
				toast.error("Error loading posts", { description: `${error}` });
				setIsLoadingPosts(false);
				setLoadMore(false)
			}
		};

		getFeedPosts();
	}, [authUser, loadMore]);

	return (
		<div className="flex flex-col items-center gap-8 md:gap-12 grow max-w-lg ">
			<InfiniteScroll
				dataLength={posts.length}
				next={onLoadMoreFeedPosts}
				hasMore={true}
				loader={<Loader2 className="h-6 w-6 animate-spin" />}
				scrollableTarget={scrollableTargetId}
			>
				{posts.map((post) => (
					<Post post={post} key={post.id} />
				))}
			</InfiniteScroll>
		</div>
	)
}

export { Posts };