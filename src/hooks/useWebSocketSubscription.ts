import { useCallback, useContext, useEffect, useRef } from "react";

import { useParams } from "react-router-dom";

import { CreateMessageEvent } from "@typings/WebsocketMessage.type";
import { CallbackProps, TSocketMessage } from "@typings/WebsocketProvider.type";

import { WebSocketContext } from "@components/Websocket/WebsocketProvider";

let activeNotification: Notification | null = null;
let notificationTimer: number | null = null;

export const useWebSocketSubscription = (
  channel: TSocketMessage["type"],
  callback: (data: CallbackProps) => void
) => {
  const { id: currentRoomId } = useParams<{ id: string }>();
  const { isReady, subscribe, unsubscribe } = useContext(WebSocketContext);
  const callbackRef = useRef(callback);

  const showNotification = useCallback(
    (data: CreateMessageEvent["data"]) => {
      // 현재 보고 있는 채팅방의 메시지면 알림 표시하지 않음
      if (data.notificationInfo?.roomId === currentRoomId) {
        return;
      }

      // 이전 알림이 있으면 닫기
      if (activeNotification) {
        activeNotification.close();
        if (notificationTimer) {
          clearTimeout(notificationTimer);
        }
      }

      // 새 알림 생성
      activeNotification = new Notification(data.notificationInfo?.senderName, {
        body: data.notificationInfo?.plainText,
        icon: "your-icon-path.png",
        tag: `chat-${data.notificationInfo?.roomId}`,
      });

      // 5초 후 자동으로 알림 닫기
      notificationTimer = window.setTimeout(() => {
        if (activeNotification) {
          activeNotification.close();
          activeNotification = null;
        }
      }, 5000);

      // 알림 클릭 처리
      activeNotification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        window.location.href = `/room/${data.notificationInfo?.roomId}`;
        activeNotification?.close();
        activeNotification = null;
        if (notificationTimer) {
          clearTimeout(notificationTimer);
        }
      };
    },
    [currentRoomId]
  );

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const wrappedCallback = useCallback(
    (data: CallbackProps) => {
      if (
        channel === "MESSAGE_CREATED" &&
        document.visibilityState === "visible"
      ) {
        showNotification(data as CreateMessageEvent["data"]);
      }

      callbackRef.current(data);
    },
    [channel, showNotification]
  );

  useEffect(() => {
    if (!isReady) return;
    subscribe({ channel, callbackFn: wrappedCallback });

    return () => {
      if (activeNotification) {
        activeNotification.close();
      }
      if (notificationTimer) {
        clearTimeout(notificationTimer);
      }
      unsubscribe({ channel, callbackFn: wrappedCallback });
    };
  }, [isReady, channel, subscribe, unsubscribe, wrappedCallback]);
};
