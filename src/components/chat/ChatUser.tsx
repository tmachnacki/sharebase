import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";

type ChatUserProps = {
  username?: string;
  fullName: string;
  profilePicUrl: string;
  className?: string;
  avatarClassName?: string;
  children?: React.ReactNode;
  asLink?: boolean;
  lastMessageText?: string;
};

export const ChatUser = ({
  username,
  fullName,
  profilePicUrl,
  className,
  avatarClassName,
  children,
  asLink = false,
  lastMessageText,
}: ChatUserProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between overflow-x-hidden text-sm",
        className,
      )}
    >
      {asLink ? (
        <Link
          to={`/users/${username}`}
          className="flex flex-row items-center gap-3"
        >
          <Avatar className={cn("h-12 w-12 text-sm", avatarClassName)}>
            <AvatarImage
              src={profilePicUrl}
              alt={`${fullName} profile picture`}
            ></AvatarImage>
            <AvatarFallback className="aspect-square h-full w-full rounded-full text-inherit">
              {/* <Skeleton className="w-full h-full rounded-full aspect-square" /> */}
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 overflow-x-hidden">
            <div className="block truncate font-semibold leading-none text-slate-900 hover:underline dark:text-slate-50">
              {fullName}
            </div>
            {lastMessageText && (
              <p className="block truncate text-sm leading-none text-slate-500 dark:text-slate-400">
                {lastMessageText}
              </p>
            )}
          </div>
        </Link>
      ) : (
        <div className="flex flex-row items-center gap-3 overflow-x-hidden">
          <Avatar className={cn("h-12 w-12 text-sm", avatarClassName)}>
            <AvatarImage
              src={profilePicUrl}
              alt={`${fullName} profile picture`}
            ></AvatarImage>
            <AvatarFallback className="aspect-square h-full w-full rounded-full text-inherit">
              {/* <Skeleton className="w-full h-full rounded-full aspect-square" /> */}
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 overflow-x-hidden">
            <div className="block truncate font-semibold leading-none text-slate-900 dark:text-slate-50">
              {fullName}
            </div>
            {lastMessageText && (
              <p className="block truncate text-sm leading-none text-slate-500 dark:text-slate-400">
                {lastMessageText}
              </p>
            )}
          </div>
        </div>
      )}

      {children && children}
    </div>
  );
};
