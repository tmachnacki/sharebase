import { Post } from "@/components/post/post";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


const Home = () => {
  return (
    <ScrollArea className="w-full h-full">
      <div className="flex justify-center flex-1 w-full h-full max-w-4xl gap-8 py-8 mx-auto">

        <div className="flex flex-col items-center gap-12 grow">
          <Post />
          <Post />
          <Post />
        </div>

        <div className="flex-col items-center hidden w-full max-w-xs lg:flex ">
          right col
        </div>
      </div>
      <ScrollBar   />
    </ScrollArea>
  );
};

export { Home };
