import { FileIcon, defaultStyles } from "react-file-icon";

import { Download } from "lucide-react";
import mime from "mime-types";

import { downloadFile } from "@utils/downloadFile";
import { isValidExtension } from "@utils/isValidExtension";

import { TChatMessageDetail, TFile } from "@typings/Chat";

type FileMessageProps = {
  file: TFile;
};

export const FileMessage = ({ file }: FileMessageProps) => {
  const fileSize = `${(file.size / 1024).toFixed(1)} KB`;

  const handleDownload = async (file: TChatMessageDetail["files"][0]) => {
    const success = await downloadFile(file.url, file.name);
    if (!success) {
      // [TODO: 다운로드 실패할 경우 에러 처리]
    }
  };

  const extension = mime.extension(file.mimeType);
  const validExtension = isValidExtension(extension) ? extension : "txt";

  return (
    <div className="flex min-w-[200px] max-w-[300px] flex-col rounded-lg border bg-white p-3 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-[30px] flex-shrink-0">
          <FileIcon
            extension={validExtension}
            {...defaultStyles[validExtension]}
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-semibold">{file.name}</span>
          <span className="text-xs text-gray-500">{fileSize}</span>
        </div>
      </div>
      <button
        onClick={() => handleDownload(file)}
        className="flex items-center gap-2 self-end rounded-md px-2 py-1 text-sm hover:bg-gray-50"
      >
        <Download size={16} />
        저장
      </button>
    </div>
  );
};
