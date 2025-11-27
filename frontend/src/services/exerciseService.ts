
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Exercise } from '../types/db';
import { MOCK_EXERCISES } from '../data/mockExercises';

/**
 * 帶超時的 Promise 包裝器
 * @param promise - 原始 Promise
 * @param timeoutMs - 超時時間（毫秒）
 */
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
};

// 快取變數：避免重複查詢
let cachedExercises: Exercise[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 分鐘快取

/**
 * 獲取所有運動資料
 * 
 * 策略：
 * 1. 先嘗試從 Supabase 查詢
 * 2. 若查詢失敗或超時，使用模擬資料作為 fallback
 * 3. 使用 5 分鐘快取減少 API 請求
 * 
 * 資料庫表結構：
 * - id (uuid), created_at, name, description, video_url, duration_seconds, tags (ARRAY)
 * 
 * 注意：若 Supabase RLS 政策未正確設定，將自動使用模擬資料
 * 請在 Supabase Dashboard 執行 database/fix_exercises_rls.sql 修復
 */
export const getAllExercises = async (): Promise<Exercise[]> => {
  // 檢查快取是否有效
  const now = Date.now();
  if (cachedExercises && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedExercises;
  }

  // 若 Supabase 未配置，直接使用模擬資料
  if (!isSupabaseConfigured) {
    console.warn('⚠️ Supabase 未配置，使用模擬資料');
    return MOCK_EXERCISES;
  }

  try {
    // 嘗試從資料庫查詢（3 秒超時）
    // 資料庫結構：id, created_at, name, description, video_url, duration_seconds, tags
    const { data, error } = await withTimeout(
      supabase
        .from('exercises')
        .select('*'),
      3000
    );

    if (error) {
      console.warn('⚠️ 資料庫查詢失敗，使用模擬資料:', error.message);
      return MOCK_EXERCISES;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ 資料庫無運動資料，使用模擬資料');
      return MOCK_EXERCISES;
    }

    // 直接使用資料庫資料（tags 已是陣列格式）
    const exercises = data.map((item: any) => ({
      id: item.id,
      created_at: item.created_at,
      name: item.name,
      description: item.description || '',
      video_url: item.video_url,
      duration_seconds: item.duration_seconds,
      tags: Array.isArray(item.tags) ? item.tags : []
    }));

    cachedExercises = exercises;
    cacheTimestamp = now;
    console.log(`✅ 從資料庫載入 ${exercises.length} 個運動`);

    return exercises;

  } catch (error) {
    // 超時或其他錯誤，使用模擬資料
    console.warn('⚠️ 查詢超時或發生錯誤，使用模擬資料');
    return MOCK_EXERCISES;
  }
};

/**
 * 清除運動資料快取
 * 可在需要強制重新載入時呼叫
 */
export const clearExerciseCache = (): void => {
  cachedExercises = null;
  cacheTimestamp = 0;
};
