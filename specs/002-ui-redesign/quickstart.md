# Quickstart Guide: Virtual Coach App UI Redesign

**Feature**: 002-ui-redesign | **Date**: 2025-11-15 | **Estimated Time**: 2 hours

本指南提供逐步設置說明,協助開發者快速啟動 UI 改版開發。

---

## Prerequisites (前置需求)

確保開發環境已安裝:

- **Node.js**: ≥ 18.0.0 (建議使用 20.x LTS)
- **npm**: ≥ 9.0.0 或 **pnpm**: ≥ 8.0.0
- **Git**: 用於版本控制
- **VS Code**: 建議使用的編輯器 (含 ESLint、Prettier 擴充功能)

檢查版本:

```powershell
node --version   # v20.x.x
npm --version    # 9.x.x
git --version    # 2.x.x
```

---

## Step 1: Install Dependencies (安裝依賴套件)

### 1.1 安裝 Mantine UI 元件庫

```powershell
# 進入前端專案目錄
cd virtual_coach_app_frontend

# 安裝 Mantine 核心套件
npm install @mantine/core@^7.0.0 @mantine/hooks@^7.0.0

# 安裝 Mantine 可選套件 (表單驗證、日期選擇器等)
npm install @mantine/form@^7.0.0 @mantine/dates@^7.0.0

# 安裝動畫庫
npm install framer-motion@^11.0.0

# 安裝圖示庫 (可選)
npm install @tabler/icons-react@^3.0.0
```

**預期結果**: `package.json` 新增以下依賴

```json
{
  "dependencies": {
    "@mantine/core": "^7.0.0",
    "@mantine/hooks": "^7.0.0",
    "@mantine/form": "^7.0.0",
    "@mantine/dates": "^7.0.0",
    "framer-motion": "^11.0.0",
    "@tabler/icons-react": "^3.0.0"
  }
}
```

### 1.2 驗證安裝

```powershell
# 檢查已安裝套件
npm list @mantine/core framer-motion
```

**預期輸出**:
```
virtual_coach_app_frontend@1.0.0
├── @mantine/core@7.x.x
└── framer-motion@11.x.x
```

---

## Step 2: Setup Mantine Theme (配置主題)

### 2.1 建立主題配置檔案

```powershell
# 在 src/ 目錄建立 theme/ 資料夾
mkdir src/theme

# 建立主題配置檔案
New-Item -ItemType File -Path src/theme/theme.ts
```

### 2.2 定義 Matcha Green 主題

編輯 `src/theme/theme.ts`:

