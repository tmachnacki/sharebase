import { useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { PostDocument } from "@/types";

import { useGetUserProfileById } from "@/hooks/useGetProfileById";
import { Skeleton } from "../ui/skeleton";
import { DocumentData } from "firebase/firestore";
import { ProfileHeaderSkeleton } from "../profile/skeleton";
import { ProfileHeader } from "../profile/header";
import { PostHeader, PostHeaderSkeleton } from "./post-header";
import { PostFooter } from "./post-footer";


type PostProps = {
  authorId: string;
  authorUrl: string;
  authorProfilePicUrl: string;
  authorUsername: string;
  location: string;
  tags: string[];
};

const Post = ({ post }: { post: PostDocument | DocumentData }) => {
  const { isLoadingUser, userProfile } = useGetUserProfileById(post?.createdBy);

  return (
    <Card className="w-full px-4 py-6" variant={"solid"}>
      {/* header */}
      {isLoadingUser || !userProfile ? <PostHeaderSkeleton /> : <PostHeader post={post} authorProfile={userProfile} />}

      {/* post description by author */}
      <div className="text-sm py-6">
        <span>{post.caption}</span>
      </div>

      {/* image */}
      <div className="w-full h-auto bg-center bg-cover rounded-2xl aspect-square" role="img" aria-description="image posted by john_doe" style={{ backgroundImage: `url("${post.imgUrl}")` }} />

      <PostFooter post={post} authorProfile={userProfile} />

    </Card>
  );
};

export { Post };
