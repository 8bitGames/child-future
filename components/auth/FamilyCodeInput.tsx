'use client';

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { FAMILY_CODE_LENGTH } from '@/lib/types/family';

interface FamilyCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
}

export function FamilyCodeInput({
  value,
  onChange,
  disabled = false,
  error,
  autoFocus = false
}: FamilyCodeInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, FAMILY_CODE_LENGTH);
  }, []);

  // Auto focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, char: string) => {
    // Only allow valid characters
    const validChar = char.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!validChar && char !== '') return;

    const newValue = value.split('');
    newValue[index] = validChar;
    const newCode = newValue.join('').slice(0, FAMILY_CODE_LENGTH);
    onChange(newCode);

    // Move to next input
    if (validChar && index < FAMILY_CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      } else {
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < FAMILY_CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, FAMILY_CODE_LENGTH);

    onChange(pastedData);

    // Focus the next empty input or last input
    const focusIndex = Math.min(pastedData.length, FAMILY_CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-1 sm:gap-2">
        {Array.from({ length: FAMILY_CODE_LENGTH }).map((_, index) => (
          <div key={index} className="relative">
            {index === 4 && (
              <span className="absolute -left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-bold">
                -
              </span>
            )}
            <input
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="text"
              autoComplete="off"
              maxLength={1}
              value={value[index] || ''}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={disabled}
              className={`
                w-10 h-12 sm:w-12 sm:h-14
                text-center text-xl sm:text-2xl font-bold
                border-2 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition-all duration-200
                ${error
                  ? 'border-red-500 bg-red-50'
                  : focused
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 bg-white'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
          </div>
        ))}
      </div>
      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}
      <p className="text-center text-xs text-gray-500">
        부모님에게 받은 8자리 코드를 입력하세요
      </p>
    </div>
  );
}
