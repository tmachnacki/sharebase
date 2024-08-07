import { create } from "zustand";

type IChatStore = {
  currentChatId: string | null;
  setCurrentChatId: (currentChatId: string | null) => void;
};

const useChatStore = create<IChatStore>((set) => ({
  currentChatId: null,
  setCurrentChatId: (chatId: string | null) => set({ currentChatId: chatId }),
}));

export { useChatStore, type IChatStore };
