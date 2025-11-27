import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Trophy, RotateCcw, Home, Star, History, Loader2 } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { createWorkoutLog, updateWorkoutLog } from '../../services/workoutLogService';
import { 
  WorkoutLog, 
  CreateWorkoutLogInput, 
  ExerciseLogEntry, 
  preferencesToSettings 
} from '../../types/workoutLog';
import { UserPreferences, PlanItem } from '../../types/app';

interface CompletedScreenProps {
  durationMinutes: number;
  preferences: UserPreferences;
  plan: PlanItem[];
  exerciseFeedback?: Map<string, 'too_easy' | 'just_right' | 'too_hard'>;
  startedAt: string;
  onHome: () => void;
  onHistory: () => void;
}

/**
 * 訓練完成頁面 (Completed Screen)
 * Phase 2 更新: 支援訓練紀錄儲存與回饋評分
 */
export const CompletedScreen: React.FC<CompletedScreenProps> = ({ 
  durationMinutes, 
  preferences,
  plan,
  exerciseFeedback,
  startedAt,
  onHome,
  onHistory,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // 自動儲存訓練紀錄 (不含評分)
  useEffect(() => {
    saveInitialLog();
  }, []);

  const saveInitialLog = async () => {
    // 建立動作執行紀錄
    const exerciseLogs: ExerciseLogEntry[] = plan
      .filter(item => item.type === 'exercise')
      .map(item => ({
        name: item.title,
        exerciseId: item.exercise?.id,
        plannedDuration: item.duration,
        actualDuration: item.duration, // TODO: 追蹤實際時間
        completed: true,
        feedback: exerciseFeedback?.get(item.exercise?.id || '') || null,
      }));

    const input: CreateWorkoutLogInput = {
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      duration_minutes: durationMinutes,
      settings: preferencesToSettings(preferences),
      exercises: exerciseLogs,
      rating: null,
      notes: null,
    };

    try {
      const log = await createWorkoutLog(user?.id || null, input);
      if (log) {
        setSavedLogId(log.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('儲存訓練紀錄失敗:', error);
    }
  };

  // 儲存評分與備註
  const handleSaveRating = async () => {
    if (!savedLogId || rating === 0) return;

    setIsSaving(true);
    try {
      await updateWorkoutLog(savedLogId, user?.id || null, {
        rating,
        notes: notes.trim() || null,
      });
    } catch (error) {
      console.error('儲存評分失敗:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 評分變更時自動儲存
  useEffect(() => {
    if (rating > 0 && savedLogId) {
      handleSaveRating();
    }
  }, [rating]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4 animate-fade-in">
      {/* 獎盃動畫 */}
      <div className="w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(250,204,21,0.4)] animate-bounce-limited ring-4 ring-yellow-100">
        <Trophy size={56} className="text-yellow-900 drop-shadow-md" />
      </div>
      
      <h2 className="text-4xl font-extrabold text-brand-dark mb-4 tracking-tight">
        訓練完成！
      </h2>
      
      <p className="text-xl text-gray-600 max-w-md mb-8 leading-relaxed">
        太棒了！您剛剛完成了 <span className="font-bold text-brand-dark text-2xl">{durationMinutes}</span> 分鐘的訓練。<br/>
        今天的汗水是明天的線條。
      </p>

      {/* 評分區塊 */}
      <div className="w-full max-w-md mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">為這次訓練評分</h3>
        
        {/* 星星評分 */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                size={36}
                className={`transition-colors ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-200'
                }`}
              />
            </button>
          ))}
        </div>

        {/* 備註輸入 */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={handleSaveRating}
          placeholder="記錄一下這次訓練的感受吧... (選填)"
          className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-light focus:border-transparent text-gray-700 placeholder-gray-400"
          rows={3}
        />

        {/* 儲存狀態 */}
        {isSaving && (
          <div className="flex items-center justify-center gap-2 mt-3 text-gray-500 text-sm">
            <Loader2 size={14} className="animate-spin" />
            <span>儲存中...</span>
          </div>
        )}
        {isSaved && !isSaving && (
          <p className="text-sm text-green-600 mt-3">
            ✓ 訓練紀錄已{user ? '同步至雲端' : '儲存至本機'}
          </p>
        )}
      </div>

      {/* 訪客提示 */}
      {!user && (
        <div className="w-full max-w-md mb-6 p-4 bg-brand-light/20 rounded-xl border border-brand-light/50">
          <p className="text-brand-dark text-sm">
            <strong>提示：</strong>註冊帳號可永久保存您的訓練紀錄與進度追蹤！
          </p>
        </div>
      )}

      {/* 操作按鈕 */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button onClick={onHome} fullWidth size="lg" className="gap-2 shadow-lg shadow-brand-dark/20 whitespace-nowrap">
          <Home size={20} /> 返回首頁
        </Button>
        <Button variant="outline" onClick={onHistory} fullWidth size="lg" className="gap-2 whitespace-nowrap">
          <History size={20} /> 查看紀錄
        </Button>
      </div>
    </div>
  );
};