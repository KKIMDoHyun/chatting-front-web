import React from "react";

import { TChatMessageDetail } from "@typings/Chat";

export const MessageItem: React.FC<{
  message: TChatMessageDetail;
  isCurrentUser: boolean;
  displayProfile: boolean;
  isStandardMessage: boolean;
  timeValue: string;
  standardMessageRef: React.RefObject<HTMLDivElement>;
}> = React.memo(
  ({
    message,
    isCurrentUser,
    displayProfile,
    isStandardMessage,
    timeValue,
    standardMessageRef,
  }) => {
    if (message.senderType === "SYSTEM") {
      return (
        <div className="flex justify-center">
          <span className="rounded-3xl bg-slate-200 px-6 py-1 text-[14px]">
            {message.plainText}
          </span>
        </div>
      );
    }

    return (
      <div
        ref={isStandardMessage ? standardMessageRef : null}
        className={`flex ${
          isCurrentUser ? "flex-row-reverse self-end" : "flex-row self-start"
        } mt-1`}
      >
        <div className="flex">
          {displayProfile && !isCurrentUser ? (
            <div className="h-[40px] w-[40px] rounded-3xl bg-slate-400" />
          ) : !isCurrentUser ? (
            <div className="w-[40px]" />
          ) : null}

          <div className="ml-[5px]">
            {displayProfile && !isCurrentUser && (
              <p className="mb-[5px]">{message.sender.name}</p>
            )}
            <div
              className={`${
                isCurrentUser ? "bg-green-300" : "bg-gray-200"
              } max-w-[484px] rounded-2xl p-[8px] text-[14px]`}
            >
              {message.plainText.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-2 self-end text-[10px]">{timeValue}</div>
      </div>
    );
  }
);
