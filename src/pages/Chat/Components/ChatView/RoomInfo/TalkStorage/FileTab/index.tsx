import { useGetTypedMessages } from "@apis/Chat/useGetTypedMessages";

import { TFile } from "@typings/Chat";

import { QueryWrapper } from "@components/QueryWrapper";

import { NoContentMessage } from "../NoContentMessage";
import { FileCard } from "./FileCard";

type FileTabProps = {
  roomId: string;
};

export const FileTab = ({ roomId }: FileTabProps) => {
  const query = useGetTypedMessages({
    roomId,
    page: 0,
    messageType: "FILE",
    size: 10000,
  });

  return (
    <QueryWrapper query={query}>
      {(data) => {
        const allFiles = data.content.reduce<TFile[]>((acc, content) => {
          return [...acc, ...content.files];
        }, []);

        if (!allFiles.length) {
          return <NoContentMessage message="파일이 없습니다." />;
        }

        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2">
            {allFiles.map((file) => (
              <FileCard key={file.url} file={file} />
            ))}
          </div>
        );
      }}
    </QueryWrapper>
  );
};
