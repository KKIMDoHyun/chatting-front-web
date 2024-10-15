import { NavigateFunction } from "react-router-dom";

import { PlusCircle } from "lucide-react";

import { useModal } from "@components/Modal/useModal";
import { Input } from "@components/ui";

import { CreateRoomModal } from "./CreateRoomModal";

type SearchAndAddRoomProps = {
  navigate: NavigateFunction;
};

export const SearchAndAddRoom = ({ navigate }: SearchAndAddRoomProps) => {
  const { showCustomModal, closeCustomModal } = useModal();

  return (
    <div className="flex items-center space-x-2 p-4">
      <Input className="flex-grow" placeholder="채팅방 검색..." disabled />
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
            isBackDrop: true,
          });
        }}
      >
        <PlusCircle size={24} />
      </button>
    </div>
  );
};
