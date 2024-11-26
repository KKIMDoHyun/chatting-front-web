import { useFormContext } from "react-hook-form";

import { Input } from "@components/ui";

import { FormValues } from ".";

type NameFormProps = {
  isEditing: boolean;
  name: string;
};

export const NameForm = ({ isEditing, name }: NameFormProps) => {
  const { register } = useFormContext<FormValues>();

  if (isEditing) {
    return (
      <Input
        {...register("name", { required: true })}
        className="max-w-xs text-center text-2xl font-bold"
      />
    );
  }

  return <h2 className="text-2xl font-bold text-gray-800">{name}</h2>;
};
