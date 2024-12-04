import {
  CreateMessageEvent,
  CreateNoticeEvent,
  CreateRoomEvent,
  FocusRoomEvent,
  UnFocusRoomEvent,
  UpdateRoomEvent,
} from "./WebsocketMessage.type";

export type TSocketMessage =
  | CreateMessageEvent
  | CreateRoomEvent
  | UpdateRoomEvent
  | CreateNoticeEvent
  | FocusRoomEvent
  | UnFocusRoomEvent;

export type TChannel = TSocketMessage["type"];

export type CallbackProps = TSocketMessage["data"];

export type subscribeProps = {
  channel: TChannel;
  callbackFn: (props: CallbackProps) => void;
};

export type unsubscribeProps = subscribeProps;

export type SendRequestProps = {
  type: string;
  data?: CallbackProps;
};
