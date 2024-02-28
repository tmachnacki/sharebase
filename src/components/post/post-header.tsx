
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { MoreHorizontal, UserRoundMinus, Link as LinkIcon, ExternalLink, UserRoundPlus } from "lucide-react";
import { Button } from "../ui/button";
import { AuthorProfile, PostDocument, UserDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { useFollowUser } from "@/hooks/useFollowUser";
import { ButtonLoader } from "../shared/button-loader";
import { User } from "../shared/user";


type PostHeaderProps = {
  post: PostDocument | DocumentData;
  authorProfile: UserDocument | DocumentData;
}

const PostHeader = ({ post, authorProfile }: PostHeaderProps) => {
  const { handleFollowUser, isFollowing, followPending } = useFollowUser(post?.createdBy);


  return (
    <User fullName={authorProfile.fullName} username={authorProfile.username} profilePicUrl={authorProfile.profilePicUrl} >
      <div className="flex items-center gap-2">
        <Button variant={isFollowing ? "outline" : "default"} onClick={handleFollowUser} disabled={followPending} size={"sm"}>
          {followPending && <ButtonLoader />}
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"iconSm"} className="data-[state=open]:bg-slate-100 data-[state=open]:dark:bg-slate-800">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem className="gap-2 flex-start" onClick={handleFollowUser} disabled={isUpdating}>
              {isFollowing ? (
                <>
                  <UserRoundMinus className="w-4 h-4" />
                  <span>Unfollow</span>
                </>
              ) : (
                <>
                  <UserRoundPlus className="w-4 h-4" />
                  <span>Follow</span>
                </>
              )}
            </DropdownMenuItem> */}
            <DropdownMenuItem className="gap-2 flex-start">
              <LinkIcon className="w-4 h-4" />
              <span>Copy link</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/posts/${post.id}`} className="gap-2 flex-start">
                <ExternalLink className="w-4 h-4" />
                <span>Go to post</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </User>
  )
};

const PostHeaderSkeleton = () => (
  <div className="flex items-start justify-start gap-4">
    <Skeleton className="h-10 w-10 rounded-full aspect-square" />
    <Skeleton className="h-6 w-24" />
  </div>
)

export { PostHeader, PostHeaderSkeleton };