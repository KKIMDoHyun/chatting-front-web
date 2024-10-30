import { TFile } from "@typings/Chat";

import { useModal } from "@components/Modal/useModal";

import { ImageViewModal } from "./ImageViewModal";

type ItemMessageProps = {
  file: TFile;
  senderId: string;
  createdAt: string;
};

export const ImageMessage = ({
  file,
  senderId,
  createdAt,
}: ItemMessageProps) => {
  const { showCustomModal, closeCustomModal } = useModal();

  const handleImageClick = () => {
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
  };

  return (
    <img
      onClick={handleImageClick}
      src={file.url}
      alt={`${file.name}`}
      className="max-h-[250px] min-h-[100px] min-w-[100px] max-w-[250px] cursor-pointer rounded-lg border object-cover"
    />
  );
};
