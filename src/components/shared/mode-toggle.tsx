import { Moon, Sun, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/shared/theme-provider"
import { cn } from "@/lib/utils"
import { useIsDesktop } from "@/hooks/useIsDesktop"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export function ModeToggle({ className }: { className?: string }) {
	const { setTheme } = useTheme()
	const isDesktop = useMediaQuery("(min-width: 768px)");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{isDesktop ? (
					<Button variant="ghost" className={cn("relative h-10 font-normal text-base group data-[state=open]:bg-slate-200 data-[state=open]:dark:bg-slate-900 data-[state=open]:text-slate-950 data-[state=open]:dark:text-slate-50", className)}>
						<Sun className="h-6 w-6 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
						<span>Theme</span>
						<ChevronRight className="w-4 h-4 absolute top-1/2 right-2 -translate-y-[50%] opacity-0 group-hover:opacity-100 transition-opacity group-data-[state=open]:opacity-100" />
					</Button>
				) : (
					<Button role="button" className={cn("h-6 w-6 p-0 bg-transparent dark:bg-transparent hover:bg-transparent", className)}>
						<Sun className="h-6 w-6 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
				)}

			</DropdownMenuTrigger>
			<DropdownMenuContent align={isDesktop ? "end" : "end"} side={isDesktop ? "right" : "left"}>
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
