import { UserDocument } from "@/types";
import { useEffect, useState } from "react"


type Follower = Omit<UserDocument, "email" | "profileBannerUrl" | "bio" | "createdAt" | "followers" | "following" | "posts" | "saves" | "tagged">

const useGetFollowers = () => {
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [followersData, setFollowersData] = useState<Array<Follower>>([]);

  useEffect(() => {
    

  }, []);


  return { loadingFollowers, followersData };
}

export { useGetFollowers };