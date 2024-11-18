import { useGetTypedMessages } from "@apis/Chat/useGetTypedMessages";

import { TFile } from "@typings/Chat";

import { QueryWrapper } from "@components/QueryWrapper";

import { NoContentMessage } from "../NoContentMessage";
import { VideoCard } from "./VideoCard";

type VideoTabProps = {
  roomId: string;
};

export const VideoTab = ({ roomId }: VideoTabProps) => {
  const query = useGetTypedMessages({
    roomId,
    page: 0,
    messageType: "VIDEO",
    size: 10000,
  });

  return (
    <QueryWrapper query={query}>
      {(data) => {
        const allFiles = data.content.reduce<TFile[]>((acc, content) => {
          return [...acc, ...content.files];
        }, []);

        if (!allFiles.length) {
          return <NoContentMessage message="동영상이 없습니다." />;
        }

        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {allFiles.map((file) => (
              <div
                key={file.url}
                className="relative aspect-square overflow-hidden rounded-md shadow-md transition-shadow hover:shadow-lg"
              >
                <VideoCard
                  src={file.url}
                  alt={file.name}
                  layout="fill"
                  objectFit="cover"
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
