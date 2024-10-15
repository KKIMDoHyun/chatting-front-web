import { User } from "lucide-react";

import { TUser } from "@typings/User";

type UserInfoProps = {
  myInfo: TUser;
};

export const UserInfo = ({ myInfo }: UserInfoProps) => (
  <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-gradient-to-r px-4 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 shadow-md">
        <User size={20} />
      </div>
      <span className="text-lg font-bold text-gray-800">{myInfo.name}</span>
    </div>
  </div>
);
