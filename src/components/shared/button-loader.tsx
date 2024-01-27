import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonLoaderProps = {
  className?: string
}

const ButtonLoader = ({ className }: ButtonLoaderProps) => (
  <Loader2 
    className={cn("h-4 w-4 mr-2 animate-spin", className)}
  />
)

export { ButtonLoader };