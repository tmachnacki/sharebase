import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Home, Compass, Bookmark, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

import { useLogout } from "@/hooks/useLogout";
import { CreatePost } from "../shared/createPost";
import { useState } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "../shared/mode-toggle";
import { Logo } from "../shared/logo";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { useAuthStore } from "@/store/authStore";


const navItemClassName = "p-2 rounded-md relative hover:bg-slate-200 dark:hover:bg-slate-900 gap-4 flex-start transition-colors hover:text-slate-950 hover:dark:text-slate-50"



const Nav = () => {
	const { pathname } = useLocation();
	const { handleLogout, isLoggingOut } = useLogout();
	const [openCreatePost, setOpenCreatePost] = useState(false);
	const authUser = useAuthStore((state) => state.user);

	const isDesktop = useIsDesktop();
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
			icon: <Bookmark className={iconClassNames} />,
			link: `/saved`,
			label: "Saved",
		},
	];

	return (
		<>
			{/* desktop */}
			<nav
				className={cn(
					"w-full h-full max-w-[16rem]  py-6 px-4 text-slate-500 dark:text-slate-400 hidden md:flex flex-col gap-6 rounded-e-3xl ",
					// "shadow-[10px_0px_60px_-15px] shadow-black dark:shadow-white",
					"border-r dark:border-r-purple-5/40 border-r-purple-4/40 "
				)}
			>
				<Link to={"/"} className="flex items-baseline  gap-2 ">
					<Logo className="h-8 w-8 translate-y-0.5" />
					<h1 className="font-semibold text-slate-900 dark:text-slate-50 text-2xl">ShareBase</h1>
				</Link>

				<ul className="flex flex-col flex-1 w-full h-full gap-2 list-none x" role="navigation">
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
									" text-slate-950 dark:text-slate-50 ",
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

					<ModeToggle className={navItemClassName} />
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

			{/* mobile */}
			<nav className="absolute bottom-0 z-50 bg-slate-50/50 dark:bg-slate-950/50 shadow backdrop-blur flex md:hidden w-full items-center justify-between h-12 p-2 text-slate-500 dark:text-slate-400 rounded-t-2xl border-t dark:border-t-purple-5/40 border-t-purple-4/40 ">
				{navItems.map((navItem) => (
					<Link to={navItem.link} key={navItem.link}>{navItem.icon}</Link>
				))}
				<ModeToggle />
			</nav>
		</>
	);
};

export { Nav };
