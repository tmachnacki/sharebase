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
};

const User = ({
  username,
  fullName,
  profilePicUrl,
  children,
  className,
}: UserProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      <div className="flex flex-row items-center gap-4">
        <Link to={`/users/${username}`}>
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={profilePicUrl}
              alt={`${fullName} profile picture`}
            ></AvatarImage>
            <AvatarFallback className="aspect-square h-full w-full rounded-full text-sm">
              {/* <Skeleton className="w-full h-full rounded-full aspect-square" /> */}
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col gap-1">
          <Link
            to={`/users/${username}`}
            className="block truncate text-sm leading-none text-slate-900 hover:underline dark:text-slate-50"
          >
            {fullName}
          </Link>
          <Link
            to={`/users/${username}`}
            className="block truncate text-sm leading-none text-slate-500 hover:underline dark:text-slate-400"
          >
            @{username}
          </Link>
        </div>
      </div>

      {children && children}
    </div>
  );
};

export { User };
