'use client';

import { useState, useEffect, useCallback } from 'react';
import { PIN_LENGTH } from '@/lib/types/family';

interface PinPadProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (pin: string) => void;
  disabled?: boolean;
  error?: string;
  showValue?: boolean;
  title?: string;
}

export function PinPad({
  value,
  onChange,
  onComplete,
  disabled = false,
  error,
  showValue = false,
  title = 'PIN 입력'
}: PinPadProps) {
  const [shake, setShake] = useState(false);

  // Trigger shake animation on error
  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle number button click
  const handleNumber = useCallback((num: string) => {
    if (disabled || value.length >= PIN_LENGTH) return;

    const newValue = value + num;
    onChange(newValue);

    if (newValue.length === PIN_LENGTH && onComplete) {
      onComplete(newValue);
    }
  }, [disabled, value, onChange, onComplete]);

  // Handle backspace
  const handleBackspace = useCallback(() => {
    if (disabled || value.length === 0) return;
    onChange(value.slice(0, -1));
  }, [disabled, value, onChange]);

  // Handle clear
  const handleClear = useCallback(() => {
    if (disabled) return;
    onChange('');
  }, [disabled, onChange]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      if (e.key >= '0' && e.key <= '9') {
        handleNumber(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, handleNumber, handleBackspace, handleClear]);

  // Number pad layout
  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'back']
  ];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>

      {/* PIN Display */}
      <div
        className={`flex gap-3 ${shake ? 'animate-shake' : ''}`}
      >
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <div
            key={index}
            className={`
              w-14 h-14 sm:w-16 sm:h-16
              rounded-full border-3
              flex items-center justify-center
              text-2xl font-bold
              transition-all duration-200
              ${value[index]
                ? 'bg-indigo-500 border-indigo-500 text-white'
                : 'bg-gray-100 border-gray-300'
              }
              ${error ? 'border-red-500 bg-red-50' : ''}
            `}
          >
            {value[index] ? (showValue ? value[index] : '●') : ''}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm font-medium animate-fadeIn">
          {error}
        </p>
      )}

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {numbers.flat().map((item) => {
          if (item === 'clear') {
            return (
              <button
                key={item}
                onClick={handleClear}
                disabled={disabled || value.length === 0}
                className={`
                  w-16 h-16 sm:w-20 sm:h-20
                  rounded-full
                  flex items-center justify-center
                  text-sm font-medium
                  transition-all duration-150
                  ${disabled || value.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
                  }
                `}
                aria-label="모두 지우기"
              >
                전체삭제
              </button>
            );
          }

          if (item === 'back') {
            return (
              <button
                key={item}
                onClick={handleBackspace}
                disabled={disabled || value.length === 0}
                className={`
                  w-16 h-16 sm:w-20 sm:h-20
                  rounded-full
                  flex items-center justify-center
                  text-2xl
                  transition-all duration-150
                  ${disabled || value.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:scale-95'
                  }
                `}
                aria-label="지우기"
              >
                ⌫
              </button>
            );
          }

          return (
            <button
              key={item}
              onClick={() => handleNumber(item)}
              disabled={disabled || value.length >= PIN_LENGTH}
              className={`
                w-16 h-16 sm:w-20 sm:h-20
                rounded-full
                flex items-center justify-center
                text-2xl sm:text-3xl font-bold
                transition-all duration-150
                ${disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 active:bg-indigo-300 active:scale-95'
                }
              `}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      <p className="text-center text-xs text-gray-500">
        4자리 숫자를 입력하세요
      </p>

      {/* Custom styles for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
