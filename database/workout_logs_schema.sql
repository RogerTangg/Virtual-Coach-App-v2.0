-- ======================================
-- Virtual Coach App - Workout Logs Schema
-- ======================================
-- Table: workout_logs
-- Purpose: 儲存使用者訓練紀錄 (Phase 2: 資料持久化)
-- ======================================

-- 建立 workout_logs 資料表
CREATE TABLE IF NOT EXISTS workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 使用者關聯 (連結至 Supabase Auth)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 時間戳記
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 訓練時長 (分鐘)
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  
  -- 當次訓練設定 (JSONB 格式儲存彈性資料)
  settings JSONB NOT NULL DEFAULT '{}'::JSONB,
  -- 預期格式: { "goal": "增肌", "difficulty": "intermediate", "equipment": ["徒手"] }
  
  -- 訓練動作陣列 (JSONB 格式儲存詳細資料)
  exercises JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- 預期格式: [{ "name": "深蹲", "duration": 45, "feedback": "just_right", "completed": true }]
  
  -- 訓練後回饋
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  
  -- 中繼資料
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 建立更新時間觸發器
DROP TRIGGER IF EXISTS update_workout_logs_updated_at ON workout_logs;
CREATE TRIGGER update_workout_logs_updated_at
BEFORE UPDATE ON workout_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 建立索引（加速查詢）
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_started_at ON workout_logs (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_started ON workout_logs (user_id, started_at DESC);

-- ======================================
-- Row Level Security (RLS) 政策
-- ======================================

-- 啟用 RLS
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- 使用者只能讀取自己的訓練紀錄
CREATE POLICY "Users can read own workout logs"
ON workout_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 使用者只能新增自己的訓練紀錄
CREATE POLICY "Users can insert own workout logs"
ON workout_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 使用者只能更新自己的訓練紀錄
CREATE POLICY "Users can update own workout logs"
ON workout_logs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 使用者只能刪除自己的訓練紀錄
CREATE POLICY "Users can delete own workout logs"
ON workout_logs
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ======================================
-- 統計視圖 (用於儀表板)
-- ======================================

-- 建立使用者訓練統計視圖
CREATE OR REPLACE VIEW user_workout_stats AS
SELECT 
  user_id,
  COUNT(*) as total_workouts,
  SUM(duration_minutes) as total_minutes,
  AVG(rating)::NUMERIC(3,2) as avg_rating,
  MAX(started_at) as last_workout_at,
  MIN(started_at) as first_workout_at
FROM workout_logs
GROUP BY user_id;

-- ======================================
-- 驗證資料表建立
-- ======================================
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'workout_logs'
ORDER BY ordinal_position;
