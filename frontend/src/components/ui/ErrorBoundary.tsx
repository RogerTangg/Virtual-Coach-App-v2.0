/**
 * ErrorBoundary - 全域錯誤邊界組件 (Global Error Boundary Component)
 * 
 * 捕捉 React 組件樹中的 JavaScript 錯誤，防止整個應用程式崩潰
 * 提供友善的錯誤畫面與重試機制
 * 
 * @author Virtual Fitness Coach Team
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

/**
 * ErrorBoundary Props 定義
 */
interface ErrorBoundaryProps {
    /** 子組件 (Child components) */
    children: ReactNode;
    /** 自定義 fallback UI (Custom fallback UI) */
    fallback?: ReactNode;
    /** 錯誤回調函數 (Error callback function) */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    /** 是否顯示錯誤詳情 (開發模式) */
    showDetails?: boolean;
}

/**
 * ErrorBoundary State 定義
 */
interface ErrorBoundaryState {
    /** 是否有錯誤 (Has error occurred) */
    hasError: boolean;
    /** 錯誤物件 (Error object) */
    error: Error | null;
    /** 錯誤資訊 (Error info) */
    errorInfo: ErrorInfo | null;
}

/**
 * 預設錯誤畫面組件 (Default Error Fallback Component)
 */
const DefaultErrorFallback: React.FC<{
    error: Error | null;
    errorInfo: ErrorInfo | null;
    onRetry: () => void;
    onGoHome: () => void;
    showDetails?: boolean;
}> = ({ error, errorInfo, onRetry, onGoHome, showDetails }) => {
    // 判斷是否為開發模式
    // @ts-ignore - Vite 環境變數
    const isDevelopment = import.meta.env?.MODE === 'development';

    return (
        <div className="min-h-[50vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                {/* 錯誤圖示 */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                {/* 標題 */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    糟糕，出了點問題
                </h2>

                {/* 說明文字 */}
                <p className="text-gray-600 mb-6">
                    應用程式發生了預期外的錯誤。<br />
                    請嘗試重新整理頁面，或返回首頁。
                </p>

                {/* 操作按鈕 */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                        onClick={onRetry} 
                        className="flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        重新整理
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={onGoHome}
                        className="flex items-center justify-center gap-2"
                    >
                        <Home className="w-4 h-4" />
                        返回首頁
                    </Button>
                </div>

                {/* 開發模式：顯示錯誤詳情 */}
                {(showDetails || isDevelopment) && error && (
                    <div className="mt-8 text-left">
                        <details className="bg-gray-50 rounded-lg p-4">
                            <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                                🔧 開發者詳情 (Development Details)
                            </summary>
                            <div className="mt-3 space-y-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">錯誤訊息 (Error Message):</p>
                                    <pre className="text-xs bg-red-50 text-red-700 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                                        {error.message}
                                    </pre>
                                </div>
                                {error.stack && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">堆疊追蹤 (Stack Trace):</p>
                                        <pre className="text-xs bg-gray-100 text-gray-600 p-2 rounded overflow-x-auto whitespace-pre-wrap max-h-40">
                                            {error.stack}
                                        </pre>
                                    </div>
                                )}
                                {errorInfo?.componentStack && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 mb-1">組件堆疊 (Component Stack):</p>
                                        <pre className="text-xs bg-blue-50 text-blue-700 p-2 rounded overflow-x-auto whitespace-pre-wrap max-h-40">
                                            {errorInfo.componentStack}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * ErrorBoundary 組件 (Error Boundary Component)
 * 
 * 使用 Class Component 因為 Error Boundary 需要 getDerivedStateFromError
 * 和 componentDidCatch 生命週期方法，這些目前在 Function Component 中無法使用
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    /**
     * 當子組件拋出錯誤時更新狀態
     */
    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    /**
     * 捕捉錯誤並記錄
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // 更新狀態以包含錯誤資訊
        this.setState({ errorInfo });

        // 記錄錯誤到 console（開發環境）
        console.error('🚨 ErrorBoundary 捕捉到錯誤:', error);
        console.error('📍 組件堆疊:', errorInfo.componentStack);

        // 呼叫自定義錯誤回調
        this.props.onError?.(error, errorInfo);

        // 未來可以整合錯誤追蹤服務（如 Sentry）
        // if (typeof window !== 'undefined' && window.Sentry) {
        //     window.Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    /**
     * 重試：重置錯誤狀態並重新渲染
     */
    handleRetry = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    /**
     * 返回首頁：導向應用程式根路徑
     */
    handleGoHome = (): void => {
        // 重置狀態
        this.setState({ hasError: false, error: null, errorInfo: null });
        // 導向首頁
        window.location.href = '/';
    };

    render(): ReactNode {
        const { hasError, error, errorInfo } = this.state;
        const { children, fallback, showDetails } = this.props;

        if (hasError) {
            // 如果有自定義 fallback，使用它
            if (fallback) {
                return fallback;
            }

            // 使用預設錯誤畫面
            return (
                <DefaultErrorFallback
                    error={error}
                    errorInfo={errorInfo}
                    onRetry={this.handleRetry}
                    onGoHome={this.handleGoHome}
                    showDetails={showDetails}
                />
            );
        }

        return children;
    }
}

/**
 * withErrorBoundary HOC - 用於包裝組件的高階組件
 * 
 * 使用方式:
 * const SafeComponent = withErrorBoundary(MyComponent);
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    const ComponentWithErrorBoundary: React.FC<P> = (props) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <WrappedComponent {...props} />
        </ErrorBoundary>
    );

    ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

    return ComponentWithErrorBoundary;
}

export default ErrorBoundary;
