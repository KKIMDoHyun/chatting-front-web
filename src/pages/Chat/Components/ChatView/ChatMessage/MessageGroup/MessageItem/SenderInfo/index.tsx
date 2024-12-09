import { useState } from "react";

import { useAtomValue } from "jotai";

import { Popover, PopoverContent, PopoverTrigger } from "@components/ui";

import { RoomMemberHistoryAtom } from "@stores/RoomStore";

import { UserInfoPopover } from "./UserInfoPopover";

type SenderInfoProps = {
  isCurrentUser: boolean;
  displayProfile: boolean;
  senderId: string;
};

export const SenderInfo = ({
  isCurrentUser,
  displayProfile,
  senderId,
}: SenderInfoProps) => {
  const memberHistory = useAtomValue(RoomMemberHistoryAtom);
  const memberInfo = memberHistory.find((member) => member.id === senderId);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {!isCurrentUser && displayProfile ? (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-400">
              {memberInfo?.profileImageUrl && (
                <img
                  src={memberInfo.profileImageUrl}
                  alt={`${memberInfo.name}'s profile`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 overflow-hidden p-0">
            <UserInfoPopover senderId={senderId} />
          </PopoverContent>
        </Popover>
      ) : (
        <div className="w-10" />
      )}
      {displayProfile && !isCurrentUser && (
        <p className="mb-1 text-sm text-gray-600">
          {memberInfo?.name || senderId}
        </p>
      )}
    </div>
  );
};
