import { ChatDocument, MessageDocument } from "@/types";
import { DocumentData, serverTimestamp } from "firebase/firestore";
import { create } from "zustand";

type IChatStore = {
  chats: Array<ChatDocument | DocumentData>;
  setChats: (chats: Array<ChatDocument | DocumentData>) => void;
  createChat: (chat: ChatDocument | DocumentData) => void;
  addMessage: (chatId: string, message: MessageDocument | DocumentData) => void;
};

const useChatStore = create<IChatStore>((set) => ({
  chats: [],
  setChats: (chats) => set({ chats }),
  createChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [message, ...chat.messages],
            lastUpdatedAt: message.createdAt,
          };
        }
        return chat;
      }),
    })),
}));
