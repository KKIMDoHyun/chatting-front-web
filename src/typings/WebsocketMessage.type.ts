import { TChatMessageDetail, TLastMessage } from "./Chat";
import { TRoomType } from "./Room";

/**
 * 메세지 생성
 */
export type CreateMessageEvent = {
  type: "MESSAGE_CREATED";
  data: TChatMessageDetail;
};

/**
 * 채팅방 생성
 */
export type CreateRoomEvent = {
  type: "ROOM_CREATED";
  data: {
    id: string;
    name: string;
    roomType: TRoomType;
    createdAt: string;
    updatedAt: string;
    memberIds: string[];
    lastMessage: TLastMessage;
  };
};

/**
 * 채팅방 변경
 */
export type UpdateRoomEvent = {
  type: "ROOM_CHANGED";
  data: {
    id: string;
    name: string;
    roomType: TRoomType;
    createdAt: string;
    updatedAt: string;
    memberIds: string[];
  };
};

/**
 * 공지사항 등록
 */
export type CreateNoticeEvent = {
  type: "NOTICE_CREATED";
  data: TChatMessageDetail;
};

/**
 * 채팅방 포커스
 */
export type FocusRoomEvent = {
  type: "ROOM_FOCUSED";
  data: {
    roomId: string;
  };
};

/**
 * 채팅방 포커스 해제
 */
export type UnFocusRoomEvent = {
  type: "ROOM_UNFOCUSED";
  data: {
    roomId: string;
  };
};

/**
 * 유저 정보 수정
 */
export type ChangeUserEvent = {
  type: "USER_CHANGED";
  data: {
    userId: string;
    name: string;
    email: string;
    phoneNumber: string;
    profileImageUrl: string;
  };
};

/**
 * 읽은 사람 확인
 */
export type UpdateReadReceiptEvent = {
  type: "READ_RECEIPT_UPDATED";
  data: {
    userId: string;
    roomId: string;
    fromMessageId: string;
    toMessageId: string;
    updatedAt: string;
  };
};
