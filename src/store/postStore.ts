import { CommentDocument, PostDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { create } from "zustand";

type IPostStore = {
  posts: Array<PostDocument | DocumentData>;
  createPost: (post: PostDocument | DocumentData) => void;
  deletePost: (post: PostDocument | DocumentData) => void;
	editPost: ({ updatedPostId, caption, tags, location }: {updatedPostId: number, caption: string, tags: string[], location: string}) => void;
  setPosts: (posts: Array<PostDocument | DocumentData>) => void;
  addComment: (postId: string, comment: CommentDocument) => void;
}

const usePostStore = create<IPostStore>((set) => ({
	posts: [],
	createPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
	deletePost: (id) => set((state) => ({ posts: state.posts.filter((post) => post.id !== id) })),
	editPost: ({updatedPostId, caption, tags, location}) => 
		set((state) => ({  	
			posts: state.posts.map((post) => {
				if (post.id === updatedPostId) {
					return {
						...post,
						caption: caption,
						tags: tags,
						location: location
					};
				} else {
					return post;
				}
			})
		})),
	setPosts: (posts) => set({ posts }),
	addComment: (postId, comment) =>
		set((state) => ({
			posts: state.posts.map((post) => {
				if (post.id === postId) {
					return {
						...post,
						comments: [...post.comments, comment],
					};
				}
				return post;
			}),
		})),
}));

export { usePostStore, type IPostStore };