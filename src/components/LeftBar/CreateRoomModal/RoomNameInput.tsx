import React from "react";

type RoomNameInputProps = {
  roomName: string;
  setRoomName: (name: string) => void;
};

export const RoomNameInput: React.FC<RoomNameInputProps> = ({
  roomName,
  setRoomName,
}) => (
  <div className="mb-6 w-full">
    <input
      type="text"
      placeholder="채팅방 이름 입력 (선택사항)"
      value={roomName}
      onChange={(e) => setRoomName(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
    />
  </div>
);
