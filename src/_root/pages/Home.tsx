import { Post } from "@/components/post/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stat } from "@/components/profile/stat";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { Posts } from "@/components/post/posts";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/hooks/useLogout";
import { User } from "@/components/shared/user"; 


const Home = () => {
  // const [authUser, authUserLoading] = useAuthState(auth);
  const authUser = useAuthStore((state) => state.user)
  const { handleLogout, isLoggingOut, error } = useLogout();


  return (
    <ScrollArea className="w-full h-full">
      <div className="flex justify-center flex-1 w-full h-full max-w-4xl gap-16 py-8 mx-auto relative">

        {/* posts */}
        <Posts />

        <div className="flex-col items-center  hidden w-full max-w-xs lg:flex sticky">
          {authUser && (
            // <div className="flex flex-row items-center justify-between w-full">
            //   <div className="flex flex-row gap-4 items-center">
            //     <Link to={`/users/${authUser?.username}`}>
            //       <Avatar className="h-10 w-110">
            //         <AvatarImage src={authUser?.profilePicUrl} alt={`${authUser?.fullName} profile picture`}>
            //         </AvatarImage>
            //         <AvatarFallback><Skeleton className="w-full h-full rounded-full aspect-square" /></AvatarFallback>
            //       </Avatar>
            //     </Link>

            //     <div className="flex flex-col gap-2">
            //       <Link to={`/users/${authUser?.username}`} className="text-sm leading-none text-slate-900 dark:text-slate-50 block truncate">
            //         {authUser.fullName}
            //       </Link>
            //       <Link to={`/users/${authUser?.username}`} className="text-slate-500 dark:text-slate-400 leading-none text-sm block truncate">
            //         @{authUser?.username}
            //       </Link>
            //     </div>
            //   </div>

            //   <Button variant={"ghost"} size={"sm"} className="text-purple-5 hover:text-purple-6 dark:hover:text-purple-4" disabled={isLoggingOut} onClick={handleLogout}> 
            //     Log out
            //   </Button>
            // </div>
            <User fullName={authUser.fullName} username={authUser.username} profilePicUrl={authUser.profilePicUrl}>
              <Button variant={"ghost"} size={"sm"} className="text-purple-5 hover:text-purple-6 dark:hover:text-purple-4" disabled={isLoggingOut} onClick={handleLogout}> 
                Log out
              </Button>
            </User>
          )}


          {/* <Card className="flex flex-col items-center  p-8 gap-8 w-full">

            <Avatar className="h-36 w-36">
              <AvatarImage src={`${authUser?.profilePicUrl}`} />
              <AvatarFallback>{authUser?.fullName}</AvatarFallback>
            </Avatar>

            <div className="w-full flex flex-row items-center justify-center gap-3">
              <Stat number={14} label="posts" className="flex-1" />
              <Separator orientation="vertical" className="" />
              <Stat number={593} label="followers" className="flex-1" />
              <Separator orientation="vertical" className="" />
              <Stat number={428} label="following" className="flex-1"/>
            </div>


          </Card> */}
        </div>
      </div>
      <ScrollBar />
    </ScrollArea>
  );
};

export { Home };
