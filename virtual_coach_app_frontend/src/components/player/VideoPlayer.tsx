import type { Exercise } from '../../types/dataModel';

interface VideoPlayerProps {
  exercise: Exercise;
  isPlaying: boolean;
}

/**
 * 影片播放器元件
 * 顯示 YouTube 嵌入式影片
 */
export function VideoPlayer({ exercise, isPlaying }: VideoPlayerProps) {
  const videoUrl = exercise.video_url;

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-gray-800 flex items-center justify-center rounded-lg">
        <div className="text-center text-gray-400">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-lg font-medium">影片無法載入</p>
          <p className="text-sm mt-2">此運動暫無教學影片</p>
        </div>
      </div>
    );
  }

  // 確保 YouTube URL 包含 autoplay 參數
  const embedUrl = new URL(videoUrl);
  if (isPlaying) {
    embedUrl.searchParams.set('autoplay', '1');
  }
  embedUrl.searchParams.set('rel', '0'); // 不顯示相關影片

  return (
    <div style={{ 
      position: 'relative',
      width: '100%',
      maxWidth: '1000px',
      aspectRatio: '16/9',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    }}>
      {/* 影片 */}
      <iframe
        src={embedUrl.toString()}
        title={`${exercise.name} 教學影片`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      
      {/* 頂部資訊覆蓋層 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 24px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
        color: '#FFFFFF',
        fontSize: '20px',
        fontWeight: 600
      }}>
        {exercise.name}
      </div>
      
      {/* 底部說明覆蓋層 */}
      {exercise.description && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          background: 'rgba(200, 230, 201, 0.3)',
          backdropFilter: 'blur(8px)',
          color: '#FFFFFF',
          fontSize: '14px',
          lineHeight: 1.5
        }}>
          {exercise.description}
        </div>
      )}
    </div>
  );
}
