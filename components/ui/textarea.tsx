import React, { useRef, useEffect, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";

type TextAreaPropTypes = {
  label?: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  value?: string | number;
  placeHolder?: string;
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  validationSchema?: RegisterOptions;
  className?: string;
} & Omit<React.ComponentProps<'textarea'>, 'name'>;

export function TextArea({
  label,
  disabled = false,
  required = true,
  maxLength = 524288,
  value,
  placeHolder,
  name,
  register,
  errors,
  validationSchema,
  className = '',
  ...props
}: TextAreaPropTypes) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    if (validationSchema?.onChange) {
      validationSchema.onChange(e);
    }
  };

  const refCallback = useCallback(
    (element: HTMLTextAreaElement | null) => {
      textareaRef.current = element;
      const { ref } = register(name, validationSchema);
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = element;
      }
    },
    [register, name, validationSchema]
  );

  return (
    <>
      {label && (
        <label className="text-sm lg:text-base font-medium">
          {label}
        </label>
      )}
      <div className={twMerge(`relative ${className} my-3`)}>
        <textarea
          className={twMerge(
            "w-full px-2 lg:px-4 py-2 text-base font-normal rounded border border-opacity-20 bg-transparent resize-none outline-none",
            "focus:ring-1 focus:ring-neutral-800 focus:border-black dark:focus:ring-white dark:focus:border-white",
            disabled && "opacity-50 cursor-not-allowed"
          )} 
          placeholder={placeHolder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          {...register(name, {
            ...validationSchema,
            onChange: handleChange
          })}
          ref={refCallback}
          {...props}
        />
        {errors[name] && (
          <p className="text-red-500 mt-3">{errors[name]?.message as string}</p>
        )}
      </div>
    </>
  );
}