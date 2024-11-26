import React from "react";

import { Camera } from "lucide-react";

type ProfileImageProps = {
  isEditing: boolean;
  canEdit: boolean;
  previewUrl: string;
  defaultImageUrl: string;
  userName: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ProfileImage = ({
  isEditing,
  canEdit,
  previewUrl,
  defaultImageUrl,
  userName,
  onImageChange,
}: ProfileImageProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (isEditing && canEdit) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="relative h-48 bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 transform">
        <div className="group relative">
          <img
            src={previewUrl || defaultImageUrl}
            alt={userName}
            className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
          />
          {isEditing && canEdit && (
            <div
              onClick={handleImageClick}
              className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Camera className="h-8 w-8 text-white" />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={onImageChange}
          />
        </div>
      </div>
    </div>
  );
};
