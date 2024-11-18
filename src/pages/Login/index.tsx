import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import LOGO from "@assets/chat-logo.png";

import { usePostLogin } from "@apis/Auth/usePostLogin";
import { instance } from "@apis/AxiosInstance";

import { useLocalStorage } from "@hooks/useLocalStorage";

import { TLoginForm } from "@typings/Auth";
import { TErrorRes } from "@typings/Axios";

import { InputField } from "@components/Auth/InputField";
import { Button, Checkbox } from "@components/ui";

const STORAGE_KEYS = {
  USERNAME: "PMS_USERNAME",
  SAVE_ID: "PMS_SAVED_ID",
} as const;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate } = usePostLogin();
  const [, setCookie] = useCookies(["refresh_token"]);
  const [savedUsername, setSavedUsername] = useLocalStorage<string>(
    STORAGE_KEYS.USERNAME,
    ""
  );
  const [saveIdSetting, setSaveIdSetting] = useLocalStorage<boolean>(
    STORAGE_KEYS.SAVE_ID,
    false
  );

  const [isLoading, setIsLoading] = useState(false);
  const [saveId, setSaveId] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm<TLoginForm>({
    mode: "onSubmit",
  });

  const username = watch("username");

  useEffect(() => {
    if (savedUsername && saveIdSetting) {
      setValue("username", savedUsername);
      setSaveId(true);
    }
  }, [saveIdSetting, savedUsername, setValue]);

  const handleSaveIdChange = (checked: boolean) => {
    setSaveId(checked);
    if (checked && username) {
      setSavedUsername(username);
      setSaveIdSetting(true);
    } else {
      setSaveIdSetting(false);
    }
  };

  const onSubmit: SubmitHandler<TLoginForm> = (data, event) => {
    event?.preventDefault();
    clearErrors("root");
    if (saveId && data.username) {
      setSavedUsername(data.username);
      setSaveIdSetting(true);
    } else {
      setSavedUsername("");
      setSaveIdSetting(false);
    }
    setIsLoading(true);
    mutate(
      { deviceType: "WEB", ...data },
      { onSuccess: handleLoginSuccess, onError: handleLoginError }
    );
  };

  const handleLoginSuccess = (res: {
    accessToken: string;
    refreshToken: string;
  }) => {
    setIsLoading(false);
    instance.defaults.headers["Authorization"] = `Bearer ${res.accessToken}`;
    localStorage.setItem("accessToken", res.accessToken);
    setCookie("refresh_token", res.refreshToken, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      secure: false,
      sameSite: "strict",
    });
    navigate("/");
  };

  const handleLoginError = (error: TErrorRes) => {
    setIsLoading(false);
    if (error.response?.data.errorCode === "ACCOUNT_DISABLED") {
      return;
    }
    const errorMessage =
      error.response?.data?.errorCode === "INVALID_PASSWORD" ||
      error.response?.data?.errorCode === "INVALID_USERNAME"
        ? error.response.data.errorMessage
        : "로그인에 실패했습니다. 다시 시도해 주세요.";

    setError("root", { type: "manual", message: errorMessage });
    setValue("password", "");
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5">
      <img src={LOGO} width={200} height={200} alt="Logo" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-[300px] flex-col gap-3"
      >
        <InputField
          name="username"
          placeholder="Id"
          type="text"
          register={register}
          validation={{ required: "아이디를 입력해주세요." }}
          className="w-full"
        />
        <InputField
          name="password"
          placeholder="Password"
          type="password"
          register={register}
          validation={{ required: "비밀번호를 입력해주세요." }}
          className="w-full"
        />
        <div className="my-2 flex items-center justify-center space-x-2">
          <Checkbox
            id="save-id"
            checked={saveId}
            onCheckedChange={(checked) =>
              handleSaveIdChange(checked as boolean)
            }
          />
          <label
            htmlFor="save-id"
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            아이디 저장
          </label>
        </div>
        {(errors.username || errors.password || errors.root) && (
          <div className="flex justify-center text-sm text-red-500">
            {errors.root?.message ||
              errors.username?.message ||
              errors.password?.message}
          </div>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
        <div>
          <p className="mt-3 text-center text-sm">
            계정이 없으신가요?{" "}
            <a href="/sign-up" className="text-blue-500 hover:underline">
              회원가입
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
