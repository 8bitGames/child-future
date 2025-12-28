export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enum 타입 정의
export type AssessmentMode = 'quick' | 'full' | 'extend';
export type CareerCategory = 'creative' | 'analytical' | 'caring' | 'leadership' | 'practical';
export type IBProfile =
  | 'Inquirer'
  | 'Knowledgeable'
  | 'Thinker'
  | 'Communicator'
  | 'Principled'
  | 'Open-minded'
  | 'Caring'
  | 'Risk-taker'
  | 'Balanced'
  | 'Reflective';
export type GoalStatus = 'active' | 'completed' | 'abandoned';
export type MissionDifficulty = 'easy' | 'medium' | 'hard';
export type BadgeTier = 'bronze' | 'silver' | 'gold';
export type MissionStatus = 'in_progress' | 'completed' | 'skipped';
export type ActivityLevel = 'high' | 'medium' | 'low';
export type WeeklyMood = 'great' | 'good' | 'okay' | 'notgood' | 'bad';
export type ConversationSituation = 'meal' | 'bedtime' | 'travel' | 'play' | 'anytime';
export type ConversationCategory = 'question' | 'activity' | 'reflection';
export type ReportPeriodType = 'monthly' | 'quarterly' | 'yearly';

export interface Database {
  public: {
    Tables: {
      families: {
        Row: {
          id: string;
          family_code: string;
          owner_id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          family_code: string;
          owner_id: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          family_code?: string;
          name?: string;
          updated_at?: string;
        };
      };
      child_sessions: {
        Row: {
          id: string;
          child_id: string;
          family_id: string;
          device_fingerprint: string | null;
          session_token: string;
          expires_at: string;
          created_at: string;
          last_active_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          family_id: string;
          device_fingerprint?: string | null;
          session_token: string;
          expires_at: string;
          created_at?: string;
          last_active_at?: string;
        };
        Update: {
          device_fingerprint?: string | null;
          expires_at?: string;
          last_active_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      children: {
        Row: {
          id: string;
          user_id: string;
          family_id: string | null;
          nickname: string;
          age: number;
          grade: string | null;
          gender: 'male' | 'female' | 'prefer-not-to-say' | null;
          activities: string[];
          hobbies: string[];
          interests: string[];
          strong_subjects: string[];
          achievements: string[];
          likes: string[];
          dream_jobs: string[];
          dislikes: string[];
          avatar_url: string | null;
          pin_hash: string | null;
          pin_attempts: number;
          pin_locked_until: string | null;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_id?: string | null;
          nickname: string;
          age: number;
          grade?: string | null;
          gender?: 'male' | 'female' | 'prefer-not-to-say' | null;
          activities?: string[];
          hobbies?: string[];
          interests?: string[];
          strong_subjects?: string[];
          achievements?: string[];
          likes?: string[];
          dream_jobs?: string[];
          dislikes?: string[];
          avatar_url?: string | null;
          pin_hash?: string | null;
          pin_attempts?: number;
          pin_locked_until?: string | null;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          family_id?: string | null;
          nickname?: string;
          age?: number;
          grade?: string | null;
          gender?: 'male' | 'female' | 'prefer-not-to-say' | null;
          activities?: string[];
          hobbies?: string[];
          interests?: string[];
          strong_subjects?: string[];
          achievements?: string[];
          likes?: string[];
          dream_jobs?: string[];
          dislikes?: string[];
          avatar_url?: string | null;
          pin_hash?: string | null;
          pin_attempts?: number;
          pin_locked_until?: string | null;
          last_login_at?: string | null;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          child_id: string;
          mode: AssessmentMode;
          scores: Json;
          top_categories: CareerCategory[];
          ib_profiles: IBProfile[];
          ib_profile_analysis: string | null;
          ai_insights: string | null;
          development_tips: string | null;
          consultation_feedback: Json | null;
          responses: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          mode: AssessmentMode;
          scores: Json;
          top_categories: CareerCategory[];
          ib_profiles: IBProfile[];
          ib_profile_analysis?: string | null;
          ai_insights?: string | null;
          development_tips?: string | null;
          consultation_feedback?: Json | null;
          responses?: Json | null;
          created_at?: string;
        };
        Update: {
          mode?: AssessmentMode;
          scores?: Json;
          top_categories?: CareerCategory[];
          ib_profiles?: IBProfile[];
          ib_profile_analysis?: string | null;
          ai_insights?: string | null;
          development_tips?: string | null;
          consultation_feedback?: Json | null;
          responses?: Json | null;
        };
      };
      goals: {
        Row: {
          id: string;
          child_id: string;
          title: string;
          description: string | null;
          target_ib_profile: IBProfile | null;
          target_category: CareerCategory | null;
          period_start: string;
          period_end: string;
          recommended_activities: string[];
          status: GoalStatus;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          title: string;
          description?: string | null;
          target_ib_profile?: IBProfile | null;
          target_category?: CareerCategory | null;
          period_start: string;
          period_end: string;
          recommended_activities?: string[];
          status?: GoalStatus;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          target_ib_profile?: IBProfile | null;
          target_category?: CareerCategory | null;
          period_start?: string;
          period_end?: string;
          recommended_activities?: string[];
          status?: GoalStatus;
          progress?: number;
          updated_at?: string;
        };
      };
      mission_templates: {
        Row: {
          id: string;
          title: string;
          description: string;
          target_ib_profile: IBProfile;
          target_category: CareerCategory;
          difficulty: MissionDifficulty;
          estimated_time: string | null;
          badge_name: string;
          badge_icon: string;
          badge_tier: BadgeTier;
          age_min: number;
          age_max: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          description: string;
          target_ib_profile: IBProfile;
          target_category: CareerCategory;
          difficulty?: MissionDifficulty;
          estimated_time?: string | null;
          badge_name: string;
          badge_icon: string;
          badge_tier?: BadgeTier;
          age_min?: number;
          age_max?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          target_ib_profile?: IBProfile;
          target_category?: CareerCategory;
          difficulty?: MissionDifficulty;
          estimated_time?: string | null;
          badge_name?: string;
          badge_icon?: string;
          badge_tier?: BadgeTier;
          age_min?: number;
          age_max?: number;
          is_active?: boolean;
        };
      };
      mission_progress: {
        Row: {
          id: string;
          child_id: string;
          mission_id: string;
          status: MissionStatus;
          started_at: string;
          completed_at: string | null;
          reflection: string | null;
          parent_verified: boolean;
        };
        Insert: {
          id?: string;
          child_id: string;
          mission_id: string;
          status?: MissionStatus;
          started_at?: string;
          completed_at?: string | null;
          reflection?: string | null;
          parent_verified?: boolean;
        };
        Update: {
          status?: MissionStatus;
          completed_at?: string | null;
          reflection?: string | null;
          parent_verified?: boolean;
        };
      };
      badges: {
        Row: {
          id: string;
          child_id: string;
          mission_id: string | null;
          name: string;
          icon: string;
          tier: BadgeTier;
          earned_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          mission_id?: string | null;
          name: string;
          icon: string;
          tier: BadgeTier;
          earned_at?: string;
        };
        Update: {
          name?: string;
          icon?: string;
          tier?: BadgeTier;
        };
      };
      check_ins: {
        Row: {
          id: string;
          child_id: string;
          week_start: string;
          week_end: string;
          child_activity_level: ActivityLevel | null;
          child_favorite_activity: string | null;
          child_weekly_mood: WeeklyMood | null;
          child_free_note: string | null;
          parent_noticeable_changes: string | null;
          parent_completed_activities: string[];
          parent_special_episode: string | null;
          parent_photos: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          week_start: string;
          week_end: string;
          child_activity_level?: ActivityLevel | null;
          child_favorite_activity?: string | null;
          child_weekly_mood?: WeeklyMood | null;
          child_free_note?: string | null;
          parent_noticeable_changes?: string | null;
          parent_completed_activities?: string[];
          parent_special_episode?: string | null;
          parent_photos?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          child_activity_level?: ActivityLevel | null;
          child_favorite_activity?: string | null;
          child_weekly_mood?: WeeklyMood | null;
          child_free_note?: string | null;
          parent_noticeable_changes?: string | null;
          parent_completed_activities?: string[];
          parent_special_episode?: string | null;
          parent_photos?: string[];
          updated_at?: string;
        };
      };
      diary_entries: {
        Row: {
          id: string;
          child_id: string;
          date: string;
          activity_title: string;
          activity_description: string | null;
          activity_photos: string[];
          child_reflection: string | null;
          parent_note: string | null;
          related_mission_id: string | null;
          related_goal_id: string | null;
          ib_profile: IBProfile | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          date?: string;
          activity_title: string;
          activity_description?: string | null;
          activity_photos?: string[];
          child_reflection?: string | null;
          parent_note?: string | null;
          related_mission_id?: string | null;
          related_goal_id?: string | null;
          ib_profile?: IBProfile | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          date?: string;
          activity_title?: string;
          activity_description?: string | null;
          activity_photos?: string[];
          child_reflection?: string | null;
          parent_note?: string | null;
          related_mission_id?: string | null;
          related_goal_id?: string | null;
          ib_profile?: IBProfile | null;
          updated_at?: string;
        };
      };
      conversation_cards: {
        Row: {
          id: string;
          question: string;
          situation: ConversationSituation;
          target_ib_profile: IBProfile;
          follow_up_tips: string[];
          age_min: number;
          age_max: number;
          category: ConversationCategory;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          question: string;
          situation: ConversationSituation;
          target_ib_profile: IBProfile;
          follow_up_tips?: string[];
          age_min?: number;
          age_max?: number;
          category?: ConversationCategory;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          question?: string;
          situation?: ConversationSituation;
          target_ib_profile?: IBProfile;
          follow_up_tips?: string[];
          age_min?: number;
          age_max?: number;
          category?: ConversationCategory;
          is_active?: boolean;
        };
      };
      conversation_history: {
        Row: {
          id: string;
          child_id: string;
          card_id: string;
          used_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          child_id: string;
          card_id: string;
          used_at?: string;
          notes?: string | null;
        };
        Update: {
          notes?: string | null;
        };
      };
      reports: {
        Row: {
          id: string;
          child_id: string;
          period_type: ReportPeriodType;
          period_start: string;
          period_end: string;
          assessment_comparison: Json | null;
          activity_stats: Json | null;
          ai_analysis: Json;
          generated_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          period_type: ReportPeriodType;
          period_start: string;
          period_end: string;
          assessment_comparison?: Json | null;
          activity_stats?: Json | null;
          ai_analysis: Json;
          generated_at?: string;
        };
        Update: {
          period_type?: ReportPeriodType;
          period_start?: string;
          period_end?: string;
          assessment_comparison?: Json | null;
          activity_stats?: Json | null;
          ai_analysis?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      assessment_mode: AssessmentMode;
      career_category: CareerCategory;
      ib_profile: IBProfile;
      goal_status: GoalStatus;
      mission_difficulty: MissionDifficulty;
      badge_tier: BadgeTier;
      mission_status: MissionStatus;
      activity_level: ActivityLevel;
      weekly_mood: WeeklyMood;
      conversation_situation: ConversationSituation;
      conversation_category: ConversationCategory;
      report_period_type: ReportPeriodType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// 편의를 위한 타입 별칭
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Family = Database['public']['Tables']['families']['Row'];
export type ChildSession = Database['public']['Tables']['child_sessions']['Row'];
export type Child = Database['public']['Tables']['children']['Row'];
export type Assessment = Database['public']['Tables']['assessments']['Row'];
export type Goal = Database['public']['Tables']['goals']['Row'];
export type MissionTemplate = Database['public']['Tables']['mission_templates']['Row'];
export type MissionProgress = Database['public']['Tables']['mission_progress']['Row'];
export type Badge = Database['public']['Tables']['badges']['Row'];
export type CheckIn = Database['public']['Tables']['check_ins']['Row'];
export type DiaryEntry = Database['public']['Tables']['diary_entries']['Row'];
export type ConversationCard = Database['public']['Tables']['conversation_cards']['Row'];
export type ConversationHistory = Database['public']['Tables']['conversation_history']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];
