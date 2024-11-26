import { useFormContext } from "react-hook-form";

import { useAtomValue } from "jotai";

import { TSignUpForm } from "@typings/Auth";

import { Button } from "@components/ui";

import { UsernameCheckAtom } from "@stores/AuthStore";

import { PasswordConfirmForm } from "./PasswordConfirmForm";
import { PasswordForm } from "./PasswordForm";
import { UsernameForm } from "./UsernameForm";

type StepOneProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export const StepOne = ({ setStep }: StepOneProps) => {
  const { trigger, watch, setError } = useFormContext<TSignUpForm>();
  const usernameCheck = useAtomValue(UsernameCheckAtom);
  const username = watch("username");

  const handleNextStep = async () => {
    if (!username) {
      setError("username", {
        type: "manual",
        message: "아이디를 입력해주세요.",
      });
      return;
    }

    if (!usernameCheck) {
      setError("username", {
        type: "manual",
        message: "아이디 중복 검사를 진행해주세요.",
      });
      return;
    }

    const isValid = await trigger(["username", "password", "confirmPassword"]);
    if (isValid) {
      setStep(1);
    }
  };

  return (
    <div className="flex w-[350px] flex-col gap-2">
      <UsernameForm />
      <PasswordForm />
      <PasswordConfirmForm />
      <Button type="button" onClick={handleNextStep}>
        다음
      </Button>
    </div>
  );
};
