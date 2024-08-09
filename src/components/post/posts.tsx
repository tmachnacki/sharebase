import { Post } from "./post";
import { Loader2 } from "lucide-react";
import { useGetFeedPosts } from "@/hooks/useGetFeedPosts";

const Posts = () => {
  const { isLoadingPosts, posts } = useGetFeedPosts();

  if (isLoadingPosts) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!!posts && posts.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-slate-500 dark:text-slate-400">
          Your feed is quiet...
        </span>
      </div>
    );
  }

  return (
    <div className="flex max-w-lg flex-shrink flex-grow flex-col items-center gap-8 md:gap-12 ">
      {!!posts &&
        posts.map((post, index) => (
          <Post post={post} key={`${post.id}-${index}`} />
        ))}
    </div>
  );
};

export { Posts };
