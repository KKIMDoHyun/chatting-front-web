import { useEffect, useRef } from "react";

import { useCheckRead } from "@apis/Chat/useCheckRead";

export const useChatRoomReadStatus = (roomId: string) => {
  const { mutate: checkRead } = useCheckRead();
  const prevRoomIdRef = useRef<string | null>(null);
  const isFirstMountRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedCheckRead = (id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      checkRead({ roomId: id });
    }, 100);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && roomId) {
        debouncedCheckRead(roomId);
      }
    };

    const handleWindowFocus = () => {
      if (roomId) {
        debouncedCheckRead(roomId);
      }
    };

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

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, checkRead]);
};
