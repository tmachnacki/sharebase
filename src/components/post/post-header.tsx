import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import {
  MoreHorizontal,
  UserRoundMinus,
  Link as LinkIcon,
  ExternalLink,
  UserRoundPlus,
  Pencil,
} from "lucide-react";
import { Button } from "../ui/button";
import { AuthorProfile, PostDocument, UserDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { useFollowUser } from "@/hooks/useFollowUser";
import { ButtonLoader } from "../shared/button-loader";
import { User } from "../shared/user";
import { useAuthStore } from "@/store/authStore";
import { CreatePost } from "../shared/createPost";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { toast } from "sonner";

type PostHeaderProps = {
  post: PostDocument | DocumentData;
  authorProfile: UserDocument | DocumentData;
};

const PostHeader = ({ post, authorProfile }: PostHeaderProps) => {
  const [openEditPost, setOpenEditPost] = useState(false);
  const { handleFollowUser, isFollowing, followPending } = useFollowUser(
    post?.createdBy,
  );
  const authUser = useAuthStore((state) => state.user);
  const isOwnPost = authUser?.uid === post.createdBy;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { pathname } = useLocation();
  const isPostDetailsPage = pathname.includes("/posts/");

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied to clipboard");
  };

  return (
    <>
      <User
        fullName={authorProfile.fullName}
        username={authorProfile.username}
        profilePicUrl={authorProfile.profilePicUrl}
      >
        <div className="flex items-center gap-2">
          {!isOwnPost && (
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={handleFollowUser}
              disabled={followPending}
              size={"sm"}
            >
              {followPending && <ButtonLoader />}
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"iconSm"}
                className="data-[state=open]:bg-slate-100 data-[state=open]:dark:bg-slate-800"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {isOwnPost && (
                <DropdownMenuItem
                  className="flex-start gap-2"
                  onClick={() => setOpenEditPost(true)}
                >
                  <Pencil className="h-4 w-4" />
                  <span>Edit Post</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="flex-start gap-2"
                onClick={() => handleCopyLink()}
              >
                <LinkIcon className="h-4 w-4" />
                <span>Copy link</span>
              </DropdownMenuItem>
              {!isPostDetailsPage && (
                <DropdownMenuItem asChild>
                  <Link to={`/posts/${post.id}`} className="flex-start gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Go to post</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </User>

      {isOwnPost && (
        <CreatePost
          open={openEditPost}
          setOpen={setOpenEditPost}
          action="edit"
          post={post}
        />
      )}
    </>
  );
};

const PostHeaderSkeleton = () => (
  <div className="flex items-start justify-start gap-4">
    <Skeleton className="aspect-square h-10 w-10 rounded-full" />
    <Skeleton className="h-6 w-24" />
  </div>
);

export { PostHeader, PostHeaderSkeleton };
