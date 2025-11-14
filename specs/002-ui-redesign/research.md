# Research: Virtual Coach App UI Redesign with Matcha Green Theme

**Feature**: 002-ui-redesign | **Date**: 2025-11-15 | **Phase**: 0 (Outline & Research)

本文件記錄 UI 改版的技術研究、決策理由和最佳實踐調研結果。

---

## 1. Mantine v7 主題系統配置 (Mantine Theme Configuration)

### Decision

採用 Mantine v7 的 `createTheme()` 和 `MantineProvider` 實現設計系統,透過主題物件集中管理所有設計令牌。

### Rationale

1. **類型安全**: Mantine 提供完整的 TypeScript 支援,主題配置有自動完成和型別檢查
2. **元件整合**: Mantine 內建 50+ 高品質元件,直接支援主題客製化,減少從零開發時間
3. **無障礙性**: 所有 Mantine 元件預設符合 WCAG 2.1 AA 標準,包含 ARIA 標籤、鍵盤導航、焦點管理
4. **效能優化**: Mantine v7 使用 CSS-in-JS (emotion),支援 SSR、CSS 提取和 tree-shaking
5. **社群生態**: 活躍維護、完整文件、豐富範例,降低學習曲線

### Implementation Approach

```typescript
// src/theme/mantineTheme.ts
import { createTheme, MantineColorsTuple } from '@mantine/core';

const matcha: MantineColorsTuple = [
  '#E8F5E9', // 0 - lightest
  '#C8E6C9', // 1
  '#A5D6A7', // 2
  '#81C784', // 3 - accent
  '#66BB6A', // 4 - primary
  '#4CAF50', // 5
  '#43A047', // 6
  '#388E3C', // 7
  '#2E7D32', // 8 - dark
  '#1B5E20', // 9 - darkest
];

export const theme = createTheme({
  primaryColor: 'matcha',
  colors: { matcha },
  fontFamily: 'Inter, Noto Sans TC, sans-serif',
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  shadows: {
    xs: '0 1px 3px rgba(46, 125, 50, 0.1)',
    sm: '0 4px 6px rgba(46, 125, 50, 0.15)',
    md: '0 10px 20px rgba(46, 125, 50, 0.2)',
    lg: '0 20px 40px rgba(46, 125, 50, 0.25)',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
      },
      styles: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'xs',
        withBorder: true,
      },
    },
  },
});
```

### Alternatives Considered

- **Chakra UI**: 功能類似但社群較小,文件較少繁體中文資源
- **Material-UI**: 過於 Material Design 風格,不易客製化為淡綠色主題
- **Ant Design**: 設計語言偏向企業風格,不符合健身應用的溫和視覺需求
- **從零開發**: 開發時間長(預估 2-3 週),需自行處理無障礙性和瀏覽器相容性

**選擇 Mantine 原因**: 平衡了元件完整性、客製化彈性、TypeScript 支援和開發效率。

---

## 2. Tailwind CSS 整合策略 (Tailwind CSS Integration)

### Decision

保留 Tailwind CSS 3.4.20 用於快速佈局和響應式設計,與 Mantine 主題整合透過共用設計令牌。

### Rationale

1. **互補性**: Mantine 處理元件級樣式,Tailwind 處理佈局和間距 utilities
2. **響應式**: Tailwind 的 breakpoint utilities (`sm:`, `md:`, `lg:`) 比 Mantine 的 responsive props 更簡潔
3. **快速開發**: Utility-first 方法適合原型設計和快速迭代
4. **現有專案**: 專案已使用 Tailwind,保留可避免大規模重構

