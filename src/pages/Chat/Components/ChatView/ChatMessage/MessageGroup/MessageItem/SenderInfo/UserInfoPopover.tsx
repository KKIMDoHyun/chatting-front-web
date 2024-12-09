import { useNavigate } from "react-router-dom";

import { useAtomValue } from "jotai";
import { MailIcon, UserIcon } from "lucide-react";

import { useCreateRoom } from "@apis/Room/useCreateRoom";

import { Button } from "@components/ui";

import { RoomMemberHistoryAtom } from "@stores/RoomStore";

type UserInfoPopoverProps = {
  senderId: string;
};

export const UserInfoPopover = ({ senderId }: UserInfoPopoverProps) => {
  const roomMembers = useAtomValue(RoomMemberHistoryAtom);
  const member = roomMembers.find((member) => member.id === senderId);
  const navigate = useNavigate();
  const { mutate: createRoomMutate } = useCreateRoom();

  if (!member) {
    return (
      <div className="p-4 text-center text-gray-500">
        멤버 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center bg-blue-500 bg-gradient-to-r p-6 text-white">
        <div className="mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white/30 shadow-lg">
          <img
            src={member.profileImageUrl}
            alt={`${member.name}'s profile`}
            className="h-full w-full object-cover"
          />
        </div>
        <h3 className="text-xl font-bold">{member.name}</h3>
      </div>

      <div className="divide-y divide-gray-100">
        <Button
          variant="ghost"
          className="flex w-full items-center px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          onClick={() => {
            navigate(`/user/${senderId}`);
          }}
        >
          <UserIcon className="mr-3 h-4 w-4 text-gray-400" />
          프로필 보기
        </Button>
        <Button
          variant="ghost"
          className="flex w-full items-center px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          onClick={() => {
            createRoomMutate(
              {
                roomType: "DIRECT",
                memberIds: [senderId],
                name: member.name,
              },
              {
                onSuccess: (res) => {
                  navigate(`/room/${res.roomId}`);
                },
              }
            );
          }}
        >
          <MailIcon className="mr-3 h-4 w-4 text-gray-400" />
          메시지 보내기
        </Button>
      </div>
    </div>
  );
};
