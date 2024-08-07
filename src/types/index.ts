export type UserDocument = {
  uid: string;
  username: string;
  email: string;
  fullName: string;
  profilePicUrl: string; // avatar
  profileBannerUrl: string; // banner backgorund
  bio: string;
  createdAt: Date;
  followers: string[]; // userIDs
  following: string[]; // userIds
  posts: string[]; // Post IDs
  saves: string[]; // Post IDs
  tagged?: string[]; // post IDs
};

export type PostDocument = {
  id: string;
  caption: string;
  imgUrl: string;
  location: string;
  likes: string[]; // User IDs
  comments: CommentDocument[]; // Commments
  tags: string[]; // User IDs
  createdAt: Date;
  createdBy: string; // User ID
};

export type CommentDocument = {
  comment: string;
  createdBy: string; // User ID
  postId: string; // Post ID
  createdAt: Date;
};

export type FollowerFollowing = Omit<
  UserDocument,
  | "email"
  | "profileBannerUrl"
  | "bio"
  | "createdAt"
  | "followers"
  | "following"
  | "posts"
  | "saves"
  | "tagged"
>;

export type AuthorProfile = Omit<
  UserDocument,
  | "email"
  | "profileBannerUrl"
  | "bio"
  | "createdAt"
  | "followers"
  | "following"
  | "posts"
  | "saves"
  | "tagged"
>;

export type MessageDocument = {
  id: string;
  chatId: string;
  createdBy: string;
  text: string;
  createdAt: Date;
};

export type ChatDocument = {
  id: string;
  userOneUid: string;
  userOneUsername: string;
  userOneFullName: string;
  userOneProfilePicUrl: string;
  userTwoUid: string;
  userTwoUsername: string;
  userTwoFullName: string;
  userTwoProfilePicUrl: string;
  createdAt: Date;
  lastUpdatedAt: Date;
  lastMessageText: string;
};
