import { useAtomValue } from "jotai";

import { RoomNoticeAtom } from "@stores/RoomStore";

export const Notice = () => {
  const roomNotice = useAtomValue(RoomNoticeAtom);

  return (
    <div className="sticky top-0 z-10 bg-slate-800 px-5 py-3 text-white opacity-95">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs">
          📢
        </span>
        <span className="text-sm">{roomNotice?.plainText}</span>
      </div>
    </div>
  );
};
