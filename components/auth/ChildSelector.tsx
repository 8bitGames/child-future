'use client';

import { useState } from 'react';
import { FamilyChild } from '@/lib/types/family';

interface ChildSelectorProps {
  children: FamilyChild[];
  selectedId: string | null;
  onSelect: (child: FamilyChild) => void;
  disabled?: boolean;
  title?: string;
}

export function ChildSelector({
  children,
  selectedId,
  onSelect,
  disabled = false,
  title = '누구세요?'
}: ChildSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (children.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">👶</div>
        <p className="text-gray-600">등록된 아이가 없어요</p>
        <p className="text-sm text-gray-500 mt-2">
          부모님에게 아이 프로필을 만들어달라고 해주세요
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

      {/* Children Grid */}
      <div
        className={`
          grid gap-4
          ${children.length === 1 ? 'grid-cols-1' : ''}
          ${children.length === 2 ? 'grid-cols-2' : ''}
          ${children.length >= 3 ? 'grid-cols-2 sm:grid-cols-3' : ''}
        `}
      >
        {children.map((child) => {
          const isSelected = child.id === selectedId;
          const isHovered = child.id === hoveredId;

          return (
            <button
              key={child.id}
              onClick={() => !disabled && onSelect(child)}
              onMouseEnter={() => setHoveredId(child.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={disabled}
              className={`
                flex flex-col items-center
                p-4 sm:p-6
                rounded-2xl
                border-3
                transition-all duration-200
                ${disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:scale-105 active:scale-95'
                }
                ${isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-300'
                  : isHovered
                    ? 'border-indigo-300 bg-indigo-50/50'
                    : 'border-gray-200 bg-white hover:border-indigo-200'
                }
              `}
              aria-label={`${child.nickname} 선택`}
              aria-pressed={isSelected}
            >
              {/* Avatar */}
              <div
                className={`
                  w-20 h-20 sm:w-24 sm:h-24
                  rounded-full
                  flex items-center justify-center
                  text-4xl sm:text-5xl
                  transition-transform duration-200
                  ${isSelected || isHovered ? 'scale-110' : ''}
                  ${isSelected
                    ? 'bg-indigo-100'
                    : 'bg-gray-100'
                  }
                `}
              >
                {child.avatar}
              </div>

              {/* Name */}
              <span
                className={`
                  mt-3
                  text-lg sm:text-xl font-bold
                  ${isSelected
                    ? 'text-indigo-700'
                    : 'text-gray-800'
                  }
                `}
              >
                {child.nickname}
              </span>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="mt-2 flex items-center gap-1 text-indigo-600 text-sm">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>선택됨</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      <p className="text-center text-sm text-gray-500">
        자신의 프로필을 선택하세요
      </p>
    </div>
  );
}
