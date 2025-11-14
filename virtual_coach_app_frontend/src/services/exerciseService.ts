import { supabase, isUsingMockData } from './supabaseClient';
import { handleError } from '../utils/errorHandler';
import type { Exercise } from '../types/dataModel';

/**
 * 模擬運動資料（開發模式使用）
 */
const MOCK_EXERCISES: Exercise[] = [
  {
    id: 1,
    name: '深蹲',
    description: '經典的下半身訓練動作，強化腿部肌群',
    target_muscle: 'legs',
    difficulty_level: 'beginner',
    equipment_needed: '無需器材',
    video_url: 'https://www.youtube.com/watch?v=example1',
    thumbnail_url: '/icons/goal-muscle.svg',
    duration_seconds: 45,
    calories_per_minute: 8.5,
    is_active: true,
    priority_weight: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: '伏地挺身',
    description: '鍛鍊胸部、肩膀和手臂的複合動作',
    target_muscle: 'chest',
    difficulty_level: 'beginner',
    equipment_needed: '無需器材',
    video_url: 'https://www.youtube.com/watch?v=example2',
    thumbnail_url: '/icons/goal-muscle.svg',
    duration_seconds: 40,
    calories_per_minute: 7.0,
    is_active: true,
    priority_weight: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: '棒式',
    description: '核心肌群訓練的基礎動作',
    target_muscle: 'core',
    difficulty_level: 'beginner',
    equipment_needed: '無需器材',
    video_url: 'https://www.youtube.com/watch?v=example3',
    thumbnail_url: '/icons/goal-muscle.svg',
    duration_seconds: 60,
    calories_per_minute: 5.0,
    is_active: true,
    priority_weight: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: '引體向上',
    description: '背部肌群的經典訓練動作',
    target_muscle: 'back',
    difficulty_level: 'intermediate',
    equipment_needed: '單槓',
    video_url: 'https://www.youtube.com/watch?v=example4',
    thumbnail_url: '/icons/equipment-dumbbell.svg',
    duration_seconds: 30,
    calories_per_minute: 9.0,
    is_active: true,
    priority_weight: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: '肩推',
    description: '肩膀力量訓練',
    target_muscle: 'shoulders',
    difficulty_level: 'intermediate',
    equipment_needed: '啞鈴',
    video_url: 'https://www.youtube.com/watch?v=example5',
    thumbnail_url: '/icons/equipment-dumbbell.svg',
    duration_seconds: 45,
    calories_per_minute: 6.5,
    is_active: true,
    priority_weight: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: '二頭彎舉',
    description: '手臂二頭肌訓練',
    target_muscle: 'arms',
    difficulty_level: 'beginner',
    equipment_needed: '啞鈴',
    video_url: 'https://www.youtube.com/watch?v=example6',
    thumbnail_url: '/icons/equipment-dumbbell.svg',
    duration_seconds: 40,
    calories_per_minute: 5.5,
    is_active: true,
    priority_weight: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * 快取配置
 */
const CACHE_KEY = 'exercises_cache';
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 分鐘

interface CacheData {
  exercises: Exercise[];
  timestamp: number;
}

/**
 * 從 localStorage 讀取快取
 */
function getCachedExercises(): Exercise[] | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CacheData = JSON.parse(cached);
    const now = Date.now();

    // 檢查快取是否過期
    if (now - data.timestamp > CACHE_DURATION_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return data.exercises;
  } catch (error) {
    console.error('Failed to read exercises cache:', error);
    return null;
  }
}

/**
 * 將資料寫入快取
 */
function setCachedExercises(exercises: Exercise[]): void {
  try {
    const data: CacheData = {
      exercises,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to cache exercises:', error);
  }
}

/**
 * 從 Supabase 獲取所有啟用的運動資料
 * 包含 5 分鐘快取機制
 * 開發模式下使用模擬資料
 * 
 * @returns Promise<Exercise[]> 運動資料陣列
 * @throws Error 當資料庫查詢失敗時
 */
export async function fetchActiveExercises(): Promise<Exercise[]> {
  // 開發模式：直接返回模擬資料
  if (isUsingMockData) {
    console.info('🧪 使用模擬運動資料 (開發模式)');
    return Promise.resolve(MOCK_EXERCISES);
  }

  // 先嘗試從快取讀取
  const cached = getCachedExercises();
  if (cached) {
    return cached;
  }

  try {
    // 從 Supabase 查詢資料
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('is_active', true)
      .order('priority_weight', { ascending: false });

    if (error) {
      throw new Error(`資料庫查詢失敗: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('資料庫中沒有可用的運動資料');
    }

    // 將資料寫入快取
    setCachedExercises(data);

    return data;
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
}

/**
 * 清除運動資料快取
 * 用於管理員更新運動資料後強制重新載入
 */
export function clearExercisesCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

/**
 * 根據篩選條件獲取運動資料
 * 開發模式下從模擬資料篩選
 * 
 * @param targetMuscles 目標肌群陣列
 * @param difficultyLevel 難度等級
 * @returns Promise<Exercise[]> 符合條件的運動資料
 */
export async function fetchFilteredExercises(
  targetMuscles: string[],
  difficultyLevel: string
): Promise<Exercise[]> {
  // 開發模式：從模擬資料篩選
  if (isUsingMockData) {
    const filtered = MOCK_EXERCISES.filter(
      (exercise) =>
        exercise.difficulty_level === difficultyLevel &&
        targetMuscles.includes(exercise.target_muscle)
    );
    return Promise.resolve(filtered);
  }

  try {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('is_active', true)
      .eq('difficulty_level', difficultyLevel)
      .contains('target_muscles', targetMuscles)
      .order('priority_weight', { ascending: false });

    if (error) {
      throw new Error(`資料庫查詢失敗: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    const errorMessage = handleError(error);
    throw new Error(errorMessage);
  }
}
