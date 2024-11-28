import { messaging } from "@firebase";
import { useMutation } from "@tanstack/react-query";
import { getToken } from "firebase/messaging";

import { instance } from "@apis/AxiosInstance";

import { TErrorRes } from "@typings/Axios";

type PostLoginReq = {
  username: string;
  password: string;
  deviceType: "WEB" | "IOS" | "ANDROID";
};

type PostLoginRes = {
  accessToken: string;
  refreshToken: string;
};

const getFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (error) {
    console.error("FCM 토큰 생성 중 오류:", error);
    return null;
  }
};

const postLogin = async (params: PostLoginReq) => {
  try {
    const fcmToken = await getFCMToken();

    return await instance.post<PostLoginReq, PostLoginRes>("/login", {
      ...params,
      ...(fcmToken && { fcmToken }),
    });
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const usePostLogin = () => {
  return useMutation<PostLoginRes, TErrorRes, PostLoginReq>({
    mutationFn: postLogin,
  });
};
