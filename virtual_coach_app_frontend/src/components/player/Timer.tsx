interface TimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  formattedTime: string;
  progressPercent: number;
}

/**
 * 圓形倒數計時器元件 (Circular Progress Ring)
 * 顯示剩餘時間和綠色進度環
 * 桌面: 200-300px, 手機: 150-200px
 */
export function Timer({ remainingSeconds, totalSeconds, formattedTime, progressPercent }: TimerProps) {
  // 響應式尺寸: 桌面 250px, 手機 180px
  const size = 250;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '16px' 
    }}>
      {/* 圓形進度環 */}
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* 背景圓環 (淡綠色) */}
        <svg
          width={size}
          height={size}
          style={{ 
            transform: 'rotate(-90deg)',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#C8E6C9"
            strokeWidth={strokeWidth}
          />
        </svg>

        {/* 進度圓環 (matcha green) */}
        <svg
          width={size}
          height={size}
          style={{ 
            transform: 'rotate(-90deg)',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#66BB6A"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s linear',
            }}
          />
        </svg>

        {/* 中央時間顯示 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px',
            letterSpacing: '1px'
          }}>
            剩餘時間
          </div>
          <div style={{
            fontSize: '56px',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1,
            fontFamily: 'monospace',
            letterSpacing: '2px'
          }}>
            {formattedTime}
          </div>
        </div>
      </div>

      {/* 進度百分比 (可選) */}
      <div style={{
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontWeight: 500
      }}>
        {Math.round(progressPercent)}% 完成
      </div>
    </div>
  );
}
