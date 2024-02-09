import { useGetFeedPosts } from "@/hooks/useGetFeedPosts"; 
import { Post } from "./post"; 

const Posts = () => {
  const { isLoadingPosts, posts } = useGetFeedPosts();

  return (
    <div className="flex flex-col items-center gap-12 grow">
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  )
}

export { Posts };