'use client';

import { useState } from 'react';
import { FAMILY_CODE_LENGTH } from '@/lib/types/family';
import { formatFamilyCode } from '@/lib/utils/family-auth';
import { Share2 } from 'lucide-react';
import { ShareFamilyCode } from './ShareFamilyCode';

interface FamilyCodeDisplayProps {
  code: string;
  showCopyButton?: boolean;
  showShareButton?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  familyName?: string;
}

export function FamilyCodeDisplay({
  code,
  showCopyButton = true,
  showShareButton = true,
  size = 'medium',
  label = '가족 코드',
  familyName = '우리 가족'
}: FamilyCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedCode = formatFamilyCode(code);

  // Size configurations
  const sizeClasses = {
    small: {
      container: 'p-3',
      box: 'w-8 h-10 text-lg',
      gap: 'gap-1',
      label: 'text-xs',
      button: 'text-xs px-2 py-1'
    },
    medium: {
      container: 'p-4',
      box: 'w-10 h-12 text-xl',
      gap: 'gap-1.5',
      label: 'text-sm',
      button: 'text-sm px-3 py-1.5'
    },
    large: {
      container: 'p-5',
      box: 'w-12 h-14 text-2xl',
      gap: 'gap-2',
      label: 'text-base',
      button: 'text-base px-4 py-2'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`bg-gray-50 rounded-xl ${classes.container}`}>
      {/* Label */}
      <div className={`text-gray-600 ${classes.label} font-medium mb-3 text-center`}>
        {label}
      </div>

      {/* Code Display */}
      <div className={`flex justify-center items-center ${classes.gap}`}>
        {Array.from({ length: FAMILY_CODE_LENGTH }).map((_, index) => (
          <div key={index} className="relative">
            {/* Dash separator after 4th character */}
            {index === 4 && (
              <span className={`
                absolute -left-2 top-1/2 -translate-y-1/2
                text-gray-400 font-bold
                ${size === 'large' ? 'text-2xl' : size === 'medium' ? 'text-xl' : 'text-lg'}
              `}>
                -
              </span>
            )}
            <div
              className={`
                ${classes.box}
                bg-white border-2 border-gray-200
                rounded-lg
                flex items-center justify-center
                font-mono font-bold
                text-indigo-600
                select-all
              `}
            >
              {code[index] || ''}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {(showCopyButton || showShareButton) && (
        <div className="flex justify-center gap-2 mt-4">
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={`
                ${classes.button}
                rounded-lg font-medium
                transition-all duration-200
                flex items-center gap-2
                ${copied
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200'
                }
              `}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  복사됨!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  코드 복사
                </>
              )}
            </button>
          )}

          {showShareButton && (
            <button
              onClick={() => setShowShareModal(true)}
              className={`
                ${classes.button}
                rounded-lg font-medium
                transition-all duration-200
                flex items-center gap-2
                bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200
              `}
            >
              <Share2 className="w-4 h-4" />
              QR/링크 공유
            </button>
          )}
        </div>
      )}

      {/* Instructions */}
      <p className={`text-center text-gray-500 mt-3 ${classes.label}`}>
        아이에게 이 코드를 알려주세요
      </p>

      {/* Share Modal */}
      <ShareFamilyCode
        code={code}
        familyName={familyName}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
