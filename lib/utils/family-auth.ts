// Family Authentication Utilities

import {
  FAMILY_CODE_LENGTH,
  PIN_LENGTH,
  WEAK_PINS,
  SESSION_EXPIRY_DAYS,
  type ChildSession
} from '@/lib/types/family';

// Characters for family code (excluding ambiguous: O, I, L)
const FAMILY_CODE_CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ0123456789';

/**
 * Generate a unique 8-character family code
 */
export function generateFamilyCode(): string {
  const array = new Uint8Array(FAMILY_CODE_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => FAMILY_CODE_CHARSET[b % FAMILY_CODE_CHARSET.length])
    .join('');
}

/**
 * Validate family code format
 */
export function isValidFamilyCode(code: string): boolean {
  if (!code || code.length !== FAMILY_CODE_LENGTH) return false;
  const validChars = new Set(FAMILY_CODE_CHARSET);
  return code.toUpperCase().split('').every(c => validChars.has(c));
}

/**
 * Validate PIN format (4 digits)
 */
export function isValidPin(pin: string): boolean {
  if (!pin || pin.length !== PIN_LENGTH) return false;
  return /^\d{4}$/.test(pin);
}

/**
 * Check if PIN is weak (common patterns)
 */
export function isWeakPin(pin: string): boolean {
  return WEAK_PINS.includes(pin);
}

/**
 * Generate a random session token
 */
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Calculate session expiry date
 */
export function getSessionExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + SESSION_EXPIRY_DAYS);
  return expiry;
}

// Client-side session storage key
const CHILD_SESSION_KEY = 'child-future-child-session';

/**
 * Get child session from localStorage (client-side)
 */
export function getChildSession(): ChildSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CHILD_SESSION_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as ChildSession;

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      clearChildSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * Set child session in localStorage (client-side)
 */
export function setChildSession(session: ChildSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHILD_SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear child session from localStorage (client-side)
 */
export function clearChildSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CHILD_SESSION_KEY);
}

/**
 * Check if child is currently logged in
 */
export function isChildLoggedIn(): boolean {
  return getChildSession() !== null;
}

/**
 * Get device fingerprint for session binding
 */
export function getDeviceFingerprint(): string {
  if (typeof window === 'undefined') return '';

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset()
  ];

  // Simple hash
  const str = components.join('|');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return Math.abs(hash).toString(16);
}

/**
 * Format family code for display (with spaces)
 */
export function formatFamilyCode(code: string): string {
  if (!code || code.length !== FAMILY_CODE_LENGTH) return code;
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

/**
 * Parse formatted family code (remove spaces/dashes)
 */
export function parseFamilyCode(formatted: string): string {
  return formatted.replace(/[\s-]/g, '').toUpperCase();
}

/**
 * Calculate lockout remaining time in minutes
 */
export function getLockoutMinutesRemaining(lockedUntil: string | null): number {
  if (!lockedUntil) return 0;

  const lockEnd = new Date(lockedUntil);
  const now = new Date();

  if (lockEnd <= now) return 0;

  return Math.ceil((lockEnd.getTime() - now.getTime()) / (1000 * 60));
}

/**
 * Check if account is currently locked
 */
export function isAccountLocked(lockedUntil: string | null): boolean {
  if (!lockedUntil) return false;
  return new Date(lockedUntil) > new Date();
}
