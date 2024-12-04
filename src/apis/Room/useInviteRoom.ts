import { useMutation } from "@tanstack/react-query";

import { instance } from "@apis/AxiosInstance";
import { QUERY_KEYS } from "@apis/QUERY_KEYS";

import { TErrorRes } from "@typings/Axios";
import { TMember } from "@typings/User";

type InviteRoomReq = {
  roomId: string;
  memberIds: string[];
};

type InviteRoomRes = {
  newMembers: TMember[];
};

const inviteRoom = async (params: InviteRoomReq) => {
  const { memberIds, roomId } = params;
  return await instance.post<InviteRoomReq, InviteRoomRes>(
    `/rooms/${roomId}/join`,
    { memberIds }
  );
};

export const useInviteRoom = () => {
  return useMutation<InviteRoomRes, TErrorRes, InviteRoomReq>({
    mutationKey: QUERY_KEYS.ROOM.invite(),
    mutationFn: (params: InviteRoomReq) => inviteRoom(params),
  });
};
