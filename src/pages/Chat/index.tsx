import { useLocation, useParams } from "react-router-dom";

import { ChatView } from "./Components/ChatView";
import { NoChatView } from "./Components/NoChatView";
import { UserInfo } from "./Components/UserInfo";

export const ChatPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];

  if (!id) return <NoChatView />;

  const Content =
    currentPath === "user" ? <UserInfo userId={id} /> : <ChatView />;

  return (
    <section className="flex h-full min-w-[812px] flex-col">{Content}</section>
  );
};
