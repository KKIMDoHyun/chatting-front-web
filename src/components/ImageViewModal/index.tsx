import React, { useState } from "react";

import dayjs from "dayjs";
import { useAtomValue } from "jotai";

import { downloadFile } from "@utils/downloadFile";

import { TChatMessageDetail, TFile } from "@typings/Chat";

import { RoomMemberHistoryAtom } from "@stores/RoomStore";

type ImageViewModalProps = {
  senderId: string;
  createdAt: string;
  file: TFile;
  closeModal: () => void;
};

export const ImageViewModal: React.FC<ImageViewModalProps> = ({
  senderId,
  createdAt,
  file,
  closeModal,
}: ImageViewModalProps) => {
  const memberHistory = useAtomValue(RoomMemberHistoryAtom);
  const memberInfo = memberHistory.find((member) => member.id === senderId);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (file: TChatMessageDetail["files"][0]) => {
    setIsDownloading(true);
    const success = await downloadFile(file.url, file.name);
    setIsDownloading(false);
    if (!success) {
      // [TODO: 다운로드 실패할 경우 에러 처리]
    }
  };

  return (
    <div className="flex h-[600px] w-[600px] flex-col rounded-lg bg-white shadow-2xl">
      <div className="flex w-full flex-row items-center justify-center gap-3 border-b p-2">
        <span className="font-bold">{memberInfo?.name}</span>
        <span className="text-sm text-gray-600">
          {dayjs(createdAt).format("YYYY-MM-DD")}
        </span>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <img
          src={file.url}
          alt={file.name}
          className="absolute h-full w-full object-contain"
        />
      </div>

      <div className="flex w-full justify-end gap-4 border-t p-3">
        <button
          onClick={closeModal}
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition duration-300 hover:bg-gray-300"
        >
          닫기
        </button>
        <button
          onClick={() => handleDownload(file)}
          disabled={isDownloading}
          className={`rounded-md px-4 py-2 text-white transition duration-300 ${
            isDownloading
              ? "cursor-not-allowed bg-blue-300"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isDownloading ? "다운로드 중..." : "저장"}
        </button>
      </div>
    </div>
  );
};
