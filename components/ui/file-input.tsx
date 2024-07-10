import React, { useRef, ChangeEvent } from "react";
import { cva, VariantProps } from "class-variance-authority";

const buttonStyles = cva(["transition-colors", "relative", "inline-flex", "items-center", "justify-center", "font-semibold", "text-md", "dark:text-gray-300"], {
  variants: {
    variant: {
      default: ["bg-secondary", "hover:bg-secondary-hover", "dark:text-white", "dark:bg-secondary-dark", "dark:hover:bg-secondary-dark-hover"],
      outline: ["hover:bg-secondary-hover", "border", "border-black", "border-[1px]", "dark:hover:bg-gray-800", "dark:border-gray-700"],
      ghost: ["hover:bg-gray-100", "bg-gray-100", "text-black", "dark:text-white", "dark:bg-secondary-dark", "dark:hover:bg-secondary-dark-hover"],
      dark: ["bg-secondary-dark", "hover:bg-secondary-dark-hover", "text-white"]
    },
    size: {
      default: ["rounded-xl", "py-3", "px-4"],
      small: ["rounded-xl", "py-3", "px-3", "h-10"],
      full: ['w-full', "rounded", "py-2", "px-4"],
      icon: [
        "rounded-full",
        "w-10",
        "h-10",
        "flex",
        "items-center",
        "justify-center",
        "p-2.5"
      ]
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

type ButtonStylesProps = VariantProps<typeof buttonStyles>;

interface FileUploadButtonProps extends ButtonStylesProps {
  onFileSelect: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  variant,
  size,
  className,
  loading,
  children,
  onFileSelect,
  accept,
  multiple,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(event.target.files);
    if (inputRef.current) {
      inputRef.current.value = '';  // Reset input value to allow selecting the same file again
    }
  };

  return (
    <div className="relative inline-block">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
      />
      <button
        {...props}
        type="button"
        className={buttonStyles({ variant, size, className })}
        onClick={handleButtonClick}
        disabled={loading}
      >
        {loading ? 'Loading...' : children}
      </button>
    </div>
  );
};