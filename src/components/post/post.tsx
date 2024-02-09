import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
} from "@/components/ui/card";
import { MoreHorizontal, UserRoundMinus, Link as LinkIcon, ExternalLink, Heart, MessageCircle, Bookmark, SkipBack } from "lucide-react";

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

import { useGetUserProfileById } from "@/hooks/useGetProfileById";
import { Skeleton } from "../ui/skeleton";
import { DocumentData } from "firebase/firestore";
import { ProfileHeaderSkeleton } from "../profile/skeleton";
import { ProfileHeader } from "../profile/header";
import { PostHeader, PostHeaderSkeleton } from "./post-header";


type PostProps = {
  authorId: string;
  authorUrl: string;
  authorProfilePicUrl: string;
  authorUsername: string;
  location: string;
  tags: string[];
};

const Post = ({ post }: { post: PostDocument | DocumentData },) => {
  const [showComments, setShowComments] = useState(false);

  const { isLoadingUser, userProfile } = useGetUserProfileById(post?.createdBy);

  return (
    <Card className="w-full px-4 py-6 space-y-6" variant={"solid"}>
      {/* header */}
      {isLoadingUser || !userProfile ? <PostHeaderSkeleton /> : <PostHeader post={post} authorProfile={userProfile} />}

      {/* post description by author */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        <span>{post.caption}</span>
      </div>

      {/* image */}
      <div className="w-full h-auto bg-center bg-cover rounded-2xl aspect-square" role="img" aria-description="image posted by john_doe" style={{ backgroundImage: `url("${post.imgUrl}")` }} />

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
