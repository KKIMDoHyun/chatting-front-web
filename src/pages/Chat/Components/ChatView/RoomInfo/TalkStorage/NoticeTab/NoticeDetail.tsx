import { FileIcon, defaultStyles } from "react-file-icon";

import dayjs from "dayjs";
import { useAtomValue } from "jotai";
import { Download } from "lucide-react";
import mime from "mime-types";

import { changeDate } from "@utils/changeDate";
import { downloadFile } from "@utils/downloadFile";
import { isValidExtension } from "@utils/isValidExtension";

import { TChatMessageDetail } from "@typings/Chat";

import { ImageViewModal } from "@components/ImageViewModal";
import { useModal } from "@components/Modal/useModal";

import { RoomMemberHistoryAtom } from "@stores/RoomStore";

type NoticeDetailProps = {
  content: TChatMessageDetail;
};

export const NoticeDetail = ({ content }: NoticeDetailProps) => {
  const { showCustomModal, closeCustomModal } = useModal();

  const memberHistory = useAtomValue(RoomMemberHistoryAtom);
  const memberInfo = memberHistory.find(
    (member) => member.id === content.senderId
  );

  const handleImageClick = () => {
    showCustomModal({
      displayComponent: (
        <ImageViewModal
          senderId={content.senderId}
          createdAt={content.createdAt}
          file={content.files[0]}
          closeModal={closeCustomModal}
        />
      ),
      isShowClose: false,
    });
  };

  const handleDownload = async (file: TChatMessageDetail["files"][0]) => {
    const success = await downloadFile(file.url, file.name);
    if (!success) {
      // [TODO: 다운로드 실패할 경우 에러 처리]
    }
  };

  const renderMedia = () => {
    if (!content.files.length)
      return (
        <p className="whitespace-pre-wrap break-all">{content.plainText}</p>
      );

    const file = content.files[0];

    if (content.messageType === "IMAGE") {
      return (
        <div className="mb-4 flex justify-center">
          <img
            onClick={handleImageClick}
            src={file.url}
            alt={file.name}
            className="max-h-[300px] w-auto cursor-pointer rounded-lg object-contain"
          />
        </div>
      );
    }

    if (content.messageType === "FILE") {
      const extension = mime.extension(file.mimeType);
      const validExtension = isValidExtension(extension) ? extension : "txt";

      return (
        <div className="flex flex-col gap-1">
          <div className="relative rounded-lg border p-3">
            <div className="flex items-center gap-5">
              <div className="w-8 flex-shrink-0">
                <FileIcon
                  extension={validExtension}
                  {...defaultStyles[validExtension]}
                />
              </div>
              <span className="break-all text-sm">{file.name}</span>
            </div>
          </div>
          <button
            onClick={() => handleDownload(file)}
            className="flex items-center gap-1 self-end text-xs text-gray-500 hover:text-gray-700"
          >
            <Download size={14} />
            <span>다운로드</span>
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
        <span>{memberInfo?.name}</span>
        <span>·</span>
        <span>{dayjs(content.createdAt).format("YYYY.MM.DD")}</span>
        <span>{changeDate(dayjs(content.createdAt))}</span>
      </div>
      <div className="w-full">{renderMedia()}</div>
    </div>
  );
};
