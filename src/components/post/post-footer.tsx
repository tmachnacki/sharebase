import useLikePost from "@/hooks/useLikePost";
import { PostDocument } from "@/types";
import { DocumentData, type Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Bookmark } from "lucide-react";
import { cn, toTimeAgo } from "@/lib/utils";
import { ButtonLoader } from "../shared/button-loader";
import { CommentsModal } from "./comments-modal";
import { useSavePost } from "@/hooks/useSavePost";

type PostFooterProps = {
  post: PostDocument | DocumentData;
  // authorProfile: UserDocument | DocumentData;
  className?: string;
  focusCommentInput?: () => void;
};

const PostFooter = ({
  post,
  className,
  focusCommentInput,
}: PostFooterProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { handleLikePost, isLiked, likes, isLiking } = useLikePost(post);
  const { isSaved, isSaving, handleSavePost } = useSavePost(post.id);

  const timestamp: Timestamp = post.createdAt;
  const timeAgo = toTimeAgo(timestamp);

  const iconButtonClassName = "h-8 rounded-full";
  const iconClassName = "h-4 w-4";

  return (
    <div className={cn("space-y-6 pt-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* like */}
          <Button
            variant={isLiked ? "primary" : "ghost"}
            size={"sm"}
            className={cn(iconButtonClassName)}
            onClick={() => handleLikePost()}
            disabled={isLiking}
          >
            {isLiking ? (
              <ButtonLoader className="" />
            ) : (
              <Heart
                aria-label="like post"
                className={cn(iconClassName, "mr-2", isLiked && "fill-current")}
              />
            )}
            {likes}
          </Button>

          {/* save */}
          <Button
            variant={isSaved ? "primary" : "ghost"}
            size={"sm"}
            className={cn(iconButtonClassName)}
            onClick={() => handleSavePost()}
            disabled={isSaving}
          >
            {isSaving ? (
              <ButtonLoader className="m-0" />
            ) : (
              <Bookmark
                aria-label="save post"
                className={cn(iconClassName, isSaved && "fill-current")}
              />
            )}
          </Button>

          {/* comments */}
          <Button
            variant={"ghost"}
            size={"sm"}
            className="rounded-full "
            onClick={
              focusCommentInput
                ? focusCommentInput
                : () => setIsCommentsOpen(true)
            }
          >
            <MessageCircle
              aria-label="comment on post"
              className={`${iconClassName} mr-2`}
            />
            {post.comments.length}
          </Button>
          <CommentsModal
            isOpen={isCommentsOpen}
            setIsOpen={setIsCommentsOpen}
            post={post}
          />
        </div>

        {/* timestamp */}
        <span className=" text-sm text-slate-500">{timeAgo}</span>
      </div>
    </div>
  );
};

export { PostFooter };