```typescript
import { createTheme, MantineColorsTuple } from '@mantine/core';

// Matcha Green 色彩系統 (10 個色階)
const matcha: MantineColorsTuple = [
  '#E8F5E9', // 0 - Lightest
  '#C8E6C9', // 1 - Very Light
  '#A5D6A7', // 2
  '#81C784', // 3 - Accent
  '#66BB6A', // 4 - Primary (主色)
  '#4CAF50', // 5
  '#43A047', // 6
  '#388E3C', // 7
  '#2E7D32', // 8 - Dark
  '#1B5E20', // 9 - Darkest
];

export const virtualCoachTheme = createTheme({
  // 色彩系統
  colors: {
    matcha,
  },
  primaryColor: 'matcha',
  primaryShade: 4, // 使用 matcha[4] 作為主色

  // 字體系統
  fontFamily: 'Inter, Noto Sans TC, sans-serif',
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
  },
  headings: {
    fontFamily: 'Inter, Noto Sans TC, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '48px', lineHeight: '1.2' },
      h2: { fontSize: '32px', lineHeight: '1.2' },
      h3: { fontSize: '24px', lineHeight: '1.3' },
    },
  },

  // 間距系統 (4px 基礎單位)
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },

  // 圓角系統
  radius: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },

  // 陰影系統 (綠色系半透明)
  shadows: {
    xs: '0 1px 3px rgba(46, 125, 50, 0.1)',
    sm: '0 4px 6px rgba(46, 125, 50, 0.15)',
    md: '0 10px 20px rgba(46, 125, 50, 0.2)',
    lg: '0 20px 40px rgba(46, 125, 50, 0.25)',
    xl: '0 30px 60px rgba(46, 125, 50, 0.3)',
  },

  // 響應式斷點
  breakpoints: {
    xs: '0px',
    sm: '768px',
    md: '1024px',
    lg: '1440px',
    xl: '1920px',
  },

  // 元件預設樣式
  components: {
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'sm',
      },
      styles: (theme) => ({
        root: {
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',

          '&:hover': {
            transform: 'scale(1.05)',
          },

          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      }),
    },

    Card: {
      defaultProps: {
        shadow: 'xs',
        radius: 'md',
        padding: 'lg',
      },
      styles: (theme) => ({
        root: {
          border: `1px solid ${theme.colors.matcha[1]}`,
          transition: 'all 0.3s ease-in-out',

          '&:hover': {
            boxShadow: theme.shadows.sm,
            borderColor: theme.colors.matcha[3],
          },
        },
      }),
    },

    TextInput: {
      styles: (theme) => ({
        input: {
          height: '44px',
          borderWidth: '2px',
          borderColor: theme.colors.matcha[2],

          '&:focus': {
            borderColor: theme.colors.matcha[4],
            boxShadow: `0 0 0 3px rgba(102, 187, 106, 0.2)`,
          },
        },
      }),
    },
  },
});
```

### 2.3 包裹應用程式

編輯 `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // 引入 Mantine CSS
import App from './App';
import { virtualCoachTheme } from './theme/theme';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={virtualCoachTheme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
```

**預期結果**: 應用程式現在使用 Matcha Green 主題,所有 Mantine 元件自動套用主題色彩。

---

## Step 3: Create First Component (建立第一個元件)

### 3.1 建立偏好設定卡片元件

```powershell
# 建立元件檔案
New-Item -ItemType File -Path src/components/preferences/PreferenceCard.tsx
```

編輯 `src/components/preferences/PreferenceCard.tsx`:

```typescript
import { Card, Text, Group, Badge, Button, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconDumbbell, IconClock } from '@tabler/icons-react';

interface PreferenceCardProps {
  title: string;
  duration: number;
  equipment: string[];
  onSelect: () => void;
}

// 包裝 Mantine Card 為動畫元件
const MotionCard = motion(Card);

export function PreferenceCard({
  title,
  duration,
  equipment,
  onSelect,
}: PreferenceCardProps) {
  return (
    <MotionCard
      shadow="xs"
      radius="md"
      padding="lg"
      withBorder
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      style={{ cursor: 'pointer' }}
      onClick={onSelect}
    >
      {/* 標題區 */}
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            {title}
          </Text>
          <Badge
            variant="filled"
            color="gray"
            leftSection={<IconClock size={14} />}
          >
            {duration} 分鐘
          </Badge>
        </Group>

        {/* 器材標籤 */}
        <Group gap="xs">
          {equipment.map((item) => (
            <Badge
              key={item}
              variant="filled"
              color="matcha"
              leftSection={<IconDumbbell size={14} />}
            >
              {item}
            </Badge>
          ))}
        </Group>

        {/* 操作按鈕 */}
        <Button variant="filled" color="matcha" fullWidth>
          選擇此方案
        </Button>
      </Stack>
    </MotionCard>
  );
}
```

### 3.2 使用元件

編輯 `src/App.tsx`:

```typescript
import { Container, Title, SimpleGrid } from '@mantine/core';
import { PreferenceCard } from './components/preferences/PreferenceCard';

function App() {
  const preferences = [
    { title: '全身肌力訓練', duration: 30, equipment: ['啞鈴', '瑜珈墊'] },
    { title: '核心強化', duration: 20, equipment: ['徒手'] },
    { title: '上肢訓練', duration: 25, equipment: ['啞鈴'] },
  ];

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl" ta="center">
        選擇訓練偏好
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {preferences.map((pref) => (
          <PreferenceCard
            key={pref.title}
            {...pref}
            onSelect={() => console.log(`Selected: ${pref.title}`)}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default App;
```

