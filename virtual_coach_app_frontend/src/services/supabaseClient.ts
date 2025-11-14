import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 開發模式：如果未設定環境變數，使用假的客戶端以便測試 UI
const isDevelopmentMode = !supabaseUrl || !supabaseAnonKey || 
  supabaseUrl === 'your_supabase_project_url' || 
  supabaseAnonKey === 'your_supabase_anon_key';

if (isDevelopmentMode) {
  console.warn(
    '⚠️ Supabase 未設定，使用開發模式（模擬資料）\n' +
    '若要使用真實資料庫，請在 .env 檔案設定 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY'
  );
}

/**
 * Supabase 客戶端實例
 * 用於所有資料庫操作
 * 開發模式下使用假的 URL，實際查詢會在 service 層被攔截
 */
export const supabase = isDevelopmentMode 
  ? createClient('https://mock.supabase.co', 'mock-anon-key')
  : createClient(supabaseUrl, supabaseAnonKey);

export const isUsingMockData = isDevelopmentMode;
