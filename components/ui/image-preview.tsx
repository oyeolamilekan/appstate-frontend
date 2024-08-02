import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { cva, type VariantProps } from 'class-variance-authority';

const imagePreviewVariants = cva(
  "relative my-2 rounded-lg", // base classes
  {
    variants: {
      size: {
        small: "w-32 h-32",
        large: "w-[468px] h-[220px] md:w-[668px] md:h-[420px] flex-shrink-0",
      },
      theme: {
        light: "bg-gray-200",
        dark: "bg-gray-700",
      },
    },
    defaultVariants: {
      size: "small",
      theme: "light",
    },
  }
);

interface ImagePreviewProps extends VariantProps<typeof imagePreviewVariants> {
  file?: File | null;
  url?: string;
  type?: "file" | "url";
  isRemoveButtonVisible?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  url,
  type = "file",
  onRemove,
  isRemoveButtonVisible = false,
  size,
  theme,
  className
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (type === "file" && file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (type === "url" && url) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file, url, type]);

  const containerClasses = twMerge(imagePreviewVariants({ size, theme }), className);

  if (!previewUrl) {
    return <p className="text-gray-500 mb-2">No image selected</p>;
  }

  return (
    <div className={containerClasses}>
      <Image
        src={previewUrl}
        alt="Image preview"
        layout="fill"
        objectFit="contain"
        className="rounded-lg"
      />
      {isRemoveButtonVisible && onRemove && (
        <button
          onClick={onRemove}
          type="button"
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
          aria-label="Remove image"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

