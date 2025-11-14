# Data Model: Virtual Coach App UI Redesign

**Feature**: 002-ui-redesign | **Date**: 2025-11-15 | **Phase**: 1 (Design & Contracts)

本文件定義 UI 改版的核心資料結構,包含設計令牌(Design Tokens)、元件變體(Component Variants)、響應式斷點(Responsive Breakpoints)和動畫配置(Animation Curves)。

---

## 1. Design Token (設計令牌)

代表設計系統的基礎變數,所有 UI 元件必須引用這些令牌以確保視覺一致性。

### 1.1 Color Palette (色彩系統)

```typescript
interface ColorPalette {
  matcha: {
    50: string;   // #E8F5E9 - Lightest (背景)
    100: string;  // #C8E6C9 - Very Light (邊框、淺色背景)
    200: string;  // #A5D6A7 
    300: string;  // #81C784 - Accent (強調色)
    400: string;  // #66BB6A - Primary (主色)
    500: string;  // #4CAF50
    600: string;  // #43A047
    700: string;  // #388E3C
    800: string;  // #2E7D32 - Dark (深色文字、播放器背景)
    900: string;  // #1B5E20 - Darkest (播放器深色漸層)
  };
  neutral: {
    white: string;      // #FFFFFF
    gray50: string;     // #FAFAFA
    gray100: string;    // #F5F5F5
    gray200: string;    // #EEEEEE
    gray300: string;    // #E0E0E0
    gray400: string;    // #BDBDBD
    gray500: string;    // #9E9E9E
    gray600: string;    // #757575
    gray700: string;    // #616161
    gray800: string;    // #424242
    gray900: string;    // #212121 - 深色文字
    black: string;      // #000000
  };
  semantic: {
    success: string;    // #66BB6A (使用主綠色)
    warning: string;    // #FFA726 (橘色,用於警告)
    error: string;      // #EF5350 (紅色,用於錯誤)
    info: string;       // #42A5F5 (藍色,用於資訊)
  };
}

// Validation Rules
// 1. 所有文字與背景對比度必須 ≥ 4.5:1 (WCAG AA)
// 2. 主色 #66BB6A 僅用於背景、邊框、圖示,不用於文字
// 3. 深色文字使用 #2E7D32 或 #212121
```

### 1.2 Typography (字體系統)

```typescript
interface Typography {
  fontFamily: {
    primary: string;    // 'Inter, sans-serif'
    secondary: string;  // 'Noto Sans TC, sans-serif'
  };
  fontSize: {
    xs: string;   // 12px - 輔助文字、標籤
    sm: string;   // 14px - 次要文字
    md: string;   // 16px - 正文 (基準)
    lg: string;   // 18px - 大正文
    xl: string;   // 24px - 小標題
    '2xl': string; // 28px - 副標題
    '3xl': string; // 32px - 標題
    '4xl': string; // 48px - 大標題
  };
  fontWeight: {
    normal: number;   // 400
    medium: number;   // 500
    semibold: number; // 600
    bold: number;     // 700
  };
  lineHeight: {
    tight: number;    // 1.2 - 標題
    normal: number;   // 1.5 - 正文
    relaxed: number;  // 1.75 - 段落
  };
}

// Validation Rules
// 1. 最小字體 12px (小於此影響可讀性)
// 2. 正文預設 16px (符合網頁標準)
// 3. 行高至少 1.5 (WCAG 建議)
```

### 1.3 Spacing (間距系統)

```typescript
interface Spacing {
  // 基礎單位 4px
  0: string;   // 0px
  1: string;   // 4px
  2: string;   // 8px
  3: string;   // 12px
  4: string;   // 16px
  5: string;   // 20px
  6: string;   // 24px
  8: string;   // 32px
  10: string;  // 40px
  12: string;  // 48px
  16: string;  // 64px
  20: string;  // 80px
  24: string;  // 96px
}

// Usage Guidelines
// - 內邊距 (padding): 4-16px (元件內部)
// - 外邊距 (margin): 8-24px (元件之間)
// - 區段間距: 32-64px (大區塊)
```

