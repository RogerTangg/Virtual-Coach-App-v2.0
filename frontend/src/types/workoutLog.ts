/**
 * 訓練紀錄型別定義 (Workout Log Type Definitions)
 * Phase 2: 資料持久化模組
 */

import { UserPreferences } from './app';

/**
 * 組間回饋類型 (Inter-set Feedback)
 * 用於記錄使用者對單一動作的難度感受
 */
export type ExerciseFeedback = 'too_easy' | 'just_right' | 'too_hard' | null;

/**
 * 單一動作執行紀錄 (Exercise Log Entry)
 * 記錄課表中每個動作的執行狀況
 */
export interface ExerciseLogEntry {
  /** 動作名稱 */
  name: string;
  
  /** 動作 ID (對應 exercises 資料表) */
  exerciseId?: string;
  
  /** 計畫持續時間 (秒) */
  plannedDuration: number;
  
  /** 實際執行時間 (秒) */
  actualDuration: number;
  
  /** 是否完成 (使用者可能跳過) */
  completed: boolean;
  
  /** 組間回饋 */
  feedback: ExerciseFeedback;
}

/**
 * 訓練設定快照 (Workout Settings Snapshot)
 * 記錄當次訓練的偏好設定
 */
export interface WorkoutSettings {
  /** 運動目標 */
  goal: string;
  
  /** 難度等級 */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  /** 使用器材 */
  equipment: string[];
  
  /** 計畫總時長 (分鐘) */
  plannedDuration: number;
}

/**
 * 訓練紀錄 (Workout Log)
 * 對應資料庫 workout_logs 資料表
 */
export interface WorkoutLog {
  /** 紀錄 ID */
  id: string;
  
  /** 使用者 ID */
  user_id: string;
  
  /** 訓練開始時間 */
  started_at: string;
  
  /** 訓練結束時間 */
  completed_at: string;
  
  /** 實際訓練時長 (分鐘) */
  duration_minutes: number;
  
  /** 當次訓練設定 */
  settings: WorkoutSettings;
  
  /** 動作執行紀錄陣列 */
  exercises: ExerciseLogEntry[];
  
  /** 訓練後評分 (1-5 星) */
  rating: number | null;
  
  /** 訓練後備註 */
  notes: string | null;
  
  /** 建立時間 */
  created_at?: string;
  
  /** 更新時間 */
  updated_at?: string;
}

/**
 * 新增訓練紀錄的輸入資料 (不含自動產生欄位)
 */
export interface CreateWorkoutLogInput {
  started_at: string;
  completed_at: string;
  duration_minutes: number;
  settings: WorkoutSettings;
  exercises: ExerciseLogEntry[];
  rating?: number | null;
  notes?: string | null;
}

/**
 * 更新訓練紀錄的輸入資料 (僅允許更新回饋相關)
 */
export interface UpdateWorkoutLogInput {
  rating?: number | null;
  notes?: string | null;
}

/**
 * 訓練紀錄列表項目 (用於歷史紀錄頁面)
 */
export interface WorkoutLogListItem {
  id: string;
  started_at: string;
  duration_minutes: number;
  goal: string;
  exerciseCount: number;
  rating: number | null;
}

/**
 * 訓練統計摘要 (用於儀表板)
 */
export interface WorkoutStats {
  /** 總訓練次數 */
  totalWorkouts: number;
  
  /** 總訓練分鐘數 */
  totalMinutes: number;
  
  /** 平均評分 */
  avgRating: number | null;
  
  /** 最近訓練時間 */
  lastWorkoutAt: string | null;
  
  /** 連續天數 (Streak) */
  currentStreak: number;
}

/**
 * 將 UserPreferences 轉換為 WorkoutSettings
 */
export function preferencesToSettings(prefs: UserPreferences): WorkoutSettings {
  return {
    goal: prefs.goal,
    difficulty: prefs.difficulty,
    equipment: prefs.equipment,
    plannedDuration: prefs.durationMinutes,
  };
}
