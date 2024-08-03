import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import usePostComment from "@/hooks/usePostComment";
import { CommentDocument, PostDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Comment } from "./comment";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ButtonLoader } from "../shared/button-loader";

type CommentsModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  post: PostDocument | DocumentData;
};

const CommentsModal = ({ isOpen, setIsOpen, post }: CommentsModalProps) => {
  const [comment, setComment] = useState("");
  const { isCommenting, handlePostComment } = usePostComment();

  const endOfCommentsRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePostComment(post.id, comment);
    setComment("");
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (!endOfCommentsRef.current || !endOfCommentsRef) return;
      endOfCommentsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "start",
      });
    };
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen, post.comments.length]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription>See what others are saying</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-72">
          <div className="flex h-full flex-col gap-4">
            {post.comments.length === 0 ? (
              <div className=" flex h-full w-full flex-col items-center justify-center space-y-2 px-6 pt-6  text-sm text-slate-600 dark:text-slate-400  ">
                <span>It's quiet here...</span>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-purple-5"
                  onClick={() => commentInputRef.current?.focus()}
                >
                  Add a comment
                </Button>
              </div>
            ) : (
              post.comments.map((comment: CommentDocument) => (
                <Comment
                  comment={comment}
                  key={`${comment.createdAt}-${comment.createdBy}`}
                />
              ))
            )}
            <div className="" ref={endOfCommentsRef} aria-hidden="true"></div>
          </div>
        </ScrollArea>

        <form
          className="flex w-full items-center gap-2 "
          onSubmit={handleSubmitComment}
        >
          <Input
            className="h-9 w-full flex-shrink flex-grow"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isCommenting}
            placeholder="Say something..."
            ref={commentInputRef}
          />
          <Button disabled={isCommenting} size={"sm"} type="submit">
            {isCommenting && <ButtonLoader />}
            Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export { CommentsModal };