### 1.4 Border Radius (圓角系統)

```typescript
interface BorderRadius {
  none: string;   // 0px
  xs: string;     // 6px - 輸入框
  sm: string;     // 8px - 按鈕
  md: string;     // 12px - 卡片
  lg: string;     // 16px - 大卡片
  xl: string;     // 24px - 標籤 (pill shape)
  full: string;   // 9999px - 圓形
}

// Usage Guidelines
// - 按鈕: sm (8px)
// - 卡片: md (12-16px)
// - 標籤: xl (24px, pill)
// - 頭像/圖示: full (圓形)
```

### 1.5 Shadow (陰影系統)

```typescript
interface Shadow {
  xs: string;   // '0 1px 3px rgba(46, 125, 50, 0.1)' - 卡片靜態
  sm: string;   // '0 4px 6px rgba(46, 125, 50, 0.15)' - 卡片懸停
  md: string;   // '0 10px 20px rgba(46, 125, 50, 0.2)' - 浮動元素
  lg: string;   // '0 20px 40px rgba(46, 125, 50, 0.25)' - 對話框
  xl: string;   // '0 30px 60px rgba(46, 125, 50, 0.3)' - 強調
  none: string; // 'none'
}

// Validation Rules
// 1. 使用綠色系半透明陰影 rgba(46, 125, 50, ...)
// 2. 不使用純黑陰影 (與主題不符)
// 3. 陰影輕微,避免過於厚重
```

### 1.6 Animation (動畫系統)

```typescript
interface Animation {
  duration: {
    instant: number;  // 0ms - 無動畫 (prefers-reduced-motion)
    fast: number;     // 150ms - 微互動
    normal: number;   // 300ms - 標準過渡
    slow: number;     // 500ms - 複雜動畫
  };
  easing: {
    linear: string;       // 'linear' - 勻速 (loading)
    easeIn: string;       // 'cubic-bezier(0.4, 0, 1, 1)' - 離開
    easeOut: string;      // 'cubic-bezier(0, 0, 0.2, 1)' - 進入
    easeInOut: string;    // 'cubic-bezier(0.4, 0, 0.2, 1)' - 過渡
    spring: string;       // 彈簧效果 (Framer Motion)
  };
}

// Usage Guidelines
// - 按鈕懸停: fast + easeInOut
// - 卡片展開: normal + easeInOut
// - 頁面過渡: slow + easeInOut
// - Loading spinner: linear (無限循環)
```

---

## 2. Component Variant (元件變體)

定義常用 UI 元件的不同視覺狀態和尺寸變體。

### 2.1 Button Variant

```typescript
interface ButtonVariant {
  variant: 'filled' | 'outline' | 'subtle' | 'ghost';
  size: 'xs' | 'sm' | 'md' | 'lg';
  color: 'matcha' | 'gray' | 'red';
  state: 'default' | 'hover' | 'active' | 'disabled' | 'loading';
}

// Variant Specifications
const buttonVariants = {
  filled: {
    background: 'matcha.400',    // #66BB6A
    color: 'white',
    border: 'none',
    hover: {
      background: 'matcha.500',
      transform: 'scale(1.05)',
    },
    active: {
      background: 'matcha.600',
      transform: 'scale(0.98)',
    },
  },
  outline: {
    background: 'transparent',
    color: 'matcha.400',
    border: '2px solid matcha.300',
    hover: {
      background: 'matcha.50',
    },
  },
  subtle: {
    background: 'matcha.50',
    color: 'matcha.800',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'matcha.800',
    border: 'none',
  },
};

// Size Specifications
const buttonSizes = {
  xs: { height: '28px', padding: '4px 12px', fontSize: 'xs' },
  sm: { height: '36px', padding: '8px 16px', fontSize: 'sm' },
  md: { height: '44px', padding: '12px 24px', fontSize: 'md' }, // 預設,觸控友善
  lg: { height: '52px', padding: '16px 32px', fontSize: 'lg' },
};

// Validation Rules
// 1. 預設尺寸 md (44px 高度,符合觸控標準)
// 2. 主要操作使用 filled + matcha
// 3. 次要操作使用 outline 或 subtle
// 4. Disabled 狀態 opacity: 0.5, cursor: not-allowed
// 5. Loading 狀態顯示 spinner,禁用點擊
```

