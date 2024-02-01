import { useEffect, useState } from "react";
import { UserDocument, FollowerFollowing } from "@/types";

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
          <div className="flex flex-col gap-4">
            {loadingUsers ? (
              <>
                <UsersSkeleton />
                <UsersSkeleton />
                <UsersSkeleton />
                <UsersSkeleton />
              </>
            ) : (
              usersData.map((user) => )
            )}
          </div>
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

const UserProfle = (user: FollowerFollowing) => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col items-center justify-center">
      <Avatar>
        <AvatarImage src={} />
        <AvatarFallback>

        </AvatarFallback>
      </Avatar>
    </div>
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 rounded-md w-36" />
      <Skeleton className="rounded-md h-18 w-36" />
    </div>
  </div>
)

const UsersSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col items-center justify-center">
      <Skeleton className="w-24 h-24 rounded-full" />
    </div>
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 rounded-md w-36" />
      <Skeleton className="rounded-md h-18 w-36" />
    </div>
  </div>
)

export { FollowersFollowing };