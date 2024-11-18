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

const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

const getFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    });
    return token;
  } catch (error) {
    console.error("Error generating FCM token:", error);
    return null;
  }
};

const postLogin = async (params: PostLoginReq) => {
  try {
    const isPermissionGranted = await requestNotificationPermission();
    if (!isPermissionGranted) {
      throw new Error("Notification permission denied");
    }

    const fcmToken = await getFCMToken();
    if (!fcmToken) {
      throw new Error("Failed to generate FCM token");
    }

    return await instance.post<PostLoginReq, PostLoginRes>("/login", {
      fcmToken,
      ...params,
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
