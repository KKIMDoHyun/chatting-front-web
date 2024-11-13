import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { instance } from "@apis/AxiosInstance";
import { QUERY_KEYS } from "@apis/QUERY_KEYS";

import { TErrorRes } from "@typings/Axios";
import { TChatMessageDetail } from "@typings/Chat";

// 초기 메시지 조회 타입
type GetInitialMessagesReq = {
  roomId: string;
};

type GetInitialMessagesRes = {
  hasPreviousContents: boolean;
  hasNextPreviousContents: boolean;
  contents: TChatMessageDetail[];
  standardMessageId: string;
};

// 추가 메시지 조회 타입
type GetMessagesReq = {
  roomId: string;
  messageId: string;
  direction: "before" | "after";
};

type GetMessagesRes = {
  hasPreviousContents: boolean;
  hasNextPreviousContents: boolean;
  contents: TChatMessageDetail[];
  standardMessageId: string;
};

// API 호출 함수들
const getInitialMessages = async (params: GetInitialMessagesReq) => {
  const { roomId } = params;
  return await instance.get<GetInitialMessagesReq, GetInitialMessagesRes>(
    `/rooms/${roomId}/messages/initial`
  );
};

const getMessages = async (params: GetMessagesReq) => {
  const { roomId, messageId, direction } = params;
  return await instance.get<GetMessagesReq, GetMessagesRes>(
    `/rooms/${roomId}/messages`,
    { params: { messageId, direction } }
  );
};

export const useEnhancedMessages = (initialParams: GetInitialMessagesReq) => {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.CHAT.messages(JSON.stringify(initialParams));

  // 초기 메시지 로드
  const initialQuery = useQuery<GetInitialMessagesRes, TErrorRes>({
    queryKey,
    queryFn: () => getInitialMessages(initialParams),
    placeholderData: keepPreviousData,
  });

  // 이전 메시지 로드 뮤테이션
  const fetchPreviousMessagesMutation = useMutation<
    GetMessagesRes,
    TErrorRes,
    string
  >({
    mutationFn: (messageId: string) =>
      getMessages({
        roomId: initialParams.roomId,
        messageId,
        direction: "before",
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKey,
        (oldData: GetInitialMessagesRes | undefined) => {
          if (!oldData) return data;
          return {
            ...oldData,
            contents: [...data.contents, ...oldData.contents],
            hasPreviousContents: data.hasPreviousContents,
            standardMessageId: data.standardMessageId,
          };
        }
      );
    },
  });

  // 다음 메시지 로드 뮤테이션
  const fetchNextMessagesMutation = useMutation<
    GetMessagesRes,
    TErrorRes,
    string
  >({
    mutationFn: (messageId: string) =>
      getMessages({
        roomId: initialParams.roomId,
        messageId,
        direction: "after",
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(
        queryKey,
        (oldData: GetInitialMessagesRes | undefined) => {
          if (!oldData) return data;
          return {
            ...oldData,
            contents: [...oldData.contents, ...data.contents],
            hasNextPreviousContents: data.hasNextPreviousContents,
            standardMessageId: data.standardMessageId,
          };
        }
      );
    },
  });

  return {
    // 기본 쿼리 데이터
    data: initialQuery.data,
    isLoading: initialQuery.isLoading,
    isError: initialQuery.isError,
    error: initialQuery.error,

    // 이전 메시지 로드
    fetchPreviousMessages: fetchPreviousMessagesMutation.mutate,
    fetchPreviousMessagesAsync: fetchPreviousMessagesMutation.mutateAsync,
    isFetchingPreviousMessages: fetchPreviousMessagesMutation.isPending,

    // 다음 메시지 로드
    fetchNextMessages: fetchNextMessagesMutation.mutate,
    fetchNextMessagesAsync: fetchNextMessagesMutation.mutateAsync,
    isFetchingNextMessages: fetchNextMessagesMutation.isPending,
  };
};
