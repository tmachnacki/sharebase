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
} from "@/components/ui/command"
import useSearchUser from "@/hooks/useSearchUser";
import { User } from "./user";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type SearchProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search = ({ open, setOpen }: SearchProps) => {
	const  { isLoading, getUserProfile, user, setUser } = useSearchUser();

	const [userInput, setUserInput] = useState("");

	const handleSubmitUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isLoading) return;
		await getUserProfile(userInput);
	}

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Enter a username..." value={userInput} onValueChange={setUserInput} onSubmit={handleSubmitUser}   />
			<CommandList>
				{isLoading && (
					<Loader2 className="w-6 h-6" />
				)}
				{user && userInput && (
					<CommandItem>
						<User fullName={user?.fullName} profilePicUrl={user?.profilePicUrl} username={user?.username} />
					</CommandItem>
				)}
				{!user && (
					<CommandEmpty>No users found.</CommandEmpty>
				)}
			</CommandList>
		</CommandDialog>
	)
}

export default Search