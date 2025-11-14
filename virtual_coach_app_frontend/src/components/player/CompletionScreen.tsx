interface CompletionScreenProps {
  workoutTitle: string;
  totalExercises: number;
  totalDurationMinutes: number;
  onRestart: () => void;
  onExit: () => void;
}

/**
 * 訓練完成畫面元件
 * 顯示完成訊息和統計資訊
 */
export function CompletionScreen({
  totalExercises,
  totalDurationMinutes,
  onRestart,
  onExit,
}: CompletionScreenProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
        padding: '48px',
        textAlign: 'center'
      }}>
        {/* 成功圖示 (大尺寸彈跳動畫) */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            width: '140px',
            height: '140px',
            background: '#66BB6A',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            animation: 'bounce 1s ease-in-out',
            boxShadow: '0 10px 30px rgba(102, 187, 106, 0.4)'
          }}>
            <svg
              width="80"
              height="80"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>

        {/* 完成訊息 */}
        <h1 style={{ fontSize: '40px', fontWeight: 700, color: '#2E7D32', marginBottom: '12px' }}>訓練完成!</h1>
        <p style={{ fontSize: '16px', color: '#757575', marginBottom: '40px' }}>恭喜你完成了今天的訓練</p>

        {/* 統計資訊 */}
        <div style={{
          background: '#E8F5E9',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#757575', marginBottom: '8px' }}>完成運動</p>
              <p style={{ fontSize: '48px', fontWeight: 700, color: '#2E7D32' }}>{totalExercises}</p>
              <p style={{ fontSize: '14px', color: '#757575' }}>個項目</p>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: '#757575', marginBottom: '8px' }}>訓練時長</p>
              <p style={{ fontSize: '48px', fontWeight: 700, color: '#2E7D32' }}>{totalDurationMinutes}</p>
              <p style={{ fontSize: '14px', color: '#757575' }}>分鐘</p>
            </div>
          </div>
        </div>

        {/* 操作按鈕 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button
            onClick={onRestart}
            style={{
              width: '100%',
              padding: '16px 32px',
              borderRadius: '12px',
              background: '#66BB6A',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(102, 187, 106, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#4CAF50'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#66BB6A'}
          >
            再練一次
          </button>
          <button
            onClick={onExit}
            style={{
              width: '100%',
              padding: '16px 32px',
              borderRadius: '12px',
              background: 'transparent',
              color: '#2E7D32',
              fontSize: '16px',
              fontWeight: 600,
              border: '2px solid #2E7D32',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E8F5E9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}
