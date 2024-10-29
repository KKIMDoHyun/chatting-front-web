import { useCallback } from "react";

import { TFile } from "@typings/Chat";

import { useModal } from "@components/Modal/useModal";

import { ImageViewModal } from "./ImageViewModal";

type ItemMessageeProps = {
  file: TFile;
  senderId: string;
  createdAt: string;
};

export const ImageMessage = ({
  file,
  senderId,
  createdAt,
}: ItemMessageeProps) => {
  const { showCustomModal, closeCustomModal } = useModal();

  const handleImageClick = useCallback(() => {
    showCustomModal({
      displayComponent: (
        <ImageViewModal
          senderId={senderId}
          createdAt={createdAt}
          file={file}
          closeModal={closeCustomModal}
        />
      ),
    });
  }, [showCustomModal, senderId, createdAt, file, closeCustomModal]);

  return (
    <img
      onClick={handleImageClick}
      src={file.url}
      alt="Sent image"
      className="max-h-[200px] max-w-[200px] cursor-pointer rounded-lg object-contain"
    />
  );
};
