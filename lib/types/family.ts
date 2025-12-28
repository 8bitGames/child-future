// Family Authentication Types

export interface Family {
  id: string;
  familyCode: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyCreate {
  name: string;
}

export interface FamilyChild {
  id: string;
  familyId: string;
  nickname: string;
  avatar: string;
  age: number;
  pinSet: boolean;
  lastLoginAt: string | null;
}

export interface ChildSession {
  id: string;
  childId: string;
  familyId: string;
  sessionToken: string;
  deviceFingerprint: string | null;
  expiresAt: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface ChildLoginRequest {
  familyCode: string;
  childId: string;
  pin: string;
  deviceFingerprint?: string;
}

export interface ChildLoginResponse {
  success: boolean;
  session?: ChildSession;
  child?: FamilyChild;
  error?: string;
  lockoutUntil?: string;
}

export interface FamilyLookupResponse {
  success: boolean;
  family?: {
    id: string;
    name: string;
    children: Array<{
      id: string;
      nickname: string;
      avatar: string;
    }>;
  };
  error?: string;
}

export interface PinSetRequest {
  childId: string;
  pin: string;
}

export interface PinVerifyResult {
  valid: boolean;
  attemptsRemaining?: number;
  lockedUntil?: string;
}

// Constants
export const FAMILY_CODE_LENGTH = 8;
export const PIN_LENGTH = 4;
export const MAX_PIN_ATTEMPTS = 3;
export const PIN_LOCKOUT_MINUTES = 5;
export const SESSION_EXPIRY_DAYS = 7;

// Weak PINs that should be rejected
export const WEAK_PINS = [
  '0000', '1111', '2222', '3333', '4444',
  '5555', '6666', '7777', '8888', '9999',
  '1234', '4321', '1212', '2121', '0123',
  '1010', '2020', '1357', '2468', '9876'
];
