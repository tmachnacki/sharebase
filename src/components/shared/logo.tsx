import { cn } from "@/lib/utils";
import React from "react";

type LogoProps = React.ComponentProps<"span"> & {
  className?: string;
};

const Logo = ({ className, ...props }: LogoProps) => (
  <span
    className={cn("relative inline-block h-10 w-10", className)}
    aria-hidden="true"
    role="img"
    {...props}
  >
    <span className="flex-center absolute bottom-0 left-0 h-3/4 w-3/4 rounded-full bg-transparent bg-gradient-to-tr from-purple-8 to-purple-5"></span>
    <span className="absolute right-0 top-0 h-1/4 w-1/4 rounded-full bg-gradient-to-tr from-purple-5 to-teal-4"></span>
    <span className="sr-only">Sharebase Logo</span>
  </span>
);

export { Logo };