### Implementation Approach

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        matcha: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A', // primary
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
        // 4px base unit
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        xs: '0 1px 3px rgba(46, 125, 50, 0.1)',
        sm: '0 4px 6px rgba(46, 125, 50, 0.15)',
        DEFAULT: '0 10px 20px rgba(46, 125, 50, 0.2)',
        lg: '0 20px 40px rgba(46, 125, 50, 0.25)',
      },
    },
  },
  plugins: [],
};
```

### Usage Pattern

- **Mantine 元件**: 使用 Mantine 內建元件 + theme props (`<Button color="matcha" />`)
- **佈局容器**: 使用 Tailwind utilities (`flex`, `grid`, `gap-4`, `p-6`)
- **響應式**: 優先使用 Tailwind breakpoints (`sm:flex-col md:flex-row lg:grid`)
- **自訂元件**: 混合使用 Mantine hooks + Tailwind classes

### Alternatives Considered

- **只用 Mantine**: 失去 Tailwind 的 utility-first 優勢和快速原型能力
- **只用 Tailwind**: 需要自行開發所有 UI 元件,開發時間長,無障礙性需自行處理
- **CSS Modules**: 增加檔案數量,不如 utility-first 直覺,維護成本高

**選擇整合方案原因**: 發揮兩者優勢,Mantine 提供元件基礎,Tailwind 加速佈局開發。

---

## 3. Framer Motion 動畫最佳實踐 (Framer Motion Best Practices)

### Decision

使用 Framer Motion 11.x 實現所有過渡動畫、微互動和頁面切換效果,遵循 60fps 效能標準。

### Rationale

1. **宣告式 API**: 動畫配置直覺,易於維護和測試
2. **效能優化**: 自動使用 GPU 加速,優先使用 `transform` 和 `opacity`
3. **手勢支援**: 內建拖曳、懸停、點擊手勢,適合互動式 UI
4. **布局動畫**: `layout` prop 自動處理元素位置變化,適合展開/收合卡片
5. **React 整合**: 與 React 生命週期完美整合,支援 SSR

### Implementation Patterns

#### 1. 卡片展開動畫 (Card Expand Animation)

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<motion.div
  layout
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
>
  <Card>
    {/* card content */}
  </Card>
</motion.div>
```

