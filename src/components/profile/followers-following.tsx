import { useEffect, useState } from "react";
import { UserDocument, FollowerFollowing } from "@/types";
import { useUserProfileStore } from "@/store/userProfileStore";
import { firestore } from "@/lib/firebase";

import { toast } from "sonner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { User } from "../shared/user";

type FollowersProps = {
  context: "followers" | "following";
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

// array of either followers or following
const FollowersFollowing = ({ context, open, setOpen }: FollowersProps) => {
  const [users, setUsers] = useState<Array<FollowerFollowing>>([]);
  const [loadingUsers, setLoadingusers] = useState(false);

  const { userProfile } = useUserProfileStore();

  const PAGE_SIZE = 20;
  useEffect(() => {
    const getFollowersFollowingData = async () => {
      if (!userProfile || !open) return;

      if (context === "followers" && userProfile.followers.length === 0) return;
      if (context === "following" && userProfile.following.length === 0) return;

      setLoadingusers(true);

      try {
        const newUsersData: FollowerFollowing[] = [];
        const usersRef = collection(firestore, "users");
        const q =
          context === "followers"
            ? query(
                usersRef,
                where("uid", "in", userProfile.followers),
                orderBy("uid"),
                limit(PAGE_SIZE),
              )
            : query(
                usersRef,
                where("uid", "in", userProfile.following),
                orderBy("uid"),
                limit(PAGE_SIZE),
              );
        const querySnapShot = await getDocs(q);

        querySnapShot.forEach((userDoc) => {
          const userDocSnapData = userDoc.data();
          newUsersData.push({
            uid: userDocSnapData.uid,
            username: userDocSnapData.username,
            fullName: userDocSnapData.fullName,
            profilePicUrl: userDocSnapData.profilePicUrl,
          });
        });
        setUsers(newUsersData);
        setLoadingusers(false);
      } catch (error) {
        toast.error(`Error getting ${context}`, { description: `${error}` });
        setLoadingusers(false);
      }
    };

    open && getFollowersFollowingData();
  }, [context, open, userProfile]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="capitalize">{context}</SheetTitle>
        </SheetHeader>

        {/* infinte scroll */}
        <ScrollArea id={`${context}ScrollArea`}>
          <ul
            className="flex flex-col divide-y divide-slate-200 py-4 dark:divide-slate-800"
            role="list"
          >
            {loadingUsers ? (
              <div className="flex w-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="sr-only">loading</span>
              </div>
            ) : (
              users.map((user) => (
                <User
                  fullName={user.fullName}
                  username={user.username}
                  profilePicUrl={user.profilePicUrl}
                  key={user.uid}
                  className="py-4 first:pt-0 last:pb-0"
                />
              ))
            )}
          </ul>
        </ScrollArea>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant={"outline"}>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const UserProfile = ({ user }: { user: FollowerFollowing }) => (
  <li className="flex flex-row items-center gap-4 py-4 first:pt-0 last:pb-0">
    <div className="flex flex-col items-center justify-start">
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={user.profilePicUrl}
          alt={`${user.username} profile picture`}
        />
        <AvatarFallback>
          <Skeleton className="h-full w-full  rounded-full" />
        </AvatarFallback>
      </Avatar>
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-sm leading-none">{`${user.fullName}`}</span>
      <span className="text-sm leading-none text-slate-500 dark:text-slate-400">{`@${user.username}`}</span>
    </div>
  </li>
);

const UsersSkeleton = () => (
  <li className="flex flex-row items-center gap-4 py-4 first:pt-0 last:pb-0">
    <div className="flex flex-col items-center justify-start">
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-20 rounded-md" />
      <Skeleton className="h-3 w-16 rounded-md" />
    </div>
  </li>
);

export { FollowersFollowing };
