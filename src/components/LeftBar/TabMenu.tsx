import { TTabMenu } from "@stores/TabStore";

type TabMenuProps = {
  tab: TTabMenu["path"];
  setTab: (tab: TTabMenu["path"]) => void;
  tabMenu: { path: TTabMenu["path"]; label: string }[];
};

export const TabMenu = ({ tab, setTab, tabMenu }: TabMenuProps) => (
  <div className="flex h-12 flex-shrink-0 border-b border-gray-200">
    {tabMenu.map((t) => (
      <button
        key={t.path}
        className={`flex flex-1 items-center justify-center text-sm font-medium transition-colors duration-200 ${
          tab === t.path
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-600 hover:bg-gray-50"
        }`}
        onClick={() => setTab(t.path)}
      >
        {t.label}
      </button>
    ))}
  </div>
);