### 2.2 Card Variant

```typescript
interface CardVariant {
  variant: 'default' | 'elevated' | 'outline';
  state: 'default' | 'hover' | 'expanded';
  interactive: boolean;
}

const cardVariants = {
  default: {
    background: 'white',
    border: '1px solid matcha.100',
    borderRadius: 'md',
    shadow: 'xs',
    padding: '16px',
    hover: {
      shadow: 'sm',
      borderColor: 'matcha.300',
    },
  },
  elevated: {
    background: 'white',
    border: 'none',
    borderRadius: 'md',
    shadow: 'md',
    padding: '16px',
    hover: {
      shadow: 'lg',
      transform: 'translateY(-2px)',
    },
  },
  outline: {
    background: 'transparent',
    border: '2px solid matcha.200',
    borderRadius: 'md',
    shadow: 'none',
    padding: '16px',
  },
  expanded: {
    // 展開狀態額外樣式
    shadow: 'sm',
    borderColor: 'matcha.400',
  },
};

// Validation Rules
// 1. 預設使用 default variant (淡綠色邊框)
// 2. 互動式卡片加入 hover 效果
// 3. 展開時增強陰影和邊框色
// 4. 非互動卡片移除 hover 樣式
```

### 2.3 Badge Variant

```typescript
interface BadgeVariant {
  variant: 'filled' | 'outline' | 'dot';
  color: 'matcha' | 'gray' | 'orange' | 'red';
  size: 'sm' | 'md' | 'lg';
}

const badgeVariants = {
  filled: {
    background: 'matcha.50',
    color: 'matcha.800',
    border: 'none',
    borderRadius: 'xl', // pill shape
    padding: '4px 12px',
  },
  outline: {
    background: 'transparent',
    color: 'matcha.700',
    border: '1px solid matcha.300',
    borderRadius: 'xl',
    padding: '4px 12px',
  },
  dot: {
    // 小圓點 + 文字
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    dotSize: '8px',
    dotColor: 'matcha.400',
  },
};

// Usage Guidelines
// - 器材標籤: filled + matcha
// - 時長標籤: filled + gray
// - 難度標籤: dot + matcha (1-3 個點)
// - 警告標籤: filled + orange
```

### 2.4 Progress Variant

```typescript
interface ProgressVariant {
  variant: 'linear' | 'circular';
  size: 'sm' | 'md' | 'lg';
  showLabel: boolean;
}

const progressVariants = {
  linear: {
    height: '8px',
    background: 'matcha.100',
    fill: 'matcha.400',
    borderRadius: 'full',
  },
  circular: {
    // 圓形進度條 (訓練計時器)
    strokeWidth: {
      sm: 6,
      md: 8,
      lg: 12,
    },
    diameter: {
      sm: 100,
      md: 200,
      lg: 300,
    },
    stroke: 'matcha.400',
    background: 'matcha.100',
  },
};

// Validation Rules
// 1. Loading 使用 linear 進度條
// 2. 訓練計時器使用 circular 進度條
// 3. 動畫流暢 (60fps, 使用 CSS animation)
```

---

## 3. Responsive Breakpoint (響應式斷點)

定義不同裝置尺寸的佈局規則和設計調整。

### 3.1 Breakpoint Definition

