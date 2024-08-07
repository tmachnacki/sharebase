import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Home,
  Compass,
  Bookmark,
  LogOut,
  PlusSquare,
  Send,
  UserRound,
  Sun,
  Moon,
  Monitor,
  SunMoon,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

import { useLogout } from "@/hooks/useLogout";
import { CreatePost } from "../shared/createPost";
import { useState } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "../shared/mode-toggle";
import { Logo } from "../shared/logo";
import { useAuthStore } from "@/store/authStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Search from "../shared/search";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "next-themes";

const navItemClassName =
  "p-2 rounded-md relative hover:bg-slate-200 dark:hover:bg-slate-900 gap-4 flex-start transition-colors hover:text-slate-950 hover:dark:text-slate-50";

const Nav = () => {
  const { pathname } = useLocation();
  const { handleLogout, isLoggingOut } = useLogout();
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const { setTheme } = useTheme();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const iconClassNames = isDesktop ? "w-6 h-6" : "w-5 h-5";

  const navItems = [
    {
      icon: <Home className={iconClassNames} />,
      link: "/",
      label: "Home",
    },
    {
      icon: <Compass className={iconClassNames} />,
      link: "/explore",
      label: "Explore",
    },
    {
      icon: <Send className={iconClassNames} />,
      link: "/chats",
      label: "Messages",
    },
    {
      icon: <Bookmark className={iconClassNames} />,
      link: `/saved`,
      label: "Saved",
    },
  ];

  const isCurrentPage = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {isDesktop ? (
        // {/* desktop */}
        <nav
          className={cn(
            "relative hidden h-screen w-full max-w-[14rem] flex-col gap-8 overflow-y-auto rounded-e-3xl px-4 py-6 text-slate-500 dark:text-slate-400 md:flex",
            // "shadow-[10px_0px_60px_-15px] shadow-black dark:shadow-white",
            "border-r border-r-purple-4/40 dark:border-r-purple-5/40 ",
          )}
        >
          <Link to={"/"} className="flex flex-shrink-0  items-baseline gap-2 ">
            <Logo className="h-8 w-8 translate-y-0.5" />
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              ShareBase
            </h1>
          </Link>

          <ul
            className="flex h-full w-full flex-1 list-none flex-col gap-2 "
            role="navigation"
          >
            {navItems.map((navItem) => (
              <li className="relative" key={navItem.label}>
                {isCurrentPage(navItem.link) && <NavIndicator />}

                <Link
                  to={navItem.link}
                  className={cn(
                    navItemClassName,
                    pathname === navItem.link &&
                      " text-slate-950 dark:text-slate-50 ",
                  )}
                  aria-current={isCurrentPage(navItem.link) ? "page" : "false"}
                >
                  {navItem.icon}
                  {navItem.label}
                </Link>
              </li>
            ))}
            <li>
              <Button
                variant={"primary-shadow"}
                className={cn(
                  "w-full",
                  navItemClassName,
                  "pl-2 hover:text-white",
                )}
                onClick={() => setOpenCreatePost(true)}
              >
                <PlusSquare className={iconClassNames} />
                Create
              </Button>
            </li>
          </ul>

          <ul className="mt-12 flex flex-col gap-2">
            <ModeToggle className={navItemClassName} />
            <li
              role="button"
              className={cn(
                navItemClassName,
                isLoggingOut && "pointer-events-none opacity-50",
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn(iconClassNames, "rotate-180")} />
              Logout
            </li>
          </ul>
        </nav>
      ) : (
        <>
          {/* mobile */}
          <nav className="absolute bottom-0 z-50 flex h-12 w-full items-center justify-evenly overflow-hidden rounded-t-2xl border-t border-t-purple-4/40 bg-slate-50/50 p-2 text-slate-500 shadow backdrop-blur dark:border-t-purple-5/40 dark:bg-slate-950/50 dark:text-slate-400 md:hidden">
            <Link
              to={navItems[0].link}
              className={cn(
                "relative",
                isCurrentPage(navItems[0].link) &&
                  " text-slate-950 dark:text-slate-50 ",
              )}
              aria-current={isCurrentPage(navItems[0].link) ? "page" : "false"}
            >
              {isCurrentPage(navItems[0].link) && <NavIndicator />}
              {navItems[0].icon}
            </Link>
            <Link
              to={navItems[1].link}
              className={cn(
                "relative",
                isCurrentPage(navItems[1].link) &&
                  " text-slate-950 dark:text-slate-50 ",
              )}
              aria-current={isCurrentPage(navItems[1].link) ? "page" : "false"}
            >
              {isCurrentPage(navItems[1].link) && <NavIndicator />}
              {navItems[1].icon}
            </Link>

            <span
              className={cn("relative cursor-pointer")}
              onClick={() => setOpenCreatePost(true)}
              role="button"
            >
              <PlusSquare className="h-5 w-5" />
              <span className="sr-only">Create post</span>
            </span>

            <Link
              to={navItems[2].link}
              className={cn(
                "relative",
                isCurrentPage(navItems[2].link) &&
                  " text-slate-950 dark:text-slate-50 ",
              )}
              aria-current={isCurrentPage(navItems[2].link) ? "page" : "false"}
            >
              {isCurrentPage(navItems[2].link) && <NavIndicator />}
              {navItems[2].icon}
            </Link>

            <Link
              to={navItems[3].link}
              className={cn(
                "relative",
                isCurrentPage(navItems[3].link) &&
                  " text-slate-950 dark:text-slate-50 ",
              )}
              aria-current={isCurrentPage(navItems[2].link) ? "page" : "false"}
            >
              {isCurrentPage(navItems[3].link) && <NavIndicator />}
              {navItems[3].icon}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={authUser?.profilePicUrl} />
                  <AvatarFallback className="text-xs">
                    {getInitials(authUser?.fullName)}{" "}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to={`/users/${authUser?.username}`} className="">
                    <UserRound className="mr-2 h-4 w-4" />
                    <span className="text-sm">Profile</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <SunMoon className="mr-2 h-4 w-4" />
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Monitor className="mr-2 h-4 w-4" />
                        <span>System</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 rotate-180" />
                  <span className="text-sm">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </>
      )}

      {/* create post modal */}
      <CreatePost
        open={openCreatePost}
        setOpen={setOpenCreatePost}
        action="create"
      />

      {/* search modal */}
      <Search open={openSearch} setOpen={setOpenSearch} />
    </>
  );
};

const NavIndicator = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "absolute -left-[9px] -top-3.5 h-1.5 w-10 rounded-b bg-purple-5 md:-left-7 md:top-1/2 md:h-6 md:w-4 md:-translate-y-[50%] md:rounded ",
      className,
    )}
  />
);

export { Nav, NavIndicator };
