import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSetAtom } from "jotai";
import { ChevronDown, LogOutIcon, UserIcon } from "lucide-react";

import { useGetMyInfo } from "@apis/User/useGetMyInfo";

import { LogoutModal } from "@components/Gnb/LogoutModal";
import { useModal } from "@components/Modal/useModal";
import { Spinner } from "@components/Spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@components/ui";

import { MyInfoAtom } from "@stores/UserStore";

export const UserInfo = () => {
  const { data, isLoading, error } = useGetMyInfo();
  const navigate = useNavigate();
  const { showCustomModal, closeCustomModal } = useModal();
  const setMyInfo = useSetAtom(MyInfoAtom);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    showCustomModal({
      displayComponent: (
        <LogoutModal closeModal={closeCustomModal} navigate={navigate} />
      ),
      isShowClose: false,
      isBackDrop: false,
    });
  };

  const handleUpdateUserInfo = () => {
    setIsOpen(false);
    navigate(`/user/${data?.id}`);
  };

  useEffect(() => {
    if (data) {
      setMyInfo(data);
    }
  }, [data, setMyInfo]);

  if (isLoading) return <Spinner />;
  if (error) throw error;
  if (!data) return <div>데이터가 없습니다.</div>;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 transition-colors duration-200 hover:bg-gray-200">
          <div className="h-6 w-6 overflow-hidden rounded-full bg-slate-400">
            <img
              src={data.profileImageUrl}
              alt={`${data.name}'s profile`}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="mr-1 text-lg font-semibold text-gray-700">
            {data.name}
          </span>
          <ChevronDown />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 overflow-hidden p-0">
        <div className="flex flex-col">
          <div className="flex flex-col justify-center bg-blue-600 p-4 text-white">
            <span className="font-semibold">{data.name}</span>
            <span className="text-sm text-blue-200">{data.email}</span>
          </div>

          <div
            onClick={handleUpdateUserInfo}
            className="flex cursor-pointer items-center p-4 transition-colors duration-200 hover:bg-gray-100"
          >
            <UserIcon className="mr-2 h-5 w-5 text-gray-600" />
            <span className="text-gray-700">내 정보 수정</span>
          </div>

          <div
            onClick={handleLogout}
            className="flex cursor-pointer items-center p-4 transition-colors duration-200 hover:bg-gray-100"
          >
            <LogOutIcon className="mr-2 h-5 w-5 text-gray-600" />
            <span className="text-gray-700">로그아웃</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
