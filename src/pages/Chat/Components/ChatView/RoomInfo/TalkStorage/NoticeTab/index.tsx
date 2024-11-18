import { useState } from "react";

import { ArrowLeft } from "lucide-react";

import { useGetNoticeMessages } from "@apis/Chat/useGetNoticeMessages";

import { TChatMessageDetail } from "@typings/Chat";

import { QueryWrapper } from "@components/QueryWrapper";

import { NoContentMessage } from "../NoContentMessage";
import { NoticeCard } from "./NoticeCard";
import { NoticeDetail } from "./NoticeDetail";

type NoticeTabProps = {
  roomId: string;
};

export const NoticeTab = ({ roomId }: NoticeTabProps) => {
  const [selectedNotice, setSelectedNotice] =
    useState<TChatMessageDetail | null>(null);
  const query = useGetNoticeMessages({ roomId });

  const handleNoticeClick = (notice: TChatMessageDetail) => {
    setSelectedNotice(notice);
  };

  const handleBack = () => {
    setSelectedNotice(null);
  };

  return (
    <QueryWrapper query={query}>
      {(data) => {
        if (!data.content.length) {
          return (
            <div className="flex h-full items-center justify-center">
              <NoContentMessage message="공지사항이 없습니다." />
            </div>
          );
        }

        if (selectedNotice) {
          return (
            <div className="flex h-full flex-col bg-white">
              <div className="border-b bg-white/80 px-2 py-4">
                <button
                  onClick={handleBack}
                  className="group flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
                >
                  <ArrowLeft
                    size={20}
                    className="transition-transform group-hover:-translate-x-0.5"
                  />
                  <span className="font-medium">공지사항 목록</span>
                </button>
              </div>

              <NoticeDetail content={selectedNotice} />
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-4">
            <div className="px-2">
              <h2 className="text-lg font-semibold text-gray-900">공지사항</h2>
              <p className="text-sm text-gray-500">
                총 {data.content.length}개의 공지사항이 있습니다
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {data.content.map((notice) => (
                <div
                  key={notice.id}
                  className="group relative w-full cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => handleNoticeClick(notice)}
                >
                  <div className="from-primary-100/0 to-primary-100/10 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100" />
                  <NoticeCard content={notice} />
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </QueryWrapper>
  );
};
