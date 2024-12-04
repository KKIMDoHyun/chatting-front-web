import { useContext, useEffect, useRef } from "react";

import { useCheckRead } from "@apis/Chat/useCheckRead";

import { WebSocketContext } from "@components/Websocket/WebsocketProvider";

export const useChatRoomReadStatus = (roomId: string) => {
  const { mutate: checkRead } = useCheckRead();
  const prevRoomIdRef = useRef<string | null>(null);
  const isFirstMountRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { sendRequest } = useContext(WebSocketContext);

  const debouncedCheckRead = (id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      checkRead({ roomId: id });
      sendRequest({
        type: "ROOM_FOCUSED",
        data: { roomId },
      });
    }, 100);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && roomId) {
        debouncedCheckRead(roomId);
      } else if (document.visibilityState === "hidden" && roomId) {
        sendRequest({
          type: "ROOM_UNFOCUSED",
          data: { roomId },
        });
      }
    };

    const handleWindowFocus = () => {
      if (roomId) {
        debouncedCheckRead(roomId);
      }
    };

    const handleWindowBlur = () => {
      if (roomId) {
        sendRequest({
          type: "ROOM_UNFOCUSED",
          data: { roomId },
        });
      }
    };

    if (prevRoomIdRef.current && prevRoomIdRef.current !== roomId) {
      // 이전 채팅방이 있고, 채팅방이 변경되었을 때 이전 채팅방에 UNFOCUSED 이벤트 전송
      sendRequest({
        type: "ROOM_UNFOCUSED",
        data: { roomId: prevRoomIdRef.current },
      });
    }

    if (
      !isFirstMountRef.current &&
      roomId &&
      prevRoomIdRef.current !== roomId
    ) {
      debouncedCheckRead(roomId);
    }

    isFirstMountRef.current = false;
    prevRoomIdRef.current = roomId;

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("blur", handleWindowBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, checkRead, sendRequest]);
};
