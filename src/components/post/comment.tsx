import { useGetUserProfileById } from "@/hooks/useGetProfileById";
import { cn } from "@/lib/utils";
import { CommentDocument } from "@/types";
import { toTimeAgo } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useFollowUser } from "@/hooks/useFollowUser";
import { User } from "../shared/user";
import { Button } from "../ui/button";
import { ButtonLoader } from "../shared/button-loader";
import { Skeleton } from "../ui/skeleton";
import { useAuthStore } from "@/store/authStore";

const Comment = ({
  comment,
  className,
}: {
  comment: CommentDocument;
  className?: string;
}) => {
  const { userProfile, isLoadingUser } = useGetUserProfileById(
    comment.createdBy,
  );
  const { isFollowing, followPending, handleFollowUser } = useFollowUser(
    userProfile?.uid,
  );
  const authUser = useAuthStore((state) => state.user);

  const commentTimeAgo = toTimeAgo(comment.createdAt);

  return (
    <div className={cn("space-y-2 text-sm", className)}>
      <div className={"flex gap-2"}>
        {isLoadingUser ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <>
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <Link
                  className="font-semibold leading-none"
                  to={`/users/${userProfile?.username}`}
                >
                  {`${userProfile?.fullName}`}
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit">
                <User
                  fullName={userProfile?.fullName}
                  profilePicUrl={userProfile?.profilePicUrl}
                  username={userProfile?.username}
                >
                  {authUser?.uid !== userProfile?.uid && (
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      disabled={followPending}
                      onClick={handleFollowUser}
                      size={"sm"}
                    >
                      {followPending && <ButtonLoader />}
                      {isFollowing ? `Unfollow` : `Follow`}
                    </Button>
                  )}
                </User>
              </HoverCardContent>
            </HoverCard>
            <span className="leading-none text-slate-500 dark:text-slate-500">
              {commentTimeAgo}
            </span>
          </>
        )}
      </div>

      <div className="leading-none text-slate-600 dark:text-slate-400">
        {isLoadingUser ? <Skeleton className="h-3 w-36" /> : comment.comment}
      </div>
    </div>
  );
};

export { Comment };