### 3.3 執行開發伺服器

```powershell
# 啟動開發伺服器
npm run dev
```

**預期結果**: 
- 瀏覽器自動開啟 `http://localhost:5173`
- 顯示 3 張偏好設定卡片,使用 Matcha Green 主題
- 卡片具備淡入動畫和懸停放大效果

---

## Step 4: Setup Testing (設置測試)

### 4.1 安裝測試依賴

```powershell
# 安裝 Vitest 和測試工具
npm install --save-dev vitest@^3.0.0 jsdom@^24.0.0

# 安裝 React Testing Library
npm install --save-dev @testing-library/react@^16.0.0 @testing-library/jest-dom@^6.0.0 @testing-library/user-event@^14.0.0
```

### 4.2 配置 Vitest

編輯 `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true,
  },
});
```

### 4.3 建立測試設置檔案

編輯 `src/tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 每個測試後自動清理
afterEach(() => {
  cleanup();
});
```

### 4.4 建立第一個測試

```powershell
# 建立測試檔案
New-Item -ItemType File -Path tests/unit/PreferenceCard.test.tsx
```

編輯 `tests/unit/PreferenceCard.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { PreferenceCard } from '../../src/components/preferences/PreferenceCard';
import { virtualCoachTheme } from '../../src/theme/theme';

// Helper: 包裹 Mantine Provider
function renderWithTheme(ui: React.ReactElement) {
  return render(<MantineProvider theme={virtualCoachTheme}>{ui}</MantineProvider>);
}

describe('PreferenceCard', () => {
  const mockProps = {
    title: '全身肌力訓練',
    duration: 30,
    equipment: ['啞鈴', '瑜珈墊'],
    onSelect: vi.fn(),
  };

  it('renders card with correct title', () => {
    renderWithTheme(<PreferenceCard {...mockProps} />);
    expect(screen.getByText('全身肌力訓練')).toBeInTheDocument();
  });

  it('displays duration badge', () => {
    renderWithTheme(<PreferenceCard {...mockProps} />);
    expect(screen.getByText('30 分鐘')).toBeInTheDocument();
  });

  it('displays all equipment badges', () => {
    renderWithTheme(<PreferenceCard {...mockProps} />);
    expect(screen.getByText('啞鈴')).toBeInTheDocument();
    expect(screen.getByText('瑜珈墊')).toBeInTheDocument();
  });

  it('calls onSelect when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<PreferenceCard {...mockProps} />);

    const button = screen.getByRole('button', { name: '選擇此方案' });
    await user.click(button);

    expect(mockProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it('calls onSelect when card is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<PreferenceCard {...mockProps} />);

    // 點擊卡片本身 (非按鈕)
    const card = screen.getByText('全身肌力訓練').closest('div[style*="cursor"]');
    if (card) await user.click(card);

    expect(mockProps.onSelect).toHaveBeenCalledTimes(1);
  });
});
```

### 4.5 執行測試

```powershell
# 執行所有測試
npm test

# 執行測試並監聽變化
npm test -- --watch

# 執行測試並產生覆蓋率報告
npm test -- --coverage
```

**預期結果**:
```
✓ PreferenceCard > renders card with correct title
✓ PreferenceCard > displays duration badge
✓ PreferenceCard > displays all equipment badges
✓ PreferenceCard > calls onSelect when button is clicked
✓ PreferenceCard > calls onSelect when card is clicked

Test Files  1 passed (1)
     Tests  5 passed (5)
```

---

## Step 5: Visual Regression Testing (視覺回歸測試)

### 5.1 安裝 Playwright

```powershell
# 安裝 Playwright
npm install --save-dev @playwright/test@^1.40.0

# 初始化 Playwright (安裝瀏覽器)
npx playwright install
```

### 5.2 建立 Playwright 配置