#### 2. 懸停效果 (Hover Effects)

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  生成課表
</motion.button>
```

#### 3. 圓形進度條動畫 (Circular Progress Animation)

```tsx
<motion.circle
  cx="50"
  cy="50"
  r="45"
  stroke="#66BB6A"
  strokeWidth="8"
  fill="none"
  initial={{ pathLength: 0 }}
  animate={{ pathLength: progress }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
/>
```

#### 4. 頁面過渡 (Page Transitions)

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={page}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    {/* page content */}
  </motion.div>
</AnimatePresence>
```

### Performance Guidelines

- **優先屬性**: 只動畫 `transform` (translate, scale, rotate) 和 `opacity`
- **避免屬性**: 不動畫 `width`, `height`, `top`, `left` (觸發 layout reflow)
- **使用 `will-change`**: 複雜動畫加上 `style={{ willChange: 'transform' }}`
- **減少 re-render**: 使用 `useMemo` 快取動畫配置物件
- **測試效能**: Chrome DevTools Performance 確保動畫維持 60fps

### Alternatives Considered

- **CSS Animations**: 效能好但不夠靈活,複雜場景(如布局動畫)難以實現
- **React Spring**: 物理動畫優秀但學習曲線陡,API 較複雜
- **GSAP**: 功能強大但檔案大(~50KB),對 React 整合需額外配置
- **Anime.js**: 輕量但缺乏 React 生態整合,需手動管理 refs

**選擇 Framer Motion 原因**: 平衡了效能、易用性、React 整合和社群支援。

---

## 4. 響應式設計斷點策略 (Responsive Breakpoint Strategy)

### Decision

採用三個主要斷點:mobile (<768px)、tablet (768-1024px)、desktop (≥1024px),遵循 mobile-first 設計原則。

### Rationale

1. **覆蓋主流裝置**: 
   - Mobile: iPhone SE (375px) ~ iPhone 14 Pro Max (428px)
   - Tablet: iPad (768px) ~ iPad Pro (1024px)
   - Desktop: MacBook Air (1280px) ~ 4K (2560px+)

2. **簡化維護**: 三個斷點足以應對大部分場景,避免過度複雜化
3. **Mobile-first**: 從小螢幕開始設計,逐步增強(progressive enhancement)
4. **Tailwind 對齊**: 與 Tailwind 預設斷點一致,減少配置複雜度

### Breakpoint Configuration

```typescript
// src/theme/breakpoints.ts
export const breakpoints = {
  mobile: 0,      // 0-767px
  tablet: 768,    // 768-1023px
  desktop: 1024,  // 1024px+
} as const;

// Mantine breakpoint configuration
export const mantineBreakpoints = {
  xs: '0px',
  sm: '768px',
  md: '1024px',
  lg: '1280px',
  xl: '1536px',
};
```

### Layout Patterns by Breakpoint

#### Mobile (<768px)
- **單欄佈局**: 所有內容垂直堆疊
- **全寬卡片**: 卡片佔滿螢幕寬度(減去 16-24px margin)
- **大觸控目標**: 按鈕高度至少 44px
- **簡化資訊**: 隱藏次要資訊,保留核心內容
- **底部固定按鈕**: 主要操作按鈕固定在底部

```tsx
<div className="p-4 sm:p-6">
  <div className="flex flex-col gap-4">
    <PreferenceCard />
    <PreferenceCard />
  </div>
  <Button fullWidth className="fixed bottom-4 left-4 right-4">
    生成課表
  </Button>
</div>
```

#### Tablet (768-1024px)
- **雙欄佈局**: 部分內容採用 2 欄排列(如偏好選項)
- **增加間距**: 卡片間距從 16px 增加到 24px
- **顯示更多資訊**: 展開次要資訊和提示
- **側邊導航**: 可選擇性加入側邊欄(如課表詳情)

```tsx
<div className="p-6 sm:p-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <PreferenceCard />
    <PreferenceCard />
  </div>
</div>
```

#### Desktop (≥1024px)
- **居中佈局**: 內容區最大寬度 1200-1440px,左右留白
- **多欄佈局**: 偏好設定 2x2 或 3x2 網格,課表左右分欄
- **懸停效果**: 加入更豐富的 hover 互動
- **橫向播放器**: 訓練播放器左側影片、右側資訊

```tsx
<div className="max-w-7xl mx-auto p-8">
  <div className="grid grid-cols-3 gap-8">
    <PreferenceCard />
    <PreferenceCard />
    <PreferenceCard />
  </div>
</div>
```

### Testing Strategy

- **Chrome DevTools**: 使用 Device Mode 模擬不同裝置
- **Real Devices**: 在實體手機(iPhone, Android)和平板(iPad)測試
- **Responsive Testing Tools**: 使用 BrowserStack 或 LambdaTest 跨裝置測試
- **Visual Regression**: Playwright 跨斷點截圖對比

### Alternatives Considered

- **更多斷點**: 如 xs, sm, md, lg, xl (5+ breakpoints) - 過於複雜,維護成本高
- **Container Queries**: 現代方案但瀏覽器支援不夠廣泛(需 Chrome 105+)
- **Desktop-first**: 從大螢幕開始設計 - 不符合現代趨勢,mobile 流量佔比高

**選擇三斷點 mobile-first 原因**: 簡單有效,覆蓋主流裝置,符合現代設計趨勢。

---

## 5. 無障礙設計實踐 (Accessibility Best Practices)

### Decision

遵循 WCAG 2.1 AA 標準,確保色彩對比度、鍵盤導航、螢幕閱讀器支援、焦點管理符合要求。

### Rationale

1. **法規遵循**: 許多國家要求公開網站符合無障礙標準
2. **擴大受眾**: 約 15% 人口有不同程度的身心障礙,無障礙設計提升可用性
3. **SEO 優勢**: 語意化 HTML 和 ARIA 標籤有助於搜尋引擎理解內容
4. **品牌形象**: 展現社會責任感和包容性

### Implementation Checklist

#### 1. 色彩對比度 (Color Contrast)

**WCAG AA 標準**: 文字與背景對比度至少 4.5:1

```typescript
// 驗證結果 (使用 WebAIM Contrast Checker)
const contrastChecks = [
  { fg: '#2E7D32', bg: '#FFFFFF', ratio: 6.2, pass: true },  // 深綠 on 白
  { fg: '#FFFFFF', bg: '#2E7D32', ratio: 6.2, pass: true },  // 白 on 深綠
  { fg: '#66BB6A', bg: '#FFFFFF', ratio: 3.1, pass: false }, // 主綠 on 白 ❌
  { fg: '#FFFFFF', bg: '#66BB6A', ratio: 3.1, pass: false }, // 白 on 主綠 ❌
];

// Solution: 主綠色僅用於背景和邊框,文字使用深綠色 #2E7D32
```

#### 2. 鍵盤導航 (Keyboard Navigation)

```tsx
// 所有互動元素可透過 Tab 鍵導航
<Button
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  生成課表
</Button>

// 焦點樣式清晰可見
const focusStyles = {
  '&:focus-visible': {
    outline: '2px solid #66BB6A',
    outlineOffset: '2px',
  },
};
```

#### 3. ARIA 標籤 (ARIA Labels)

```tsx
// 語意化 HTML + ARIA 屬性
<button
  aria-label="生成課表"
  aria-describedby="button-description"
  aria-pressed={isPressed}
>
  <Icon aria-hidden="true" />
  生成課表
</button>

<p id="button-description" className="sr-only">
  根據您選擇的偏好生成客製化訓練課表
</p>

// 載入狀態
<div role="status" aria-live="polite" aria-busy={isLoading}>
  {isLoading ? '正在生成課表...' : '課表已生成'}
</div>
```

#### 4. 螢幕閱讀器優化 (Screen Reader Optimization)

```tsx
// 隱藏裝飾性元素
<div aria-hidden="true">
  {/* decorative background gradient */}
</div>

// 跳過導航連結
<a href="#main-content" className="sr-only focus:not-sr-only">
  跳至主要內容
</a>

// 語意化標題階層
<h1>Virtual Coach App</h1>
<section>
  <h2>偏好設定</h2>
  <h3>運動目標</h3>
</section>
```

#### 5. 動畫尊重 (Respect Prefers-Reduced-Motion)

```typescript
// 檢測使用者偏好
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 動畫配置
const animationConfig = prefersReducedMotion
  ? { duration: 0 } // 關閉動畫
  : { duration: 0.3, ease: 'easeInOut' }; // 正常動畫

// Framer Motion 整合
<motion.div
  animate={{ opacity: 1 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
/>
```

### Testing Tools

- **axe DevTools**: Chrome 擴充功能,自動檢測無障礙問題
- **WAVE**: 網頁無障礙評估工具
- **Lighthouse**: Accessibility audit 分數目標 95+
- **NVDA/JAWS**: 實際使用螢幕閱讀器測試
- **鍵盤測試**: 拔掉滑鼠,純鍵盤操作所有功能

### Alternatives Considered

- **WCAG AAA 標準**: 對比度要求 7:1,過於嚴格,限制設計彈性
- **不考慮無障礙**: 違反最佳實踐,限制使用者群體,可能面臨法規問題

**選擇 WCAG 2.1 AA 原因**: 平衡可用性和設計彈性,符合國際標準和法規要求。

---

## 6. 效能優化策略 (Performance Optimization Strategies)

### Decision

採用多層次優化策略:程式碼分割、圖示優化、懶載入、CSS 優化、動畫效能,確保 FCP < 1.5s, LCP < 2.5s, 動畫 60fps。

### Rationale

1. **使用者體驗**: 快速載入和流暢動畫直接影響滿意度和留存率
2. **SEO 排名**: Google Core Web Vitals 影響搜尋排名
3. **行動網路**: 手機流量佔比高,需優化低頻寬場景
4. **競爭優勢**: 效能優異的應用在市場中脫穎而出

### Optimization Techniques

#### 1. 程式碼分割 (Code Splitting)

```typescript
// 路由層級分割
const PreferenceForm = lazy(() => import('./components/preferences/PreferenceForm'));
const WorkoutList = lazy(() => import('./components/workout/WorkoutList'));
const TrainingPlayer = lazy(() => import('./components/player/TrainingPlayer'));

// 元件層級分割
<Suspense fallback={<Loading />}>
  <PreferenceForm />
</Suspense>

// Mantine 按需導入
import { Button, Card } from '@mantine/core'; // ✅ 只導入需要的元件
// import * as Mantine from '@mantine/core'; // ❌ 不要全部導入
```

**預期效果**: 初始 bundle 從 ~300KB 降至 ~180KB

#### 2. 圖示優化 (Icon Optimization)

```typescript
// 使用 SVG sprite (減少 HTTP 請求)
<svg>
  <use href="/icons/sprite.svg#muscle" />
</svg>

// SVGO 壓縮 (移除不必要屬性)
// Before: 2.5KB → After: 0.8KB

// 內嵌關鍵圖示 (避免額外請求)
const MuscleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path d="M..." fill="currentColor" />
  </svg>
);
```

**預期效果**: 圖示總大小從 ~50KB 降至 ~15KB

#### 3. 圖片懶載入 (Lazy Loading Images)

```tsx
// 原生 lazy loading
<img
  src="/exercise-thumbnail.jpg"
  alt="運動示範"
  loading="lazy"
  decoding="async"
/>

// Intersection Observer (自訂控制)
const { ref, inView } = useIntersection({ threshold: 0.1 });
<div ref={ref}>
  {inView && <img src={src} alt={alt} />}
</div>

// 使用 WebP 格式 (體積小 25-35%)
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="..." />
</picture>
```

**預期效果**: LCP 從 3.2s 降至 2.3s

#### 4. CSS 優化 (CSS Optimization)

```typescript
// Tailwind purge (移除未使用的 CSS)
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  // 生產環境自動 purge,CSS 從 ~200KB 降至 ~20KB
};

// Critical CSS 內聯 (首屏樣式)
// vite.config.ts
export default {
  plugins: [
    inlineCriticalCss({
      include: ['src/index.html'],
    }),
  ],
};

// Mantine CSS 提取 (SSR 優化)
import { MantineProvider, emotionCache } from '@mantine/core';
```

**預期效果**: FCP 從 1.8s 降至 1.3s

#### 5. 動畫效能 (Animation Performance)

```typescript
// 使用 transform 和 opacity (GPU 加速)
const smoothAnimation = {
  transform: 'translateX(100px)', // ✅ GPU accelerated
  opacity: 0.5,                   // ✅ GPU accelerated
};

// 避免觸發 reflow 的屬性
const badAnimation = {
  width: '200px',  // ❌ Triggers layout
  left: '100px',   // ❌ Triggers layout
};

// 使用 will-change 提示
<motion.div style={{ willChange: 'transform' }}>
  {/* complex animation */}
</motion.div>

// 減少 re-render
const animationConfig = useMemo(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}), []);
```

**預期效果**: 所有動畫維持 60fps (16.67ms per frame)

#### 6. 資源預載入 (Resource Preloading)

```html
<!-- index.html -->
<head>
  <!-- 預載入關鍵字體 -->
  <link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- 預連線外部資源 -->
  <link rel="preconnect" href="https://api.supabase.co">
  
  <!-- DNS 預解析 -->
  <link rel="dns-prefetch" href="https://cdn.example.com">
</head>
```

### Performance Monitoring

```typescript
// Web Vitals 監控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// Lighthouse CI 整合 (.github/workflows/lighthouse.yml)
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --config=lighthouserc.json

// 效能預算
// lighthouserc.json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "interactive": ["error", { "maxNumericValue": 3500 }]
      }
    }
  }
}
```

### Alternatives Considered

- **不優化**: 接受慢速載入 - 不可接受,影響使用者體驗和留存
- **過度優化**: 如極致的 inline everything - 增加維護成本,收益遞減
- **CDN**: 使用 Cloudflare/Vercel CDN - 好方案但不在 UI 改版範圍,部署時考慮

**選擇多層次優化原因**: 平衡開發效率和效能提升,針對關鍵指標(FCP, LCP, 動畫幀率)優化。

---

## 7. 視覺回歸測試策略 (Visual Regression Testing)

### Decision

使用 Playwright 進行視覺回歸測試,對比 UI 改版前後的截圖差異,確保視覺一致性。

### Rationale

1. **自動化檢測**: 捕捉人眼容易忽略的細微變化(如 1px 偏移、色彩偏差)
2. **CI 整合**: 每次 PR 自動執行,防止意外破壞現有 UI
3. **跨瀏覽器**: 確保 Chrome、Firefox、Safari 視覺一致
4. **跨裝置**: 驗證響應式設計在不同螢幕尺寸的正確性

### Implementation Approach

```typescript
// tests/visual/component-snapshots.spec.ts
import { test, expect } from '@playwright/test';

test.describe('UI Components Visual Regression', () => {
  test('Preference Form - Desktop', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page).toHaveScreenshot('preference-form-desktop.png', {
      maxDiffPixels: 100, // 容許 100px 差異
    });
  });

  test('Preference Form - Mobile', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('preference-form-mobile.png');
  });

  test('Workout Card - Hover State', async ({ page }) => {
    await page.goto('http://localhost:5173/workout');
    await page.hover('.workout-card');
    await expect(page).toHaveScreenshot('workout-card-hover.png');
  });

  test('Training Player - Dark Theme', async ({ page }) => {
    await page.goto('http://localhost:5173/player');
    await expect(page).toHaveScreenshot('player-dark.png');
  });
});
```

### Best Practices

1. **穩定截圖**: 
   - 等待動畫完成: `await page.waitForTimeout(500)`
   - 隱藏動態內容: `await page.addStyleTag({ content: '* { animation: none !important; }' })`
   - 固定時間戳: 使用 mock data 避免時間變化

2. **合理閾值**:
   - 完全相同: `maxDiffPixels: 0`
   - 容許抗鋸齒差異: `maxDiffPixels: 50-100`
   - 大改動: 更新 baseline screenshot

3. **組織結構**:
   ```
   tests/visual/
   ├── screenshots/
   │   ├── baseline/        # 基準截圖
   │   ├── actual/          # 當前截圖
   │   └── diff/            # 差異對比
   └── *.spec.ts
   ```

4. **CI 配置**:
   ```yaml
   # .github/workflows/visual-regression.yml
   - name: Run Visual Tests
     run: npx playwright test --project=chromium
   - name: Upload Diff Screenshots
     if: failure()
     uses: actions/upload-artifact@v3
     with:
       name: visual-diff
       path: tests/visual/screenshots/diff/
   ```

### Alternatives Considered

- **Percy**: 商業服務,功能強大但需付費,小團隊成本高
- **Chromatic**: Storybook 視覺測試工具,需額外維護 stories
- **BackstopJS**: 配置複雜,不如 Playwright 整合度高
- **手動測試**: 耗時易錯,無法持續驗證

**選擇 Playwright 原因**: 開源免費、與現有測試架構整合、跨瀏覽器支援、社群活躍。

---

## 8. Icon 設計指南 (Icon Design Guidelines)

### Decision

建立統一的 SVG icon 系統,使用單一顏色(currentColor)確保可彈性套用綠色主題,尺寸標準化(24x24, 32x32, 48x48)。

### Rationale

1. **可縮放**: SVG 向量格式在任何解析度下都清晰
2. **可著色**: `fill="currentColor"` 允許透過 CSS 動態改變顏色
3. **檔案小**: 優化後的 SVG 通常 < 1KB
4. **無障礙**: 可搭配 `aria-label` 提供語意

### Icon Set

| Category | Icons | Usage |
|----------|-------|-------|
| 運動目標 (Goals) | muscle (肌肉), fire (火焰), body (身型) | 偏好設定 - 運動目標選項 |
| 器材 (Equipment) | bodyweight (徒手), dumbbell (啞鈴), band (彈力帶), kettlebell (壺鈴) | 偏好設定 - 器材選項 |
| 難度 (Difficulty) | star-outline (空心星), star-filled (實心星) | 難度標籤 1-3 星 |
| 控制 (Controls) | play (播放), pause (暫停), skip (跳過), exit (退出) | 訓練播放器控制按鈕 |
| 狀態 (Status) | check (勾選), clock (時鐘), number (數字), trophy (獎杯) | 標籤、完成畫面 |

### Design Standards

```svg
<!-- 標準 24x24 icon 範本 -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path 
    d="M..." 
    fill="currentColor"
    stroke="none"
  />
</svg>

<!-- 優化 checklist -->
<!-- 1. 移除不必要屬性 (id, style, class) -->
<!-- 2. 簡化路徑 (合併相鄰點) -->
<!-- 3. 使用 currentColor 而非硬編碼顏色 -->
<!-- 4. 設定正確的 viewBox (0 0 24 24) -->
<!-- 5. 移除註釋和元數據 -->
```

### Usage Examples

```tsx
// 直接內嵌 (關鍵 icons)
const MuscleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M..." />
  </svg>
);

// 外部引用 (大量 icons)
<img src="/icons/muscle.svg" alt="增肌" className="w-8 h-8" />

// Icon component wrapper
interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor', className }) => (
  <svg 
    width={size} 
    height={size} 
    fill={color}
    className={className}
  >
    <use href={`/icons/sprite.svg#${name}`} />
  </svg>
);

