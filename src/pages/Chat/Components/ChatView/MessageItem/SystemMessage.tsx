import React from "react";

import { useAtomValue } from "jotai";

import { RoomMemberHistoryAtom } from "@stores/RoomStore";

const MEMBER_ID_PATTERN = /\{([^}]+)\}/g;

type SystemMessageProps = {
  plainText: string;
};

export const SystemMessage = React.memo(({ plainText }: SystemMessageProps) => {
  const memberHistory = useAtomValue(RoomMemberHistoryAtom);
  const memberMap = new Map(
    memberHistory.map((member) => [member.id, member.name])
  );

  const formattedMessage = plainText.replace(MEMBER_ID_PATTERN, (_, id) => {
    return memberMap.get(id) || id;
  });

  return (
    <div className="flex justify-center py-5">
      <div className="flex w-full max-w-[700px] justify-center">
        <span className="break-words rounded-xl bg-gray-100 px-4 py-1 text-center text-xs font-semibold text-gray-500">
          {formattedMessage}
        </span>
      </div>
    </div>
  );
});
