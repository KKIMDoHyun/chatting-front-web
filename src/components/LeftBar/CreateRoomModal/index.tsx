import { useState } from "react";

import { NavigateFunction } from "react-router-dom";

import { useAtomValue } from "jotai";

import { useCreateRoom } from "@apis/Room/useCreateRoom";
import { useGetUsers } from "@apis/User/useGetUsers";

import { TUser } from "@typings/User";

import { QueryWrapper } from "@components/QueryWrapper";

import { MyInfoAtom } from "@stores/UserStore";

import { ModalFooter } from "./ModalFooter";
import { RoomNameInput } from "./RoomNameInput";
import { UserList } from "./UserList";

type CreateRoomModalProps = {
  closeModal: () => void;
  navigate: NavigateFunction;
};

export const CreateRoomModal = ({
  closeModal,
  navigate,
}: CreateRoomModalProps) => {
  const query = useGetUsers();
  const [selectedUsers, setSelectedUsers] = useState<TUser[]>([]);
  const myInfo = useAtomValue(MyInfoAtom);
  const [roomName, setRoomName] = useState("");
  const { mutate } = useCreateRoom();

  const handleUserToggle = (user: TUser) => {
    setSelectedUsers((prev) =>
      prev.map((v) => v.id).includes(user.id)
        ? prev.filter((v) => v.id !== user.id)
        : [...prev, user]
    );
  };

  const handleCreate = () => {
    const finalRoomName =
      roomName.trim() ||
      [myInfo?.name, ...selectedUsers.map((v) => v.name)].join(", ");
    mutate(
      {
        name: finalRoomName,
        memberIds: selectedUsers.map((v) => v.id),
        roomType: selectedUsers.length === 1 ? "DIRECT" : "GROUP",
      },
      {
        onSuccess: (res) => {
          closeModal();
          navigate(`/room/${res.roomId}`);
        },
      }
    );
  };

  if (!myInfo) return null;

  return (
    <div className="flex h-[600px] w-[400px] flex-col items-center rounded-lg bg-white p-8 shadow-2xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">채팅방 생성</h2>

      <RoomNameInput roomName={roomName} setRoomName={setRoomName} />

      <div className="mb-4 self-start text-sm text-gray-600">
        초대할 사용자 {selectedUsers.length}명 선택됨
      </div>

      <QueryWrapper query={query}>
        {(data) => (
          <UserList
            users={data.filter((v) => v.id !== myInfo.id)}
            selectedUsers={selectedUsers}
            handleUserToggle={handleUserToggle}
          />
        )}
      </QueryWrapper>

      <ModalFooter
        closeModal={closeModal}
        handleCreate={handleCreate}
        isCreateDisabled={selectedUsers.length === 0}
      />
    </div>
  );
};
