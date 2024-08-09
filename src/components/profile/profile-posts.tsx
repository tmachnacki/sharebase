import { useEffect } from "react";
import { ProfilePost } from "./profile-post";
import { PostsGrid } from "../shared/posts-grid";
import { useGetProfilePosts } from "@/hooks/useGetProfilePosts";

const ProfilePosts = ({ userId }: { userId?: string }) => {
  const { getProfilePosts, isLoadingProfilePosts, profilePosts } =
    useGetProfilePosts();

  const noPostsFound =
    !isLoadingProfilePosts && userId && profilePosts.length === 0;

  useEffect(() => {
    if (userId) getProfilePosts(userId);
  }, [userId]);

  if (noPostsFound) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-slate-500 dark:text-slate-400">No posts yet</span>
      </div>
    );
  }

  return (
    <PostsGrid loading={isLoadingProfilePosts}>
      {profilePosts.map((post) => (
        <ProfilePost post={post} key={post.id} />
      ))}
    </PostsGrid>
  );
};

export { ProfilePosts };
