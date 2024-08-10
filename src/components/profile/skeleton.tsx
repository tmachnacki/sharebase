import { Skeleton } from "@/components/ui/skeleton";

const ProfileHeaderSkeleton = () => (
  <div className="flex flex-row gap-8 sm:flex-row">
    <div className="grid w-fit flex-shrink-0 place-items-center self-center sm:self-auto">
      <Skeleton className="aspect-square h-48 w-48 rounded-xl md:h-36 md:w-36 lg:h-48 lg:w-48" />
    </div>

    <div className="space-y-4">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-8 w-72" />
      <Skeleton className="h-8 w-36" />
    </div>
  </div>
);

const ProfilePostsSkeleton = () => (
  <div className="group/posts grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 ">
    <Skeleton className="aspect-square rounded-none" />
    <Skeleton className="aspect-square rounded-none" />
    <Skeleton className="aspect-square rounded-none" />
    <Skeleton className="aspect-square rounded-none" />
    <Skeleton className="aspect-square rounded-none" />
    <Skeleton className="aspect-square rounded-none" />
  </div>
);

export { ProfileHeaderSkeleton, ProfilePostsSkeleton };
