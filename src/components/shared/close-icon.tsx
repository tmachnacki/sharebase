import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const CloseIcon = ({ className }: { className: string }) => (
  <Button
    variant={"ghost"}
    size={"iconSm"}
    className={cn(
      "opacity-80 group-hover:opacity-100 active:opacity-100 focus:opacity-100",
      className
    )} 
  >
    <X className="w-4 h-4 " />
    <span className="sr-only">Close</span>
  </Button>
)

export { CloseIcon }