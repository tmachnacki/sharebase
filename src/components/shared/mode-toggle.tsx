import { Moon, Sun, ChevronRight, Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/shared/theme-provider";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isDesktop ? (
          <Button
            variant="ghost"
            className={cn(
              "group relative h-10 text-base font-normal data-[state=open]:bg-slate-200 data-[state=open]:text-slate-950 data-[state=open]:dark:bg-slate-900 data-[state=open]:dark:text-slate-50",
              className,
            )}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
            <span>Theme</span>
            <ChevronRight className="absolute right-2 top-1/2 h-4 w-4 -translate-y-[50%] opacity-0 transition-opacity group-hover:opacity-100 group-data-[state=open]:opacity-100" />
          </Button>
        ) : (
          <Button
            role="button"
            className={cn(
              "h-6 w-6 bg-transparent p-0 hover:bg-transparent dark:bg-transparent",
              className,
            )}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isDesktop ? "end" : "end"}
        side={isDesktop ? "right" : "left"}
      >
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
