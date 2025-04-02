# WebSocket 아키텍처 문서

이 문서는 쨌쨌 채팅 플랫폼의 WebSocket 기반 실시간 통신 아키텍처에 대해 설명합니다.

## 아키텍처 개요

쨌쨌은 HTTP와 WebSocket을 결합한 하이브리드 아키텍처를 사용합니다:

- **HTTP**: REST API 요청 (인증, 사용자 정보, 채팅방 관리 등)
- **WebSocket**: 실시간 메시지 교환 및 상태 업데이트

![아키텍처 다이어그램](https://via.placeholder.com/800x400?text=WebSocket+Architecture+Diagram)

## WebSocket 연결 관리

### 연결 수립 프로세스

1. **사용자 인증**: HTTP 요청을 통해 JWT 토큰 획득
2. **WebSocket 연결 초기화**: 획득한 JWT를 사용하여 WebSocket 연결 수립
3. **채널 구독**: 사용자가 참여 중인 채팅방에 대한 채널 구독
4. **상태 동기화**: 초기 상태 정보 수신 및 클라이언트 상태 동기화

```typescript
// WebSocket 연결 초기화 예시
export const initializeWebSocketConnection = (authToken: string) => {
  const socket = new WebSocket(`${WS_BASE_URL}?token=${authToken}`);
  
  socket.onopen = () => {
    console.log('WebSocket 연결 성공');
    // 채널 구독 및 초기화 메시지 전송
    subscribeToUserChannels(socket);
  };
  
  socket.onclose = (event) => {
    console.log(`WebSocket 연결 종료: ${event.code} - ${event.reason}`);
    // 재연결 로직
    handleReconnection(authToken);
  };
  
  return socket;
};
```

### 재연결 메커니즘

네트워크 문제나 서버 재시작 시 자동 재연결을 위한 지수 백오프 알고리즘을 구현했습니다:

```typescript
export const handleReconnection = (authToken: string, attempt = 1) => {
  const maxAttempts = 10;
  const baseDelay = 1000; // 1초
  
  if (attempt > maxAttempts) {
    console.error('최대 재연결 시도 횟수 초과');
    return;
  }
  
  // 지수 백오프 - 재시도 간격을 점진적으로 증가
  const delay = Math.min(baseDelay * Math.pow(1.5, attempt - 1), 30000); // 최대 30초
  
  setTimeout(() => {
    console.log(`재연결 시도 ${attempt}/${maxAttempts}`);
    const newSocket = initializeWebSocketConnection(authToken);
    
    newSocket.onerror = () => {
      handleReconnection(authToken, attempt + 1);
    };
  }, delay);
};
```

## Pub/Sub 패턴 구현

쨌쨌은 확장성을 위해, 토픽 기반 Pub/Sub 패턴을 구현했습니다:

### 채널 구독

```typescript
export const subscribeToChannel = (socket: WebSocket, channelId: string) => {
  if (socket.readyState === WebSocket.OPEN) {
    const subscribeMessage = {
      type: 'SUBSCRIBE',
      channelId,
      timestamp: Date.now(),
    };
    
    socket.send(JSON.stringify(subscribeMessage));
  }
};
```

### 메시지 발행

```typescript
export const publishMessage = (
  socket: WebSocket, 
  channelId: string, 
  content: string, 
  type: 'TEXT' | 'FILE' | 'IMAGE' = 'TEXT'
) => {
  if (socket.readyState === WebSocket.OPEN) {
    const message = {
      type: 'PUBLISH',
      channelId,
      messageType: type,
      content,
      timestamp: Date.now(),
    };
    
    socket.send(JSON.stringify(message));
  }
};
```

## 메시지 처리 및 상태 관리

### 메시지 수신 처리

```typescript
socket.onmessage = (event) => {
  try {
    const message = JSON.parse(event.data);
    
    switch (message.type) {
      case 'CHAT_MESSAGE':
        handleChatMessage(message);
        break;
      case 'USER_STATUS':
        handleUserStatusUpdate(message);
        break;
      case 'READ_RECEIPT':
        handleReadReceipt(message);
        break;
      case 'NOTIFICATION':
        handleNotification(message);
        break;
      default:
        console.log('알 수 없는 메시지 타입:', message.type);
    }
  } catch (error) {
    console.error('메시지 처리 중 오류:', error);
  }
};
```

### Jotai를 활용한 상태 관리

Jotai 원자 상태와 WebSocket 이벤트를 연결하여 실시간 상태 업데이트를 구현했습니다:

```typescript
// 채팅 메시지 상태 관리
export const chatMessagesAtom = atomWithImmer<Record<string, Message[]>>({});

// 읽지 않은 메시지 카운터
export const unreadCountAtom = atomWithImmer<Record<string, number>>({});

// WebSocket 이벤트와 상태 연결
export const handleChatMessage = (message: ChatMessageEvent) => {
  const { channelId, message: messageData } = message;
  
  // Jotai 상태 업데이트
  setAtom(chatMessagesAtom, (draft) => {
    const messages = draft[channelId] || [];
    draft[channelId] = [...messages, messageData];
  });
  
  // 현재 채팅방이 아니면 읽지 않은 메시지 수 증가
  if (getCurrentChannelId() !== channelId) {
    setAtom(unreadCountAtom, (draft) => {
      draft[channelId] = (draft[channelId] || 0) + 1;
    });
  }
};
```

## 실시간 동기화 기능

### 메시지 읽음 상태 추적

```typescript
export const sendReadReceipt = (socket: WebSocket, channelId: string, messageId: string) => {
  if (socket.readyState === WebSocket.OPEN) {
    const receipt = {
      type: 'READ_RECEIPT',
      channelId,
      messageId,
      timestamp: Date.now(),
    };
    
    socket.send(JSON.stringify(receipt));
  }
};
```

### 사용자 상태 업데이트

```typescript
export const broadcastUserStatusChange = (
  socket: WebSocket, 
  status: 'ONLINE' | 'AWAY' | 'OFFLINE'
) => {
  if (socket.readyState === WebSocket.OPEN) {
    const statusUpdate = {
      type: 'USER_STATUS',
      status,
      timestamp: Date.now(),
    };
    
    socket.send(JSON.stringify(statusUpdate));
  }
};
```

## 성능 최적화

### 메시지 배치 처리

대량의 메시지를 효율적으로 처리하기 위한 배치 처리 방식:

```typescript
// 배치 처리를 위한 큐
let messageQueue: Message[] = [];
const MAX_BATCH_SIZE = 50;
const BATCH_INTERVAL = 100; // 100ms

// 메시지 큐에 추가
export const queueMessage = (message: Message) => {
  messageQueue.push(message);
  
  if (messageQueue.length >= MAX_BATCH_SIZE) {
    flushMessageQueue();
  }
};

// 정기적인 큐 처리
setInterval(flushMessageQueue, BATCH_INTERVAL);

// 큐 처리 함수
function flushMessageQueue() {
  if (messageQueue.length === 0) return;
  
  const batch = [...messageQueue];
  messageQueue = [];
  
  // 배치 단위로 상태 업데이트
  setAtom(chatMessagesAtom, (draft) => {
    batch.forEach((message) => {
      const messages = draft[message.channelId] || [];
      draft[message.channelId] = [...messages, message];
    });
  });
}
```

### 양방향 무한 스크롤

무한 스크롤을 통한 효율적인 메시지 로딩 구현:

```typescript
export const useChatMessages = (channelId: string) => {
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const [loading, setLoading] = useState(false);
  
  // 이전 메시지 로드
  const loadPreviousMessages = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const oldestMessageId = messages[channelId]?.[0]?.id;
      
      const previousMessages = await fetchMessages({
        channelId,
        before: oldestMessageId,
        limit: 20,
      });
      
      setMessages((draft) => {
        const currentMessages = draft[channelId] || [];
        draft[channelId] = [...previousMessages, ...currentMessages];
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 스크롤 관찰자 설정
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  
  useEffect(() => {
    if (inView) {
      loadPreviousMessages();
    }
  }, [inView, channelId]);
  
  return {
    messages: messages[channelId] || [],
    loading,
    loadMoreRef: ref,
  };
};
```

## 보안 고려사항

1. **메시지 인증**: 모든 WebSocket 메시지는 JWT 토큰으로 인증
2. **메시지 검증**: 서버 측에서 메시지 형식 및 권한 검증
3. **속도 제한**: 메시지 플러딩 방지를 위한 제한 적용
4. **내용 필터링**: 유해 콘텐츠 필터링 로직 적용
5. **암호화**: WebSocket 연결은 WSS(WebSocket Secure)를 통해 암호화

## 테스트 및 디버깅

### WebSocket 모니터링

개발 과정에서의 WebSocket 통신 모니터링 도구:

```typescript
export const enableWebSocketDebug = (socket: WebSocket) => {
  if (process.env.NODE_ENV !== 'production') {
    // 웹소켓 이벤트에 디버그 로깅 추가
    const originalSend = socket.send;
    socket.send = function(data) {
      console.debug('WebSocket SEND:', JSON.parse(data.toString()));
      return originalSend.call(this, data);
    };
    
    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);
      console.debug('WebSocket RECEIVE:', data);
      // 기존 onmessage 핸들러 호출
      handleWebSocketMessage(event);
    };
  }
  
  return socket;
};
```

## 결론

쨌쨌 프로젝트의 WebSocket 아키텍처는 확장 가능하고 안정적인 실시간 통신을 제공합니다. Pub/Sub 패턴과 상태 관리 시스템의 통합을 통해 다양한 실시간 기능을 구현했으며, 성능 최적화를 통해 대규모 사용자 환경에서도 원활한 경험을 제공합니다.

이 아키텍처는 향후 음성/영상 통화, 그룹 공동 작업 등의 기능 확장에도 대응 가능하도록 설계되었습니다.
