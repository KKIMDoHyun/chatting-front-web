import { useParams } from "react-router-dom";

import { useChatRoomReadStatus } from "@hooks/useChatRoomReadStatus";

import { MessageForm } from "@pages/Chat/Components/ChatView/MessageForm";

import { ChatMessage } from "./ChatMessage";
import { RoomInfo } from "./RoomInfo";

export const ChatView = () => {
  const { id: roomId } = useParams<{ id: string }>();

  useChatRoomReadStatus(roomId ?? "");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-shrink grow basis-0 flex-col overflow-hidden">
        <RoomInfo />
        <ChatMessage />
      </div>
      <MessageForm />
    </div>
  );
};
