import { useCreateNotice } from "@apis/Chat/useCreateNotice";

import { Button } from "@/components/ui/button";

type CreateNoticeModalProps = {
  messageId: string;
  roomId: string;
  closeModal: () => void;
};

export const CreateNoticeModal = ({
  messageId,
  roomId,
  closeModal,
}: CreateNoticeModalProps) => {
  const { mutate: createNoticeMutate } = useCreateNotice();

  const handleConfirm = async () => {
    createNoticeMutate(
      { roomId, messageId },
      {
        onSuccess: () => {
          closeModal();
        },
      }
    );
  };

  return (
    <div className="flex w-[400px] flex-col rounded-lg bg-white p-6 shadow-2xl">
      <p className="text-center text-lg">공지사항으로 등록하시겠습니까?</p>

      <div className="mt-6 flex justify-center gap-4">
        <Button variant="outline" onClick={closeModal}>
          취소
        </Button>
        <Button onClick={handleConfirm}>확인</Button>
      </div>
    </div>
  );
};
