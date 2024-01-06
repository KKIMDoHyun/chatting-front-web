import { Logo } from "@components/Gnb/Logo";

export const Gnb: React.FC = () => {
  const Menu: { label: string; href: string }[] = [
    {
      label: "중고거래",
      href: "/",
    },
    {
      label: "동네업체",
      href: "/",
    },
    {
      label: "알바",
      href: "/",
    },
    {
      label: "부동산 직거래",
      href: "/",
    },
    {
      label: "중고차 직거래",
      href: "/",
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-[64px] z-[999] bg-white">
      <div className="flex flex-row h-full items-center px-[2rem] py-[1.2rem] justify-between max-w-[120rem] my-0 mx-auto">
        <a className="mr-[3.6rem] items-center" href="/">
          <Logo />
        </a>

        <nav className="flex flex-row w-full pr-[4rem]">
          <ul className="list-none inline-block font-bold">
            {Menu.map((menu) => (
              <li key={menu.label} className=" inline-block">
                <a className="text-[1.8rem] mr-[3rem]" href={menu.href}>
                  {menu.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-row items-center justify-center gap-[1.2rem]">
          <form>
            <input
              type="search"
              placeholder="물품이나 동네를 검색해보세요"
              className="w-[28.8rem] text-[1.6rem] py-[0.9rem] px-[1.2rem] h-[4rem] bg-gray-100 rounded-md"
            />
          </form>
          <button className="text-[1.6rem] px-[1.6rem] py-[0.8rem] w-fit font-bold whitespace-nowrap rounded-md border-[1px] border-gray-400 hover:bg-gray-100 hover:opacity-[0.7]">
            채팅하기
          </button>
        </div>
      </div>
    </div>
  );
};
