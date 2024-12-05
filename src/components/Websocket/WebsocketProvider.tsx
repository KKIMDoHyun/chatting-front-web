import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { instance } from "@apis/AxiosInstance";

import { useHeartbeatInterval } from "@hooks/useHeartbeatInterval";

import {
  CallbackProps,
  SendRequestProps,
  subscribeProps,
  unsubscribeProps,
} from "@typings/WebsocketProvider.type";

type WebSocketContextProps = {
  isReady: boolean;
  subscribe: (props: subscribeProps) => void;
  unsubscribe: (props: unsubscribeProps) => void;
  sendRequest: (props: SendRequestProps) => void;
};

export const WebSocketContext = createContext<WebSocketContextProps>(
  {} as WebSocketContextProps
);

type WebsocketProviderProps = {
  children: React.ReactNode;
};

export const WebsocketProvider: React.FC<WebsocketProviderProps> = ({
  children,
}) => {
  const [isReady, setIsReady] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const isConnecting = useRef(false);
  const subscribers = useRef<{
    [key: string]: Set<(data: CallbackProps) => void>;
  }>({});
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 2;

  const handleTokenExpiration = useCallback(async () => {
    try {
      // 토큰 갱신 요청
      const { accessToken: newAccessToken } = await instance.post<
        object,
        { accessToken: string }
      >("/tokens/reissue");

      // 새로운 토큰 저장
      localStorage.setItem("accessToken", newAccessToken);

      // axios 인스턴스의 헤더 업데이트
      instance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

      // 웹소켓 재연결 시도
      if (ws.current) {
        ws.current.close(); // 기존 연결 종료
      }
      reconnectAttempts.current = 0;
      connect(); // 새로운 토큰으로 재연결

      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reconnect = useCallback(() => {
    if (isConnecting.current) return;

    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      console.log("웹소켓 최대 연결 횟수 도달... 연결 중지");
      return;
    }

    const backoffTime = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
    setTimeout(() => {
      if (!isConnecting.current) {
        connect();
        reconnectAttempts.current++;
      }
    }, backoffTime);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connect = useCallback(() => {
    if (isConnecting.current || ws.current?.readyState === WebSocket.OPEN)
      return;

    isConnecting.current = true;
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("No access token found. Unable to connect to WebSocket.");
      isConnecting.current = false;
      return;
    }

    ws.current = new WebSocket(
      `${import.meta.env.VITE_WEBSOCKET}?token=${accessToken}`
    );

    ws.current.onopen = () => {
      setIsReady(true);
      isConnecting.current = false;
      reconnectAttempts.current = 0;
      console.log("⭐️ WebSocket connection opened ⭐️");
    };

    ws.current.onclose = (event) => {
      setIsReady(false);
      isConnecting.current = false;
      console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
      reconnect();
    };

    ws.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      setIsReady(false);
      isConnecting.current = false;
    };

    ws.current.onmessage = async (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);

        if (message.errorMessage === "TOKEN_EXPIRED") {
          console.log("Token expired, attempting to refresh...");
          const success = await handleTokenExpiration();
          if (!success) return;
          return;
        }

        const channel = message.type;
        if (subscribers.current[channel]) {
          subscribers.current[channel].forEach((callback) =>
            callback(message.data)
          );
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };
  }, [reconnect, handleTokenExpiration]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
      isConnecting.current = false;
    };
  }, [connect]);

  const cleanup = useCallback(() => {
    subscribers.current = {};
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const subscribe = useCallback(({ channel, callbackFn }: subscribeProps) => {
    if (!subscribers.current[channel]) {
      subscribers.current[channel] = new Set();
    }

    subscribers.current[channel]!.add(callbackFn);
    console.log(`⭕️ ${channel} 구독. Total subscribers:`, subscribers.current);
  }, []);

  const unsubscribe = useCallback(
    ({ channel, callbackFn }: unsubscribeProps) => {
      if (subscribers.current[channel]) {
        subscribers.current[channel]!.delete(callbackFn);
        if (subscribers.current[channel]!.size === 0) {
          delete subscribers.current[channel];
        }
        console.log(
          `❌ ${channel} 구독 해제. Total subscribers:`,
          subscribers.current
        );
      }
    },
    []
  );

  const sendRequest = useCallback(
    (props: SendRequestProps) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current?.send(JSON.stringify(props));
      } else {
        console.error("WebSocket is not connected. Attempting to reconnect...");
        connect();
      }
    },
    [connect]
  );

  useHeartbeatInterval(
    () => {
      sendRequest({ type: "HEART_BEAT" });
    },
    isReady ? 40000 : null
  );

  return (
    <WebSocketContext.Provider
      value={{
        isReady,
        subscribe,
        unsubscribe,
        sendRequest,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
