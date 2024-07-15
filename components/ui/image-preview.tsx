import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  file: File | null;
  onRemove: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!previewUrl) {
    return <p className="text-gray-500 mb-2">No image selected</p>;
  }

  return (
    <div className="relative w-32 h-32 my-2">
      <Image
        src={previewUrl}
        alt="File preview"
        layout="fill"
        objectFit="contain"
        className="rounded-lg"
      />
      <button 
        onClick={onRemove}
        type="button"
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
        aria-label="Remove image"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ImagePreview;