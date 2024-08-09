import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserDocument } from "@/types";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Loader2, UsersRound } from "lucide-react";
import { firestore } from "@/lib/firebase";
import { toast } from "sonner";
import { User } from "../shared/user";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type TaggedPopoverProps = {
  tags: string[];
};

export const TaggedPopover = ({ tags }: TaggedPopoverProps) => {
  const [taggedUsers, setTaggedUsers] = useState<
    Array<UserDocument | DocumentData>
  >([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [open, setOpen] = useState(false);
  const [canFetch, setCanFetch] = useState(true);

  useEffect(() => {
    const getTaggedUsers = async () => {
      console.log("getting tagged users");
      setIsLoadingUsers(true);
      const q = query(
        collection(firestore, "users"),
        where("fullName", "in", tags),
      );

      try {
        const querySnapshot = await getDocs(q);
        const fetchedUsers: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ ...doc.data(), id: doc.id });
        });
        setTaggedUsers(fetchedUsers);
        setIsLoadingUsers(false);
        setCanFetch(false);
      } catch (error) {
        console.error(error);
        toast.error("Error getting tagged users", { description: `${error}` });
        setIsLoadingUsers(false);
      }
    };

    if (canFetch && open && !!tags && tags.length > 0) getTaggedUsers();
  }, [open, tags]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="h-8 rounded-full border border-slate-100 dark:border-slate-800"
            >
              <UsersRound
                aria-label="users tagged in this post"
                className={`${"h-4 w-4"} mr-2`}
              />
              {tags.length}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Tags</TooltipContent>
      </Tooltip>

      <PopoverContent>
        <ScrollArea className="h-auto max-h-72 w-full">
          <div className="flex flex-col gap-4">
            {isLoadingUsers ? (
              <div className="flex w-full items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              taggedUsers.map((user) => (
                <User
                  fullName={user.fullName}
                  username={user.username}
                  profilePicUrl={user.profilePicUrl}
                  key={user.uid}
                  className=""
                />
              ))
            )}
          </div>

          <ScrollBar />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
