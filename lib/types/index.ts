/**
 * 타입 통합 Export
 * 모든 타입을 중앙에서 관리
 */

// ============================================
// 기존 타입 (assessment.ts)
// ============================================
export type {
  AssessmentMode,
  CareerCategory,
  IBLearnerProfile,
  QuestionType,
  SituationOption,
  Question,
  QuestionResponse,
  BasicInfo,
  ConsultationFeedback,
  AssessmentData
} from './assessment';

export { CAREER_CATEGORY_NAMES } from './assessment';

// ============================================
// 기존 타입 (result.ts)
// ============================================
export type {
  CategoryScores,
  JobRecommendation,
  MajorRecommendation,
  IBProfile,
  ConsultationMode as ResultConsultationMode,
  ConsultationGuide,
  AssessmentResult,
  ResultComparison
} from './result';

export { IB_PROFILE_NAMES } from './result';

// ============================================
// IB 강화 타입 (ib-enhanced.ts)
// ============================================
export type {
  BehavioralCategory,
  ObservationContext,
  ObservationFrequency,
  ProficiencyLevel,
  ProficiencyLevelKo,
  AssessmentQuestionType,
  ObserverType,
  AgeGroup,
  AgeRange,
  BehavioralIndicator,
  ObservationRubric,
  AssessmentQuestion,
  BusinessCompetency,
  AgeAdaptation,
  TheoreticalBasis,
  EnhancedIBProfile,
  ObservationItem,
  SituationQuestionOption,
  SituationQuestion,
  IBProfileScore,
  IBAssessmentResult,
  CareerIBMapping
} from './ib-enhanced';

// ============================================
// 부모 프로필 타입 (parent.ts)
// ============================================
export type {
  ParentingStyle,
  EducationGoal,
  EducationInterest,
  ChildStrength,
  GrowthArea,
  ParentingConcern,
  ParentSurveyResponse,
  ParentProfile,
  ParentSurveyResult,
  ParentChildMatch,
  ObservationResponse
} from './parent';

export {
  PARENTING_STYLE_NAMES,
  EDUCATION_GOAL_NAMES,
  EDUCATION_INTEREST_NAMES,
  CHILD_STRENGTH_NAMES,
  GROWTH_AREA_NAMES,
  PARENTING_CONCERN_NAMES
} from './parent';

// ============================================
// 활동 타입 (activity.ts)
// ============================================
export type {
  ActivityCategory,
  ActivityDifficulty,
  ActivityEnvironment,
  ParticipationType,
  ActivityDuration,
  ActivityResource,
  Activity,
  ActivityRecommendation,
  ActivityMatchRequest,
  FamilyActivity,
  ActivityLog,
  ActivityCollection
} from './activity';

export {
  ACTIVITY_CATEGORY_NAMES,
  ACTIVITY_DIFFICULTY_NAMES,
  PARTICIPATION_TYPE_NAMES,
  ACTIVITY_DURATION_INFO
} from './activity';

// ============================================
// 가이드 타입 (guide.ts)
// ============================================
export type {
  GuideType,
  ConversationScenario,
  ConversationGuide,
  ParentingTip,
  LearningGuide,
  ParentGuide,
  TeacherGuide,
  GuideGenerationRequest,
  GuideTemplate
} from './guide';

export { GUIDE_TYPE_NAMES } from './guide';

// ============================================
// 세션 타입 (session.ts)
// ============================================
export type {
  ParticipantType,
  ConsultationMode,
  AssessmentStep,
  StepConfig,
  SessionStatus,
  AssessmentSession,
  SessionResults,
  SessionHistory,
  SessionCompareRequest,
  SessionCompareResult,
  ProgressState,
  StepAction,
  StoredSession,
  UserSessionList
} from './session';

export {
  PARTICIPANT_TYPE_NAMES,
  CONSULTATION_MODE_NAMES,
  ASSESSMENT_STEP_NAMES
} from './session';
