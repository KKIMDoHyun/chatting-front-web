export type TChatMessageDetail = {
  id: string;
  roomId: string;
  messageType: TMessageType;
  senderType: TSenderType;
  senderId: string;
  createdAt: string;
  updatedAt: string;
  plainText: string;
  files: TFile[];
  options: string[];
  reactions: TReaction[];
  replyTo: string | null;
  isDeleted: boolean;
  isNotice: boolean;
};

type TReaction = {
  emojiName: string;
  memberIds: string[];
};

export type TFile = {
  name: string;
  size: number;
  mimeType: string;
  url: string;
};

export type TLastMessage = Pick<
  TChatMessageDetail,
  "id" | "messageType" | "senderType" | "senderId" | "createdAt" | "plainText"
>;

export type TMessageType = "TEXT" | "IMAGE" | "VIDEO" | "FILE";
export type TSenderType = "USER" | "SYSTEM";

export type TTalkStorage = {
  id: string;
  senderId: string;
  createdAt: string;
  messageType: "NOTICE" | "IMAGE" | "VIDEO" | "FILE";
  files: TFile[];
};
