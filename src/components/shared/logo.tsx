import { cn } from "@/lib/utils";
import React from "react";

type LogoProps = React.ComponentProps<"span"> & {
  className?: string;
}

const Logo = ({ className, ...props }: LogoProps) => (
  <span className={cn("relative w-10 h-10 inline-block", className)} aria-hidden="true" role="img" {...props}>
    <span className="absolute bottom-0 left-0 bg-transparent rounded-full h-3/4 w-3/4 bg-gradient-to-tr from-purple-8 to-purple-5 flex-center">
      <span className="w-3/4 h-3/4 rounded-full bg-zinc-50 dark:bg-zinc-950"></span>
    </span>
    <span className="absolute top-0 right-0 w-1/4 h-1/4 rounded-full bg-gradient-to-tr from-purple-5 to-teal-4"></span>
    <span className="sr-only">SnapWrite Logo</span>
  </span>
)

export { Logo }