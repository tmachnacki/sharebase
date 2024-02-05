import { PostDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { Heart, MapPin, MessageCircle } from "lucide-react"; 

const ProfilePost = ({post}: {post?: PostDocument | DocumentData}) => (
  <div 
    className="w-full h-auto bg-center bg-cover aspect-square group-hover/posts:opacity-75 hover:!opacity-100 transition group/post flex flex-col justify-end px-2 cursor-pointer " 
    role="img" 
    aria-description={""} 
    style={{ backgroundImage: `url('/img_post_1.png')` }} 
  >
    <ul className="flex flex-col gap-2 p-4 transition-all duration-300 ease-in-out translate-y-2 rounded-lg opacity-0 group-hover/post:bg-opacity-50 group-hover/post:opacity-100 group-hover/post:-translate-y-2 backdrop-blur-sm bg-slate-950 text-slate-50">
      <li className="flex flex-row items-center gap-2">
        <Heart className="w-6 h-6 text-purple-400" aria-hidden="true" />
        <span>342 Likes</span>
      </li>
      <li className="flex flex-row items-center gap-2">
        <MessageCircle className="w-6 h-6 text-purple-400" aria-hidden="true" />
        <span>15 Comments</span>
      </li>
    </ul>
  </div>
)

export { ProfilePost };