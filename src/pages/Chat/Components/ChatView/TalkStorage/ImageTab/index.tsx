import { useGetTypedMessages } from "@apis/Chat/useGetTypedMessages";

import { TFile } from "@typings/Chat";

import { QueryWrapper } from "@components/QueryWrapper";

import { NoContentMessage } from "../NoContentMessage";
import { ImageCard } from "./ImageCard";

type ImageTabProps = {
  roomId: string;
};

export const ImageTab = ({ roomId }: ImageTabProps) => {
  const query = useGetTypedMessages({
    roomId,
    messageType: "IMAGE",
    page: 0,
    size: 10000,
  });

  return (
    <QueryWrapper query={query}>
      {(data) => {
        const allFiles = data.content.reduce<
          Array<{
            file: TFile;
            senderId: string;
            createdAt: string;
          }>
        >((acc, message) => {
          const messageFiles = message.files.map((file) => ({
            file,
            senderId: message.senderId,
            createdAt: message.createdAt,
          }));
          return [...acc, ...messageFiles];
        }, []);

        if (!allFiles?.length) {
          return <NoContentMessage message="이미지가 없습니다." />;
        }

        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {allFiles.map(({ file, senderId, createdAt }) => (
              <div
                key={file.url}
                className="relative aspect-square overflow-hidden rounded-md shadow-md transition-shadow hover:shadow-lg"
              >
                <ImageCard
                  file={file}
                  senderId={senderId}
                  createdAt={createdAt}
                  className="transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 truncate bg-black bg-opacity-50 p-1 text-sm text-white">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </QueryWrapper>
  );
};
