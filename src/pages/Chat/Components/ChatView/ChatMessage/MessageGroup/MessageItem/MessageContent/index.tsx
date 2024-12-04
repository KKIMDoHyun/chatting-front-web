import React, { useState } from "react";

import { Pin } from "lucide-react";

import { TChatMessageDetail } from "@typings/Chat";

import { useModal } from "@components/Modal/useModal";

import { CreateNoticeModal } from "./CreateNoticeModal";
import { FileMessage } from "./FileMessage";
import { ImageMessage } from "./ImageMessage";
import { TextMessage } from "./TextMessage";

type MessageContentProps = {
  message: TChatMessageDetail;
  isCurrentUser: boolean;
  timeValue: string;
  showTime: boolean;
  roomId: string;
};

export const MessageContent = React.memo(
  ({
    message,
    isCurrentUser,
    showTime,
    timeValue,
    roomId,
  }: MessageContentProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { showCustomModal, closeCustomModal } = useModal();
    const renderMessage = () => {
      switch (message.messageType) {
        case "IMAGE":
          return (
            <ImageMessage
              file={message.files[0]}
              senderId={message.senderId}
              createdAt={message.createdAt}
            />
          );
        case "FILE":
          return <FileMessage file={message.files[0]} />;
        default:
          return (
            <TextMessage
              isCurrentUser={isCurrentUser}
              plainText={message.plainText}
            />
          );
      }
    };

    const handleNoticeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      showCustomModal({
        displayComponent: (
          <CreateNoticeModal
            roomId={roomId}
            messageId={message.id}
            closeModal={closeCustomModal}
          />
        ),
        isShowClose: false,
      });
    };

    return (
      <div
        className={`group relative flex ${
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        } gap-2`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex items-end ${!isCurrentUser && "ml-12"}`}>
          {renderMessage()}

          {isHovered && (
            <button
              onClick={handleNoticeClick}
              className={`flex h-6 w-6 items-center justify-center text-gray-600 opacity-0 transition-opacity hover:rounded-full hover:bg-gray-200 group-hover:opacity-100 ${
                isCurrentUser ? "order-first mr-1" : "order-last ml-1"
              }`}
            >
              <Pin size={10} />
            </button>
          )}
        </div>

        {message.unreadUserIds.length > 0 && (
          <div className="self-end text-xs text-yellow-500">
            {message.unreadUserIds.length}
          </div>
        )}
        {showTime && (
          <div className="self-end text-[10px] text-gray-400">{timeValue}</div>
        )}
      </div>
    );
  }
);
