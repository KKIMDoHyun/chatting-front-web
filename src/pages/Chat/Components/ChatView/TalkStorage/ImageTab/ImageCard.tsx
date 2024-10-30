import { useState } from "react";

type ImageCardProps = {
  src: string;
  alt: string;
  className?: string;
};

export const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(true);

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
        src={src}
        alt={alt}
        onLoad={handleLoad}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};
