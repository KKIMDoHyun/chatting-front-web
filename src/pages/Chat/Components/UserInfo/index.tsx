import { useNavigate } from "react-router-dom";

import { useAtomValue } from "jotai";
import { Mail, MessageSquare, Phone } from "lucide-react";

import { useCreateRoom } from "@apis/Room/useCreateRoom";
import { useGetUserInfo } from "@apis/User/useGetUserInfo";

import { QueryWrapper } from "@components/QueryWrapper";
import { Button } from "@components/ui";

import { MyInfoAtom } from "@stores/UserStore";

type UserInfoProps = {
  userId: string;
};

export const UserInfo = ({ userId }: UserInfoProps) => {
  const navigate = useNavigate();
  const query = useGetUserInfo({ userId });
  const { mutate } = useCreateRoom();
  const myInfo = useAtomValue(MyInfoAtom);

  const handleCreateRoom = () => {
    if (query.data) {
      mutate(
        {
          name: query.data.name,
          memberIds: [query.data.id],
          roomType: "DIRECT",
        },
        {
          onSuccess: (res) => {
            navigate(`/room/${res.roomId}`);
          },
        }
      );
    }
  };

  if (!myInfo) return null;

  return (
    <QueryWrapper query={query}>
      {(data) => (
        <div className="flex h-full items-center justify-center bg-gray-50">
          <div className="h-full w-full overflow-hidden rounded-xl bg-white shadow-md">
            <div className="relative h-48 bg-gradient-to-b from-blue-100 to-blue-200">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform">
                <img
                  src={data.profileImageUrl}
                  alt={data.name}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                />
              </div>
            </div>

            <div className="px-6 pb-8 pt-20 text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                {data.name}
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{data.email}</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{data.phoneNumber}</span>
                </div>
              </div>

              {myInfo.id !== userId && (
                <div className="mt-8">
                  <Button
                    onClick={handleCreateRoom}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <MessageSquare className="h-4 w-4" />
                    1:1 채팅하기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </QueryWrapper>
  );
};
