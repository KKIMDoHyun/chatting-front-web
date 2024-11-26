import { Controller, useFormContext } from "react-hook-form";

import { Phone } from "lucide-react";

import { Input } from "@components/ui";

import { formatPhoneNumber } from "@pages/SignUp/utils";

import { FormValues } from ".";

type PhoneNumberFormProps = {
  isEditing: boolean;
  phoneNumber: string;
};

export const PhoneNumberForm = ({
  isEditing,
  phoneNumber,
}: PhoneNumberFormProps) => {
  const { control } = useFormContext<FormValues>();

  return (
    <div className="flex items-center justify-center gap-2 text-gray-600">
      <Phone className="h-4 w-4" />
      {isEditing ? (
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              type="tel"
              className="max-w-xs"
              value={value}
              onChange={(e) => {
                onChange(formatPhoneNumber(e.target.value));
              }}
              maxLength={13}
            />
          )}
        />
      ) : (
        <span>{phoneNumber}</span>
      )}
    </div>
  );
};
