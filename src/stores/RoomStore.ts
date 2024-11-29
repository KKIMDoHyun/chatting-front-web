import { atom } from "jotai";

import { TChatMessageDetail } from "@typings/Chat";
import { TRoom } from "@typings/Room";
import { TMember } from "@typings/User";

export const RoomListAtom = atom<TRoom[]>([]);

export const RoomMemberHistoryAtom = atom<TMember[]>([]);

export const RoomNoticeAtom = atom<TChatMessageDetail | null>(null);
