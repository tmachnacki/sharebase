import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

import { Home, Compass, Bookmark, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";

import { useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { CreatePost } from "../shared/createPost";
import { useState } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "../shared/mode-toggle";

const iconClassNames = "w-6 h-6";

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
    icon: <Bookmark className={iconClassNames} />,
    link: "/saved",
    label: "Saved",
  },
];

const navItemClassName = "p-2 rounded-md relative hover:bg-slate-200 dark:hover:bg-slate-900 gap-4 flex-start transition-colors hover:text-slate-950 dark:hover:text-slate-50 ;"

const Nav = () => {
  const { pathname } = useLocation();
  const { handleLogout, isLoggingOut, error } = useLogout();
  const [openCreatePost, setOpenCreatePost] = useState(false);

  return (
    <nav className="w-full h-full max-w-[16rem] border-r border-r-slate-200 dark:border-r-slate-800 py-6 px-4 text-slate-500 dark:text-slate-400 hidden md:flex flex-col">
      <ul className="flex flex-col flex-1 w-full h-full gap-2 list-none" role="navigation">
        {navItems.map((navItem) => (
          <li className="relative" key={navItem.label}>
            {pathname === navItem.link && (
              <span
                aria-hidden="true"
                className="absolute w-4 h-6 rounded-md -left-6 top-1/2 -translate-y-[50%] bg-purple-5"
              >
                {" "}
              </span>
            )}

            <Link
              to={navItem.link}
              className={cn(
                navItemClassName,
                pathname === navItem.link &&
                  " text-slate-950 dark:text-slate-50",
              )}
            >
              {navItem.icon}
              {navItem.label}
            </Link>
          </li>
        ))}
        <li>
          <Button
            variant={"primary-shadow"}
            className="w-full"
            onClick={() => setOpenCreatePost(true)}
          >
            Create
          </Button>

          <CreatePost open={openCreatePost} setOpen={setOpenCreatePost} />
        </li>
      </ul>

      <ul className="flex flex-col gap-2">

        <ModeToggle />
        <li
          role="button"
          className={cn(
            navItemClassName,
            isLoggingOut && "opacity-50 pointer-events-none"
          )}
          onClick={handleLogout}
        >
          <LogOut className={cn(iconClassNames, "rotate-180")} />
          Logout
        </li>
      </ul>

    </nav>
  );
};

export { Nav };
