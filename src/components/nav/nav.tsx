import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

import { Home, Compass, Bookmark, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";

import { useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";

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

const Nav = () => {
  const { pathname } = useLocation();
  const { handleLogout, isLoggingOut, error } = useLogout();

  return (
    <nav className="w-full h-full max-w-[16rem] border-r border-r-slate-200 dark:border-r-slate-800 py-6 px-4 text-slate-600 dark:text-slate-400 flex flex-col">
      <ul className="flex flex-col flex-1 w-full h-full gap-1 list-none">
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
                pathname === navItem.link &&
                  " text-slate-950 dark:text-slate-50",
                "p-2 rounded-md relative hover:bg-slate-200 dark:hover:bg-slate-900 gap-4 flex-start transition-colors hover:text-slate-950 dark:hover:text-slate-50  "
              )}
            >
              {navItem.icon}
              {navItem.label}
            </Link>
          </li>
        ))}
      </ul>

      <span
        role="button"
        className={cn(
          "gap-4 p-2 transition-colors rounded-md hover:bg-slate-200 dark:hover:bg-slate-900 flex-start hover:text-slate-950 dark:hover:text-slate-50",
          isLoggingOut && "opacity-50 pointer-events-none"
        )}
        onClick={handleLogout}
      >
        <LogOut className={cn(iconClassNames, "rotate-180")} />
        Logout
      </span>
    </nav>
  );
};

export { Nav };
