import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/authStore";
import { Posts } from "@/components/post/posts";
import { useLogout } from "@/hooks/useLogout";
import { User } from "@/components/shared/user";
import { SuggestedUsers } from "@/components/home/suggested-users";

const Home = () => {
  const authUser = useAuthStore((state) => state.user);
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <ScrollArea className="h-full w-full">
      <div className="relative mx-auto flex h-full w-full max-w-4xl flex-1 justify-center gap-8 px-6 pb-20 pt-8 md:py-8 xl:gap-12 ">
        {/* posts */}
        <Posts />

        <section className="hidden w-full max-w-[18rem] flex-shrink-0 flex-grow-0 flex-col items-center lg:flex ">
          {authUser && (
            <div className="flex w-full flex-col">
              <User
                fullName={authUser.fullName}
                username={authUser.username}
                profilePicUrl={authUser.profilePicUrl}
              >
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="text-purple-5 hover:bg-purple-1 hover:text-purple-6 dark:hover:text-purple-4"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </User>

              <h4 className="pb-4 pt-12 ">Suggested Users</h4>
              <SuggestedUsers />
            </div>
          )}
        </section>
      </div>
      <ScrollBar />
    </ScrollArea>
  );
};

export { Home };
