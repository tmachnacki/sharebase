import { ProfilePost } from "./profile-post";
import { PostsGrid } from "../shared/posts-grid";
import { useGetUserTaggedPosts } from "@/hooks/useGetUserTaggedPosts";
import { useEffect } from "react";

export const TaggedPosts = ({ userId }: { userId?: string }) => {
  const { taggedPosts, isLoadingTaggedPosts, getUserTaggedPosts } =
    useGetUserTaggedPosts();

  useEffect(() => {
    if (userId) getUserTaggedPosts(userId);
  }, [userId]);

  const noPostsFound =
    !isLoadingTaggedPosts && userId && taggedPosts.length === 0;

  if (noPostsFound) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-slate-500 dark:text-slate-400">
          No tagged posts yet
        </span>
      </div>
    );
  }

  return (
    <PostsGrid loading={isLoadingTaggedPosts}>
      {taggedPosts.map((post) => (
        <ProfilePost post={post} key={post.id} />
      ))}
    </PostsGrid>
  );
};
