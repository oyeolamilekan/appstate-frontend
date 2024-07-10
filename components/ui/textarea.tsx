import { twMerge } from 'tailwind-merge';
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";

export function TextArea({
  onChange = () => { },
  value,
  name,
  placeHolder,
  maxLength,
  disabled = false,
  required = true,
  className = '',
  validationSchema,
  register,
  errors,
  label,
  ...props
}: TextAreaPropTypes) {
  return (
    <>
      {label && (
        <label className="text-sm lg:text-base font-medium">
          {label}
        </label>
      )}
      <div className={twMerge(`relative ${className} my-3`)}>
        <textarea
          className="outline-none h-10 flex items-center pl-2 lg:pl-4 border-[0.1px] rounded text-base font-normal w-full focus:ring-neutral-800 focus:border-black dark:focus:ring-white dark:focus:border-white focus:border-[0.2px] bg-transparent border-opacity-20 resize-none"
          placeholder={placeHolder}
          value={value}
          disabled={disabled}
          required={required}
          maxLength={Number(maxLength) || 524288}
          {...register(name, validationSchema)}
          {...props}
        />
        {errors[name] && (
          <p className="text-red-500 mt-3">{errors[name]?.message as string}</p>
        )}
      </div>
    </>
  )
}

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
  customDivClass?: string,
  onChange?: Function;
} & React.ComponentProps<'textarea'>;
