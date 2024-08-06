import { ChatDocument, MessageDocument } from "@/types";
import { DocumentData } from "firebase/firestore";
import { create } from "zustand";

// type IChatStore = {
//   chats: Array<ChatDocument | DocumentData>;
//   setChats: (chats: Array<ChatDocument | DocumentData>) => void;
//   createChat: (chat: ChatDocument | DocumentData) => void;
//   addMessage: (
//     chatId: string,
//     messageText: string,
//     lastUpdatedAt: Date,
//   ) => void;
// };

// const useChatStore = create<IChatStore>((set) => ({
//   chats: [],
//   setChats: (chats) => set({ chats }),
//   createChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
//   addMessage: (chatId, messageText, lastUpdatedAt) =>
//     set((state) => ({
//       chats: state.chats.map((chat) => {
//         if (chat.id === chatId) {
//           return {
//             ...chat,
//             lastMessageText: messageText,
//             lastUpdatedAt: lastUpdatedAt,
//           };
//         }
//         return chat;
//       }),
//     })),
// }));

type IChatStore = {
  currentChatId: string | null;
  setCurrentChatId: (currentChatId: string | null) => void;
};

const useChatStore = create<IChatStore>((set) => ({
  currentChatId: null,
  setCurrentChatId: (chatId: string | null) => set({ currentChatId: chatId }),
}));

export { useChatStore, type IChatStore };
