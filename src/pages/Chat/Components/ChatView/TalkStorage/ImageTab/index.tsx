import { useGetImages } from "@apis/Room/useGetImages";

import { QueryWrapper } from "@components/QueryWrapper";

import { NoContentMessage } from "../NoContentMessage";
import { ImageCard } from "./ImageCard";

type ImageTabProps = {
  roomId: string;
};

export const ImageTab = ({ roomId }: ImageTabProps) => {
  const query = useGetImages({ roomId, page: 0, messageType: "IMAGE" });

  return (
    <QueryWrapper query={query}>
      {(data) => (
        <>
          {data.contents.length === 0 ? (
            <NoContentMessage message="이미지가 없습니다." />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {data.contents.flatMap((content) =>
                content.files.map((file) => (
                  <div
                    key={file.url}
                    className="relative aspect-square overflow-hidden rounded-md shadow-md transition-shadow hover:shadow-lg"
                  >
                    <ImageCard
                      src={file.url}
                      alt={file.name}
                      className="transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 truncate bg-black bg-opacity-50 p-1 text-sm text-white">
                      {file.name}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </QueryWrapper>
  );
};
