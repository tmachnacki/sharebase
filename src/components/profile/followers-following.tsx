import { useEffect, useState } from "react";
import { UserDocument, FollowerFollowing } from "@/types";
import { useUserProfileStore } from "@/store/userProfileStore";
import { storage, firestore } from "@/lib/firebase";
import { useFollowUser } from "@/hooks/useFollowUser";

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
} from "@/components/ui/sheet"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { FirebaseError } from "firebase/app";


type FollowersProps = {
  context: "followers" | "following"
  uids: string[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// array of uids that follow user or that user is following
const FollowersFollowing = ({ context, uids, open, setOpen }: FollowersProps) => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersData, setUsersData] = useState<Array<FollowerFollowing>>([]);
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 20

  useEffect(() => {
    const getFollowersFollowingData = async () => {
      if (!uids || uids.length === 0) return;
      
      setLoadingUsers(true);
      try{
        const newUsersData: FollowerFollowing[] = [];
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("uid", "in", uids ), orderBy("uid"), limit(PAGE_SIZE));
        const querySnapShot = await getDocs(q);

        querySnapShot.forEach((userDoc) => {
          const userDocSnapData = userDoc.data()
          newUsersData.push({
            uid: userDocSnapData.uid,
            username: userDocSnapData.username,
            fullName: userDocSnapData.fullName,
            profilePicUrl: userDocSnapData.profilePicUrl
          })
        })

        setUsersData(newUsersData);
        setLoadingUsers(false)

      } catch (error) {
        toast.error("Error", {description: `${error}`})
        setLoadingUsers(false);
      }
    };

    getFollowersFollowingData();

  }, [uids, context])

  return(
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="capitalize">
            {context}
          </SheetTitle>
        </SheetHeader>

        {/* infinte scroll */}
        <ScrollArea id={`${context}ScrollArea`}>
          <ul className="flex flex-col py-4 divide-y divide-slate-200 dark:divide-slate-800" role="list" >
            {loadingUsers ? (
              <>
                <UsersSkeleton />
                <UsersSkeleton />
                <UsersSkeleton />
                <UsersSkeleton />
              </>
            ) : (
              usersData.map((user) => (
                <UserProfile user={user} key={user.uid}  />
              ))
            )}
          </ul>
        </ScrollArea>

        <SheetFooter>
          <SheetClose asChild> 
            <Button variant={"outline"} >
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const UserProfile = ({ user }: { user: FollowerFollowing }) => (
  <li className="flex flex-row gap-4 items-center py-4 first:pt-0 last:pb-0">
    <div className="flex flex-col items-center justify-start">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.profilePicUrl} alt={`${user.username} profile picture`} />
        <AvatarFallback>
          <Skeleton className="w-full h-full  rounded-full" />
        </AvatarFallback>
      </Avatar>
    </div>
    <div className="flex flex-col gap-2">
      <span className="leading-none text-sm">{`${user.fullName}`}</span>
      <span className="leading-none text-sm text-slate-500 dark:text-slate-400">{`@${user.username}`}</span>
    </div>
  </li>
)

const UsersSkeleton = () => (
  <li className="flex flex-row gap-4 items-center py-4 first:pt-0 last:pb-0">
    <div className="flex flex-col items-center justify-start">
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 rounded-md w-20" />
      <Skeleton className="rounded-md h-3 w-16" />
    </div>
  </li>
)

export { FollowersFollowing };