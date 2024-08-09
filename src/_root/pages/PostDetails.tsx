import { ProfilePost } from "@/components/profile/profile-post";
import { PostsGrid } from "@/components/shared/posts-grid";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMorePostsFromAuthor } from "@/hooks/useGetMorePostsFromAuthor";
import { useGetPostDetailsById } from "@/hooks/useGetPostDetailsById";
import { useGetUserProfileById } from "@/hooks/useGetProfileById";
import { MapPin } from "lucide-react";
import { useParams } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PostHeader, PostHeaderSkeleton } from "@/components/post/post-header";
import { PostFooter } from "@/components/post/post-footer";
import { useEffect, useRef, useState } from "react";
import usePostComment from "@/hooks/usePostComment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonLoader } from "@/components/shared/button-loader";
import { CommentDocument } from "@/types";
import { Comment } from "@/components/post/comment";

export const PostDetails = () => {
  const { postid } = useParams();
  const { isLoadingPost, posts } = useGetPostDetailsById(postid);
  // const { posts } = usePostStore();
  // const postData = posts.filter((post) => post.id === postid)[0];
  const postData = posts[0];

  const authorId: string | undefined = postData?.createdBy;

  const { isLoadingAuthorPosts, moreAuthorPosts } = useGetMorePostsFromAuthor(
    authorId,
    postid,
  );
  const { isLoadingUser, userProfile } = useGetUserProfileById(authorId);

  const noPostsFound =
    !isLoadingAuthorPosts && authorId && moreAuthorPosts.length === 0;
  const authorNotFound = !isLoadingUser && !userProfile;
  const postNotFound = !postData && !isLoadingPost;

  const [comment, setComment] = useState("");
  const { isCommenting, handlePostComment } = usePostComment();

  const endOfCommentsRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postid) return;
    await handlePostComment(postid, comment);
    setComment("");
  };

  const handleCommentButtonClick = () => {
    if (!commentInputRef.current) return;
    commentInputRef.current.focus();
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (!endOfCommentsRef.current || !endOfCommentsRef) return;
      endOfCommentsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        // inline: "start",
      });
    };

    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [postData?.comments.length]);

  if (postNotFound) {
    return (
      <div className="p-content container space-y-8 px-4 text-center md:px-6">
        Post not found
      </div>
    );
  }
  if (authorNotFound) {
    return (
      <div className="p-content container space-y-8 px-4 text-center md:px-6">
        Author not found
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-content container space-y-8 px-4 md:px-6">
        <section className="mx-auto w-full max-w-4xl">
          {isLoadingUser ? (
            <Card
              className="grid grid-cols-1 overflow-hidden lg:grid-cols-2"
              variant={"solid"}
            >
              <Skeleton className="aspect-square w-full rounded-none"></Skeleton>

              {/* comments and info */}
              <div className="flex w-full flex-col px-4 py-6">
                <PostHeaderSkeleton />
              </div>
            </Card>
          ) : (
            postData && (
              <Card
                className="grid grid-cols-1 bg-transparent dark:bg-transparent lg:grid-cols-2"
                variant={"border"}
              >
                {/* image */}
                <div className="hidden h-full w-full flex-col items-center justify-center border-r-[1px] border-slate-200 dark:border-slate-800 lg:flex">
                  <img
                    className="hidden h-auto w-full object-center lg:block"
                    src={postData?.imgUrl}
                    alt={postData?.caption}
                  />
                </div>

                {/* comments and info */}
                <div className="flex w-full flex-col overflow-hidden lg:justify-between">
                  <div className=" border-b-[1px] border-slate-200 p-6 dark:border-slate-800">
                    <PostHeader authorProfile={userProfile!} post={postData} />
                    <p className="py-6 text-sm">{postData?.caption}</p>
                    {postData?.location && (
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="mr-2 h-4 w-4" />
                        {postData?.location}
                      </div>
                    )}
                  </div>

                  {/* image */}

                  <img
                    className="block h-auto w-full  lg:hidden"
                    src={postData?.imgUrl}
                    alt={postData?.caption}
                  />

                  {/* <div className="relative w-full"> */}
                  {/* <div className="absolute h-full w-full "> */}
                  <ScrollArea className="h-72 w-full flex-grow lg:h-48">
                    {postData.comments.length === 0 ? (
                      <div className=" flex h-full w-full flex-col items-center justify-center space-y-2 p-6  text-sm text-slate-500 dark:text-slate-400  ">
                        <span>It's quiet here...</span>
                        {/* <Button
                            variant={"ghost"}
                            size={"sm"}
                            className="text-purple-5"
                            onClick={handleCommentButtonClick}
                          >
                            Add a comment
                          </Button> */}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 p-6">
                        {postData.comments.map((comment: CommentDocument) => (
                          <Comment
                            comment={comment}
                            key={`${comment.createdAt}-${comment.createdBy}`}
                          />
                        ))}
                        <div
                          className="-mt-4 h-0"
                          ref={endOfCommentsRef}
                          aria-hidden="true"
                        ></div>
                      </div>
                    )}
                    <ScrollBar />
                  </ScrollArea>
                  {/* </div> */}
                  {/* </div> */}

                  <div className="space-y-4  border-t-[1px] border-slate-200 px-6 pb-6 pt-4 dark:border-slate-800">
                    {postData && (
                      <PostFooter
                        post={postData}
                        focusCommentInput={handleCommentButtonClick}
                      />
                    )}

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
                  </div>
                </div>
              </Card>
            )
          )}
        </section>

        <Separator />

        <section className="w-full ">
          <h2 className="mb-8 flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-400">
              More posts from
            </span>
            {isLoadingUser ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span>{` ${userProfile?.username}`}</span>
            )}
          </h2>

          {noPostsFound ? (
            <div className="flex w-full items-center justify-center text-slate-500">
              No posts found
            </div>
          ) : (
            <PostsGrid loading={isLoadingAuthorPosts}>
              {moreAuthorPosts.slice(0, 5).map((post) => (
                <ProfilePost post={post} key={post.id} />
              ))}
            </PostsGrid>
          )}
        </section>
      </div>

      <ScrollBar />
    </ScrollArea>
  );
};
