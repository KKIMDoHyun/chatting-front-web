import { useQuery } from "@tanstack/react-query";

import { instance } from "@apis/AxiosInstance";
import { QUERY_KEYS } from "@apis/QUERY_KEYS";

import { TErrorRes } from "@typings/Axios";
import { TChatMessageDetail } from "@typings/Chat";
import { TPage } from "@typings/Page";

type GetInitialMessagesReq = {
  roomId: string;
};

type GetInitialMessagesRes = {
  messages: TPage & {
    content: TChatMessageDetail[];
  };
  standardMessageId: string;
};

const getInitialMessages = async (params: GetInitialMessagesReq) => {
  const { roomId } = params;
  return await instance.get<GetInitialMessagesReq, GetInitialMessagesRes>(
    `/rooms/${roomId}/messages/initial`
  );
};

export const useGetInitialMessages = (initialParams: GetInitialMessagesReq) => {
  return useQuery<GetInitialMessagesRes, TErrorRes>({
    queryKey: QUERY_KEYS.CHAT.messages(JSON.stringify(initialParams)),
    queryFn: () => getInitialMessages(initialParams),
  });
};
