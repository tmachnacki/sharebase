import { PostDocument } from "@/types";


const ProfilePost = ({ post }: PostDocument) => (
  <div 
    className="w-full h-auto bg-center bg-cover aspect-square group-hover/posts:opacity-50 hover:!opacity-100 transition-opacity" 
    role="img" 
    aria-description={""} 
    style={{ backgroundImage: `url('/img_post_1.png')` }} 
  />
)

export { ProfilePost };