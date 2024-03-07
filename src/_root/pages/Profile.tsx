import { Link, useParams } from 'react-router-dom'
import { useGetUserProfileByUsername } from '@/hooks/useGetProfileByUsername';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProfileHeaderSkeleton } from '@/components/profile/skeleton';
import { ProfileHeader } from '@/components/profile/header';

import { Grid3X3, UserSquare  } from 'lucide-react';
import { ProfilePosts } from '@/components/profile/profile-posts';
import { useAuthStore } from '@/store/authStore';

const Profile = () => {
  const { username } = useParams();
  const { isLoadingUser, userNotFound, userProfile } = useGetUserProfileByUsername(username);
  const authUser = useAuthStore((state) => state.user);

  const isOwnPage = username === authUser?.username;

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
            <TabsList className={`grid grid-cols-2 w-64 mx-auto`}>
              <TabsTrigger value='posts' className='w-full h-full'>
                <Grid3X3 className='w-4 h-4 mr-2' />
                Posts
              </TabsTrigger>

              <TabsTrigger value='tagged' className='w-full h-full'>
                <UserSquare className='w-4 h-4 mr-2' />
                Tagged
              </TabsTrigger>
            </TabsList>

            <TabsContent value='posts' >
              <ProfilePosts userId={userProfile?.uid} />
            </TabsContent>

            <TabsContent value='tagged' >
              Tagged In
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