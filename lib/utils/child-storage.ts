import { ChildProfile, CreateChildData, UpdateChildData } from '@/lib/types/child';
import { AssessmentResult } from '@/lib/types/result';

// Storage keys
const CHILDREN_KEY = 'child-future-children';
const SELECTED_CHILD_KEY = 'child-future-selected-child';

// Legacy storage keys (for migration)
const LEGACY_KEYS = {
  results: 'child-future-results',
  missions: 'child-future-missions',
  badges: 'child-future-badges',
  points: 'child-future-child-points',
  diary: 'child-future-child-diary',
  checkins: 'child-future-child-checkins',
  reports: 'child-future-reports',
};

// Generate UUID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ===========================
// 아이 목록 관리
// ===========================

export function getChildren(): ChildProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CHILDREN_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveChildren(children: ChildProfile[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CHILDREN_KEY, JSON.stringify(children));
}

export function addChild(data: CreateChildData): ChildProfile {
  const newChild: ChildProfile = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  const children = getChildren();
  children.push(newChild);
  saveChildren(children);

  // 첫 번째 아이면 자동 선택
  if (children.length === 1) {
    setSelectedChildId(newChild.id);
  }

  return newChild;
}

export function updateChild(id: string, data: UpdateChildData): ChildProfile | null {
  const children = getChildren();
  const index = children.findIndex((c) => c.id === id);

  if (index === -1) return null;

  children[index] = { ...children[index], ...data };
  saveChildren(children);

  return children[index];
}

export function deleteChild(id: string): boolean {
  const children = getChildren();
  const filtered = children.filter((c) => c.id !== id);

  if (filtered.length === children.length) return false;

  saveChildren(filtered);

  // 삭제된 아이가 선택된 아이였다면, 첫 번째 아이 선택
  if (getSelectedChildId() === id) {
    if (filtered.length > 0) {
      setSelectedChildId(filtered[0].id);
    } else {
      clearSelectedChildId();
    }
  }

  // 해당 아이의 모든 데이터 삭제
  deleteChildData(id);

  return true;
}

export function getChildById(id: string): ChildProfile | null {
  const children = getChildren();
  return children.find((c) => c.id === id) || null;
}

// ===========================
// 선택된 아이 관리
// ===========================

export function getSelectedChildId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SELECTED_CHILD_KEY);
}

export function setSelectedChildId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SELECTED_CHILD_KEY, id);
}

export function clearSelectedChildId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SELECTED_CHILD_KEY);
}

export function getSelectedChild(): ChildProfile | null {
  const id = getSelectedChildId();
  if (!id) return null;
  return getChildById(id);
}

// ===========================
// 아이별 데이터 접근 (Storage Key 생성)
// ===========================

function getChildStorageKey(childId: string, dataType: string): string {
  return `child-future-${childId}-${dataType}`;
}

