import { atom } from "jotai";

import { TRoom } from "@typings/Room";
import { TMember } from "@typings/User";

export const RoomListAtom = atom<TRoom[]>([]);

export const RoomMemberHistoryAtom = atom<TMember[]>([]);
