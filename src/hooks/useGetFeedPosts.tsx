import { useEffect, useState } from "react";
import { usePostStore } from "@/store/postStore";
import { useAuthStore } from "@/store/authStore";
import { useUserProfileStore } from "@/store/userProfileStore";
import { DocumentData, collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner"; 

const useGetFeedPosts = () => {
	const [isLoadingPosts, setIsLoadingPosts] = useState(true);
	const { posts, setPosts } = usePostStore();
	const authUser = useAuthStore((state) => state.user);

  const PAGE_SIZE = 10
	useEffect(() => {
		const getFeedPosts = async () => {
			if (authUser?.following.length === 0) {
				setPosts([]);
				return;
			}
      
			setIsLoadingPosts(true);
			const q = query(collection(firestore, "posts"), where("createdBy", "in", authUser?.following), orderBy("createdAt"), limit(PAGE_SIZE));

			try {
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
	}, [authUser, setPosts]);

	return { isLoadingPosts, posts };
};

export { useGetFeedPosts };