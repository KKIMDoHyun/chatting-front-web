import { useEffect, useRef } from "react";

import { useCheckRead } from "@apis/Chat/useCheckRead";

import { TChatMessageDetail } from "@typings/Chat";

export const useChatRoomReadStatus = (
  roomId: string,
  messages: TChatMessageDetail[]
) => {
  const { mutate: checkRead } = useCheckRead();
  const prevRoomIdRef = useRef<string | null>(null);

  useEffect(() => {
    const handleFocus = () => {
      if (roomId && messages.length > 0) {
        checkRead({ roomId });
      }
    };

    // roomId가 비어있거나 이전 roomId와 다를 때 체크
    if (prevRoomIdRef.current !== null && prevRoomIdRef.current === roomId) {
      // 이전 채팅방에서 나가는 경우
      if (messages.length > 0) {
        checkRead({ roomId: prevRoomIdRef.current });
      }
    }

    // 현재 roomId 저장
    prevRoomIdRef.current = roomId ?? null;

    // 포커스 이벤트 리스너 등록
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [roomId, messages, checkRead]);
};
