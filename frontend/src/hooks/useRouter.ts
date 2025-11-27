/**
 * useRouter - 輕量級 Hash 路由 Hook
 * 
 * 功能：
 * 1. 支援瀏覽器「上一頁」/「下一頁」導航
 * 2. 維持 URL 與應用狀態同步
 * 3. 支援重新整理頁面保持當前畫面
 * 4. 特定頁面（workout, generating）不加入歷史記錄
 * 
 * 設計原則：
 * - 不引入額外依賴（如 react-router-dom）
 * - 保持與現有 AppScreen 類型相容
 * - 確保不影響現有功能
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppScreen } from '../types/app';

// 不記錄到歷史的頁面（訓練中、生成中等狀態頁面）
const TRANSIENT_SCREENS: AppScreen[] = ['workout', 'generating', 'completed'];

// 預設頁面
const DEFAULT_SCREEN: AppScreen = 'home';

// 有效的頁面列表
const VALID_SCREENS: AppScreen[] = [
  'home',
  'login',
  'register',
  'profile',
  'setup',
  'overview',
  'generating',
  'workout',
  'completed',
  'history',
  'dashboard'
];

/**
 * 從 URL hash 解析當前頁面
 */
const getScreenFromHash = (): AppScreen => {
  const hash = window.location.hash.slice(1); // 移除 #
  if (hash && VALID_SCREENS.includes(hash as AppScreen)) {
    return hash as AppScreen;
  }
  return DEFAULT_SCREEN;
};

/**
 * 設置 URL hash
 */
const setHashForScreen = (screen: AppScreen, replace: boolean = false): void => {
  const newHash = `#${screen}`;
  
  if (replace) {
    window.history.replaceState(null, '', newHash);
  } else {
    window.history.pushState(null, '', newHash);
  }
};

export interface UseRouterOptions {
  /**
   * 初始頁面（若 URL 無有效 hash）
   */
  initialScreen?: AppScreen;
  
  /**
   * 是否啟用瀏覽器歷史記錄
   * @default true
   */
  enableHistory?: boolean;
  
  /**
   * 頁面切換前的回調（可用於確認離開等）
   * 返回 false 可阻止切換
   */
  beforeNavigate?: (from: AppScreen, to: AppScreen) => boolean | Promise<boolean>;
}

export interface UseRouterReturn {
  /**
   * 當前頁面
   */
  currentScreen: AppScreen;
  
  /**
   * 導航到指定頁面
   * @param screen - 目標頁面
   * @param options - 導航選項
   */
  navigate: (screen: AppScreen, options?: { replace?: boolean }) => void;
  
  /**
   * 返回上一頁
   */
  goBack: () => void;
  
  /**
   * 檢查是否可以返回
   */
  canGoBack: boolean;
  
  /**
   * 頁面導航歷史（用於調試）
   */
  history: AppScreen[];
}

/**
 * 輕量級 Hash 路由 Hook
 * 
 * @example
 * ```tsx
 * const { currentScreen, navigate, goBack } = useRouter({
 *   initialScreen: 'home',
 *   enableHistory: true
 * });
 * 
 * // 導航到新頁面
 * navigate('dashboard');
 * 
 * // 替換當前頁面（不加入歷史）
 * navigate('login', { replace: true });
 * 
 * // 返回上一頁
 * goBack();
 * ```
 */
export function useRouter(options: UseRouterOptions = {}): UseRouterReturn {
  const {
    initialScreen,
    enableHistory = true,
    beforeNavigate
  } = options;

  // 從 URL hash 或 initialScreen 初始化
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    if (enableHistory) {
      const hashScreen = getScreenFromHash();
      // 若 hash 是臨時頁面，重置為首頁或初始頁面
      if (TRANSIENT_SCREENS.includes(hashScreen)) {
        return initialScreen || DEFAULT_SCREEN;
      }
      return hashScreen;
    }
    return initialScreen || DEFAULT_SCREEN;
  });

  // 內部歷史記錄
  const historyRef = useRef<AppScreen[]>([currentScreen]);
  
  // 是否正在處理 popstate 事件
  const isPopstateRef = useRef(false);

  /**
   * 導航到指定頁面
   */
  const navigate = useCallback(async (
    screen: AppScreen,
    navOptions: { replace?: boolean } = {}
  ) => {
    const { replace = false } = navOptions;
    
    // 相同頁面不處理
    if (screen === currentScreen) return;

    // 執行 beforeNavigate 回調
    if (beforeNavigate) {
      const shouldProceed = await beforeNavigate(currentScreen, screen);
      if (!shouldProceed) return;
    }

    // 更新狀態
    setCurrentScreen(screen);

    // 更新歷史記錄
    if (!replace) {
      historyRef.current = [...historyRef.current, screen];
    } else {
      historyRef.current = [...historyRef.current.slice(0, -1), screen];
    }

    // 更新 URL hash（臨時頁面使用 replace 避免影響返回行為）
    if (enableHistory) {
      const shouldReplace = replace || TRANSIENT_SCREENS.includes(screen);
      setHashForScreen(screen, shouldReplace);
    }
  }, [currentScreen, enableHistory, beforeNavigate]);

  /**
   * 返回上一頁
   */
  const goBack = useCallback(() => {
    if (enableHistory) {
      window.history.back();
    } else {
      // 無歷史模式：從內部歷史返回
      if (historyRef.current.length > 1) {
        historyRef.current = historyRef.current.slice(0, -1);
        const previousScreen = historyRef.current[historyRef.current.length - 1];
        setCurrentScreen(previousScreen);
      }
    }
  }, [enableHistory]);

  /**
   * 監聽瀏覽器返回/前進事件
   */
  useEffect(() => {
    if (!enableHistory) return;

    const handlePopstate = () => {
      isPopstateRef.current = true;
      const newScreen = getScreenFromHash();
      
      // 若目標是臨時頁面，跳過並繼續返回
      if (TRANSIENT_SCREENS.includes(newScreen)) {
        window.history.back();
        return;
      }
      
      setCurrentScreen(newScreen);
      
      // 更新內部歷史
      historyRef.current = [...historyRef.current.filter(s => s !== newScreen), newScreen];
      
      setTimeout(() => {
        isPopstateRef.current = false;
      }, 0);
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [enableHistory]);

  /**
   * 初始化時設置 URL hash
   */
  useEffect(() => {
    if (enableHistory && !window.location.hash) {
      setHashForScreen(currentScreen, true);
    }
  }, []);

  return {
    currentScreen,
    navigate,
    goBack,
    canGoBack: historyRef.current.length > 1,
    history: historyRef.current
  };
}

/**
 * 創建類型安全的頁面配置
 * 用於定義頁面之間的返回邏輯
 */
export const SCREEN_BACK_MAP: Partial<Record<AppScreen, (isLoggedIn: boolean) => AppScreen>> = {
  profile: (isLoggedIn) => isLoggedIn ? 'dashboard' : 'home',
  history: (isLoggedIn) => isLoggedIn ? 'dashboard' : 'profile',
  setup: (isLoggedIn) => isLoggedIn ? 'dashboard' : 'home',
  overview: () => 'setup',
  login: () => 'home',
  register: () => 'login',
  completed: (isLoggedIn) => isLoggedIn ? 'dashboard' : 'history'
};

/**
 * 獲取頁面的返回目標
 */
export const getBackScreen = (
  currentScreen: AppScreen,
  isLoggedIn: boolean
): AppScreen | null => {
  const backFn = SCREEN_BACK_MAP[currentScreen];
  return backFn ? backFn(isLoggedIn) : null;
};
