import { useGetImages } from "@apis/Room/useGetImages";

import { QueryWrapper } from "@components/QueryWrapper";

import { NoContentMessage } from "../NoContentMessage";
import { FileCard } from "./FileCard";

type FileTabProps = {
  roomId: string;
};

export const FileTab = ({ roomId }: FileTabProps) => {
  const query = useGetImages({ roomId, page: 0, messageType: "FILE" });

  return (
    <QueryWrapper query={query}>
      {(data) => (
        <>
          {data.contents.length === 0 ? (
            <NoContentMessage message="파일이 없습니다." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2">
              {data.contents.flatMap((content) =>
                content.files.map((file) => (
                  <FileCard key={file.url} file={file} />
                ))
              )}
            </div>
          )}
        </>
      )}
    </QueryWrapper>
  );
};
