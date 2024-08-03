import { useFollowUser } from "@/hooks/useFollowUser";
import { User } from "../shared/user";
import { Button } from "../ui/button";
import { ButtonLoader } from "../shared/button-loader";

interface SuggestedUserProps {
  fullName: string;
  username: string;
  profilePicUrl: string;
  uid: string;
}

export const SuggestedUser = ({
  fullName,
  username,
  profilePicUrl,
  uid,
}: SuggestedUserProps) => {
  const { followPending, isFollowing, handleFollowUser } = useFollowUser(uid);
  return (
    <User
      fullName={fullName}
      username={username}
      profilePicUrl={profilePicUrl}
      key={uid}
    >
      <Button
        variant={"ghost"}
        size={"sm"}
        disabled={followPending}
        onClick={handleFollowUser}
        className="ml-4 text-purple-5 hover:bg-purple-1 hover:text-purple-6  dark:hover:text-purple-4"
      >
        {followPending && <ButtonLoader />}
        {isFollowing ? `Unfollow` : `Follow`}
      </Button>
    </User>
  );
};