// Generic getter
function getChildData<T>(childId: string, dataType: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const key = getChildStorageKey(childId, dataType);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Generic setter
function setChildData<T>(childId: string, dataType: string, data: T): void {
  if (typeof window === 'undefined') return;
  const key = getChildStorageKey(childId, dataType);
  localStorage.setItem(key, JSON.stringify(data));
}

// 아이의 모든 데이터 삭제
function deleteChildData(childId: string): void {
  if (typeof window === 'undefined') return;
  const dataTypes = ['results', 'missions', 'badges', 'points', 'diary', 'checkins', 'reports'];
  dataTypes.forEach((type) => {
    const key = getChildStorageKey(childId, type);
    localStorage.removeItem(key);
  });
}

// ===========================
// 아이별 검사 결과
// ===========================

export function getChildResults(childId: string): AssessmentResult[] {
  return getChildData<AssessmentResult[]>(childId, 'results') || [];
}

export function saveChildResult(childId: string, result: AssessmentResult): void {
  const results = getChildResults(childId);
  results.push(result);
  // 최대 20개 유지
  const trimmed = results.slice(-20);
  setChildData(childId, 'results', trimmed);
}

export function getChildLatestResult(childId: string): AssessmentResult | null {
  const results = getChildResults(childId);
  return results.length > 0 ? results[results.length - 1] : null;
}

export function deleteChildResult(childId: string, resultId: string): boolean {
  const results = getChildResults(childId);
  const filtered = results.filter((r) => r.id !== resultId);
  if (filtered.length === results.length) return false;
  setChildData(childId, 'results', filtered);
  return true;
}

export interface ComparisonResult {
  current: AssessmentResult;
  previous: AssessmentResult;
  scoreDifferences: Record<string, number>;
}

export function compareChildResults(
  childId: string,
  currentId: string,
  previousId: string
): ComparisonResult | null {
  const results = getChildResults(childId);
  const current = results.find((r) => r.id === currentId);
  const previous = results.find((r) => r.id === previousId);

  if (!current || !previous) return null;

  const scoreDifferences: Record<string, number> = {};
  for (const key of Object.keys(current.scores)) {
    scoreDifferences[key] = (current.scores[key as keyof typeof current.scores] || 0) -
      (previous.scores[key as keyof typeof previous.scores] || 0);
  }

  return { current, previous, scoreDifferences };
}

// ===========================
// 아이별 미션
// ===========================

export interface Mission {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'daily' | 'weekly' | 'challenge';
  points: number;
  badgeId?: string;
  badgeEmoji?: string;
  completedAt?: string;
}

export function getChildMissions(childId: string): Mission[] {
  return getChildData<Mission[]>(childId, 'missions') || [];
}

export function saveChildMissions(childId: string, missions: Mission[]): void {
  setChildData(childId, 'missions', missions);
}

// ===========================
// 아이별 배지
// ===========================

export interface Badge {
  id: string;
  emoji?: string;
  title?: string;
  // Legacy fields for portfolio page
  name?: string;
  icon?: string;
  tier?: 'bronze' | 'silver' | 'gold';
  earnedAt: string;
}

export function getChildBadges(childId: string): Badge[] {
  return getChildData<Badge[]>(childId, 'badges') || [];
}

export function saveChildBadges(childId: string, badges: Badge[]): void {
  setChildData(childId, 'badges', badges);
}

export function addChildBadge(childId: string, badge: Omit<Badge, 'earnedAt'>): void {
  const badges = getChildBadges(childId);
  if (!badges.find((b) => b.id === badge.id)) {
    badges.push({ ...badge, earnedAt: new Date().toISOString() });
    saveChildBadges(childId, badges);
  }
}

// ===========================
// 아이별 포인트
// ===========================

export function getChildPoints(childId: string): number {
  const points = getChildData<number>(childId, 'points');
  return points || 0;
}

export function setChildPoints(childId: string, points: number): void {
  setChildData(childId, 'points', points);
}

export function addChildPoints(childId: string, points: number): number {
  const current = getChildPoints(childId);
  const newPoints = current + points;
  setChildPoints(childId, newPoints);
  return newPoints;
}

// ===========================
// 아이별 일기
// ===========================

export interface DiaryEntry {
  id: string;
  // Child mode fields
  content?: string;
  mood?: string;
  weather?: string;
  points?: number;
  // Parent mode fields (growth diary)
  date?: string;
  activity?: {
    title: string;
    description: string;
    photos: string[];
  };
  childReflection?: string;
  parentNote?: string;
  ibProfile?: string;
  badge?: {
    name: string;
    icon: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export function getChildDiary(childId: string): DiaryEntry[] {
  return getChildData<DiaryEntry[]>(childId, 'diary') || [];
}

export function saveChildDiary(childId: string, diary: DiaryEntry[]): void {
  setChildData(childId, 'diary', diary);
}

export function addChildDiaryEntry(childId: string, entry: DiaryEntry): void {
  const diary = getChildDiary(childId);
  diary.unshift(entry);
  saveChildDiary(childId, diary);
}

// ===========================
// 아이별 체크인
// ===========================

export interface CheckIn {
  id: string;
  // Child mode fields
  mood?: string;
  activities?: string[];
  memo?: string;
  points?: number;
  // Parent mode fields (weekly check-in)
  date?: string;
  weekStart?: string;
  weekEnd?: string;
  childData?: {
    activityLevel: 'high' | 'medium' | 'low' | null;
    favoriteActivity: string;
    weeklyMood: 'great' | 'good' | 'okay' | 'notgood' | 'bad' | null;
    freeNote: string;
  };
  parentData?: {
    noticeableChanges: string;
    completedActivities: string[];
    specialEpisode: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export function getChildCheckIns(childId: string): CheckIn[] {
  return getChildData<CheckIn[]>(childId, 'checkins') || [];
}

export function saveChildCheckIns(childId: string, checkIns: CheckIn[]): void {
  setChildData(childId, 'checkins', checkIns);
}

export function addChildCheckIn(childId: string, checkIn: CheckIn): void {
  const checkIns = getChildCheckIns(childId);
  checkIns.unshift(checkIn);
  saveChildCheckIns(childId, checkIns);
}

export function getChildTodayCheckIn(childId: string): CheckIn | null {
  const checkIns = getChildCheckIns(childId);
  const today = new Date().toISOString().split('T')[0];
  return checkIns.find((c) => c.createdAt.startsWith(today)) || null;
}

// ===========================
// 데이터 마이그레이션
// ===========================

export function migrateToMultiChild(): { migrated: boolean; childId: string | null } {
  if (typeof window === 'undefined') return { migrated: false, childId: null };

  // 이미 마이그레이션 되었는지 확인
  const existingChildren = getChildren();
  if (existingChildren.length > 0) {
    return { migrated: false, childId: existingChildren[0].id };
  }

  // 레거시 데이터가 있는지 확인
  const legacyResults = localStorage.getItem(LEGACY_KEYS.results);

  if (!legacyResults) {
    // 레거시 데이터 없음 - 마이그레이션 불필요
    return { migrated: false, childId: null };
  }

  try {
    const parsedResults = JSON.parse(legacyResults) as AssessmentResult[];

    // 기존 결과에서 아이 정보 추출
    let childNickname = '아이';

    if (parsedResults.length > 0) {
      const latestResult = parsedResults[parsedResults.length - 1];
      if (latestResult.basicInfo) {
        childNickname = latestResult.basicInfo.nickname || '아이';
      }
    }

    // 새 아이 프로필 생성
    const newChild = addChild({
      name: childNickname,
      nickname: childNickname,
      avatar: '🧒',
    });

    // 레거시 데이터를 새 구조로 이전
    if (legacyResults) {
      setChildData(newChild.id, 'results', parsedResults);
    }

    const legacyMissions = localStorage.getItem(LEGACY_KEYS.missions);
    if (legacyMissions) {
      setChildData(newChild.id, 'missions', JSON.parse(legacyMissions));
    }

    const legacyBadges = localStorage.getItem(LEGACY_KEYS.badges);
    if (legacyBadges) {
      setChildData(newChild.id, 'badges', JSON.parse(legacyBadges));
    }

    const legacyPoints = localStorage.getItem(LEGACY_KEYS.points);
    if (legacyPoints) {
      setChildData(newChild.id, 'points', parseInt(legacyPoints, 10));
    }

    const legacyDiary = localStorage.getItem(LEGACY_KEYS.diary);
    if (legacyDiary) {
      setChildData(newChild.id, 'diary', JSON.parse(legacyDiary));
    }

    const legacyCheckins = localStorage.getItem(LEGACY_KEYS.checkins);
    if (legacyCheckins) {
      setChildData(newChild.id, 'checkins', JSON.parse(legacyCheckins));
    }

    const legacyReports = localStorage.getItem(LEGACY_KEYS.reports);
    if (legacyReports) {
      setChildData(newChild.id, 'reports', JSON.parse(legacyReports));
    }

    // 레거시 키 삭제하지 않음 (백업 유지)
    // 대신 마이그레이션 완료 플래그 설정
    localStorage.setItem('child-future-migrated', 'true');

    return { migrated: true, childId: newChild.id };
  } catch (error) {
    console.error('Migration failed:', error);
    return { migrated: false, childId: null };
  }
}

// 마이그레이션 상태 확인
export function isMigrated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('child-future-migrated') === 'true';
}

// ===========================
// 현재 선택된 아이 기반 유틸리티 (편의 함수)
// ===========================

export function getCurrentChildResults(): AssessmentResult[] {
  const childId = getSelectedChildId();
  if (!childId) return [];
  return getChildResults(childId);
}

export function getCurrentChildLatestResult(): AssessmentResult | null {
  const childId = getSelectedChildId();
  if (!childId) return null;
  return getChildLatestResult(childId);
}

export function getCurrentChildMissions(): Mission[] {
  const childId = getSelectedChildId();
  if (!childId) return [];
  return getChildMissions(childId);
}

export function getCurrentChildBadges(): Badge[] {
  const childId = getSelectedChildId();
  if (!childId) return [];
  return getChildBadges(childId);
}

export function getCurrentChildPoints(): number {
  const childId = getSelectedChildId();
  if (!childId) return 0;
  return getChildPoints(childId);
}

export function getCurrentChildDiary(): DiaryEntry[] {
  const childId = getSelectedChildId();
  if (!childId) return [];
  return getChildDiary(childId);
}

export function getCurrentChildCheckIns(): CheckIn[] {
  const childId = getSelectedChildId();
  if (!childId) return [];
  return getChildCheckIns(childId);
}

// ===========================
// 아이별 목표
// ===========================

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetIBProfile?: string;
  targetCategory?: string;
  periodStart: string;
  periodEnd: string;
  recommendedActivities: string[];
  progress: number;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

export function getChildGoals(childId: string): Goal[] {
  return getChildData<Goal[]>(childId, 'goals') || [];
}

export function saveChildGoals(childId: string, goals: Goal[]): void {
  setChildData(childId, 'goals', goals);
}

export function getCurrentChildGoals(): Goal[] {
  const childId = getSelectedChildId();
  if (!childId) return [];
  return getChildGoals(childId);
}

// ===========================
// 아이별 AI 리포트
// ===========================

export interface AIReport {
  id: string;
  title: string;
  content: string;
  summary: string;
  timestamp: string;
  assessmentId?: string;
}

export function getChildReports(childId: string): AIReport[] {
  return getChildData<AIReport[]>(childId, 'reports') || [];
}

export function saveChildReports(childId: string, reports: AIReport[]): void {
  setChildData(childId, 'reports', reports);
}

export function addChildReport(childId: string, report: AIReport): void {
  const reports = getChildReports(childId);
  reports.unshift(report);
  // 최대 10개 유지
  const trimmed = reports.slice(0, 10);
  saveChildReports(childId, trimmed);
}

export function getCurrentChildReports(): AIReport[] {
  const childId = getSelectedChildId();
  if (!childId) return [];
  return getChildReports(childId);
}
