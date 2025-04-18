import { useEffect, useState } from "react";

import { Navigate, useLocation, useParams } from "react-router-dom";

import { useSetAtom } from "jotai";
import { Archive } from "lucide-react";

import LOGO from "@assets/chat-logo.png";

import { useGetRoomInfo } from "@apis/Room/useGetRoomInfo";

import { useWebSocketSubscription } from "@hooks/useWebSocketSubscription";

import { TMember } from "@typings/User";
import { ChangeUserEvent } from "@typings/WebsocketMessage.type";
import { CallbackProps } from "@typings/WebsocketProvider.type";

import { QueryWrapper } from "@components/QueryWrapper";
import { Button } from "@components/ui";

import { RoomMemberHistoryAtom, RoomNoticeAtom } from "@stores/RoomStore";

import { TalkStorage } from "./TalkStorage";
import { UsersInRoom } from "./UsersInRoom";

export const RoomInfo = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const query = useGetRoomInfo({ roomId: roomId ?? "" });
  const setRoomNotice = useSetAtom(RoomNoticeAtom);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const setMemberHistory = useSetAtom(RoomMemberHistoryAtom);
  const location = useLocation();

  const handleChangeUser = (data: CallbackProps) => {
    const changedUser = data as ChangeUserEvent["data"];

    setMemberHistory((prev) =>
      prev.map((member: TMember) => {
        if (member.id === changedUser.userId) {
          return {
            ...member,
            id: changedUser.userId,
            name: changedUser.name,
            profileImageUrl: changedUser.profileImageUrl,
          };
        }
        return member;
      })
    );
  };

  useEffect(() => {
    if (query.data) {
      setRoomNotice(query.data.notice);
      setMemberHistory(query.data.memberHistory);
    }
  }, [query.data, location, setMemberHistory, setRoomNotice]);

  useWebSocketSubscription("USER_CHANGED", handleChangeUser);

  if (!roomId) {
    return <Navigate to="/room" replace />;
  }

  return (
    <QueryWrapper query={query}>
      {(data) => (
        <>
          <div className="chatting-divider flex min-h-[64px] items-center justify-between border-b-[1px] px-[20px]">
            <div className="flex w-full items-center gap-[12px]">
              <img width={40} src={LOGO} alt="logo" />
              <div className="flex w-full items-center justify-between pr-6">
                <div className="w-[600px] overflow-hidden text-ellipsis whitespace-nowrap">
                  <span className="text-[16px] font-semibold">{data.name}</span>
                </div>

                <div className="flex flex-row">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    <Archive className="h-5 w-5" />
                  </Button>
                  <UsersInRoom memberSize={data.members.length} />
                </div>
              </div>
            </div>
          </div>

          {/* 톡서랍 */}
          <TalkStorage
            roomId={roomId}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />
        </>
      )}
    </QueryWrapper>
  );
};
