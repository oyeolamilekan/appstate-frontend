import React, { useState, useCallback } from 'react';

interface ObscureInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const ObscureInput: React.FC<ObscureInputProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const displayValue = isFocused ? value : '•'.repeat(value.length);

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      className={`bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};