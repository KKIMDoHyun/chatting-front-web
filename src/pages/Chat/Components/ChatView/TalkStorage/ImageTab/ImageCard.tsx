import { useState } from "react";

import { TFile } from "@typings/Chat";

import { useModal } from "@components/Modal/useModal";

import { ImageViewModal } from "../../MessageItem/MessageContent/ImageViewModal";

type ImageCardProps = {
  file: TFile;
  className?: string;
  senderId: string;
  createdAt: string;
};

export const ImageCard: React.FC<ImageCardProps> = ({
  file,
  className,
  senderId,
  createdAt,
}) => {
  const [isLoading, setIsLoading] = useState(true);
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
      isShowClose: false,
    });
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`absolute inset-0 ${className || ""}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-500">Loading...</span>
        </div>
      )}

      <img
        onClick={handleImageClick}
        src={file.url}
        alt={file.name}
        onLoad={handleLoad}
        className={`absolute inset-0 h-full w-full cursor-pointer object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};
