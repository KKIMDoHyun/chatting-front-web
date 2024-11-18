import { FileIcon, defaultStyles } from "react-file-icon";

import dayjs from "dayjs";
import { Download } from "lucide-react";
import mime from "mime-types";

import { downloadFile } from "@utils/downloadFile";

import { TChatMessageDetail, TFile } from "@typings/Chat";

import { formatFileSize, isValidExtension } from "./utils";

type FileCardProps = {
  file: TFile;
};

export const FileCard = ({ file }: FileCardProps) => {
  const extension = mime.extension(file.mimeType);
  const validExtension = isValidExtension(extension) ? extension : "txt";

  const handleDownload = async (file: TChatMessageDetail["files"][0]) => {
    const success = await downloadFile(file.url, file.name);
    if (!success) {
      // [TODO: 다운로드 실패할 경우 에러 처리]
    }
  };

  return (
    <div className="flex h-full cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-md hover:shadow-lg">
      <div className="w-[50px]">
        <FileIcon
          extension={validExtension}
          {...defaultStyles[validExtension]}
        />
      </div>

      <div className="flex flex-col justify-between gap-3">
        <div className="flex flex-col">
          <h3 className="truncate text-sm font-medium">{file.name}</h3>
          {/* TODO 24.10.07 : 추후 유효기간 필드로 변경 */}
          <p className="text-xs text-gray-400">
            유효기간: {dayjs().format("YYYY.MM.DD")}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
          <button
            onClick={() => handleDownload(file)}
            className="flex items-center gap-1 self-end text-xs text-gray-500 hover:text-gray-700"
          >
            <Download size={14} />
            <span>다운로드</span>
          </button>
        </div>
      </div>
    </div>
  );
};
