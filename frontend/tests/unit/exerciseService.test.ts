import { describe, it, expect, vi, beforeEach, beforeAll, afterEach } from 'vitest';
import { MOCK_EXERCISES } from '@/data/mockExercises';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    supabaseUrl: 'https://mock.supabase.co',
  },
  isSupabaseConfigured: true, // 預設為配置完成
}));

// Mock data
vi.mock('@/data/mockExercises', () => ({
  MOCK_EXERCISES: [
    {
      id: '1',
      name: '測試運動',
      tags: ['equipment:徒手', 'difficulty:初階'],
    },
  ],
}));

describe('exerciseService', () => {
  let supabase: any;
  let getAllExercises: any;
  let clearExerciseCache: any;

  beforeAll(async () => {
    const supabaseModule = await import('@/lib/supabase');
    supabase = supabaseModule.supabase;
    const exerciseModule = await import('@/services/exerciseService');
    getAllExercises = exerciseModule.getAllExercises;
    clearExerciseCache = exerciseModule.clearExerciseCache;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // 清除快取確保每個測試獨立
    clearExerciseCache?.();
  });

  afterEach(() => {
    // 清除快取
    clearExerciseCache?.();
  });

  describe('getAllExercises', () => {
    it('應該成功從 Supabase 獲取運動資料', async () => {
      const mockDbData = [
        {
          id: '1',
          name: '伏地挺身',
          description: '標準伏地挺身',
          video_url: 'https://example.com/1',
          duration_seconds: 30,
          tags: ['equipment:徒手', 'difficulty:初階'],
        },
        {
          id: '2',
          name: '深蹲',
          description: '標準深蹲',
          video_url: 'https://example.com/2',
          duration_seconds: 45,
          tags: ['equipment:徒手', 'difficulty:中階'],
        },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: mockDbData,
          error: null,
        }),
      } as any);

      const result = await getAllExercises();

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('伏地挺身');
      expect(result[0].tags).toContain('equipment:徒手');
      expect(supabase.from).toHaveBeenCalledWith('exercises');
    });

    it('應該在 Supabase 失敗時使用 Mock Data', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Network error', name: 'Error' },
        }),
      } as any);

      const result = await getAllExercises();

      expect(result).toEqual(MOCK_EXERCISES);
    });

    it('應該在資料庫為空時使用 Mock Data', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      } as any);

      const result = await getAllExercises();

      expect(result).toEqual(MOCK_EXERCISES);
    });

    it('應該正確處理 tags 為陣列格式', async () => {
      const mockDbData = [
        {
          id: '1',
          name: '伏地挺身',
          description: '',
          video_url: 'https://example.com/1',
          duration_seconds: 30,
          tags: ['equipment:徒手', 'difficulty:初階', 'goal:增肌'],
        },
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: mockDbData,
          error: null,
        }),
      } as any);

      const result = await getAllExercises();

      expect(result[0].tags).toContain('difficulty:初階');
      expect(result[0].tags).toContain('goal:增肌');
      expect(result[0].tags).toContain('equipment:徒手');
      expect(Array.isArray(result[0].tags)).toBe(true);
    });
  });
});
