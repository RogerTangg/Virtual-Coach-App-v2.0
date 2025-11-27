# Virtual Fitness Coach

> 您的智能私人健身教練 - AI 驅動的個人化訓練體驗

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4.1-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Flash_2.5-orange.svg)](https://ai.google.dev/)

## 專案簡介

**Virtual Fitness Coach** 是一款現代化的 AI 健身訓練應用程式，結合 **Google Gemini AI** 智能演算法，為您量身打造專屬訓練計畫。無論您是健身新手還是進階訓練者，都能獲得個人化的運動方案。

### 核心功能

- **AI 智能生成**: 結合 Google Gemini AI 根據您的目標與體能程度生成最適課表
- **個性化訓練計畫**: 支援減脂、增肌、提升耐力等多種訓練目標
- **多肌群訓練**: 胸部、背部、腿部、肩部、手臂、核心完整涵蓋
- **訓練追蹤**: 完整記錄每次訓練數據，追蹤您的進步
- **訓練日曆**: 視覺化呈現訓練歷史，包含強度指標與連續訓練標記
- **智能計時器**: 圓形進度環設計，搭配語音提示
- **響應式設計**: 完美支援桌面、平板、手機
- **清新主題**: 舒適的抹茶綠視覺體驗

## 快速開始

### 前置需求

- Node.js 20.x 或更高版本
- npm 或 yarn
- Git
- Supabase 帳號 (免費)
- Google AI Studio API Key (選填，用於 AI 生成功能)

### 安裝步驟

1. **Clone 專案**
```bash
git clone https://github.com/your-username/Virtual-Coach-App-v2.0.git
cd Virtual-Coach-App-v2.0/frontend
```

2. **安裝相依套件**
```bash
npm install
```

3. **設定環境變數**

複製 `.env.example` 為 `.env` 並填入憑證：
```bash
# Supabase 設定 (必填)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI 設定 (選填 - 用於 AI 課表生成)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

> **安全提醒**: 永遠不要將 `.env` 檔案提交到版本控制系統

4. **啟動開發伺服器**
```bash
npm run dev
```

開啟瀏覽器訪問 `http://localhost:5173`

## 專案架構

```
Virtual-Coach-App-v2.0/
├── frontend/                   # 前端應用程式
│   ├── src/
│   │   ├── components/        # React 元件
│   │   │   ├── auth/         # 認證相關 (登入/註冊/個人資料)
│   │   │   ├── dashboard/    # 會員儀表板
│   │   │   ├── history/      # 訓練歷史
│   │   │   ├── plan/         # 訓練計畫展示
│   │   │   ├── player/       # 訓練播放器
│   │   │   ├── setup/        # 訓練設定
│   │   │   └── ui/           # 通用 UI 元件
│   │   ├── features/         # 功能模組
│   │   │   ├── auth/         # 認證 Context
│   │   │   └── generator/    # 課表生成引擎
│   │   ├── services/         # API 服務層
│   │   │   ├── aiGeneratorService.ts   # AI 生成服務
│   │   │   ├── authService.ts          # 認證服務
│   │   │   ├── dashboardService.ts     # 儀表板服務
│   │   │   ├── exerciseService.ts      # 運動資料服務
│   │   │   └── workoutLogService.ts    # 訓練記錄服務
│   │   ├── hooks/            # 自定義 Hooks
│   │   ├── lib/              # 第三方庫配置
│   │   ├── types/            # TypeScript 型別定義
│   │   └── utils/            # 工具函數
│   ├── tests/                # 測試檔案
│   └── dist/                 # 編譯輸出
├── database/                  # 資料庫 Schema
│   ├── schema.sql            # 主要資料表
│   ├── auth_schema.sql       # 認證相關資料表
│   └── setup.sql             # 初始設定腳本
└── specs/                     # 功能規格文件
```

## 技術棧

### 前端框架
| 技術 | 版本 | 用途 |
|------|------|------|
| React | 19.2.0 | UI 框架 |
| TypeScript | 5.8.2 | 型別安全 |
| Vite | 6.4.1 | 建置工具 |
| Tailwind CSS | 3.4.x | 樣式工具 |

### 後端服務
| 技術 | 說明 |
|------|------|
| Supabase | BaaS (PostgreSQL + Auth + REST API) |
| Google Gemini AI | 智能課表生成 |

### 測試
| 技術 | 版本 | 用途 |
|------|------|------|
| Vitest | 3.0.x | 單元測試 |
| React Testing Library | 16.1.0 | 元件測試 |
| MSW | 2.8.0 | API Mocking |

## 安全特性

- ✅ **環境變數管理**: 所有敏感憑證透過環境變數管理，不硬編碼
- ✅ **PKCE 認證流程**: 使用 Supabase Auth 的 PKCE 安全流程
- ✅ **Session 管理**: 自動 Token 刷新，防止意外登出
- ✅ **輸入驗證**: 前端表單驗證 + Supabase RLS 後端驗證
- ✅ **錯誤處理**: 統一錯誤處理，不洩漏敏感系統資訊
- ✅ **Git 安全**: `.env` 檔案已加入 `.gitignore`

## 功能展示

### 1. 會員儀表板
- 訓練統計總覽 (總訓練次數、總時數、本週進度)
- 視覺化訓練日曆 (強度指標、連續訓練標記)
- 快速開始新訓練

### 2. 訓練設定
- 選擇訓練目標 (減脂/增肌/耐力)
- 目標肌群多選
- 難度等級調整
- 訓練時長設定

### 3. AI 課表生成
- Google Gemini AI 智能分析
- 根據設定生成最適課表
- 可手動調整組數與休息時間

### 4. 訓練播放器
- 全螢幕沉浸式體驗
- 圓形計時器倒數動畫
- 語音提示 (可關閉)
- 暫停/繼續/跳過控制
- 螢幕喚醒鎖定

### 5. 訓練歷史
- 完整訓練記錄
- 依目標篩選
- 評分與回饋

## 測試

```bash
# 執行所有測試
npm test

# Watch 模式
npm run test:watch

# 測試覆蓋率
npm run test:coverage

# Lint 檢查
npm run lint
```

## 部署

### 環境變數設定

在部署平台 (Render/Vercel/Netlify) 設定以下環境變數：

| 變數名稱 | 必填 | 說明 |
|---------|------|------|
| `VITE_SUPABASE_URL` | ✅ | Supabase 專案 URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名金鑰 |
| `VITE_GEMINI_API_KEY` | ✅ | Google Gemini API Key (AI 生成功能) |

### 建置指令

```bash
# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 資料庫架構

使用 Supabase PostgreSQL，主要資料表：

| 資料表 | 說明 |
|--------|------|
| `exercises` | 運動項目資料庫 |
| `workout_logs` | 訓練記錄 |
| `user_profiles` | 使用者個人資料 |

詳細架構請參考 [database/schema.sql](./database/schema.sql)

## 開發指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器 (port 5173) |
| `npm run build` | 建置生產版本 |
| `npm run preview` | 預覽生產版本 |
| `npm test` | 執行測試 |
| `npm run lint` | ESLint 檢查 |

---

<p align="center">
  Made with ❤️ by <strong>Virtual Fitness Coach Team</strong>
</p>