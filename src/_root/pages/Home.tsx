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


const Home = () => {
  // const [authUser, authUserLoading] = useAuthState(auth);
  const authUser = useAuthStore((state) => state.user)


  return (
    <ScrollArea className="w-full h-full">
      <div className="flex justify-center flex-1 w-full h-full max-w-4xl gap-8 py-8 mx-auto relative">

        <div className="flex flex-col items-center gap-12 grow">
          <Post />
          <Post />
          <Post />
        </div>

        <div className="flex-col items-center  hidden w-full max-w-sm lg:flex sticky">
          <Card className="flex flex-col items-center  p-8 gap-8 w-full">
            {/* profile pic */}
            <Avatar className="h-36 w-36">
              <AvatarImage src={`${authUser?.profilePicUrl}`} />
              <AvatarFallback>{authUser?.fullName}</AvatarFallback>
            </Avatar>

            {/* stats */}
            <div className="w-full flex flex-row items-center justify-center gap-3">
              <Stat number={14} label="posts" className="flex-1" />
              <Separator orientation="vertical" className="" />
              <Stat number={593} label="followers" className="flex-1" />
              <Separator orientation="vertical" className="" />
              <Stat number={428} label="following" className="flex-1"/>
            </div>


          </Card>
        </div>
      </div>
      <ScrollBar />
    </ScrollArea>
  );
};

export { Home };
