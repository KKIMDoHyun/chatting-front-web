import { useGetNoticeMessages } from "@apis/Chat/useGetNoticeMessages";

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
        if (!data.content.length) {
          return <NoContentMessage message="공지사항이 없습니다." />;
        }

        return (
          <div className="flex flex-col gap-3">
            {data.content.map((c) => (
              <div
                key={c.id}
                className="relative w-full overflow-hidden rounded-md shadow-md transition-shadow hover:shadow-lg"
              >
                <NoticeCard content={c} />
              </div>
            ))}
          </div>
        );
      }}
    </QueryWrapper>
  );
};
