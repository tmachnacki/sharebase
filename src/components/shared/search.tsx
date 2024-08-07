import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { User } from "./user";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useGetOtherUsers } from "@/hooks/useGetOtherUsers";

type SearchProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Search = ({ open, setOpen }: SearchProps) => {
  // const { isLoading, getUserProfile, user, setUser } = useSearchUser();
  const [userInput, setUserInput] = useState("");
  const { isLoadingUsers, getOtherUsers, users } = useGetOtherUsers();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Enter a username..."
        value={userInput}
        onValueChange={setUserInput}
      />
      <CommandList>
        {isLoadingUsers && <Loader2 className="h-4 w-4 animate-spin" />}
        {!!users &&
          userInput &&
          users.map((user) => (
            <CommandItem key={user.uid}>
              <User
                fullName={user?.fullName}
                profilePicUrl={user?.profilePicUrl}
                username={user?.username}
              />
            </CommandItem>
          ))}
        {!isLoadingUsers && !users && (
          <CommandEmpty>No users found.</CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default Search;
