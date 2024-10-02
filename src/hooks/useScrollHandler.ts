import { useCallback, useEffect, useRef } from "react";

import { useLocation } from "react-router-dom";

import { TChatMessageDetail } from "@typings/Chat";

type UseScrollHandlerProps = {
  messages: TChatMessageDetail[];
  loadPreviousMessages: () => Promise<void>;
  hasPreviousMessages: boolean | undefined;
};

export const useScrollHandler = ({
  messages,
  loadPreviousMessages,
  hasPreviousMessages,
}: UseScrollHandlerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const isNearBottomRef = useRef<boolean>(true);
  const location = useLocation();

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop === 0 && hasPreviousMessages) {
        loadPreviousMessages();
      }
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
    }
  }, [hasPreviousMessages, loadPreviousMessages]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (containerRef.current) {
      if (prevScrollHeightRef.current) {
        const newScrollHeight = containerRef.current.scrollHeight;
        containerRef.current.scrollTop =
          newScrollHeight - prevScrollHeightRef.current;
        prevScrollHeightRef.current = 0;
      } else if (isInitialLoadRef.current) {
        scrollToBottom();
        isInitialLoadRef.current = false;
      } else if (isNearBottomRef.current) {
        scrollToBottom();
      }
    }
  }, [messages, scrollToBottom]);

  // 채팅방 이동 시 스크롤을 맨 아래로 이동
  useEffect(() => {
    scrollToBottom();
    isInitialLoadRef.current = true;
  }, [location.pathname, scrollToBottom]);

  return {
    containerRef,
    prevScrollHeightRef,
    scrollToBottom,
  };
};
