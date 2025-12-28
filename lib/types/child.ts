// 아이 프로필 타입 정의

export interface ChildProfile {
  id: string;           // uuid
  name: string;         // 아이 이름
  nickname: string;     // 별명 (화면 표시용)
  avatar: string;       // 이모지 또는 아바타
  birthYear?: number;   // 출생연도
  createdAt: string;    // 생성일
}

// 아이 생성 시 필요한 데이터
export type CreateChildData = Omit<ChildProfile, 'id' | 'createdAt'>;

// 아이 수정 시 사용하는 데이터
export type UpdateChildData = Partial<Omit<ChildProfile, 'id' | 'createdAt'>>;

// 아바타 이모지 목록
export const AVATAR_EMOJIS = [
  '🧒', '👧', '👦', '👶', '🧒🏻', '👧🏻', '👦🏻',
  '🦁', '🐰', '🐻', '🐼', '🦊', '🐯', '🐱',
  '🌟', '🌈', '🦋', '🌸', '🎨', '⚽', '🎵'
];
