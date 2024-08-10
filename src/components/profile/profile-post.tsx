import { PostDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useProgressiveImage } from "@/hooks/useProgressiveImage";
import { cn } from "@/lib/utils";

const ProfilePost = ({ post }: { post: PostDocument | DocumentData }) => {
  const { sourceLoaded } = useProgressiveImage(post.imgUrl);

  return (
    <Link
      className={cn(
        "group/post relative flex aspect-square h-auto w-full cursor-pointer flex-col justify-center rounded-sm bg-cover bg-center shadow-xl transition-[box-shadow] hover:shadow-purple-7/30 dark:hover:shadow-purple-6/30",
        !sourceLoaded && "animate-pulse bg-slate-200 dark:bg-slate-800",
      )}
      role="img"
      aria-description={post.caption}
      style={{ backgroundImage: `url("${post.imgUrl}")` }}
      to={`/posts/${post.id}`}
    >
      <ul className="mx-auto flex translate-y-2 flex-row gap-4 rounded-full border border-slate-700 bg-slate-950 p-4 text-slate-50  opacity-0 backdrop-blur-sm transition-all duration-200 ease-in-out group-hover/post:-translate-y-0 group-hover/post:bg-opacity-60 group-hover/post:opacity-100">
        <li className="flex flex-row items-center gap-2">
          <Heart className="h-5 w-5 fill-current" aria-label="likes" />
          <span>{post.likes.length}</span>
        </li>
        <li className="flex flex-row items-center gap-2">
          <MessageCircle
            className="h-5 w-5 fill-current"
            aria-label="comments"
          />
          <span>{post.comments.length}</span>
        </li>
      </ul>
    </Link>
  );
};

export { ProfilePost };
