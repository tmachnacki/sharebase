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
import { useSavePost } from "@/hooks/useSavePost";


type PostFooterProps = {
  post: PostDocument | DocumentData;
  // authorProfile: UserDocument | DocumentData;
  className?: string;
}

const PostFooter = ({ post, className }: PostFooterProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const { handleLikePost, isLiked, likes } = useLikePost(post);
  const { isSaved, isSaving, handleSavePost } = useSavePost(post.id);

  const timestamp: Timestamp = post.createdAt;
  const timeAgo = toTimeAgo(timestamp);

  const iconButtonClassName = "h-8 rounded-full";
  const iconClassName = "h-4 w-4";

  return (
    <div className={cn("pt-2 space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* like */}
          <Button
            variant={isLiked ? "primary" : "ghost"}
            size={"sm"}
            className={cn(
              iconButtonClassName,
            )}
            onClick={handleLikePost}
          >
            <Heart
              aria-label="like post"
              className={cn(
                iconClassName,
                "mr-2",
                isLiked && "fill-current"
              )}
            />
            {likes}
          </Button>
          
          {/* save */}
          <Button 
            variant={isSaved ? "primary" : "ghost"}
            size={"sm"}
            className={cn(
              iconButtonClassName,
            )}
            onClick={handleSavePost}
          >
            <Bookmark
              aria-label="save post"
              className={cn(
                iconClassName,
                isSaved && "fill-current"
              )}
            />
          </Button>

          {/* comments */}
          <Button variant={"ghost"} size={"sm"} className="rounded-full " onClick={() => setIsCommentsOpen(true)}>
            <MessageCircle
              aria-label="comment on post"
              className={`${iconClassName} mr-2`}
            />
            {post.comments.length}
          </Button>
          <CommentsModal isOpen={isCommentsOpen} setIsOpen={setIsCommentsOpen} post={post} />
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