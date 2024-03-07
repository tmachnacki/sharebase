import {
  Card,
} from "@/components/ui/card";

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
      {isLoadingUser || !userProfile ? <PostHeaderSkeleton /> : <PostHeader post={post} authorProfile={userProfile} />}

      {/* post description by author */}
      <div className="text-sm py-6">
        <span>{post.caption}</span>
      </div>

      {/* image */}
      <div className="w-full h-auto bg-center bg-cover rounded-2xl aspect-square" role="img" aria-description="image posted by john_doe" style={{ backgroundImage: `url("${post.imgUrl}")` }} />

      <PostFooter post={post} authorProfile={userProfile} />

    </Card>
  );
};

export { Post };
