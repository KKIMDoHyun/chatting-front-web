import { TUser } from "@typings/User";

import { TTabMenu } from "@stores/TabStore";

import { RoomList } from "./RoomList";
import { UserList } from "./UserList";

type ContentPanelProps = {
  tab: TTabMenu["path"];
  myInfo: TUser;
};

export const ContentPanel = ({ tab, myInfo }: ContentPanelProps) => (
  <div className="relative h-full overflow-hidden">
    {tab === "user" ? <UserList myInfo={myInfo} /> : <RoomList />}
  </div>
);
