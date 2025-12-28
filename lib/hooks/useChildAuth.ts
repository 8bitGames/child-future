'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getChildSession,
  setChildSession,
  clearChildSession,
  getDeviceFingerprint
} from '@/lib/utils/family-auth';
import type { ChildSession, FamilyChild, ChildLoginResponse } from '@/lib/types/family';

interface UseChildAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: ChildSession | null;
  child: FamilyChild | null;
  login: (familyCode: string, childId: string, pin: string) => Promise<ChildLoginResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useChildAuth(): UseChildAuthReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<ChildSession | null>(null);
  const [child, setChild] = useState<FamilyChild | null>(null);

  // Initialize session from localStorage
  useEffect(() => {
    const storedSession = getChildSession();
    if (storedSession) {
      setSession(storedSession);
      // Fetch child data
      fetchChildData(storedSession.childId);
    }
    setIsLoading(false);
  }, []);

  const fetchChildData = async (childId: string) => {
    try {
      const response = await fetch(`/api/auth/child/session?childId=${childId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.child) {
          setChild(data.child);
        }
      }
    } catch (error) {
      console.error('Failed to fetch child data:', error);
    }
  };

  const login = useCallback(async (
    familyCode: string,
    childId: string,
    pin: string
  ): Promise<ChildLoginResponse> => {
    setIsLoading(true);

    try {
      const deviceFingerprint = getDeviceFingerprint();

      const response = await fetch('/api/auth/child/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyCode,
          childId,
          pin,
          deviceFingerprint
        })
      });

      const data: ChildLoginResponse = await response.json();

      if (data.success && data.session && data.child) {
        setChildSession(data.session);
        setSession(data.session);
        setChild(data.child);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: '로그인 중 오류가 발생했습니다.'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      if (session) {
        await fetch('/api/auth/child/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken: session.sessionToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearChildSession();
      setSession(null);
      setChild(null);
      setIsLoading(false);
    }
  }, [session]);

  const refreshSession = useCallback(async () => {
    const storedSession = getChildSession();
    if (storedSession) {
      setSession(storedSession);
      await fetchChildData(storedSession.childId);
    } else {
      setSession(null);
      setChild(null);
    }
  }, []);

  return {
    isAuthenticated: session !== null,
    isLoading,
    session,
    child,
    login,
    logout,
    refreshSession
  };
}
