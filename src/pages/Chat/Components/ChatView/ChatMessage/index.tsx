import { useEffect, useRef, useState } from "react";

import { useLocation, useParams } from "react-router-dom";

import { useAtomValue, useSetAtom } from "jotai";

import { useEnhancedMessages } from "@apis/Chat/useGetEnhancedMessages";

import { createGroupedMessageStructure } from "@utils/groupMessagesByDate";

import { useChatRoomReadStatus } from "@hooks/useChatRoomReadStatus";
import { useWebSocketSubscription } from "@hooks/useWebSocketSubscription";

import { TChatMessageDetail } from "@typings/Chat";
import { CallbackProps } from "@typings/WebsocketProvider.type";

import { Spinner } from "@components/Spinner";

import { RoomNoticeAtom } from "@stores/RoomStore";
import { MyInfoAtom } from "@stores/UserStore";

import { MessageGroup } from "./MessageGroup";
import { Notice } from "./Notice";

export const ChatMessage = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const location = useLocation();
  const myInfo = useAtomValue(MyInfoAtom);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const isNearBottomRef = useRef<boolean>(true);
  const [messages, setMessages] = useState<TChatMessageDetail[]>([]);
  const [targetMessageId, setTargetMessageId] = useState<string>("");
  const setRoomNotice = useSetAtom(RoomNoticeAtom);

  const {
    data,
    fetchPreviousMessages,
    fetchNextMessages,
    isFetchingPreviousMessages,
    isFetchingNextMessages,
  } = useEnhancedMessages({ roomId: roomId ?? "" });

  const scrollToMessagePosition = (messageId: string) => {
    if (containerRef.current && messages.length > 0) {
      const targetIndex = messages.findIndex((msg) => msg.id === messageId);
      if (targetIndex !== -1) {
        const totalHeight = containerRef.current.scrollHeight;
        const containerHeight = containerRef.current.clientHeight;
        const approximateMessageHeight = totalHeight / messages.length;
        const targetPosition = approximateMessageHeight * targetIndex;
        containerRef.current.scrollTop = targetPosition - containerHeight / 2;
      }
    }
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (containerRef.current) {
        const { clientHeight, scrollHeight } = containerRef.current;
        containerRef.current.scrollTop = scrollHeight - clientHeight;
      }
    });
  };

  const handleScroll = () => {
    if (containerRef.current && data) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop === 0 && data.hasPreviousContents && messages.length > 0) {
        prevScrollHeightRef.current = scrollHeight;
        fetchPreviousMessages(messages[0].id);
      }

      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      isNearBottomRef.current = isAtBottom;

      if (isAtBottom && data.hasNextPreviousContents && messages.length > 0) {
        fetchNextMessages(messages[messages.length - 1].id);
      }
    }
  };

  const handleNewMessage = (data: CallbackProps) => {
    const newMessage = data as TChatMessageDetail;
    if (newMessage.roomId === roomId) {
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.id === newMessage.id)) {
          return prevMessages;
        }
        const updatedMessages = [...prevMessages, newMessage];

        // 내가 보낸 메시지이거나 스크롤이 하단에 있을 때 스크롤
        if (newMessage.senderId === myInfo?.id || isNearBottomRef.current) {
          requestAnimationFrame(scrollToBottom);
        }

        return updatedMessages;
      });
    }
  };

  const handleNewNotice = (data: CallbackProps) => {
    const newNotice = data as TChatMessageDetail;
    if (newNotice.roomId === roomId) {
      setRoomNotice(newNotice);
    }
  };

  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [location]);

  useEffect(() => {
    if (data) {
      setMessages(data.contents);
      setTargetMessageId(data.standardMessageId);
    }
  }, [data]);

  useEffect(() => {
    if (containerRef.current && messages.length > 0) {
      if (isInitialLoadRef.current) {
        const targetMessageIndex = messages.findIndex(
          (msg) => msg.id === targetMessageId
        );

        if (targetMessageIndex !== -1) {
          scrollToMessagePosition(targetMessageId);
        } else {
          scrollToBottom();
        }
        isInitialLoadRef.current = false;
      } else if (prevScrollHeightRef.current) {
        const newScrollHeight = containerRef.current.scrollHeight;
        containerRef.current.scrollTop =
          newScrollHeight - prevScrollHeightRef.current;
        prevScrollHeightRef.current = 0;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, targetMessageId]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, messages]);

  useWebSocketSubscription("MESSAGE_CREATED", handleNewMessage);
  useWebSocketSubscription("NOTICE_CREATED", handleNewNotice);
  useChatRoomReadStatus(roomId ?? "", messages);

  if (!roomId) return null;

  return (
    <div
      ref={containerRef}
      className="flex h-full flex-col overflow-y-auto overflow-x-hidden"
    >
      <Notice />

      <div className="px-[20px] pt-[20px]">
        {isFetchingPreviousMessages && (
          <div className="flex justify-center py-2">
            <Spinner />
          </div>
        )}

        {createGroupedMessageStructure(messages).map(
          ({ date, groupedMessagesByUser }) => (
            <MessageGroup
              key={date}
              date={date}
              groupedMessagesByUser={groupedMessagesByUser}
              myInfo={myInfo}
              roomId={roomId}
            />
          )
        )}

        {isFetchingNextMessages && (
          <div className="flex justify-center py-2">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
};
