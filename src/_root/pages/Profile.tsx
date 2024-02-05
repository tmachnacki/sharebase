import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetUserProfileByUsername } from '@/hooks/useGetProfileByUsername';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProfileHeaderSkeleton, ProfilePostsSkeleton } from '@/components/profile/skeleton';
import { ProfileHeader } from '@/components/profile/header';
import { Skeleton } from '@/components/ui/skeleton';

import { Grid3X3, Bookmark} from 'lucide-react';
import { ProfilePost } from '@/components/profile/profile-post';
import { ButtonLoader } from '@/components/shared/button-loader';
import { PostDocument } from '@/types';
import ProfilePosts from '@/components/profile/profile-posts';

const Profile = () => {
  const { username } = useParams();
  const { isLoadingUser, userNotFound, userProfile,  } = useGetUserProfileByUsername(username);

  if (userNotFound) return <UserNotFound />;
  return (
    <ScrollArea className='w-full'>
      <div className="container pt-8 space-y-8">
        {/* header */}
        {!isLoadingUser && userProfile && <ProfileHeader />}
        {isLoadingUser && <ProfileHeaderSkeleton />}

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

            <TabsContent value='posts' >
              <ProfilePosts />
            </TabsContent>

          </Tabs>
        </div>
        {/* end tabs */}
      </div>
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