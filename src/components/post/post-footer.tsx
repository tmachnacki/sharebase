import useLikePost from "@/hooks/useLikePost";
import usePostComment from "@/hooks/usePostComment";
import { useAuthStore } from "@/store/authStore";
import { CommentDocument, PostDocument, UserDocument } from "@/types";
import { DocumentData, type Timestamp } from "firebase/firestore";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { cn, toTimeAgo } from "@/lib/utils";
import { Input } from "../ui/input";
import { ButtonLoader } from "../shared/button-loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CommentsModal } from "./comments-modal";


type PostFooterProps = {
  post: PostDocument | DocumentData;
  authorProfile: UserDocument | DocumentData | null;
  className?: string;
}

const PostFooter = ({ post, authorProfile, className }: PostFooterProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const { handleLikePost, isLiked, likes } = useLikePost(post);

  const timestamp: Timestamp = post.createdAt;
  const timeAgo = toTimeAgo(timestamp);

  const isSaved = authUser ? post.id in authUser.saves : false;

  return (
    <div className={cn("pt-2 space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* like */}
          <Button
            variant={"ghost"}
            size={"sm"}
            className={cn(
              "rounded-full items-center",
              isLiked && "text-purple-5 hover:text-purple-5 dark:hover:text-purple-5"
            )}
            onClick={handleLikePost}
          >
            <Heart
              aria-label="like"
              className={cn(
                "h-5 w-5 mr-2",
                isLiked && "fill-current"
              )}
            />
            {likes}
          </Button>

          {/* comments */}
          <Button variant={"ghost"} size={"sm"} className="rounded-full " onClick={() => setIsCommentsOpen(true)}>
            <MessageCircle
              aria-label="comment"
              className="h-5 w-5 mr-2"
            />
            {post.comments.length}
          </Button>
          <CommentsModal isOpen={isCommentsOpen} setIsOpen={setIsCommentsOpen} post={post} />

          {/* save */}
          <Button variant={"ghost"} size={"sm"} className="rounded-full">
            <Bookmark
              aria-label="save"
              className="h-5 w-5"
            />
          </Button>
        </div>

        {/* timestamp */}
        <span className=" text-slate-500 text-sm">
          {timeAgo}
        </span>
      </div>
    </div>
  )
};

export { PostFooter };