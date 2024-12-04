import React from "react";

import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAtomValue } from "jotai";
import { MessageSquare } from "lucide-react";

import { useGetFileUrl } from "@apis/Chat/useGetFileUrl";
import { QUERY_KEYS } from "@apis/QUERY_KEYS";
import { useCreateRoom } from "@apis/Room/useCreateRoom";
import { useChangeUserInfo } from "@apis/User/useChangeUserInfo";
import { useGetUserInfo } from "@apis/User/useGetUserInfo";

import { QueryWrapper } from "@components/QueryWrapper";
import { Button } from "@components/ui";

import { MyInfoAtom } from "@stores/UserStore";

import { EmailForm } from "./EmailForm";
import { NameForm } from "./NameForm";
import { PhoneNumberForm } from "./PhoneNumberForm";
import { ProfileImage } from "./ProfileImageForm";

type UserInfoProps = {
  userId: string;
};

export type FormValues = {
  profileImageUrl: string;
  name: string;
  email: string;
  phoneNumber: string;
};

export const UserInfo = ({ userId }: UserInfoProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const query = useGetUserInfo({ userId });
  const { mutate: createRoomMutate } = useCreateRoom();
  const { mutate: changeUserInfoMutate } = useChangeUserInfo();
  const { mutate: getFileUrlMutate } = useGetFileUrl();
  const myInfo = useAtomValue(MyInfoAtom);
  const [isEditing, setIsEditing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const previewUrlRef = React.useRef<string>("");
  const queryClient = useQueryClient();

  const methods = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      profileImageUrl: "",
    },
  });

  const { reset } = methods;

  // 폼 초기화 함수
  const resetForm = React.useCallback(
    (data: FormValues) => {
      if (!data) return;
      reset({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profileImageUrl: data.profileImageUrl,
      });
    },
    [reset]
  );

  // 이미지 URL 정리
  React.useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  // 편집 모드가 꺼질 때 이미지 상태 초기화
  React.useEffect(() => {
    if (!isEditing) {
      setSelectedFile(null);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = "";
      }
    }
  }, [isEditing]);

  // 데이터가 변경될 때 폼 초기화
  React.useEffect(() => {
    if (query.data) {
      resetForm(query.data);
    }
  }, [query.data, resetForm]);

  // 경로가 변경될 때 상태 초기화
  React.useEffect(() => {
    setIsEditing(false);
    setSelectedFile(null);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (query.data) {
      resetForm(query.data);
    }
  }, [pathname, query.data, resetForm]);

  const handleCreateRoom = () => {
    if (!query.data) return;
    createRoomMutate(
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
  };

  const handleEditClick = () => {
    if (query.data) {
      resetForm(query.data);
    }
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    if (query.data) {
      resetForm(query.data);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = "";
      }
      setSelectedFile(null);
    }
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setSelectedFile(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      getFileUrlMutate(
        {
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
          metadata: new Map(),
        },
        {
          onSuccess: async (res) => {
            try {
              await axios.put(res.preSignedUrl, file, {
                headers: {
                  "Content-Type": file.type,
                  "x-amz-tagging": "status=temporary",
                },
              });
              resolve(res.fileUrl);
            } catch (error) {
              reject(error);
            }
          },
          onError: reject,
        }
      );
    });
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const profileImageUrl = selectedFile
        ? await uploadImage(selectedFile)
        : query.data?.profileImageUrl || "";

      changeUserInfoMutate(
        { userId, ...data, profileImageUrl },
        {
          onSuccess: () => {
            query.refetch();
            setIsEditing(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            if (previewUrlRef.current) {
              URL.revokeObjectURL(previewUrlRef.current);
              previewUrlRef.current = "";
            }
            queryClient.refetchQueries({ queryKey: QUERY_KEYS.USER.myInfo() });
          },
        }
      );
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!myInfo) return null;

  return (
    <QueryWrapper query={query}>
      {(data) => (
        <div className="flex h-full items-center justify-center bg-gray-50">
          <div className="h-full w-full overflow-hidden rounded-xl bg-white shadow-md">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="relative"
              >
                <ProfileImage
                  isEditing={isEditing}
                  canEdit={myInfo.id === userId}
                  previewUrl={previewUrlRef.current}
                  defaultImageUrl={data.profileImageUrl}
                  userName={data.name}
                  onImageChange={handleImageChange}
                />

                <div className="px-6 pb-8 pt-20 text-center">
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <NameForm isEditing={isEditing} name={data.name} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <EmailForm isEditing={isEditing} email={data.email} />
                    <PhoneNumberForm
                      isEditing={isEditing}
                      phoneNumber={data.phoneNumber}
                    />
                  </div>

                  <div className="mt-8">
                    {myInfo.id !== userId ? (
                      <Button
                        onClick={handleCreateRoom}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                        type="button"
                      >
                        <MessageSquare className="h-4 w-4" />
                        1:1 채팅하기
                      </Button>
                    ) : isEditing ? (
                      <div className="flex justify-center gap-2">
                        <Button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          저장하기
                        </Button>
                        <Button
                          onClick={handleCancelClick}
                          type="button"
                          variant="outline"
                          className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2 font-medium"
                        >
                          취소
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={handleEditClick}
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        수정하기
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      )}
    </QueryWrapper>
  );
};
