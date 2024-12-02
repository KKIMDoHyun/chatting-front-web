import { useCallback, useEffect, useRef, useState } from "react";

import { useLocation, useParams } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";

import {
  GetMessagesRes,
  useEnhancedMessages,
} from "@apis/Chat/useGetEnhancedMessages";
import { QUERY_KEYS } from "@apis/QUERY_KEYS";

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
  const setRoomNotice = useSetAtom(RoomNoticeAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const isNearBottomRef = useRef<boolean>(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const [messages, setMessages] = useState<TChatMessageDetail[]>([]);

  const queryClient = useQueryClient();

  const {
    data,
    fetchPreviousMessages,
    fetchNextMessages,
    isFetchingPreviousMessages,
    isFetchingNextMessages,
  } = useEnhancedMessages({ roomId: roomId ?? "" });

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;

    const { clientHeight, scrollHeight } = containerRef.current;
    containerRef.current.scrollTo({
      top: scrollHeight - clientHeight,
      behavior: "smooth",
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current || !data) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop === 0 && data.hasPreviousContents && messages.length > 0) {
        prevScrollHeightRef.current = scrollHeight;
        fetchPreviousMessages(messages[0].id);
      }

      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      isNearBottomRef.current = isAtBottom;

      if (isAtBottom && data.hasNextContents && messages.length > 0) {
        fetchNextMessages(messages[messages.length - 1].id);
      }
    }, 150);
  }, [data, messages, fetchPreviousMessages, fetchNextMessages]);

  const handleNewMessage = useCallback(
    (data: CallbackProps) => {
      const newMessage = data as TChatMessageDetail;
      if (newMessage.roomId !== roomId) return;

      // queryClient를 통해 캐시 데이터 업데이트
      queryClient.setQueryData(
        QUERY_KEYS.CHAT.messages(JSON.stringify({ roomId })),
        (oldData: GetMessagesRes | undefined) => {
          if (!oldData) return oldData;

          const updatedMessages = [...oldData.contents];
          if (!updatedMessages.some((msg) => msg.id === newMessage.id)) {
            updatedMessages.push(newMessage);
          }

          return {
            ...oldData,
            contents: updatedMessages,
          };
        }
      );

      // 로컬 상태도 업데이트
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.id === newMessage.id)) {
          return prevMessages;
        }

        const updatedMessages = [...prevMessages, newMessage];

        if (newMessage.senderId === myInfo?.id || isNearBottomRef.current) {
          requestAnimationFrame(scrollToBottom);
        }

        return updatedMessages;
      });
    },
    [roomId, queryClient, myInfo?.id, scrollToBottom]
  );

  const handleNewNotice = useCallback(
    (data: CallbackProps) => {
      const newNotice = data as TChatMessageDetail;
      if (newNotice.roomId === roomId) {
        setRoomNotice(newNotice);
      }
    },
    [roomId, setRoomNotice]
  );

  useEffect(() => {
    isInitialLoadRef.current = true;
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [location]);

  useEffect(() => {
    if (!data) return;

    // 데이터 설정
    setMessages(data.contents);

    // 초기 로드 시에만 스크롤 위치 조정
    if (isInitialLoadRef.current && containerRef.current) {
      requestAnimationFrame(() => {
        if (!containerRef.current) return;

        // standardMessageId의 인덱스 찾기
        const targetIndex = data.contents.findIndex(
          (msg) => msg.id === data.standardMessageId
        );

        // standardMessageId가 존재하고 마지막 메시지인 경우
        if (targetIndex === data.contents.length - 1) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
        // standardMessageId가 존재하고 중간에 있는 경우
        else if (targetIndex > -1) {
          const { scrollHeight, clientHeight } = containerRef.current;
          const messageHeight = scrollHeight / data.contents.length;
          const targetScrollPosition = messageHeight * targetIndex;

          containerRef.current.scrollTop = Math.max(
            0,
            targetScrollPosition - clientHeight / 2
          );
        }
        // standardMessageId가 없는 경우 맨 아래로
        else {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        isInitialLoadRef.current = false;
      });
    }
  }, [data]);

  useEffect(() => {
    if (!containerRef.current || messages.length === 0) return;

    if (prevScrollHeightRef.current) {
      const newScrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTop =
        newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0;
    }
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

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
