export type TUser = {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  profileImageUrl: string;
};

export type TMember = Pick<TUser, "id" | "name" | "profileImageUrl">;
