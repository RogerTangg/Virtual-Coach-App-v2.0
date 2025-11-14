/**
 * WorkoutSummary Component
 * Displays workout overview with duration, exercise count, and difficulty badges
 */

import { Badge } from '@mantine/core';
import { IconClock, IconListNumbers, IconStar } from '@tabler/icons-react';
import { matchaGreen } from '../../theme/colors';

export interface WorkoutSummaryProps {
  totalDurationMinutes: number;
  exerciseCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * 取得難度顯示名稱
 */
function getDifficultyLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner: '初學者',
    intermediate: '中階',
    advanced: '進階',
  };
  return labels[level] || level;
}

/**
 * WorkoutSummary 元件
 * 顯示訓練課表摘要資訊的橫向徽章組
 */
export function WorkoutSummary({
  totalDurationMinutes,
  exerciseCount,
  difficulty,
}: WorkoutSummaryProps) {
  return (
    <div
      data-testid="workout-summary"
      style={{
        display: 'flex',
        gap: '12px',
        padding: '16px',
        backgroundColor: matchaGreen[50],
        borderRadius: '12px',
        flexWrap: 'wrap',
      }}
    >
      {/* 總時長徽章 */}
      <Badge
        data-testid="badge-duration"
        size="lg"
        variant="filled"
        color={matchaGreen[500]}
        leftSection={<IconClock size={16} data-testid="clock-icon" />}
      >
        {totalDurationMinutes} 分鐘
      </Badge>

      {/* 運動數量徽章 */}
      <Badge
        data-testid="badge-count"
        size="lg"
        variant="filled"
        color={matchaGreen[500]}
        leftSection={<IconListNumbers size={16} data-testid="number-icon" />}
      >
        {exerciseCount} 個運動
      </Badge>

      {/* 難度徽章 */}
      <Badge
        data-testid="badge-difficulty"
        size="lg"
        variant="filled"
        color={matchaGreen[500]}
        leftSection={<IconStar size={16} data-testid="star-icon" />}
      >
        {getDifficultyLabel(difficulty)}
      </Badge>
    </div>
  );
}