```typescript
interface ResponsiveBreakpoint {
  name: 'mobile' | 'tablet' | 'desktop';
  minWidth: number;   // px
  maxWidth?: number;  // px (optional)
  columns: number;    // 網格欄數
  gutter: number;     // 網格間距 (px)
  margin: number;     // 頁面邊距 (px)
  containerMaxWidth?: number; // 容器最大寬度 (px)
}

const breakpoints: ResponsiveBreakpoint[] = [
  {
    name: 'mobile',
    minWidth: 0,
    maxWidth: 767,
    columns: 4,       // 4 欄網格
    gutter: 16,       // 16px 間距
    margin: 16,       // 16px 邊距
  },
  {
    name: 'tablet',
    minWidth: 768,
    maxWidth: 1023,
    columns: 8,       // 8 欄網格
    gutter: 24,       // 24px 間距
    margin: 32,       // 32px 邊距
  },
  {
    name: 'desktop',
    minWidth: 1024,
    columns: 12,      // 12 欄網格
    gutter: 32,       // 32px 間距
    margin: 48,       // 48px 邊距
    containerMaxWidth: 1440, // 最大寬度限制
  },
];
```

### 3.2 Layout Patterns

```typescript
interface LayoutPattern {
  component: string;
  mobile: LayoutConfig;
  tablet: LayoutConfig;
  desktop: LayoutConfig;
}

interface LayoutConfig {
  display: 'flex' | 'grid' | 'block';
  direction?: 'row' | 'column';
  columns?: number;
  gap?: number;
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

// 偏好設定佈局
const preferenceFormLayout: LayoutPattern = {
  component: 'PreferenceForm',
  mobile: {
    display: 'flex',
    direction: 'column',
    gap: 16,
  },
  tablet: {
    display: 'grid',
    columns: 2,
    gap: 24,
  },
  desktop: {
    display: 'grid',
    columns: 3,
    gap: 32,
  },
};

// 課表卡片佈局
const workoutListLayout: LayoutPattern = {
  component: 'WorkoutList',
  mobile: {
    display: 'flex',
    direction: 'column',
    gap: 12,
  },
  tablet: {
    display: 'flex',
    direction: 'column',
    gap: 16,
  },
  desktop: {
    display: 'grid',
    columns: 2, // 左側列表 + 右側詳情
    gap: 32,
  },
};
```

### 3.3 Typography Scale

```typescript
interface TypographyScale {
  mobile: {
    h1: string;  // 32px
    h2: string;  // 24px
    h3: string;  // 20px
    body: string; // 16px
    small: string; // 14px
  };
  tablet: {
    h1: string;  // 40px
    h2: string;  // 28px
    h3: string;  // 22px
    body: string; // 16px
    small: string; // 14px
  };
  desktop: {
    h1: string;  // 48px
    h2: string;  // 32px
    h3: string;  // 24px
    body: string; // 18px
    small: string; // 14px
  };
}

// Validation Rules
// 1. 最小字體 14px (任何裝置)
// 2. Mobile 正文 16px (避免自動縮放)
// 3. 標題隨裝置放大,保持層次
```

---

## 4. Animation Curve (動畫曲線)

定義不同類型動畫的時間函數和配置。

### 4.1 Curve Definition

```typescript
interface AnimationCurve {
  name: string;
  curve: string;           // CSS timing function
  duration: number;        // ms
  usage: string[];         // 使用場景
}

const animationCurves: AnimationCurve[] = [
  {
    name: 'easeInOut',
    curve: 'cubic-bezier(0.4, 0, 0.2, 1)',
    duration: 300,
    usage: ['卡片展開', '按鈕過渡', '頁面切換'],
  },
  {
    name: 'easeOut',
    curve: 'cubic-bezier(0, 0, 0.2, 1)',
    duration: 200,
    usage: ['元素進入', 'Tooltip 顯示'],
  },
  {
    name: 'easeIn',
    curve: 'cubic-bezier(0.4, 0, 1, 1)',
    duration: 200,
    usage: ['元素離開', 'Modal 關閉'],
  },
  {
    name: 'spring',
    curve: 'spring(stiffness: 400, damping: 17)', // Framer Motion
    duration: 300,
    usage: ['按鈕點擊', '懸停放大'],
  },
  {
    name: 'linear',
    curve: 'linear',
    duration: 1000,
    usage: ['Loading spinner', '進度條'],
  },
];
```

