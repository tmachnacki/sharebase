import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Home, Compass, Bookmark, LogOut, Plus, MoreHorizontal, UserSearch, PlusSquare } from "lucide-react";
import { cn } from "@/lib/utils";

import { useLogout } from "@/hooks/useLogout";
import { CreatePost } from "../shared/createPost";
import { useState } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "../shared/mode-toggle";
import { Logo } from "../shared/logo";
import { useAuthStore } from "@/store/authStore";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Search from "../shared/search";


const navItemClassName = "p-2 rounded-md relative hover:bg-slate-200 dark:hover:bg-slate-900 gap-4 flex-start transition-colors hover:text-slate-950 hover:dark:text-slate-50"



const Nav = () => {
	const { pathname } = useLocation();
	const { handleLogout, isLoggingOut } = useLogout();
	const [openCreatePost, setOpenCreatePost] = useState(false);
	const [openSearch, setOpenSearch] = useState(false);
	const authUser = useAuthStore((state) => state.user);

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
			icon: <Bookmark className={iconClassNames} />,
			link: `/saved`,
			label: "Saved",
		},
	];

	const isCurrentPage = (path: string) => {
		return pathname === path;
	}


	return (
		<>
			{isDesktop ? (
				// {/* desktop */}
				<nav
					className={cn(
						"w-full h-full max-w-[16rem]  py-6 px-4 text-slate-500 dark:text-slate-400 hidden md:flex flex-col gap-6 rounded-e-3xl relative",
						// "shadow-[10px_0px_60px_-15px] shadow-black dark:shadow-white",
						"border-r dark:border-r-purple-5/40 border-r-purple-4/40 "
					)}
				>
					<Link to={"/"} className="flex items-baseline  gap-2 ">
						<Logo className="h-8 w-8 translate-y-0.5" />
						<h1 className="font-semibold text-slate-900 dark:text-slate-50 text-2xl">ShareBase</h1>
					</Link>

					<ul className="flex flex-col flex-1 w-full h-full gap-2 list-none " role="navigation">
						{navItems.map((navItem) => (
							<li className="relative" key={navItem.label}>
								{isCurrentPage(navItem.link) && (
									<span
										aria-hidden="true"
										className="absolute w-4 h-6 rounded -left-7 top-1/2 -translate-y-[50%] bg-purple-5"
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
									aria-current={isCurrentPage(navItem.link) ? "page" : "false"}
								>
									{navItem.icon}
									{navItem.label}
								</Link>
							</li>
						))}
						<li>
							<button className={`${navItemClassName} w-full`} onClick={() => setOpenSearch(true)}>
								<UserSearch className={iconClassNames} />
								<span>Search</span>
							</button>
						</li>
						<li>
							<Button
								variant={"primary-shadow"}
								className={cn("w-full", navItemClassName, "pl-2")}
								onClick={() => setOpenCreatePost(true)}
							>
								<PlusSquare className={iconClassNames} />
								Create
							</Button>
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
			) : (
				<>
					{/* mobile */}
					<nav className="absolute bottom-0 z-50 bg-slate-50/50 dark:bg-slate-950/50 shadow backdrop-blur flex md:hidden w-full items-center justify-evenly h-12 p-2 text-slate-500 dark:text-slate-400 rounded-t-2xl border-t dark:border-t-purple-5/40 border-t-purple-4/40 overflow-hidden">
						<Link
							to={navItems[0].link}
							className={cn(
								"relative",
								isCurrentPage(navItems[0].link) &&
								" text-slate-950 dark:text-slate-50 ",
							)}
							aria-current={isCurrentPage(navItems[0].link) ? "page" : "false"}
						>
							{isCurrentPage(navItems[0].link) && (
								<span
									aria-hidden="true"
									className="absolute w-8 h-1.5 rounded-b -top-3.5 left-1/2 -translate-x-[50%] bg-purple-5"
								>
									{" "}
								</span>
							)}
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
							{isCurrentPage(navItems[1].link) && (
								<span
									aria-hidden="true"
									className="absolute w-10 h-1.5 rounded-b -top-3.5 -left-[9px] bg-purple-5"
								>
									{" "}
								</span>
							)}
							{navItems[1].icon}
						</Link>

						{/* dummy element for spacing */}
						<div className="" aria-hidden="true"></div>

						<Link
							to={navItems[2].link}
							className={cn(
								"relative",
								isCurrentPage(navItems[2].link) &&
								" text-slate-950 dark:text-slate-50 ",
							)}
							aria-current={isCurrentPage(navItems[2].link) ? "page" : "false"}
						>
							{isCurrentPage(navItems[2].link) && (
								<span
									aria-hidden="true"
									className="absolute w-10 h-1.5 rounded-b -top-3.5 -left-[9px] bg-purple-5"
								>
									{" "}
								</span>
							)}
							{navItems[2].icon}
						</Link>

						<MoreHorizontal className={iconClassNames} />

						{/* <ModeToggle  className={cn(" text-slate-950 dark:text-slate-50 ",)}  /> */}
					</nav>
					<Button 
						className="absolute z-[50] bottom-0 left-1/2 -translate-x-[50%] rounded-full -translate-y-1/2 h-12 w-12" 
						variant={"primary"} 
						size={"icon"} 
						onClick={() => setOpenCreatePost(true)}
					>
						<Plus className="w-5 h-5" />
					</Button>
				</>
			)}

			{/* create post modal */}
			<CreatePost open={openCreatePost} setOpen={setOpenCreatePost} />

			{/* search modal */}
			<Search open={openSearch} setOpen={setOpenSearch} />
		</>
	);
};

export { Nav };
