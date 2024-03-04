import { Post } from "@/components/post/post";
import { ProfilePost } from "@/components/profile/profile-post";
import { firestore } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { PostDocument } from "@/types";
import { collection, query, where, orderBy, limit, DocumentData, getDocs } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Explore = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [explorePosts, setExplorePosts] = useState<Array<PostDocument | DocumentData>>([]);
  const authUser = useAuthStore((state) => state.user);

  const PAGE_SIZE = 15;
  useEffect(() => {
    const getExplorePosts = async () => {
      if (!authUser || isLoading) return;

      setIsLoading(true);
      try {
        const q = query(collection(firestore, "posts"), where("createdBy", "not-in", authUser?.following), orderBy("createdAt"), limit(PAGE_SIZE));
        const querySnapshot = await getDocs(q);
				const fetchedPosts: DocumentData[] = [];

				querySnapshot.forEach((postDoc) => {
					fetchedPosts.push({ ...postDoc.data(), id: postDoc.id});
				});

				// fetchedPosts.sort((a, b) => b.createdAt - a.createdAt);
        setExplorePosts(fetchedPosts)


        setIsLoading(false);
      } catch (error) {
        toast.error("Error getting posts", { description: `${error}` });
        setIsLoading(false);
      }
    }

    getExplorePosts();
  }, [authUser])

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 group/posts ">
      {isLoading ? (
        <>
          <div className="col-span-full w-full flex items-center justify-center ">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </>
      ) : (
        explorePosts.map((post: DocumentData) => (
          <ProfilePost post={post} key={post.id} />
        ))
      )}

    </div>
  )
}

export { Explore };