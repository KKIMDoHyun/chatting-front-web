import { useGetNoticeMessages } from "@apis/Chat/useGetNoticeMessages";

import { TFile } from "@typings/Chat";

import { QueryWrapper } from "@components/QueryWrapper";

import { NoContentMessage } from "../NoContentMessage";
import { NoticeCard } from "./NoticeCard";

type NoticeTabProps = {
  roomId: string;
};

export const NoticeTab = ({ roomId }: NoticeTabProps) => {
  const query = useGetNoticeMessages({ roomId });

  return (
    <QueryWrapper query={query}>
      {(data) => {
        // 모든 content의 files를 하나의 배열로 평탄화
        const allFiles = data.content.reduce<TFile[]>((acc, content) => {
          return [...acc, ...content.files];
        }, []);

        if (!allFiles.length) {
          return <NoContentMessage message="공지사항이 없습니다." />;
        }

        return (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {allFiles.map((file) => (
              <div
                key={file.url}
                className="relative aspect-square overflow-hidden rounded-md shadow-md transition-shadow hover:shadow-lg"
              >
                <NoticeCard
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
