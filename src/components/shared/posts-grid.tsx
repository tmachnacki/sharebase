import { ComponentPropsWithoutRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PostGridProps = ComponentPropsWithoutRef<"div"> & {
	loading: boolean;
	className?: string;
}

const PostsGrid = ({ loading, children, className }: PostGridProps) => {

	return (
		<div 
			className={cn(
				"grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 group/posts ", 
				className
			)} 
		>
			{loading ? (
				<div className="col-span-full w-full flex items-center justify-center ">
					<Loader2 className="h-6 w-6 animate-spin" />
				</div>
			) : (
				children && children
			)}
		</div>
	)
}

export { PostsGrid };