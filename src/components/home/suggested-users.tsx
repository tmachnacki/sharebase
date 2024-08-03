import { useGetSuggestedUsers } from "@/hooks/useGetSusggestedUsers";
import { Skeleton } from "../ui/skeleton";
import { SuggestedUser } from "./suggested-user";

export const SuggestedUsers = () => {
  const { isLoading, suggestedUsers } = useGetSuggestedUsers();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {suggestedUsers.map((suggestedUser) => (
        <SuggestedUser
          fullName={suggestedUser.fullName}
          username={suggestedUser.username}
          profilePicUrl={suggestedUser.profilePicUrl}
          uid={suggestedUser.uid}
          key={suggestedUser.uid}
        />
      ))}
    </div>
  );
};
