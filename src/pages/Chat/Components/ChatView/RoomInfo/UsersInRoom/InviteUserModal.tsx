import React, { useState } from "react";

import { useSetAtom } from "jotai";

import { useInviteRoom } from "@apis/Room/useInviteRoom";
import { useGetInvitableUsers } from "@apis/User/useGetInvitableUsers";

import { QueryWrapper } from "@components/QueryWrapper";

import { RoomMemberHistoryAtom } from "@stores/RoomStore";

type InviteUserModalProps = {
  closeModal: () => void;
  roomId: string;
};

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  closeModal,
  roomId,
}) => {
  const query = useGetInvitableUsers({ roomId });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { mutate } = useInviteRoom();
  const setMemberHistory = useSetAtom(RoomMemberHistoryAtom);

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleInvite = () => {
    mutate(
      { roomId, memberIds: selectedUsers },
      {
        onSuccess: (res) => {
          setMemberHistory((prev) => [...prev, ...res.newMembers]);
          closeModal();
        },
      }
    );
  };

  return (
    <div className="flex h-[500px] w-[400px] flex-col items-center rounded-lg bg-white p-8 shadow-2xl">
      <h2 className="mb-4 text-xl font-bold text-gray-800">대화 상대 초대</h2>
      <div className="mb-2 self-start text-sm text-gray-500">
        초대할 사용자 {selectedUsers.length}명 선택됨
      </div>

      <QueryWrapper query={query}>
        {(data) => (
          <div className="w-full flex-grow overflow-y-auto">
            <div className="max-h-[180px] overflow-y-auto pr-2">
              {data.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 rounded-md p-2 hover:bg-gray-100"
                >
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`user-${user.id}`}
                    className="flex flex-grow cursor-pointer items-center"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-400">
                      <img
                        src={user.profileImageUrl}
                        alt={`${user.name}'s profile`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </QueryWrapper>
      <div className="mt-4 flex w-full justify-end space-x-2">
        <button
          onClick={closeModal}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          취소
        </button>
        <button
          onClick={handleInvite}
          disabled={selectedUsers.length === 0}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300"
        >
          초대하기
        </button>
      </div>
    </div>
  );
};
