import useLikePost from "@/hooks/useLikePost";
import { PostDocument } from "@/types";
import { DocumentData, type Timestamp } from "firebase/firestore";
import { useState } from "react";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Bookmark, Tag } from "lucide-react";
import { cn, toTimeAgo } from "@/lib/utils";
import { ButtonLoader } from "../shared/button-loader";
import { CommentsModal } from "./comments-modal";
import { useSavePost } from "@/hooks/useSavePost";
import { TaggedPopover } from "./tagged-popover";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PostFooterProps = {
  post: PostDocument | DocumentData;
  // authorProfile: UserDocument | DocumentData;
  className?: string;
  focusCommentInput?: () => void;
};

const iconButtonClassName = "h-8 rounded-full";
const iconClassName = "h-4 w-4";

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

  return (
    <TooltipProvider delayDuration={400}>
      <div className={cn("space-y-6 pt-2", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* like */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isLiked ? "primary" : "ghost"}
                  size={"sm"}
                  className={cn(
                    iconButtonClassName,
                    !isLiked && "border border-slate-100 dark:border-slate-800",
                  )}
                  onClick={() => handleLikePost()}
                  disabled={isLiking}
                >
                  {isLiking ? (
                    <ButtonLoader className="" />
                  ) : (
                    <Heart
                      aria-label="like post"
                      className={cn(
                        iconClassName,
                        "mr-2",
                        isLiked && "fill-current",
                      )}
                    />
                  )}
                  {likes}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Like</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                {/* save */}
                <Button
                  variant={isSaved ? "primary" : "ghost"}
                  size={"sm"}
                  className={cn(
                    iconButtonClassName,
                    !isSaved && "border border-slate-100 dark:border-slate-800",
                  )}
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
              </TooltipTrigger>
              <TooltipContent>Save</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                {/* comments */}
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="h-8 rounded-full border border-slate-100 dark:border-slate-800"
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
              </TooltipTrigger>
              <TooltipContent>Comments</TooltipContent>
            </Tooltip>

            {/* tags */}
            {!!post.tags && post.tags.length > 0 && (
              <TaggedPopover tags={post.tags} />
            )}

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
    </TooltipProvider>
  );
};

export { PostFooter };
