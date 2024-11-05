import { FileIcon, defaultStyles } from "react-file-icon";

import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import mime from "mime-types";

import { changeDate } from "@utils/changeDate";
import { isValidExtension } from "@utils/isValidExtension";

import { TChatMessageDetail } from "@typings/Chat";

import { RoomMemberHistoryAtom } from "@stores/RoomStore";

type NoticeCardProps = {
  content: TChatMessageDetail;
};

export const NoticeCard = ({ content }: NoticeCardProps) => {
  const memberHistory = useAtomValue(RoomMemberHistoryAtom);
  const memberInfo = memberHistory.find(
    (member) => member.id === content.senderId
  );

  const getFirstLine = (text: string) => {
    const firstLineBreak = text.indexOf("\n");
    return firstLineBreak === -1 ? text : `${text.slice(0, firstLineBreak)}...`;
  };

  const renderMedia = () => {
    if (!content.files.length) return null;

    const file = content.files[0];
    const containerClass = "flex items-center justify-center";

    if (content.messageType === "IMAGE") {
      return (
        <div className={`${containerClass} h-20 w-20`}>
          <img
            src={file.url}
            alt={file.name}
            className="h-full w-full rounded object-cover"
          />
        </div>
      );
    }

    if (content.messageType === "FILE") {
      const extension = mime.extension(file.mimeType);
      const validExtension = isValidExtension(extension) ? extension : "txt";

      return (
        <div className={`${containerClass} w-16`}>
          <FileIcon
            extension={validExtension}
            {...defaultStyles[validExtension]}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-28 w-full cursor-pointer bg-gray-50 p-4 hover:bg-gray-100">
      <div className="flex w-80 flex-shrink-0 flex-col justify-center gap-3">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap break-all text-gray-700">
          {getFirstLine(content.plainText)}
        </p>
        <div className="flex gap-1 text-xs text-gray-500">
          <p>{dayjs(content.createdAt).format("YYYY.MM.DD")}</p>
          <p>{changeDate(dayjs(content.createdAt))}</p>
          <p className="ml-1">{memberInfo?.name}</p>
        </div>
      </div>

      <div className="flex h-full w-full items-center justify-end">
        {renderMedia()}
      </div>
    </div>
  );
};
