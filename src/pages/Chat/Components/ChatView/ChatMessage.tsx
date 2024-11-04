import { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import { useAtomValue } from "jotai";

import { useGetInitialMessages } from "@apis/Chat/useGetInitialMessages";

import { changeDate } from "@utils/changeDate";
import { checkDisplayProfile } from "@utils/checkDisplayProfile";
import { createGroupedMessageStructure } from "@utils/groupMessagesByDate";

import { useScrollHandler } from "@hooks/useScrollHandler";
import { useWebSocketSubscription } from "@hooks/useWebSocketSubscription";

import { TChatMessageDetail } from "@typings/Chat";
import { CreateMessageEvent } from "@typings/WebsocketMessage.type";
import { CallbackProps } from "@typings/WebsocketProvider.type";

import { MyInfoAtom } from "@stores/UserStore";

import { MessageItem } from "./MessageItem";
import { useChatRoomReadStatus } from "./useChatRoomReadStatus";

export const ChatMessage = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<TChatMessageDetail[]>([]);
  const myInfo = useAtomValue(MyInfoAtom);

  const { data } = useGetInitialMessages({
    roomId: roomId ?? "",
  });

  useChatRoomReadStatus(roomId ?? "", messages);

  const { containerRef } = useScrollHandler({
    messages,
  });

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
    [roomId]
  );

  useEffect(() => {
    if (data) {
      const allMessages = [...data.messages.content];
      setMessages(allMessages);
    }
  }, [data]);

  useWebSocketSubscription("MESSAGE_CREATED", handleNewMessage);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto overflow-x-hidden px-[20px] pt-[20px]"
    >
      {createGroupedMessageStructure(messages).map(
        ({ date, groupedMessagesByUser }) => (
          <div key={date} className="flex flex-col">
            <div className="self-center rounded-xl bg-slate-200 px-4 py-1 text-sm">
              {date}
            </div>
            {groupedMessagesByUser.map((group) =>
              group.map((message, messageIndex) => {
                const isLastInGroup = messageIndex === group.length - 1;

                return (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isCurrentUser={message.senderId === myInfo?.id}
                    displayProfile={checkDisplayProfile(
                      group,
                      message,
                      messageIndex,
                      myInfo
                    )}
                    // isStandardMessage={message.id === data?.standardMessage?.id}
                    timeValue={changeDate(dayjs(message.createdAt))}
                    showTime={isLastInGroup}
                  />
                );
              })
            )}
          </div>
        )
      )}
    </div>
  );
};
