import { Card } from "@/components/ui/card";

import { PostDocument } from "@/types";

import { useGetUserProfileById } from "@/hooks/useGetProfileById";
import { DocumentData } from "firebase/firestore";
import { PostHeader, PostHeaderSkeleton } from "./post-header";
import { PostFooter } from "./post-footer";

const Post = ({ post }: { post: PostDocument | DocumentData }) => {
  const { isLoadingUser, userProfile } = useGetUserProfileById(post?.createdBy);

  return (
    <Card className="w-full px-4 py-6" variant={"solid"}>
      {/* header */}
      {isLoadingUser || !userProfile ? (
        <PostHeaderSkeleton />
      ) : (
        <PostHeader post={post} authorProfile={userProfile} />
      )}

      {/* post description by author */}
      <div className="py-6 text-sm">
        <span>{post.caption}</span>
      </div>

      {/* image */}
      <img
        className="h-auto w-full rounded-2xl object-center"
        src={post.imgUrl}
        alt={`post image`}
        loading="lazy"
      />

      <PostFooter post={post} />
    </Card>
  );
};

export { Post };
