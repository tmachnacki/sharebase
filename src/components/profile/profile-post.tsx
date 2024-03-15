import { PostDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { Heart, MapPin, MessageCircle } from "lucide-react"; 
import { Link } from "react-router-dom";

const ProfilePost = ({post}: {post: PostDocument | DocumentData}) => (
  <div 
    className="w-full h-auto bg-center bg-cover aspect-square group/post cursor-pointer rounded-sm flex flex-col justify-center transition-[box-shadow] shadow-xl hover:shadow-purple-7/30 dark:hover:shadow-purple-6/30" 
    role="img" 
    aria-description={""} 
    style={{ backgroundImage: `url("${post.imgUrl}")` }} 
  >
    <ul className="flex flex-row gap-4 p-4 mx-auto transition-all duration-200 ease-in-out translate-y-2 rounded-full border  border-slate-700 opacity-0 group-hover/post:bg-opacity-60 group-hover/post:opacity-100 group-hover/post:-translate-y-0 backdrop-blur-sm bg-slate-950 text-slate-50">
      <li className="flex flex-row items-center gap-2">
        <Heart className="w-5 h-5 fill-current" aria-label="likes" />
        <span>{post.likes.length}</span>
      </li>
      <li className="flex flex-row items-center gap-2">
        <MessageCircle className="w-5 h-5 fill-current" aria-label="comments" />
        <span>{post.comments.length}</span>
      </li>
    </ul>
  </div>
)

export { ProfilePost };