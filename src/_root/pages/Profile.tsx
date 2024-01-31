import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetUserProfileByUsername } from '@/hooks/useGetProfileByUsername';
import { useAuthStore } from '@/store/authStore';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ProfileHeaderSkeleton, ProfilePostsSkeleton } from '@/components/profile/skeleton';
import { Skeleton } from '@/components/ui/skeleton';

import { Grid3X3, Bookmark} from 'lucide-react';
import { ProfilePost } from '@/components/profile/profile-post';
import { EditProfile } from '@/components/profile/edit';
import { useFollowUser } from '@/hooks/useFollowUser';
import { useUserProfileStore } from '@/store/userProfileStore';
import { ButtonLoader } from '@/components/shared/button-loader';
import { PostDocument } from '@/types';

const Profile = () => {
  const { username } = useParams();
  const { isLoadingUser, userProfile } = useGetUserProfileByUsername(username);
  // const { isLoadingUser, userProfile } = useGetUserProfileById(uid);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const authUser = useAuthStore(state => state.user)
  const currentUserProfile = useUserProfileStore(state => state.userProfile);

  const { followPending, isFollowing, handleFollowUser } = useFollowUser(currentUserProfile?.uid);

  const isOwnProfileandAuth = authUser && authUser.username === userProfile?.username
  const userNotFound = !isLoadingUser && !userProfile

  if (userNotFound) return <UserNotFound />;

  return (
    <ScrollArea className='w-full'>
      <div className="container pt-8 space-y-8">
        {/* header */}
        {isLoadingUser ? (
          <ProfileHeaderSkeleton />
        ) : (
          <div className="flex flex-row gap-8">
            <div className="grid w-full max-w-xs place-items-center grow-0 shrink-0">
              <Avatar className='w-48 h-48'>
                <AvatarImage src={userProfile?.profilePicUrl} className='w-full h-full' />
                <AvatarFallback>{userProfile?.fullName}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4 grow-1 shrink-1">
              <div className="flex items-center gap-4">
                <h1 className='text-2xl font-thin'>{userProfile?.username}</h1>
                {isOwnProfileandAuth ? (
                  <Button variant={'outline'} className='grow sm:grow-0' onClick={() => setShowEditProfile(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    variant={isFollowing ? 'secondary' : 'default'} 
                    className='grow sm:grow-0' 
                    disabled={followPending}
                    onClick={handleFollowUser}
                  >
                    {followPending && <ButtonLoader />}
                    {isFollowing ? `Unfollow` : `Follow`}
                  </Button>
                )}
              </div>
              <div className="flex flex-row items-center justify-start">
                <Button variant={"ghost"} className='pl-0 pointer-events-none'>
                  <span className='mr-1 font-semibold'>{userProfile?.posts?.length}</span>
                  <span className='font-thin'>posts</span>
                </Button>
                <Button variant={"ghost"} className=''>
                  <span className='mr-1 font-semibold'>{userProfile?.followers?.length}</span>
                  <span className='font-thin'>followers</span>
                </Button>
                <Button variant={"ghost"} className=''>
                  <span className='mr-1 font-semibold'>{userProfile?.following?.length}</span>
                  <span className='font-thin'>following</span>
                </Button>
              </div>
              <div className='font-semibold'>{userProfile?.fullName}</div>
              <div className="">{userProfile?.bio}</div>
            </div>
          </div>
        )}
        {/* end header */}

        <Separator />

        {/* tabs */}
        <div className="w-full">
          <Tabs defaultValue='posts' className='space-y-8'>
            <TabsList className='grid grid-cols-2 mx-auto w-96'>
              <TabsTrigger value='posts' className='w-full h-full'>
                <Grid3X3 className='w-4 h-4 mr-2' />
                Posts
              </TabsTrigger>
              <TabsTrigger value='saved' disabled={isLoadingUser}>
                <Bookmark className='w-4 h-4 mr-2' />
                Saved
              </TabsTrigger>
            </TabsList>

            {isLoadingUser ? (
              <ProfilePostsSkeleton />
            ) : (
              <TabsContent value='posts' >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 group/posts ">
                  {userProfile?.posts.map((post: PostDocument) => (
                    <ProfilePost post={post} />
                  ))}

                  <div className="w-full h-auto bg-center bg-cover aspect-square group-hover/posts:opacity-50 hover:!opacity-100 transition-opacity" role="img" aria-description="" style={{ backgroundImage: `url('/img_post_1.png')` }} />
                  <div className="w-full h-auto bg-center bg-cover aspect-square group-hover/posts:opacity-50 hover:!opacity-100 transition-opacity" role="img" aria-description="" style={{ backgroundImage: `url('/img_post_1.png')` }} />
                  <div className="w-full h-auto bg-center bg-cover aspect-square group-hover/posts:opacity-50 hover:!opacity-100 transition-opacity" role="img" aria-description="" style={{ backgroundImage: `url('/img_post_1.png')` }} />
                  <div className="w-full h-auto bg-center bg-cover aspect-square group-hover/posts:opacity-50 hover:!opacity-100 transition-opacity" role="img" aria-description="" style={{ backgroundImage: `url('/img_post_1.png')` }} />
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
        {/* end tabs */}
      </div>

      {/* edit profile dialog */}
      <EditProfile isOpen={showEditProfile} onOpenChange={setShowEditProfile} onClose={() => setShowEditProfile(false)} />
    </ScrollArea >
  )
}

const UserNotFound = () => (
  <div className='flex flex-col items-center justify-center mx-auto'>
    <span className='text-2xl'>User Not Found</span>
    <Link to={"/"} className='mx-auto text-purple-500 w-max hover:underline'>Go Home</Link>
  </div>
)

export { Profile }