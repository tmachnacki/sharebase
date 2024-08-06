import { cn } from "@/lib/utils";
import { MessageDocument } from "@/types";
import { DocumentData } from "firebase/firestore";

export const Message = ({
  message,
  className,
}: {
  message: MessageDocument | DocumentData;
  className?: string;
  authorProfilePicUrl?: string;
}) => {
  return (
    <div className={cn("flex items-center")}>
      <p>{message.text}</p>
    </div>
  );
};
