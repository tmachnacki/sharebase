import { useState, useEffect } from "react"
import { DocumentData, collection, documentId, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

import { toast } from "sonner";
import { ProfilePost } from "@/components/profile/profile-post";
import { PostDocument } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { PostsGrid } from "@/components/shared/posts-grid";

const Saves = () => {
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
		<div className="container p-content space-y-8">
			{/* <h1 className="text-lg">Saved posts</h1> */}
			<PostsGrid loading={loadingSaves}>
				{savedPosts.map((post: DocumentData) => (
					<ProfilePost post={post} key={post.id} />
				))}
			</PostsGrid>
		</div>
	)
}

export { Saves };