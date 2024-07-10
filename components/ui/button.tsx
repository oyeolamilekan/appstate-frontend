import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(["transition-colors", "relative", "inline-flex", "items-center", "justify-center", "font-semibold", "text-md", "dark:text-gray-300"], {
  variants: {
    variant: {
      default: ["bg-secondary", "hover:bg-secondary-hover", "dark:text-white", "dark:bg-secondary-dark", "dark:hover:bg-secondary-dark-hover"],
      outline: ["hover:bg-secondary-hover", "border", "border-black", "border-[1px]", "dark:hover:bg-gray-800", "dark:border-gray-700"],
      ghost: ["hover:bg-gray-100", "bg-gray-100", "text-black", "dark:text-white", "dark:bg-secondary-dark", "dark:hover:bg-secondary-dark-hover"],
      dark: ["bg-secondary-dark", "hover:bg-secondary-dark-hover", "text-white"],
      danger: ["bg-red-600", "hover:bg-red-700", "text-white", "dark:bg-red-700", "dark:hover:bg-red-800"]
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

type ButtonProps = VariantProps<typeof buttonStyles> & ComponentProps<"button"> & {
  loading?: boolean;
};

export function Button({ variant, size, className, loading, children, ...props }: ButtonProps) {
  return (
    <button {...props} className={twMerge(buttonStyles({ variant, size }), className)} disabled={loading}>
      <div className={`flex items-center justify-center ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
      {loading && (
        <Loader2 className="absolute h-5 w-5 text-white animate-spin" />
      )}
    </button>
  );
}
