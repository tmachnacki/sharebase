import { useEffect, useState } from "react";
import { usePostStore } from "@/store/postStore";
import { useAuthStore } from "@/store/authStore";
import { useUserProfileStore } from "@/store/userProfileStore";
import { DocumentData, collection, doc, getDoc, getDocs, limit, or, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner"; 

const useGetFeedPosts = () => {
	const [isLoadingPosts, setIsLoadingPosts] = useState(true);
	const { posts, setPosts } = usePostStore();
	const authUser = useAuthStore((state) => state.user);

	const noFollowing = authUser?.following.length === 0;
	const noPosts = authUser?.posts.length === 0;
	
  const PAGE_SIZE = 10
	useEffect(() => {
		const getFeedPosts = async () => {
			if (noFollowing && noPosts) {
				setIsLoadingPosts(false);
				setPosts([]);
				return;
			}
			
			try {
				setIsLoadingPosts(true);
				const q = noFollowing 
					? query(collection(firestore, "posts"), where("createdBy", "==", authUser?.uid), orderBy("createdAt"), limit(PAGE_SIZE))
					: query(collection(firestore, "posts"), or(where("createdBy", "in", authUser?.following), where("createdBy", "==", authUser?.uid)), orderBy("createdAt"), limit(PAGE_SIZE));
				const querySnapshot = await getDocs(q);
				const feedPosts: DocumentData[] = [];

				querySnapshot.forEach((postDoc) => {
					feedPosts.push({ ...postDoc.data(), id: postDoc.id});
				});

				feedPosts.sort((a, b) => b.createdAt - a.createdAt);
				setPosts(feedPosts);
				setIsLoadingPosts(false);
			} catch (error) {
        toast.error("Error loading posts", { description: `${error}` });
				setIsLoadingPosts(false);
			} 
		};

		if (authUser) getFeedPosts();
	}, [authUser?.following, authUser?.posts]);

	return { isLoadingPosts, posts };
};

export { useGetFeedPosts };