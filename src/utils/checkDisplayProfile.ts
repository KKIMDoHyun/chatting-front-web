import { TChatMessageDetail } from "@typings/Chat";
import { TUser } from "@typings/User";

export const checkDisplayProfile = (
  messages: TChatMessageDetail[],
  currentMessage: TChatMessageDetail,
  index: number,
  currentUser: TUser | null
): boolean => {
  if (currentMessage.senderId === currentUser?.id) return false;
  if (index === 0) return true;
  const prevMessage = messages[index - 1];
  return prevMessage.senderId !== currentMessage.senderId;
};
