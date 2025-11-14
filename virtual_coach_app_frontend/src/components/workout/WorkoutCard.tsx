/**
 * WorkoutCard Component
 * Redesigned with matcha green theme, badges, and expand/collapse animation
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@mantine/core';
import { matchaGreen } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import type { WorkoutPlanItem } from '../../types/dataModel';

/**
 * WorkoutCard Props
 */
export interface WorkoutCardProps {
  item: WorkoutPlanItem;
  index: number;
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
 * 取得肌群顯示名稱
 */
function getMuscleLabel(muscle: string): string {
  const labels: Record<string, string> = {
    chest: '胸部',
    back: '背部',
    legs: '腿部',
    shoulders: '肩膀',
    arms: '手臂',
    core: '核心',
  };
  return labels[muscle] || muscle;
}

/**
 * 訓練項目卡片組件 (重新設計)
 * 
 * 採用白色背景、抹茶綠邊框、可展開/收合設計
 */
export function WorkoutCard({ item, index }: WorkoutCardProps) {
  const { exercise, sets, reps, restSeconds } = item;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      data-testid="workout-card"
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: `2px solid ${isExpanded ? matchaGreen[500] : matchaGreen[200]}`,
        boxShadow: isExpanded ? shadows.md : shadows.xs,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
      whileHover={{ scale: 1.01 }}
      layout
    >
      {/* 主要內容 */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
        style={{
          padding: '16px',
          cursor: 'pointer',
        }}
      >
        {/* 編號與名稱 */}
        <div style={{ display: 'flex', alignItems: 'start', gap: '16px', marginBottom: '12px' }}>
          <div
            style={{
              flexShrink: 0,
              width: '40px',
              height: '40px',
              backgroundColor: matchaGreen[500],
              color: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            {index + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                {exercise.name}
              </h3>
              {/* 展開/收合圖示 */}
              <svg
                style={{
                  width: '20px',
                  height: '20px',
                  color: matchaGreen[500],
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {!isExpanded && exercise.description && (
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                {exercise.description}
              </p>
            )}
          </div>
        </div>

        {/* 訓練參數 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: matchaGreen[600] }}>{sets}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>組數</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: matchaGreen[600] }}>{reps}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>次數</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: matchaGreen[600] }}>{restSeconds}s</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>休息</div>
          </div>
        </div>

        {/* 徽章區 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
          {/* 裝備徽章 - 填充抹茶綠 */}
          {exercise.equipment_needed && (
            <Badge variant="filled" color={matchaGreen[500]} size="sm">
              {exercise.equipment_needed}
            </Badge>
          )}
          
          {/* 時長徽章 - 填充灰色 */}
          {exercise.duration_seconds && (
            <Badge variant="filled" color="gray" size="sm">
              {exercise.duration_seconds} 秒
            </Badge>
          )}
          
          {/* 難度徽章 - 點狀變體 */}
          <Badge variant="dot" color={matchaGreen[500]} size="sm">
            {getDifficultyLabel(exercise.difficulty_level)}
          </Badge>
          
          {/* 肌群徽章 */}
          <Badge variant="light" color={matchaGreen[500]} size="sm">
            {getMuscleLabel(exercise.target_muscle)}
          </Badge>
        </div>
      </div>

      {/* 展開的詳細內容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            data-testid="workout-card-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: matchaGreen[50],
              borderTop: `1px solid ${matchaGreen[200]}`,
            }}
          >
            <div style={{
              padding: '16px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}>
            {/* 完整說明 */}
            {exercise.description && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  運動說明
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}>
                  {exercise.description}
                </p>
              </div>
            )}

            {/* 詳細資訊 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  目標肌群
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  {getMuscleLabel(exercise.target_muscle)}
                </p>
              </div>
              
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  訓練時長
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  {exercise.duration_seconds}秒
                </p>
              </div>
            </div>

            {/* 影片連結 */}
            {exercise.video_url && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${matchaGreen[200]}` }}>
                <a
                  href={exercise.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: matchaGreen[600],
                    fontWeight: '500',
                    textDecoration: 'none',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                  觀看教學影片
                </a>
              </div>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
