/**
 * ExerciseCard Component (Redesigned)
 * Expandable exercise card with matcha green theme and Framer Motion animation
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@mantine/core';
import { matchaGreen } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import type { WorkoutPlanItem } from '../../types/dataModel';

/**
 * ExerciseCard Props
 */
export interface ExerciseCardProps {
  item: WorkoutPlanItem;
  index: number;
  defaultExpanded?: boolean;
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
 * 運動項目卡片組件（增強版，重新設計）
 * 
 * 顯示單一運動的詳細資訊，支援展開/收合完整說明
 * 採用抹茶綠主題、Framer Motion 動畫、光綠色展開區域
 */
export function ExerciseCard({ item, index, defaultExpanded = false }: ExerciseCardProps) {
  const { exercise, sets, reps, restSeconds } = item;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      data-testid="exercise-card"
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
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
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
        <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
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
              <p
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginTop: '4px',
                  marginBottom: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
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

        {/* 標籤 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
          <Badge variant="dot" color={matchaGreen[500]} size="sm">
            {getDifficultyLabel(exercise.difficulty_level)}
          </Badge>
          <Badge variant="light" color={matchaGreen[500]} size="sm">
            {getMuscleLabel(exercise.target_muscle)}
          </Badge>
          {exercise.equipment_needed && (
            <Badge variant="filled" color={matchaGreen[500]} size="sm">
              {exercise.equipment_needed}
            </Badge>
          )}
          {exercise.duration_seconds && (
            <Badge variant="filled" color="gray" size="sm">
              {exercise.duration_seconds} 秒
            </Badge>
          )}
        </div>
      </div>

      {/* 展開的詳細內容 - 光綠色背景 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            data-testid="exercise-card-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: matchaGreen[50],
              padding: '16px',
              borderTop: `1px solid ${matchaGreen[200]}`,
            }}
          >
            {/* 完整說明 */}
            {exercise.description && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  運動說明
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  {exercise.description}
                </p>
              </div>
            )}

            {/* 詳細資訊 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  訓練細節
                </h4>
                <ul style={{ fontSize: '14px', color: '#6b7280', listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg style={{ width: '16px', height: '16px', color: matchaGreen[500] }} fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {sets} 組 × {reps} 次
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <svg style={{ width: '16px', height: '16px', color: matchaGreen[400] }} fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    每組休息 {restSeconds} 秒
                  </li>
                  {exercise.duration_seconds && (
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg style={{ width: '16px', height: '16px', color: '#f97316' }} fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      預計 {exercise.duration_seconds} 秒
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  運動屬性
                </h4>
                <ul style={{ fontSize: '14px', color: '#6b7280', listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}>
                    <span style={{ color: '#9ca3af' }}>難度：</span>
                    {getDifficultyLabel(exercise.difficulty_level)}
                  </li>
                  <li style={{ marginBottom: '4px' }}>
                    <span style={{ color: '#9ca3af' }}>目標：</span>
                    {getMuscleLabel(exercise.target_muscle)}
                  </li>
                  <li>
                    <span style={{ color: '#9ca3af' }}>器材：</span>
                    {exercise.equipment_needed || '無需器材'}
                  </li>
                </ul>
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
