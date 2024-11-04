import { useMutation } from "@tanstack/react-query";

import { instance } from "@apis/AxiosInstance";
import { QUERY_KEYS } from "@apis/QUERY_KEYS";

import { TErrorRes } from "@typings/Axios";

type CreateNoticeReq = {
  roomId: string;
  messageId: string;
};

type CreateNoticeRes = object;

const createNotice = async (params: CreateNoticeReq) => {
  const { roomId, messageId } = params;
  return await instance.patch<CreateNoticeReq, CreateNoticeRes>(
    `/rooms/${roomId}/messages/${messageId}`
  );
};

export const useCreateNotice = () => {
  return useMutation<CreateNoticeRes, TErrorRes, CreateNoticeReq>({
    mutationKey: QUERY_KEYS.CHAT.createNotice(),
    mutationFn: (params: CreateNoticeReq) => createNotice(params),
  });
};