```powershell
# 建立配置檔案
New-Item -ItemType File -Path playwright.config.ts
```

編輯 `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 5.3 建立視覺測試

```powershell
# 建立測試目錄和檔案
mkdir tests/visual
New-Item -ItemType File -Path tests/visual/preference-card.spec.ts
```

編輯 `tests/visual/preference-card.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('PreferenceCard Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('matches desktop snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page).toHaveScreenshot('preference-cards-desktop.png');
  });

  test('matches tablet snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page).toHaveScreenshot('preference-cards-tablet.png');
  });

  test('matches mobile snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('preference-cards-mobile.png');
  });

  test('card hover state', async ({ page }) => {
    const card = page.locator('text=全身肌力訓練').locator('..');
    await card.hover();
    await expect(page).toHaveScreenshot('preference-card-hover.png');
  });
});
```

### 5.4 執行視覺測試

```powershell
# 首次執行會生成基準截圖
npx playwright test

# 更新基準截圖
npx playwright test --update-snapshots

# 檢視測試報告
npx playwright show-report
```

**預期結果**:
- 生成 4 張基準截圖於 `tests/visual/*.spec.ts-snapshots/`
- 後續測試會比對是否有視覺差異

---

## Step 6: Integrate Tailwind CSS (整合 Tailwind)

### 6.1 確認 Tailwind 配置

編輯 `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 共享 Mantine 設計令牌
      colors: {
        matcha: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
      spacing: {
        // 4px 基礎單位
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        xs: '0 1px 3px rgba(46, 125, 50, 0.1)',
        sm: '0 4px 6px rgba(46, 125, 50, 0.15)',
        md: '0 10px 20px rgba(46, 125, 50, 0.2)',
        lg: '0 20px 40px rgba(46, 125, 50, 0.25)',
        xl: '0 30px 60px rgba(46, 125, 50, 0.3)',
      },
    },
  },
  plugins: [],
};
```

### 6.2 使用 Tailwind 工具類

編輯 `src/components/preferences/PreferenceCard.tsx` (使用 Tailwind):

```typescript
// 在 Mantine 元件中混用 Tailwind
<MotionCard
  className="hover:shadow-md transition-all duration-300"
  // ...其他 props
>
  <Stack className="gap-4">
    <Text className="text-xl font-semibold text-matcha-800">
      {title}
    </Text>
  </Stack>
</MotionCard>
```

**預期結果**: Mantine 和 Tailwind 和諧共存,可混用兩種樣式系統。

---

## Step 7: Accessibility Validation (無障礙驗證)

### 7.1 安裝 axe-core

```powershell
# 安裝無障礙測試工具
npm install --save-dev @axe-core/react@^4.8.0
```

### 7.2 整合 axe DevTools

編輯 `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';
import { virtualCoachTheme } from './theme/theme';

// 開發環境啟用 axe
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, ReactDOM, 1000);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={virtualCoachTheme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
```

### 7.3 檢查無障礙問題

```powershell
# 執行開發伺服器
npm run dev

# 開啟瀏覽器 DevTools Console
# axe 會自動報告無障礙違規
```

**預期結果**: Console 顯示無障礙違規 (如缺少 alt 文字、對比度不足等),逐一修正。

---

## Step 8: Performance Optimization (效能優化)

### 8.1 啟用 Code Splitting

編輯 `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 分離 Mantine 套件
          'mantine': ['@mantine/core', '@mantine/hooks'],
          'animation': ['framer-motion'],
          'icons': ['@tabler/icons-react'],
        },
      },
    },
  },
});
```

### 8.2 Lazy Load 元件

編輯 `src/App.tsx`:

```typescript
import { lazy, Suspense } from 'react';
import { Container, Title, Loader } from '@mantine/core';

// Lazy load 偏好設定卡片
const PreferenceCard = lazy(() =>
  import('./components/preferences/PreferenceCard').then((module) => ({
    default: module.PreferenceCard,
  }))
);

function App() {
  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl" ta="center">
        選擇訓練偏好
      </Title>

      <Suspense fallback={<Loader size="lg" />}>
        {/* Lazy loaded content */}
      </Suspense>
    </Container>
  );
}
```

### 8.3 測量效能

```powershell
# 建構生產版本
npm run build

