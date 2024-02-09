import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

type UserProps = {
  username: string;
  fullName: string;
  profilePicUrl: string;
  children?: React.ReactNode;
  className?: string;
}

const User = ({ username, fullName, profilePicUrl, children, className }: UserProps) => {
  return (
    <div 
      className={cn(
        "flex flex-row items-center justify-between w-full",
        className
      )}
    >
      <div className="flex flex-row gap-4 items-center">
        <Link to={`/users/${username}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage src={profilePicUrl} alt={`${fullName} profile picture`}>
            </AvatarImage>
            <AvatarFallback className="text-sm w-full h-full rounded-full aspect-square">
              {/* <Skeleton className="w-full h-full rounded-full aspect-square" /> */}
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col gap-2">
          <Link to={`/users/${username}`} className="text-sm leading-none text-slate-900 dark:text-slate-50 block truncate">
            {fullName}
          </Link>
          <Link to={`/users/${username}`} className="text-slate-500 dark:text-slate-400 leading-none text-sm block truncate">
            @{username}
          </Link>
        </div>
      </div>

      {children && children}

    </div>
  )
}

export { User };

