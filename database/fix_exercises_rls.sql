-- ======================================
-- Virtual Coach App - RLS 政策修復腳本
-- Fix for exercises table RLS Policy
-- ======================================
-- 
-- 問題描述 (Problem Description):
-- exercises 表的 RLS 政策導致 anon 用戶無法讀取資料
-- 造成應用程式必須使用模擬資料
--
-- 執行方式 (How to Execute):
-- 1. 登入 Supabase Dashboard
-- 2. 前往 SQL Editor
-- 3. 複製貼上此腳本並執行
--
-- 表結構 (Table Structure):
-- id (uuid), created_at, name, description, video_url, duration_seconds, tags (ARRAY)
-- ======================================

-- Step 1: 移除既有的 RLS 政策（如果存在）
DROP POLICY IF EXISTS "Allow public read access to active exercises" ON public.exercises;
DROP POLICY IF EXISTS "Allow anyone to read exercises" ON public.exercises;
DROP POLICY IF EXISTS "exercises_read_policy" ON public.exercises;
DROP POLICY IF EXISTS "Allow public read active exercises" ON public.exercises;
DROP POLICY IF EXISTS "Allow public read all exercises" ON public.exercises;

-- Step 2: 確保 RLS 已啟用
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Step 3: 建立新的讀取政策 - 允許所有人讀取所有運動資料
-- 這是符合 PRD 需求的設計：訪客和會員都可以瀏覽運動資料庫
CREATE POLICY "Allow public read all exercises"
ON public.exercises
FOR SELECT
TO anon, authenticated
USING (true);

-- Step 4: 驗證政策建立成功
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'exercises';

-- ======================================
-- 驗證資料可讀取
-- ======================================
SELECT COUNT(*) as total_exercise_count FROM exercises;

-- 顯示前 5 筆資料確認
SELECT id, name, duration_seconds, tags
FROM exercises 
LIMIT 5;
