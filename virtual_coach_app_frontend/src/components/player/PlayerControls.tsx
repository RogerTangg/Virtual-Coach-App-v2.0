import { useState, useEffect } from 'react';

interface PlayerControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onExit: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

/**
 * 播放器控制按鈕元件 (Auto-hide with fade animation)
 * 三個圓形按鈕: 暫停/繼續、跳過、退出
 * 半透明綠色背景,3秒後自動隱藏
 */
export function PlayerControls({
  isPaused,
  onPlayPause,
  onNext,
  onPrevious,
  onExit,
  canGoPrevious,
  canGoNext,
}: PlayerControlsProps) {
  // Remove auto-hide - controls always visible
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px',
        background: 'linear-gradient(to top, rgba(46, 125, 50, 0.4), transparent)',
        opacity: 1,
        zIndex: 20,
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px' 
      }}>
        {/* 暫停/繼續按鈕 (中央,最大) */}
        <button
          onClick={onPlayPause}
          aria-label={isPaused ? '繼續' : '暫停'}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(102, 187, 106, 0.9)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = 'rgba(102, 187, 106, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(102, 187, 106, 0.9)';
          }}
        >
          {isPaused ? (
            // 播放圖示
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            // 暫停圖示
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          )}
        </button>

        {/* 跳過按鈕 */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="跳過"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(102, 187, 106, 0.7)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: canGoNext ? 'pointer' : 'not-allowed',
            opacity: canGoNext ? 1 : 0.4,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            if (canGoNext) {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = 'rgba(102, 187, 106, 0.9)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(102, 187, 106, 0.7)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 退出按鈕 */}
        <button
          onClick={onExit}
          aria-label="退出訓練"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(102, 187, 106, 0.7)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.background = 'rgba(239, 83, 80, 0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(102, 187, 106, 0.7)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
