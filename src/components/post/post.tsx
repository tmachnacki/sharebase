import { Card } from "@/components/ui/card";
import { PostDocument } from "@/types";
import { useGetUserProfileById } from "@/hooks/useGetProfileById";
import { DocumentData } from "firebase/firestore";
import { PostHeader, PostHeaderSkeleton } from "./post-header";
import { PostFooter } from "./post-footer";
import { MapPin } from "lucide-react";
import { useProgressiveImage } from "@/hooks/useProgressiveImage";
import { Skeleton } from "../ui/skeleton";

const Post = ({ post }: { post: PostDocument | DocumentData }) => {
  const { isLoadingUser, userProfile } = useGetUserProfileById(post?.createdBy);
  const { sourceLoaded } = useProgressiveImage(post.imgUrl);

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
        <p>{post.caption}</p>
      </div>
      {post.location && (
        <div className="flex items-center pb-2 text-sm text-slate-400 dark:text-slate-500">
          <MapPin className="mr-2 h-4 w-4" />
          <span>{post.location}</span>
        </div>
      )}

      {/* image */}
      {sourceLoaded ? (
        <img
          className="h-auto w-full rounded-2xl object-center"
          src={post.imgUrl}
          alt={`${post.caption}`}
          loading="lazy"
        />
      ) : (
        <Skeleton className="aspect-square h-auto w-full rounded-2xl" />
      )}

      <PostFooter post={post} />
    </Card>
  );
};

export { Post };
