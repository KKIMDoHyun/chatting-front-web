import React from "react";

import { TChatMessageDetail } from "@typings/Chat";

import { MessageContent } from "./MessageContent";
import { SenderInfo } from "./SenderInfo";
import { SystemMessage } from "./SystemMessage";

type MessageItemProps = {
  message: TChatMessageDetail;
  isCurrentUser: boolean;
  displayProfile: boolean;
  roomId: string;
  timeValue: string;
  showTime: boolean;
};

export const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({ message, isCurrentUser, displayProfile, timeValue, showTime, roomId }) => {
    if (message.senderType === "SYSTEM") {
      return <SystemMessage plainText={message.plainText} />;
    }

    return (
      <div
        className={`flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        } mb-2`}
      >
        <SenderInfo
          displayProfile={displayProfile}
          isCurrentUser={isCurrentUser}
          senderId={message.senderId}
        />
        <MessageContent
          message={message}
          roomId={roomId}
          isCurrentUser={isCurrentUser}
          timeValue={timeValue}
          showTime={showTime}
        />
      </div>
    );
  }
);
