import { useQuery } from "@tanstack/react-query";

import { instance } from "@apis/AxiosInstance";
import { QUERY_KEYS } from "@apis/QUERY_KEYS";

import { TErrorRes } from "@typings/Axios";
import { TChatMessageDetail, TMessageType } from "@typings/Chat";
import { TPage } from "@typings/Page";

type GetTypedMessagesReq = {
  roomId: string;
  messageType: TMessageType;
  page: number;
  size: number;
};

type GetTypedMessagesRes = TPage & {
  content: TChatMessageDetail[];
};

const getTypedMessages = async (params: GetTypedMessagesReq) => {
  const { roomId, ...rest } = params;
  return await instance.get<GetTypedMessagesReq, GetTypedMessagesRes>(
    `/rooms/${roomId}/typed-messages`,
    { params: { ...rest } }
  );
};

export const useGetTypedMessages = (params: GetTypedMessagesReq) => {
  return useQuery<GetTypedMessagesRes, TErrorRes>({
    queryKey: QUERY_KEYS.TALK_STORAGE.typedMessages(JSON.stringify(params)),
    queryFn: () => getTypedMessages(params),
  });
};
