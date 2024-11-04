import { useQuery } from "@tanstack/react-query";

import { instance } from "@apis/AxiosInstance";
import { QUERY_KEYS } from "@apis/QUERY_KEYS";

import { TErrorRes } from "@typings/Axios";
import { TChatMessageDetail } from "@typings/Chat";
import { TPage } from "@typings/Page";

type GetNoticeMessagesReq = {
  roomId: string;
};

type GetNoticeMessagesRes = TPage & {
  content: TChatMessageDetail[];
};

const getNoticeMessages = async (params: GetNoticeMessagesReq) => {
  const { roomId } = params;
  return await instance.get<GetNoticeMessagesReq, GetNoticeMessagesRes>(
    `/rooms/${roomId}/notice-messages`
  );
};

export const useGetNoticeMessages = (params: GetNoticeMessagesReq) => {
  return useQuery<GetNoticeMessagesRes, TErrorRes>({
    queryKey: QUERY_KEYS.TALK_STORAGE.noticeMessages(JSON.stringify(params)),
    queryFn: () => getNoticeMessages(params),
  });
};
