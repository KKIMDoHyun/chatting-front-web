import { useCallback } from "react";

import { TChatMessageDetail } from "@typings/Chat";
import { CreateMessageEvent } from "@typings/WebsocketMessage.type";
import { CallbackProps } from "@typings/WebsocketProvider.type";

type UseWebSocketMessageProps = {
  roomId: string;
  setMessages: React.Dispatch<React.SetStateAction<TChatMessageDetail[]>>;
};

export const useWebSocketMessage = ({
  roomId,
  setMessages,
}: UseWebSocketMessageProps) => {
  const handleNewMessage = useCallback(
    (data: CallbackProps) => {
      const newMessage = data as CreateMessageEvent["data"];
      if (newMessage.roomId === roomId) {
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg.id === newMessage.id)) {
            return prevMessages;
          }
          return [...prevMessages, newMessage];
        });
      }
    },
    [roomId, setMessages]
  );

  return handleNewMessage;
};