# 預覽生產版本
npm run preview

# 使用 Lighthouse 測量
# Chrome DevTools > Lighthouse > Generate Report
```

**預期目標**:
- FCP (First Contentful Paint): <1.5s
- LCP (Largest Contentful Paint): <2.5s
- TTI (Time to Interactive): <3.5s
- Bundle Size: <250KB (gzipped)

---

## Troubleshooting (常見問題)

### 問題 1: Mantine 樣式未套用

**症狀**: 元件顯示無樣式或樣式錯誤

**解決方案**:
```typescript
// 確認已引入 Mantine CSS
import '@mantine/core/styles.css';

// 確認元件在 MantineProvider 內部
<MantineProvider theme={virtualCoachTheme}>
  <App />
</MantineProvider>
```

### 問題 2: Framer Motion 動畫不流暢

**症狀**: 動畫卡頓,幀率低於 60fps

**解決方案**:
```typescript
// 僅動畫 transform 和 opacity
<motion.div
  animate={{
    opacity: 1,
    transform: 'translateY(0)', // ✅
  }}
  // 避免動畫 width, height, left, top ❌
/>

// 使用 will-change 提示瀏覽器
<Box style={{ willChange: 'transform, opacity' }}>
```

### 問題 3: TypeScript 類型錯誤

**症狀**: `Property 'matcha' does not exist on type 'MantineTheme'`

**解決方案**:
```typescript
// 擴充 Mantine 類型定義
// src/types/mantine.d.ts
import '@mantine/core';

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<'matcha', MantineColorsTuple>;
  }
}
```

### 問題 4: Playwright 測試失敗

**症狀**: Visual regression 測試顯示像素差異

**解決方案**:
```powershell
# 更新基準截圖
npx playwright test --update-snapshots

# 設定像素容差
# playwright.config.ts
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 100, // 允許 100 像素差異
  },
},
```

---

## Next Steps (後續步驟)

完成 Quickstart 後,建議按以下順序進行:

1. **閱讀 contracts/design-system-api.md**
   - 理解完整的 Mantine 主題 API
   - 學習元件自訂方法

2. **閱讀 contracts/component-variants.md**
   - 查看所有元件變體規格
   - 了解元件使用指南

3. **閱讀 data-model.md**
   - 熟悉設計令牌結構
   - 理解響應式斷點定義

4. **開始重構現有元件**
   - 依序重構 PreferenceForm、WorkoutList、TrainingPlayer
   - 每完成一個元件執行測試

5. **設置 CI/CD**
   - 整合 GitHub Actions 自動執行測試
   - 配置 Playwright 視覺測試於 CI 環境

---

## Validation Checklist (驗證清單)

完成 Quickstart 後,確認以下項目:

- [ ] ✅ Mantine 和 Framer Motion 已安裝
- [ ] ✅ 主題配置正確,顯示 Matcha Green 色彩
- [ ] ✅ PreferenceCard 元件正常顯示,具備動畫效果
- [ ] ✅ Vitest 單元測試通過 (5/5)
- [ ] ✅ Playwright 視覺測試執行成功
- [ ] ✅ Tailwind 和 Mantine 共存無衝突
- [ ] ✅ axe DevTools 報告無重大無障礙違規
- [ ] ✅ Lighthouse 效能分數 ≥ 90

**All steps validated. Ready to start UI redesign implementation!**

---

## Resources (延伸資源)

- **Mantine Docs**: https://mantine.dev/
- **Framer Motion Docs**: https://www.framer.com/motion/
- **Tailwind CSS Docs**: https://tailwindcss.com/
- **Vitest Docs**: https://vitest.dev/
- **Playwright Docs**: https://playwright.dev/
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

**Estimated time to complete: 2 hours**
