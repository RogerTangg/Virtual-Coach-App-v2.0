/**
 * 統一錯誤處理模組 (Unified Error Handling)
 * 
 * 提供應用程式級別的錯誤處理與使用者友善的錯誤訊息
 */

// 身份驗證錯誤對照表 (Authentication Error Messages)
// 包含 Supabase Auth 可能回傳的各種錯誤訊息
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // 登入相關錯誤
  'Invalid login credentials': '帳號或密碼錯誤',
  'Email not confirmed': '請先驗證您的 Email',
  'User not found': '帳號不存在',
  
  // 註冊相關錯誤 - Supabase 可能回傳多種格式
  'Email already registered': '此 Email 已被註冊',
  'User already registered': '此 Email 已被註冊，請直接登入',
  'A user with this email address has already been registered': '此 Email 已被註冊，請直接登入',
  'email address already registered': '此 Email 已被註冊，請直接登入',
  
  // 密碼相關錯誤
  'Password should be at least 6 characters': '密碼至少需要 6 個字元',
  'Password is too short': '密碼至少需要 6 個字元',
  
  // 其他錯誤
  'Signups not allowed for this instance': '目前不開放註冊',
  'Invalid email': 'Email 格式不正確',
  'Email rate limit exceeded': '操作過於頻繁，請稍後再試',
  'For security purposes, you can only request this once every 60 seconds': '操作過於頻繁，請 60 秒後再試',
  
  'default': '操作失敗，請稍後再試'
};

// 網路錯誤對照表
export const NETWORK_ERROR_MESSAGES: Record<string, string> = {
  'Failed to fetch': '網路連線失敗，請檢查您的網路',
  'Network request failed': '網路請求失敗',
  'timeout': '請求逾時，請稍後再試',
  'default': '網路錯誤，請檢查連線'
};

/**
 * 清理身份驗證錯誤訊息
 * 避免暴露敏感的系統資訊
 * 
 * @param error - 原始錯誤物件
 * @returns 使用者友善的錯誤訊息
 */
export function sanitizeAuthError(error: any): string {
  const message = error?.message || '';
  const code = error?.code || '';
  
  // 優先檢查完全匹配
  if (AUTH_ERROR_MESSAGES[message]) {
    return AUTH_ERROR_MESSAGES[message];
  }
  
  // 檢查是否包含關鍵字（處理 Supabase 回傳的各種格式）
  const lowerMessage = message.toLowerCase();
  
  // 重複註冊相關
  if (lowerMessage.includes('already registered') || 
      lowerMessage.includes('already been registered') ||
      lowerMessage.includes('already exists') ||
      code === 'user_already_exists') {
    return '此 Email 已被註冊，請直接登入';
  }
  
  // Email 未驗證
  if (lowerMessage.includes('email not confirmed') || 
      lowerMessage.includes('not confirmed') ||
      code === 'email_not_confirmed') {
    return '請先驗證您的 Email';
  }
  
  // 密碼太短
  if (lowerMessage.includes('password') && 
      (lowerMessage.includes('short') || lowerMessage.includes('6 characters'))) {
    return '密碼至少需要 6 個字元';
  }
  
  // 頻率限制
  if (lowerMessage.includes('rate limit') || lowerMessage.includes('60 seconds')) {
    return '操作過於頻繁，請稍後再試';
  }
  
  // 無效憑證
  if (lowerMessage.includes('invalid') && lowerMessage.includes('credentials')) {
    return '帳號或密碼錯誤';
  }
  
  return AUTH_ERROR_MESSAGES.default;
}

/**
 * 清理網路錯誤訊息
 * 
 * @param error - 原始錯誤物件
 * @returns 使用者友善的錯誤訊息
 */
export function sanitizeNetworkError(error: any): string {
  const message = error?.message || '';
  return NETWORK_ERROR_MESSAGES[message] || NETWORK_ERROR_MESSAGES.default;
}

/**
 * 通用錯誤處理
 * 
 * @param error - 錯誤物件
 * @param context - 錯誤發生的情境
 * @returns 處理後的錯誤訊息
 */
export function handleError(error: any, context: string = 'operation'): string {
  // 記錄原始錯誤供開發人員除錯
  console.error(`[${context}] Error:`, error);

  // 根據錯誤類型返回適當訊息
  if (error?.message?.includes('auth')) {
    return sanitizeAuthError(error);
  }

  if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
    return sanitizeNetworkError(error);
  }

  // 預設訊息
  return error?.message || '發生未知錯誤，請稍後再試';
}

/**
 * API 錯誤類別
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 驗證錯誤類別
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
