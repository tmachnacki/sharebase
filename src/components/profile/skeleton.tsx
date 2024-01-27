import { Skeleton } from "@/components/ui/skeleton";

const ProfileHeaderSkeleton = () => (
  <div className="flex flex-row gap-8">
    <div className="grid place-items-center grow-0 shrink-0 w-full max-w-xs">
      <Skeleton className="w-48 h-48 rounded-full" />
    </div>

    <div className="space-y-4">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-8 w-72" />
      <Skeleton className="h-8 w-36" />
    </div>
  </div>
)


const ProfilePostsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 group/posts ">
    <Skeleton className="rounded-none aspect-square" />
    <Skeleton className="rounded-none aspect-square" />
    <Skeleton className="rounded-none aspect-square" />
    <Skeleton className="rounded-none aspect-square" />
    <Skeleton className="rounded-none aspect-square" />
    <Skeleton className="rounded-none aspect-square" />
  </div>
)

export { ProfileHeaderSkeleton, ProfilePostsSkeleton };


