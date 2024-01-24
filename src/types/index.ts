export type UserDocument = {
  uid: string;
  username: string;
  email: string;
  fullName: string;
  profilePicUrl: string; // avatar
  profileBannerUrl: string; // banner backgorund
  bio: string;
  createdAt: Date;
  followers: string[]; // User IDs
  following: string[]; // User IDs
  posts: string[]; // Post IDs
  saves: string[]; // Post IDs
}

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
}

export type CommentDocument = {
  comment: string;
  createdBy: string; // User ID
  postId: string; // Post ID
  createdAt: Date;
}