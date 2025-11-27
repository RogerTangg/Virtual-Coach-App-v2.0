/**
 * 訓練紀錄服務 (Workout Log Service)
 * Phase 2: 資料持久化模組
 * 
 * 負責與 Supabase workout_logs 資料表進行 CRUD 操作
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  WorkoutLog,
  CreateWorkoutLogInput,
  UpdateWorkoutLogInput,
  WorkoutLogListItem,
  WorkoutStats,
} from '../types/workoutLog';

/**
 * 本地儲存鍵名 (用於訪客模式)
 */
const LOCAL_STORAGE_KEY = 'virtual_coach_workout_logs';

/**
 * 從本地儲存讀取訓練紀錄 (訪客模式)
 */
function getLocalWorkoutLogs(): WorkoutLog[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 儲存訓練紀錄至本地儲存 (訪客模式)
 */
function saveLocalWorkoutLogs(logs: WorkoutLog[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('無法儲存至本地儲存:', error);
  }
}

/**
 * 生成唯一 ID (訪客模式使用)
 */
function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 新增訓練紀錄 (Create Workout Log)
 * 
 * @param userId - 使用者 ID (若為 null 則存至本地)
 * @param input - 訓練紀錄資料
 * @returns 新建的訓練紀錄
 */
export async function createWorkoutLog(
  userId: string | null,
  input: CreateWorkoutLogInput
): Promise<WorkoutLog | null> {
  // 訪客模式：儲存至本地
  if (!userId) {
    const localLog: WorkoutLog = {
      id: generateLocalId(),
      user_id: 'guest',
      ...input,
      rating: input.rating ?? null,
      notes: input.notes ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const logs = getLocalWorkoutLogs();
    logs.unshift(localLog);
    saveLocalWorkoutLogs(logs);
    
    return localLog;
  }

  // 會員模式：儲存至 Supabase
  if (!isSupabaseConfigured) {
    console.error('Supabase 未設定');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('workout_logs')
      .insert({
        user_id: userId,
        started_at: input.started_at,
        completed_at: input.completed_at,
        duration_minutes: input.duration_minutes,
        settings: input.settings,
        exercises: input.exercises,
        rating: input.rating ?? null,
        notes: input.notes ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error('新增訓練紀錄失敗:', error);
      return null;
    }

    return data as WorkoutLog;
  } catch (error) {
    console.error('新增訓練紀錄錯誤:', error);
    return null;
  }
}

/**
 * 更新訓練紀錄 (Update Workout Log)
 * 主要用於更新訓練後回饋 (評分和備註)
 * 
 * @param logId - 紀錄 ID
 * @param userId - 使用者 ID
 * @param input - 更新資料
 * @returns 更新後的訓練紀錄
 */
export async function updateWorkoutLog(
  logId: string,
  userId: string | null,
  input: UpdateWorkoutLogInput
): Promise<WorkoutLog | null> {
  // 訪客模式：更新本地紀錄
  if (!userId || logId.startsWith('local_')) {
    const logs = getLocalWorkoutLogs();
    const index = logs.findIndex(log => log.id === logId);
    
    if (index === -1) return null;
    
    logs[index] = {
      ...logs[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    
    saveLocalWorkoutLogs(logs);
    return logs[index];
  }

  // 會員模式：更新 Supabase
  if (!isSupabaseConfigured) {
    console.error('Supabase 未設定');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('workout_logs')
      .update({
        rating: input.rating,
        notes: input.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', logId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('更新訓練紀錄失敗:', error);
      return null;
    }

    return data as WorkoutLog;
  } catch (error) {
    console.error('更新訓練紀錄錯誤:', error);
    return null;
  }
}

/**
 * 取得使用者訓練紀錄列表 (Get User Workout Logs)
 * 
 * @param userId - 使用者 ID
 * @param limit - 最大筆數 (預設 20)
 * @param offset - 偏移量 (分頁用)
 * @returns 訓練紀錄列表
 */
export async function getWorkoutLogs(
  userId: string | null,
  limit: number = 20,
  offset: number = 0
): Promise<WorkoutLogListItem[]> {
  // 訪客模式：從本地讀取
  if (!userId) {
    const logs = getLocalWorkoutLogs();
    return logs.slice(offset, offset + limit).map(log => ({
      id: log.id,
      started_at: log.started_at,
      duration_minutes: log.duration_minutes,
      goal: log.settings.goal,
      exerciseCount: log.exercises.length,
      rating: log.rating,
    }));
  }

  // 會員模式：從 Supabase 讀取
  if (!isSupabaseConfigured) {
    console.error('Supabase 未設定');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('id, started_at, duration_minutes, settings, exercises, rating')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('取得訓練紀錄失敗:', error);
      return [];
    }

    return (data || []).map(log => ({
      id: log.id,
      started_at: log.started_at,
      duration_minutes: log.duration_minutes,
      goal: (log.settings as any)?.goal || '未知',
      exerciseCount: Array.isArray(log.exercises) ? log.exercises.length : 0,
      rating: log.rating,
    }));
  } catch (error) {
    console.error('取得訓練紀錄錯誤:', error);
    return [];
  }
}

/**
 * 取得單筆訓練紀錄詳情 (Get Workout Log Detail)
 * 
 * @param logId - 紀錄 ID
 * @param userId - 使用者 ID
 * @returns 訓練紀錄詳情
 */
export async function getWorkoutLogById(
  logId: string,
  userId: string | null
): Promise<WorkoutLog | null> {
  // 訪客模式
  if (!userId || logId.startsWith('local_')) {
    const logs = getLocalWorkoutLogs();
    return logs.find(log => log.id === logId) || null;
  }

  // 會員模式
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('id', logId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('取得訓練紀錄詳情失敗:', error);
      return null;
    }

    return data as WorkoutLog;
  } catch (error) {
    console.error('取得訓練紀錄詳情錯誤:', error);
    return null;
  }
}

/**
 * 計算連續訓練天數 (Calculate Streak)
 * 
 * @param logs - 訓練紀錄列表 (需已按日期降序排列)
 * @returns 連續天數
 */
function calculateStreak(logs: { started_at: string }[]): number {
  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 取得所有訓練日期 (去重)
  const workoutDates = new Set<string>();
  logs.forEach(log => {
    const date = new Date(log.started_at);
    date.setHours(0, 0, 0, 0);
    workoutDates.add(date.toISOString().split('T')[0]);
  });

  // 從今天開始往前數連續天數
  const checkDate = new Date(today);
  
  // 如果今天沒有訓練，從昨天開始算
  const todayStr = today.toISOString().split('T')[0];
  if (!workoutDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
    
    // 如果昨天也沒有訓練，streak 為 0
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    if (!workoutDates.has(yesterdayStr)) {
      return 0;
    }
  }

  // 計算連續天數
  while (workoutDates.has(checkDate.toISOString().split('T')[0])) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

/**
 * 取得使用者訓練統計 (Get User Workout Stats)
 * 
 * @param userId - 使用者 ID
 * @returns 訓練統計摘要
 */
export async function getWorkoutStats(
  userId: string | null
): Promise<WorkoutStats> {
  const defaultStats: WorkoutStats = {
    totalWorkouts: 0,
    totalMinutes: 0,
    avgRating: null,
    lastWorkoutAt: null,
    currentStreak: 0,
  };

  // 訪客模式
  if (!userId) {
    const logs = getLocalWorkoutLogs();
    
    if (logs.length === 0) return defaultStats;

    const totalMinutes = logs.reduce((sum, log) => sum + log.duration_minutes, 0);
    const ratings = logs.filter(log => log.rating !== null).map(log => log.rating!);
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : null;

    return {
      totalWorkouts: logs.length,
      totalMinutes,
      avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      lastWorkoutAt: logs[0]?.started_at || null,
      currentStreak: calculateStreak(logs),
    };
  }

  // 會員模式
  if (!isSupabaseConfigured) {
    return defaultStats;
  }

  try {
    // 取得基本統計
    const { data: logs, error } = await supabase
      .from('workout_logs')
      .select('started_at, duration_minutes, rating')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error || !logs) {
      console.error('取得訓練統計失敗:', error);
      return defaultStats;
    }

    if (logs.length === 0) return defaultStats;

    const totalMinutes = logs.reduce((sum, log) => sum + log.duration_minutes, 0);
    const ratings = logs.filter(log => log.rating !== null).map(log => log.rating!);
    const avgRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : null;

    return {
      totalWorkouts: logs.length,
      totalMinutes,
      avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      lastWorkoutAt: logs[0]?.started_at || null,
      currentStreak: calculateStreak(logs),
    };
  } catch (error) {
    console.error('取得訓練統計錯誤:', error);
    return defaultStats;
  }
}

/**
 * 刪除訓練紀錄 (Delete Workout Log)
 * 
 * @param logId - 紀錄 ID
 * @param userId - 使用者 ID
 * @returns 是否成功刪除
 */
export async function deleteWorkoutLog(
  logId: string,
  userId: string | null
): Promise<boolean> {
  // 訪客模式
  if (!userId || logId.startsWith('local_')) {
    const logs = getLocalWorkoutLogs();
    const filtered = logs.filter(log => log.id !== logId);
    
    if (filtered.length === logs.length) return false;
    
    saveLocalWorkoutLogs(filtered);
    return true;
  }

  // 會員模式
  if (!isSupabaseConfigured) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('workout_logs')
      .delete()
      .eq('id', logId)
      .eq('user_id', userId);

    if (error) {
      console.error('刪除訓練紀錄失敗:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('刪除訓練紀錄錯誤:', error);
    return false;
  }
}

/**
 * 將訪客紀錄遷移至會員帳號 (Migrate Guest Logs)
 * 當訪客註冊或登入後，將本地紀錄同步至雲端
 * 
 * @param userId - 新會員的使用者 ID
 * @returns 成功遷移的筆數
 */
export async function migrateGuestLogsToUser(userId: string): Promise<number> {
  if (!isSupabaseConfigured) {
    console.error('Supabase 未設定，無法遷移紀錄');
    return 0;
  }

  const localLogs = getLocalWorkoutLogs();
  
  if (localLogs.length === 0) return 0;

  let migratedCount = 0;

  for (const log of localLogs) {
    try {
      const { error } = await supabase
        .from('workout_logs')
        .insert({
          user_id: userId,
          started_at: log.started_at,
          completed_at: log.completed_at,
          duration_minutes: log.duration_minutes,
          settings: log.settings,
          exercises: log.exercises,
          rating: log.rating,
          notes: log.notes,
        });

      if (!error) {
        migratedCount++;
      }
    } catch (error) {
      console.error('遷移紀錄失敗:', error);
    }
  }

  // 清除本地紀錄
  if (migratedCount > 0) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return migratedCount;
}
