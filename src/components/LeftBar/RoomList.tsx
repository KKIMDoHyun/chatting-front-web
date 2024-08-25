import React, { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import dayjs from "dayjs";
import { useAtom } from "jotai";
import { EllipsisVertical } from "lucide-react";

import { useGetRooms } from "@apis/Room/useGetRooms";

import { TRoom } from "@typings/Room";

import { RoomPopover } from "@components/LeftBar/RoomPopover";
import { Spinner } from "@components/Spinner";

import { RoomListAtom } from "@stores/RoomStore";

type RoomItemProps = {
  room: TRoom;
  isActive: boolean;
  onRoomClick: (roomId: string) => void;
  activeRoomId: string | null;
  setActiveRoomId: (roomId: string | null) => void;
};

const formatDate = (date: string): string => {
  const messageDate = dayjs(date);
  const today = dayjs().startOf("day");

  if (messageDate.isSame(today, "day")) {
    return messageDate.format("A h:mm");
  }
  return messageDate.format("YYYY-MM-DD");
};

const RoomItem = ({
  room,
  isActive,
  onRoomClick,
  activeRoomId,
  setActiveRoomId,
}: RoomItemProps) => {
  const formattedDate = () => formatDate(room.latestMessage.createdAt);
  const isActiveRoom = activeRoomId === room.id;

  return (
    <li
      onClick={() => onRoomClick(room.id)}
      onMouseEnter={() => setActiveRoomId(room.id)}
      onMouseLeave={() => !isActiveRoom && setActiveRoomId(null)}
      className={`relative flex h-20 cursor-pointer items-center gap-4 rounded-xl p-4 transition-colors duration-200 ${
        isActive ? "bg-blue-50" : "bg-white hover:bg-gray-50"
      }`}
    >
      <img
        width={48}
        height={48}
        className="rounded-full border border-gray-200 object-cover"
        src="/src/assets/HNS.png"
        alt={`${room.name} icon`}
      />
      <div className="flex-grow overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="max-w-[150px] truncate text-sm font-semibold text-gray-800">
              {room.name}
            </span>
            <span className="text-xs text-gray-500">{room.members.length}</span>
          </div>
          {!isActiveRoom && (
            <span className="text-xs text-gray-500">{formattedDate()}</span>
          )}
        </div>
        <p className="mt-1 truncate text-sm text-gray-600">
          {room.latestMessage.content}
        </p>
      </div>

      {isActiveRoom && (
        <RoomPopover roomId={room.id} onClose={() => setActiveRoomId(null)}>
          <button className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
            <EllipsisVertical size={18} />
          </button>
        </RoomPopover>
      )}
    </li>
  );
};

export const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [roomList, setRoomList] = useAtom(RoomListAtom);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const roomListRef = useRef<HTMLUListElement>(null);

  const { data, isLoading, error } = useGetRooms();

  const handleRoomClick = (roomId: string) => {
    navigate(`room/${roomId}`);
  };

  useEffect(() => {
    if (data) {
      setRoomList(data);
    }
  }, [data, setRoomList]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roomListRef.current &&
        !roomListRef.current.contains(event.target as Node)
      ) {
        setActiveRoomId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) return <Spinner />;
  if (error) throw error;
  if (!data) return <div>데이터가 없습니다.</div>;

  return (
    <ul className="flex h-full w-full flex-col space-y-2 overflow-auto p-2">
      {roomList.map((room) => (
        <RoomItem
          key={room.id}
          room={room}
          isActive={room.id === id}
          onRoomClick={handleRoomClick}
          activeRoomId={activeRoomId}
          setActiveRoomId={setActiveRoomId}
        />
      ))}
    </ul>
  );
};
// useEffect(() => {
//   if (isReady) {
//     subscribe({
//       channel: `ROOM_CHANGED_${String(id)}`,
//       callbackFn: (data) => {
//         const roomIds = roomList.map((v) => v.id);
//         // roomList에 이미 id가 있으면 -> 이미 있는 채팅방 -> 맨 위로 옮기기
//         if (roomIds.includes((data as RoomChanged["data"]).room.id)) {
//           const newRoomList = [...roomList];
//           const foundRoomIdx = roomIds.findIndex(
//             (v) => v === (data as RoomChanged["data"]).room.id
//           );
//           newRoomList.splice(foundRoomIdx, 1);
//           newRoomList.unshift((data as RoomChanged["data"]).room);
//           setRoomList(newRoomList);
//         }
//         // roomList에 id가 없음 -> 새로운 채팅방임 -> 맨 위로 생성
//         else {
//           setRoomList((prev) => [
//             (data as RoomChanged["data"]).room,
//             ...prev,
//           ]);
//         }
//       },
//     });
//   }
// }, [id, isReady, roomList, setRoomList, subscribe]);
