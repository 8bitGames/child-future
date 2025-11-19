'use client';

import { useState } from 'react';

interface RadioOption {
  value: string | number;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  name: string;
  label?: string;
  error?: string;
  direction?: 'horizontal' | 'vertical';
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  label,
  error,
  direction = 'vertical'
}: RadioGroupProps) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string | number) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}

      <div className={`
        ${direction === 'horizontal'
          ? 'flex flex-wrap gap-3'
          : 'space-y-2'
        }
      `}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200
              ${selectedValue === option.value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
              ${direction === 'horizontal' ? 'flex-1 min-w-[120px]' : ''}
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleChange(option.value)}
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
