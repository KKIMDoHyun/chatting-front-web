import { useMutation } from "@tanstack/react-query";

import { instance } from "@apis/AxiosInstance";

import { TErrorRes } from "@typings/Axios";

type ChangeUserInfoReq = {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string;
};

type ChangeUserInfoRes = object;

const changeUserInfo = async (params: ChangeUserInfoReq) => {
  const { userId, ...rest } = params;
  console.log(rest);
  return await instance.put<ChangeUserInfoReq, ChangeUserInfoRes>(
    `/users/${userId}`,
    rest
  );
};

export const useChangeUserInfo = () => {
  return useMutation<ChangeUserInfoRes, TErrorRes, ChangeUserInfoReq>({
    mutationFn: changeUserInfo,
  });
};
