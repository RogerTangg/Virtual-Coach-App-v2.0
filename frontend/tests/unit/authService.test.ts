import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase before importing authService
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn().mockResolvedValue({ error: null }), // 預設返回 Promise
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn(),
  },
  isSupabaseConfigured: true,
  startSessionRefresh: vi.fn(),
  stopSessionRefresh: vi.fn(),
}));

// Mock errorHandling
vi.mock('@/utils/errorHandling', () => ({
  sanitizeAuthError: vi.fn((error) => error?.message || '操作失敗'),
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('應該成功呼叫 Supabase signUp API', async () => {
      const { supabase } = await import('@/lib/supabase');
      const { signUp } = await import('@/services/authService');

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        identities: [{ id: 'identity-1' }], // 🔧 新增：有 identities 表示全新用戶
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser as any, session: null },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'user-123', display_name: 'Test User' },
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await signUp({
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        display_name: 'Test User',
      });

      expect(result.email).toBe('test@example.com');
      expect(supabase.auth.signUp).toHaveBeenCalled();
    });

    it('應該在註冊失敗時拋出錯誤', async () => {
      const { supabase } = await import('@/lib/supabase');
      const { signUp } = await import('@/services/authService');

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already exists' } as any,
      });

      await expect(
        signUp({
          email: 'existing@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
      ).rejects.toThrow();
    });

    it('應該在重複註冊時拋出錯誤（identities 為空）', async () => {
      const { supabase } = await import('@/lib/supabase');
      const { signUp } = await import('@/services/authService');

      // 模擬 Supabase 返回空 identities（表示重複註冊）
      const mockUser = {
        id: 'user-123',
        email: 'existing@example.com',
        identities: [], // 空陣列表示已存在的用戶
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser as any, session: null },
        error: null,
      });

      await expect(
        signUp({
          email: 'existing@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        })
      ).rejects.toThrow();
    });
  });

  describe('signIn', () => {
    it('應該成功登入使用者', async () => {
      const { supabase } = await import('@/lib/supabase');
      const { signIn } = await import('@/services/authService');

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        email_confirmed_at: new Date().toISOString(), // 🔧 新增：表示 Email 已驗證
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser as any, session: {} as any },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'user-123', display_name: 'Test User' },
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.user?.email).toBe('test@example.com');
    });
  });

  describe('signOut', () => {
    it('應該成功登出', async () => {
      const { supabase, stopSessionRefresh } = await import('@/lib/supabase');
      const { signOut } = await import('@/services/authService');

      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      await expect(signOut()).resolves.not.toThrow();
      expect(stopSessionRefresh).toHaveBeenCalled();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('應該在未登入時回傳 null', async () => {
      const { supabase } = await import('@/lib/supabase');
      const { getCurrentUser } = await import('@/services/authService');

      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null as any },
        error: null,
      } as any);

      const result = await getCurrentUser();
      expect(result).toBeNull();
    });
  });
});
