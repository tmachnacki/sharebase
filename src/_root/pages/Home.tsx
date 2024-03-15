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
import { useLogout } from "@/hooks/useLogout";
import { User } from "@/components/shared/user"; 


const Home = () => {
  const authUser = useAuthStore((state) => state.user)
  const { handleLogout, isLoggingOut } = useLogout();
	const scrollableTargetId = "feed"

  return (
    <ScrollArea className="w-full h-full" id={scrollableTargetId}>
      <div className="flex justify-center flex-1 w-full h-full max-w-4xl gap-8 xl:gap-16 pt-8 pb-20 md:py-8 mx-auto relative">

        {/* posts */}
        <Posts scrollableTargetId={scrollableTargetId}  />

        <div className="flex-col items-center  hidden w-full max-w-xs lg:flex sticky">
          {authUser && (
            <User fullName={authUser.fullName} username={authUser.username} profilePicUrl={authUser.profilePicUrl}>
              <Button variant={"ghost"} size={"sm"} className="text-purple-5 hover:text-purple-6 dark:hover:text-purple-4" disabled={isLoggingOut} onClick={handleLogout}> 
                Log out
              </Button>
            </User>
          )}
        </div>
      </div>
      <ScrollBar />
    </ScrollArea>
  );
};

export { Home };
