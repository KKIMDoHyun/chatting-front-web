import { useNavigate } from "react-router-dom";

import { PlusCircle } from "lucide-react";

import { TUser } from "@typings/User";

import { useModal } from "@components/Modal/useModal";

import { CreateRoomModal } from "./CreateRoomModal";

type UserInfoProps = {
  myInfo: TUser;
};

export const UserInfo = ({ myInfo }: UserInfoProps) => {
  const { showCustomModal, closeCustomModal } = useModal();
  const navigate = useNavigate();

  return (
    <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-gradient-to-r px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gray-50 shadow-md">
          <img
            src={myInfo.profileImageUrl}
            alt={`${myInfo.name}'s profile`}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-lg font-bold text-gray-800">{myInfo.name}</span>
      </div>

      <button
        className="text-gray-600 transition-colors duration-200 hover:text-blue-500 focus:outline-none"
        onClick={() => {
          showCustomModal({
            displayComponent: (
              <CreateRoomModal
                closeModal={closeCustomModal}
                navigate={navigate}
              />
            ),
          });
        }}
      >
        <PlusCircle size={24} />
      </button>
    </div>
  );
};
