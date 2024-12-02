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

// 추가 메시지 조회 타입
type GetMessagesReq = {
  roomId: string;
  messageId: string;
  direction: "before" | "after";
};

export type GetMessagesRes = {
  hasPreviousContents: boolean;
  hasNextContents: boolean;
  contents: TChatMessageDetail[];
  standardMessageId: string;
};

const getInitialMessages = async (params: GetInitialMessagesReq) => {
  const { roomId } = params;
  return await instance.get<GetInitialMessagesReq, GetMessagesRes>(
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
  const initialQuery = useQuery<GetMessagesRes, TErrorRes>({
    queryKey,
    queryFn: () => getInitialMessages(initialParams),
    placeholderData: keepPreviousData,
    staleTime: 0,
    enabled: Boolean(initialParams.roomId),
  });

  const updateMessages = (
    oldData: GetMessagesRes | undefined,
    newData: GetMessagesRes,
    isPrevious: boolean
  ): GetMessagesRes => {
    if (!oldData) return newData;

    const uniqueMessages = new Map<string, TChatMessageDetail>();

    // 기존 메시지 추가
    oldData.contents.forEach((msg) => uniqueMessages.set(msg.id, msg));

    // 새 메시지 추가 (중복 제거)
    newData.contents.forEach((msg) => uniqueMessages.set(msg.id, msg));

    // 메시지 정렬
    const sortedMessages = Array.from(uniqueMessages.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return {
      ...oldData,
      contents: sortedMessages,
      hasPreviousContents: isPrevious
        ? newData.hasPreviousContents
        : oldData.hasPreviousContents,
      hasNextContents: isPrevious
        ? oldData.hasNextContents
        : newData.hasNextContents,
      standardMessageId: newData.standardMessageId,
    };
  };

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
        (oldData: GetMessagesRes | undefined) =>
          updateMessages(oldData, data, true)
      );
    },
    onError: (error) => {
      console.error("Error fetching previous messages:", error);
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
        (oldData: GetMessagesRes | undefined) =>
          updateMessages(oldData, data, false)
      );
    },
    onError: (error) => {
      console.error("Error fetching next messages:", error);
    },
  });

  return {
    data: initialQuery.data,
    isLoading: initialQuery.isLoading,
    isError: initialQuery.isError,
    error: initialQuery.error,
    fetchPreviousMessages: (messageId: string) => {
      if (
        !fetchPreviousMessagesMutation.isPending &&
        initialQuery.data?.hasPreviousContents
      ) {
        fetchPreviousMessagesMutation.mutate(messageId);
      }
    },
    fetchNextMessages: (messageId: string) => {
      if (
        !fetchNextMessagesMutation.isPending &&
        initialQuery.data?.hasNextContents
      ) {
        fetchNextMessagesMutation.mutate(messageId);
      }
    },
    isFetchingPreviousMessages: fetchPreviousMessagesMutation.isPending,
    isFetchingNextMessages: fetchNextMessagesMutation.isPending,
  };
};
