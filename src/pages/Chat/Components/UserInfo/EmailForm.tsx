import { useFormContext } from "react-hook-form";

import { Mail } from "lucide-react";

import { Input } from "@components/ui";

import { FormValues } from ".";

type EmailFormProps = {
  isEditing: boolean;
  email: string;
};

export const EmailForm = ({ isEditing, email }: EmailFormProps) => {
  const { register } = useFormContext<FormValues>();

  return (
    <div className="flex items-center justify-center gap-2 text-gray-600">
      <Mail className="h-4 w-4" />
      {isEditing ? (
        <Input
          {...register("email", {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          type="email"
          className="max-w-xs"
        />
      ) : (
        <span>{email}</span>
      )}
    </div>
  );
};
