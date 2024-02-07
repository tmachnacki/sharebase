import { useState } from 'react'
import { useAuthStore } from '@/store/authStore';
import { useUserProfileStore } from '@/store/userProfileStore';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ButtonLoader } from '../shared/button-loader';
import { useFollowUser } from '@/hooks/useFollowUser';
import { FollowersFollowing } from './followers-following';
import { EditProfile } from './edit';
import { UserDocument } from '@/types';
import { DocumentData } from 'firebase/firestore';

const ProfileHeader = () => {
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const authUser = useAuthStore((state) => state.user);

  const { followPending, isFollowing, handleFollowUser } = useFollowUser(userProfile?.uid);

  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const isOwnProfileAndAuth = authUser && authUser?.username === userProfile?.username;


  return (
    <>
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
            {isOwnProfileAndAuth ? (
              <Button variant={'outline'} className='grow sm:grow-0' onClick={() => setEditOpen(true)}>
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
            <Button
              variant={"ghost"}
              className=''
              onClick={() => {
                setFollowersOpen(true);
              }}
            >
              <span className='mr-1 font-semibold'>{userProfile?.followers?.length}</span>
              <span className='font-thin'>followers</span>
            </Button>
            <Button
              variant={"ghost"}
              className=''
              onClick={() => {
                setFollowingOpen(true);
              }}
            >
              <span className='mr-1 font-semibold'>{userProfile?.following?.length}</span>
              <span className='font-thin'>following</span>
            </Button>
          </div>
          <div className='font-semibold'>{userProfile?.fullName}</div>
          <div className="">{userProfile?.bio}</div>
        </div>
      </div>

      {/* dialogs */}
      {/* edit */}
      <EditProfile isOpen={editOpen} onOpenChange={setEditOpen} onClose={() => setEditOpen(false)} />

      {/* followers */}
      <FollowersFollowing context='followers' open={followersOpen} setOpen={setFollowersOpen} />

      {/* following */}
      <FollowersFollowing context='following' open={followingOpen} setOpen={setFollowingOpen} />
    </>
  )
}

export { ProfileHeader };