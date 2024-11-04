import { useCallback, useEffect, useRef, useState } from "react";

import { useLocation } from "react-router-dom";

import { TChatMessageDetail } from "@typings/Chat";

type UseScrollHandlerProps = {
  messages: TChatMessageDetail[];
};

export const useScrollHandler = ({ messages }: UseScrollHandlerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);
  const isNearBottomRef = useRef<boolean>(true);
  const location = useLocation();
  const [pendingImageCount, setPendingImageCount] = useState(0);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // 이미지 로딩 추적을 위한 함수들
  const incrementPendingImages = useCallback(() => {
    setPendingImageCount((count) => count + 1);
  }, []);

  const decrementPendingImages = useCallback(() => {
    setPendingImageCount((count) => Math.max(0, count - 1));
  }, []);

  // 이미지 로딩 감지 및 처리
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const images = container.getElementsByTagName("img");

    // 현재 보이는 모든 이미지에 대한 로딩 상태 추적
    Array.from(images).forEach((img) => {
      if (!img.complete) {
        incrementPendingImages();

        const handleLoad = () => {
          decrementPendingImages();
        };

        img.addEventListener("load", handleLoad);
        img.addEventListener("error", handleLoad); // 에러 시에도 카운트 감소

        return () => {
          img.removeEventListener("load", handleLoad);
          img.removeEventListener("error", handleLoad);
        };
      }
    });
  }, [messages, decrementPendingImages, incrementPendingImages]);

  // 이미지 로딩 완료 후 스크롤 조정
  useEffect(() => {
    if (pendingImageCount === 0) {
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
    }
  }, [pendingImageCount, messages, scrollToBottom]);

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
