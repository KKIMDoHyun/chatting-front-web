import { useMutation } from "@tanstack/react-query";

import { instance } from "@apis/AxiosInstance";

import { TErrorRes } from "@typings/Axios";

type CheckUsernameReq = {
  username: string;
};

type CheckUsernameRes = {
  result: boolean;
};

const checkUsername = async (params: CheckUsernameReq) => {
  return await instance.post<CheckUsernameReq, CheckUsernameRes>(
    "/users/check-username",
    { ...params }
  );
};

export const useCheckUsername = () => {
  return useMutation<CheckUsernameRes, TErrorRes, CheckUsernameReq>({
    mutationFn: checkUsername,
  });
};