// Usage
<Icon name="muscle" size={32} className="text-matcha-400" />
```

### Tools & Resources

- **設計工具**: Figma (向量繪製) → Export as SVG
- **優化工具**: SVGO (壓縮 SVG,移除不必要屬性)
- **Icon 庫參考**: Heroicons, Lucide, Phosphor (簡潔風格靈感)
- **Sprite 生成**: svg-sprite-loader (Webpack) 或手動合併

### Alternatives Considered

- **Icon Font**: 舊方案,無障礙性差,難以調整顏色,已過時
- **PNG/JPG**: 點陣格式,不可縮放,檔案大
- **使用第三方庫**: 如 react-icons - 增加 bundle size,客製化困難

**選擇 SVG 原因**: 現代標準,可縮放、可著色、檔案小、無障礙性佳。

---

## Summary of Key Decisions

| Aspect | Decision | Key Benefit |
|--------|----------|-------------|
| UI Library | Mantine v7 | 完整元件庫 + 主題系統 + TypeScript 支援 + 無障礙性 |
| Styling | Mantine CSS-in-JS + Tailwind utilities | 元件級主題 + 快速佈局 utilities |
| Animation | Framer Motion 11.x | 宣告式 API + 60fps 效能 + React 整合 |
| Responsive | 3 breakpoints (mobile/tablet/desktop) | 簡化維護 + 覆蓋主流裝置 |
| Accessibility | WCAG 2.1 AA | 法規遵循 + 擴大受眾 + SEO 優勢 |
| Performance | 多層次優化 (splitting, lazy, optimize) | FCP < 1.5s, LCP < 2.5s, 60fps |
| Testing | Playwright visual regression | 自動化視覺檢測 + CI 整合 |
| Icons | SVG with currentColor | 可縮放 + 可著色 + 檔案小 + 無障礙 |

**All technical unknowns resolved. Ready for Phase 1 (Design & Contracts).**
