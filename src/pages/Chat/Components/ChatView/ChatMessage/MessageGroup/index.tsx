import dayjs from "dayjs";

import { changeDate } from "@utils/changeDate";
import { checkDisplayProfile } from "@utils/checkDisplayProfile";

import { TChatMessageDetail } from "@typings/Chat";
import { TUser } from "@typings/User";

import { MessageItem } from "./MessageItem";

type MessageGroupProps = {
  date: string;
  groupedMessagesByUser: Array<Array<TChatMessageDetail>>;
  myInfo: TUser | null;
  roomId: string;
};

export const MessageGroup = ({
  date,
  groupedMessagesByUser,
  myInfo,
  roomId,
}: MessageGroupProps) => (
  <div className="flex flex-col">
    <div className="self-center rounded-xl bg-slate-200 px-4 py-1 text-sm">
      {date}
    </div>
    {groupedMessagesByUser.map((group) =>
      group.map((message, messageIndex) => (
        <MessageItem
          key={message.id}
          message={message}
          isCurrentUser={message.senderId === myInfo?.id}
          displayProfile={checkDisplayProfile(
            group,
            message,
            messageIndex,
            myInfo
          )}
          roomId={roomId}
          timeValue={changeDate(dayjs(message.createdAt))}
          showTime={messageIndex === group.length - 1}
        />
      ))
    )}
  </div>
);
