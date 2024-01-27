import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetUserProfileByUsername } from '@/hooks/useGetProfileByUsername';
import { useAuthStore } from '@/store/authStore';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ProfileHeaderSkeleton, ProfilePostsSkeleton } from '@/components/profile/skeleton';
import { Skeleton } from '@/components/ui/skeleton';

import { Grid3X3, Bookmark, Loader2 } from 'lucide-react';
import { ProfilePost } from '@/components/profile/profile-post';
import { EditProfile } from '@/components/profile/edit';

const Profile = () => {
  const { username } = useParams();
  const { isLoadingUser, userProfile } = useGetUserProfileByUsername(username);
  const [followPending, setFollowPending] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const authUser = useAuthStore(state => state.user)

  const isOwnProfileandAuth = authUser && authUser.username === userProfile?.username
  const userNotFound = !isLoadingUser && !userProfile

  if (userNotFound) return <UserNotFound />;

  const onFollow = () => {

  }

  const onUnFollow = () => {

  }

  return (
    <ScrollArea className='w-full'>
      <div className="container space-y-8 pt-8">
        {/* header */}
        {isLoadingUser ? (
          <ProfileHeaderSkeleton />
        ) : (
          <div className="flex flex-row gap-8">
            <div className="grid place-items-center grow-0 shrink-0 w-full max-w-xs">
              <Avatar className='w-48 h-48'>
                <AvatarImage src={userProfile?.profilePicUrl} className='w-full h-full' />
                <AvatarFallback>{userProfile?.fullName}</AvatarFallback>
              </Avatar>
            </div>

            <div className="grow-1 shrink-1 space-y-4">
              <div className="flex gap-4 items-center">
                <h1 className='font-thin text-2xl'>{userProfile?.username}</h1>
                {isOwnProfileandAuth ? (
                  <Button variant={'outline'} className='grow sm:grow-0' onClick={() => setShowEditProfile(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant={'primary'} className='grow sm:grow-0' disabled={followPending}>
                    {followPending && <Loader2 className='m-4 w-4 mr-2' />}
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex flex-row justify-start items-center">
                <Button variant={"ghost"} className='pointer-events-none pl-0'>
                  <span className='font-semibold mr-1'>{userProfile?.posts?.length}</span>
                  <span className='font-thin'>posts</span>
                </Button>
                <Button variant={"ghost"} className=''>
                  <span className='font-semibold mr-1'>{userProfile?.followers?.length}</span>
                  <span className='font-thin'>followers</span>
                </Button>
                <Button variant={"ghost"} className=''>
                  <span className='font-semibold mr-1'>{userProfile?.following?.length}</span>
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
            <TabsList className='mx-auto grid grid-cols-2 w-96'>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 group/posts ">
                  {/* {userProfile?.posts.map((post) => (
                    <ProfilePost post={post} />
                  ))} */}

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
  <div className='flex flex-col justify-center items-center mx-auto'>
    <span className='text-2xl'>User Not Found</span>
    <Link to={"/"} className='text-purple-500 w-max mx-auto hover:underline'>Go Home</Link>
  </div>
)

export { Profile }