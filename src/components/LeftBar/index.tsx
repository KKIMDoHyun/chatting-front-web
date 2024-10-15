import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useAtom, useAtomValue } from "jotai";

import { TAB_MENU, TabAtom } from "@stores/TabStore";
import { MyInfoAtom } from "@stores/UserStore";

import { ContentPanel } from "./ContentPanel";
import { SearchAndAddRoom } from "./SearchAndAddRoom";
import { TabMenu } from "./TabMenu";
import { UserInfo } from "./UserInfo";

export const LeftBar = () => {
  const [tab, setTab] = useAtom(TabAtom);
  const myInfo = useAtomValue(MyInfoAtom);
  const navigate = useNavigate();

  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.split("/")[1];
    setTab(path === "user" ? "user" : "room");
  }, [location.pathname, setTab]);

  if (!myInfo) return null;

  return (
    <nav className="flex w-[350px] min-w-[350px] flex-col overflow-hidden border-r border-gray-200 bg-white shadow-lg">
      <UserInfo myInfo={myInfo} />
      <SearchAndAddRoom navigate={navigate} />
      <TabMenu tab={tab} setTab={setTab} tabMenu={TAB_MENU} />
      <ContentPanel tab={tab} myInfo={myInfo} />
    </nav>
  );
};
