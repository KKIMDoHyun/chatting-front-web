import { useFormContext } from "react-hook-form";

import { useAtom } from "jotai";

import { useCheckUsername } from "@apis/Auth/useCheckUsername";

import { TSignUpForm } from "@typings/Auth";

import { InputField } from "@components/Auth/InputField";
import { Button } from "@components/ui";

import { UsernameCheckAtom } from "@stores/AuthStore";

export const UsernameForm = () => {
  const {
    register,
    watch,
    clearErrors,
    setError,
    formState: { errors },
  } = useFormContext<TSignUpForm>();

  const { mutate: checkUsernameMutate } = useCheckUsername();
  const [usernameCheck, setUsernameCheck] = useAtom(UsernameCheckAtom);
  const username = watch("username");

  const handleCheckUsername = () => {
    if (!username) return;

    checkUsernameMutate(
      { username },
      {
        onSuccess: (res) => {
          if (res.result) {
            setUsernameCheck(true);
            clearErrors("username");
            return;
          }

          setUsernameCheck(false);
          setError("username", {
            type: "manual",
            message: "이미 사용 중인 아이디입니다.",
          });
        },
        onError: () => {
          setUsernameCheck(false);
          setError("username", {
            type: "manual",
            message: "중복 검사 중 오류가 발생했습니다.",
          });
        },
      }
    );
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <InputField
          name="username"
          placeholder="Id"
          type="text"
          register={register}
          validation={{ required: "아이디를 입력해주세요." }}
        />
        <Button
          onClick={handleCheckUsername}
          type="button"
          disabled={!username}
        >
          중복 검사
        </Button>
      </div>

      {errors.username && (
        <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
      )}

      {usernameCheck && (
        <p className="mt-1 text-xs text-green-500">사용 가능한 아이디입니다.</p>
      )}
    </div>
  );
};
