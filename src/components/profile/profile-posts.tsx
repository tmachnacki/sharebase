import { useState, useEffect } from "react"
import { DocumentData, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

import { usePostStore } from "@/store/postStore"
import { toast } from "sonner";
import { ProfilePost } from "./profile-post";
import { PostsGrid } from "../shared/posts-grid";

const ProfilePosts = ({ userId }: { userId?: string }) => {
	const [loadingPosts, setLoadingPosts] = useState(false)
	const { posts, setPosts } = usePostStore();

	const noPostsFound = !loadingPosts && userId && posts.length === 0;

	useEffect(() => {
		const getPosts = async () => {
			if (!userId) return;
			setLoadingPosts(true);
			setPosts([]);

			try {
				const q = query(collection(firestore, "posts"), where("createdBy", "==", userId));
				const querySnapshot = await getDocs(q);

				const posts: DocumentData[] = [];
				querySnapshot.forEach((doc) => {
					posts.push({ ...doc.data(), id: doc.id });
				});

				posts.sort((a, b) => b.createdAt - a.createdAt);
				setPosts(posts);
				setLoadingPosts(false);
			} catch (error) {
				toast.error("Error loading posts", { description: `${error}` });
				setPosts([]);
				setLoadingPosts(false);
			}
		};

		getPosts();
	}, [userId, setPosts]);

	if (noPostsFound) return null;
	return (
		<PostsGrid loading={loadingPosts}>
			{posts.map((post: DocumentData) => (
				<ProfilePost post={post} key={post.id} />
			))}
		</PostsGrid>

	)
}

export { ProfilePosts };