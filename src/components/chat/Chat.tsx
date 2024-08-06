import { useState, Dispatch, SetStateAction } from "react";
import { User } from "../shared/user";

type ChatProps = {
  chatId: string;

  otherUserProfilePicUrl: string;
  otherUserUsername: string;
  otherUserFullName: string;
  otherUserUid: string;
  lastMessageText: string;
};

export const Chat = ({
  chatId,

  otherUserProfilePicUrl,
  otherUserUsername,
  otherUserFullName,
  otherUserUid,
  lastMessageText,
}: ChatProps) => {
  return <div>Chat</div>;
};
