import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, UserRoundMinus, Link as LinkIcon, ExternalLink, Heart, MessageCircle, Bookmark } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PostDocument } from "@/types";


type PostProps = {
  authorId: string;
  authorUrl: string;
  authorProfilePicUrl: string;
  authorUsername: string;
  location: string;
  tags: string[];
};

const Post = ({ post }: { post?: PostDocument }) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card className="w-full px-4 py-6 space-y-6" variant={"solid"}>
      {/* header */}
      <div className="flex-between">
        <div className="gap-4 flex-start">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Link to={`/users/JDoe`}>john_doe</Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"iconSm"} className="data-[state=open]:bg-slate-100 data-[state=open]:dark:bg-slate-800">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem className="gap-2 flex-start">
              <UserRoundMinus className="w-4 h-4" />
              <span>Unfollow</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 flex-start">
              <LinkIcon className="w-4 h-4" />
              <span>Copy link</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 flex-start">
              <ExternalLink className="w-4 h-4" />
              <span>Go to post</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* post description by author */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        <span>Check out this cool picture of the sunset on the coast</span>
      </div>

      {/* image */}
      <div className="w-full h-auto bg-center bg-cover rounded-2xl aspect-square" role="img" aria-description="image posted by john_doe" style={{ backgroundImage: `url('/img_post_1.png')`}}>
      </div>

      {/* actions */}
      <div className="gap-4 flex-start text-purple-5">
        <span role="button">
          <Heart className="w-6 h-6" />
          <span className="sr-only">Like</span>
        </span>
        <span role="button">
          <MessageCircle className="w-6 h-6" />
          <span className="sr-only">Comment</span>
        </span>
        <span role="button" className="ms-auto">
          <Bookmark className="w-6 h-6" />
          <span className="sr-only">Save</span>
        </span>
      </div>

      {/* comments */}


      {/* add comment */}

    </Card>
  );
};

export { Post };