### 4.2 Framer Motion Variants

```typescript
interface MotionVariant {
  name: string;
  initial: object;
  animate: object;
  exit?: object;
  transition: object;
}

// 淡入淡出
const fadeInOut: MotionVariant = {
  name: 'fadeInOut',
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

// 滑入滑出
const slideInOut: MotionVariant = {
  name: 'slideInOut',
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

// 縮放
const scale: MotionVariant = {
  name: 'scale',
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

// 彈跳
const bounce: MotionVariant = {
  name: 'bounce',
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { 
    type: 'spring',
    stiffness: 400,
    damping: 17,
  },
};
```

### 4.3 Performance Constraints

```typescript
interface PerformanceConstraint {
  property: string;
  allowed: boolean;
  reason: string;
}

const performanceConstraints: PerformanceConstraint[] = [
  {
    property: 'transform',
    allowed: true,
    reason: 'GPU 加速,不觸發 reflow',
  },
  {
    property: 'opacity',
    allowed: true,
    reason: 'GPU 加速,不觸發 repaint',
  },
  {
    property: 'width',
    allowed: false,
    reason: '觸發 layout reflow,效能差',
  },
  {
    property: 'height',
    allowed: false,
    reason: '觸發 layout reflow,效能差',
  },
  {
    property: 'left/top',
    allowed: false,
    reason: '觸發 layout,使用 translateX/Y 替代',
  },
];

// Validation Rules
// 1. 只動畫 transform 和 opacity
// 2. 複雜動畫使用 will-change
// 3. 動畫幀率維持 60fps (16.67ms per frame)
// 4. 支援 prefers-reduced-motion (關閉動畫)
```

---

## Entity Relationships

```
DesignToken
  ├─ ColorPalette (色彩系統)
  ├─ Typography (字體系統)
  ├─ Spacing (間距系統)
  ├─ BorderRadius (圓角系統)
  ├─ Shadow (陰影系統)
  └─ Animation (動畫系統)

ComponentVariant
  ├─ ButtonVariant (按鈕變體)
  ├─ CardVariant (卡片變體)
  ├─ BadgeVariant (標籤變體)
  └─ ProgressVariant (進度條變體)

ResponsiveBreakpoint
  ├─ BreakpointDefinition (斷點定義)
  ├─ LayoutPattern (佈局模式)
  └─ TypographyScale (字體縮放)

AnimationCurve
  ├─ CurveDefinition (曲線定義)
  ├─ MotionVariant (Framer Motion 變體)
  └─ PerformanceConstraint (效能約束)
```

**Relationships**:
- ComponentVariant **使用** DesignToken (引用色彩、間距、圓角等)
- ResponsiveBreakpoint **影響** ComponentVariant (不同斷點下的尺寸調整)
- AnimationCurve **套用於** ComponentVariant (元件的過渡動畫)

---

## Data Validation Rules

1. **色彩對比度**: 所有文字與背景對比度 ≥ 4.5:1 (WCAG AA)
2. **觸控目標**: 所有可點擊元素至少 44x44px
3. **間距一致性**: 所有間距必須是 4px 的倍數
4. **動畫效能**: 只動畫 transform 和 opacity,維持 60fps
5. **響應式**: 所有元件支援 3 個斷點,無佈局錯位
6. **無障礙**: 所有元件包含 ARIA 標籤,支援鍵盤導航

**All entities validated and ready for implementation.**
