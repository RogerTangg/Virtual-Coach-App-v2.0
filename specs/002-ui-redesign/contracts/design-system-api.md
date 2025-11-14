# Design System API Contract

**Feature**: 002-ui-redesign | **Date**: 2025-11-15 | **Contract Type**: Theme Configuration

本文件定義 Mantine 主題系統 API,包含主題配置、設計令牌存取、全域樣式覆寫的規格。

---

## 1. Theme Provider Setup

### 1.1 MantineProvider Configuration

```typescript
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

interface ThemeConfig {
  colors: Record<string, string[]>;
  primaryColor: string;
  fontFamily: string;
  fontSizes: Record<string, string>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  shadows: Record<string, string>;
  breakpoints: Record<string, string>;
}

// REQUEST: 建立 Mantine 主題
const theme = createTheme(config: Partial<ThemeConfig>): MantineTheme;

// RESPONSE: MantineTheme 物件
interface MantineTheme {
  colors: ColorScheme;
  primaryColor: string;
  // ... 其他主題屬性
}

// EXAMPLE
const virtualCoachTheme = createTheme({
  colors: {
    matcha: [
      '#E8F5E9', // 0
      '#C8E6C9', // 1
      '#A5D6A7', // 2
      '#81C784', // 3
      '#66BB6A', // 4 - Primary
      '#4CAF50', // 5
      '#43A047', // 6
      '#388E3C', // 7
      '#2E7D32', // 8
      '#1B5E20', // 9
    ],
  },
  primaryColor: 'matcha',
  fontFamily: 'Inter, Noto Sans TC, sans-serif',
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
  },
});

// USAGE
<MantineProvider theme={virtualCoachTheme}>
  <App />
</MantineProvider>
```

**Contract Terms**:
- **Input**: `ThemeConfig` 部分配置物件
- **Output**: 完整的 `MantineTheme` 物件
- **Side Effects**: 全域注入 CSS 變數 (如 `--mantine-color-matcha-4`)
- **Error Handling**: 若配置無效,拋出 `TypeError`

---

## 2. Design Token Access

### 2.1 Theme Hook API

```typescript
import { useMantineTheme } from '@mantine/core';

// REQUEST: 存取主題令牌
const theme = useMantineTheme();

// RESPONSE: 主題物件
interface ThemeAccess {
  colors: {
    [colorName: string]: string[]; // matcha: ['#E8F5E9', ...]
  };
  spacing: {
    [key: string]: string; // xs: '10px', sm: '12px', ...
  };
  radius: {
    [key: string]: string; // sm: '8px', md: '12px', ...
  };
  shadows: {
    [key: string]: string; // sm: '0 4px 6px rgba(...)', ...
  };
  breakpoints: {
    [key: string]: string; // sm: '768px', md: '1024px', ...
  };
}

// EXAMPLE: 使用主題色彩
function MyComponent() {
  const theme = useMantineTheme();
  
  return (
    <Box
      bg={theme.colors.matcha[4]}  // Primary green
      p={theme.spacing.md}          // 16px padding
      sx={(theme) => ({
        borderRadius: theme.radius.md,
        boxShadow: theme.shadows.sm,
        
        '&:hover': {
          boxShadow: theme.shadows.md,
        },
      })}
    >
      Content
    </Box>
  );
}
```

**Contract Terms**:
- **Input**: None (Hook)
- **Output**: `MantineTheme` 物件
- **Context Required**: 必須在 `<MantineProvider>` 內部使用
- **Error Handling**: 若在 Provider 外使用,拋出 `Error: useMantineTheme must be used within MantineProvider`

### 2.2 CSS Variables API

```typescript
// REQUEST: 透過 CSS 變數存取設計令牌
// 自動生成的 CSS 變數
:root {
  --mantine-color-matcha-0: #E8F5E9;
  --mantine-color-matcha-4: #66BB6A;
  --mantine-spacing-md: 16px;
  --mantine-radius-md: 12px;
  --mantine-shadow-sm: 0 4px 6px rgba(46, 125, 50, 0.15);
}

// USAGE: 在 CSS/SCSS 中使用
.custom-card {
  background-color: var(--mantine-color-matcha-0);
  padding: var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-md);
  box-shadow: var(--mantine-shadow-sm);
}

// USAGE: 在 sx prop 中使用
<Box
  sx={{
    backgroundColor: 'var(--mantine-color-matcha-4)',
    padding: 'var(--mantine-spacing-lg)',
  }}
/>
```

**Contract Terms**:
- **Input**: CSS 變數名稱
- **Output**: 設計令牌值 (字串)
- **Scope**: 全域 (`:root`)
- **Fallback**: 若變數不存在,使用瀏覽器預設值

---

## 3. Component Customization

### 3.1 Component Default Props

```typescript
import { Button, Card } from '@mantine/core';

// REQUEST: 設定元件預設 props
const theme = createTheme({
  components: {
    Button: Button.extend({
      defaultProps: {
        size: 'md',
        radius: 'sm',
        variant: 'filled',
        color: 'matcha',
      },
      styles: (theme) => ({
        root: {
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      }),
    }),
    
    Card: Card.extend({
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
    }),
  },
});

// USAGE: 所有 Button 自動套用預設樣式
<Button>Submit</Button> // 自動是 matcha 色、md 尺寸、sm 圓角
```

**Contract Terms**:
- **Input**: `Component.extend({ defaultProps, styles })`
- **Output**: 擴充的元件配置
- **Override**: 個別元件仍可透過 props 覆寫
- **Validation**: 若 `styles` 函數拋出錯誤,元件渲染失敗

### 3.2 Global Styles Override

```typescript
import { MantineProvider } from '@mantine/core';

// REQUEST: 注入全域樣式
<MantineProvider
  theme={theme}
  cssVariablesResolver={(theme) => ({
    variables: {
      '--custom-focus-ring': theme.colors.matcha[4],
    },
    light: {
      '--mantine-color-body': '#FAFAFA',
    },
    dark: {
      '--mantine-color-body': '#212121',
    },
  })}
>
  <App />
</MantineProvider>
```

**Contract Terms**:
- **Input**: `cssVariablesResolver` 函數
- **Output**: CSS 變數物件 (variables, light, dark)
- **Scope**: 全域注入
- **Theme Modes**: 支援 light/dark 模式

---

## 4. Responsive Utilities

### 4.1 useMediaQuery Hook

```typescript
import { useMediaQuery } from '@mantine/hooks';

// REQUEST: 偵測裝置斷點
const isMobile = useMediaQuery('(max-width: 767px)');
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
const isDesktop = useMediaQuery('(min-width: 1024px)');

// RESPONSE: boolean
// EXAMPLE
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  return (
    <Stack spacing={isMobile ? 'sm' : 'lg'}>
      {/* 內容 */}
    </Stack>
  );
}
```

**Contract Terms**:
- **Input**: Media query 字串
- **Output**: `boolean` (是否符合)
- **Re-render**: 斷點變化時觸發重新渲染
- **SSR Support**: 初始值為 `false`,客戶端 hydration 後更新

### 4.2 Responsive Props

```typescript
import { Box } from '@mantine/core';

// REQUEST: 使用響應式 props
<Box
  p={{ base: 'sm', sm: 'md', md: 'lg', lg: 'xl' }}
  w={{ base: '100%', md: '50%', lg: '33%' }}
  display={{ base: 'block', md: 'flex' }}
>
  Content
</Box>

// RESPONSE: 根據斷點自動調整樣式
// base: 0px+
// sm: 768px+
// md: 1024px+
// lg: 1440px+
```

**Contract Terms**:
- **Input**: 響應式物件 `{ base, sm, md, lg, xl }`
- **Output**: 對應斷點的樣式值
- **Breakpoints**: 使用 theme.breakpoints 定義
- **Mobile-First**: base 為最小斷點,逐步覆寫

---

## 5. Animation Utilities

### 5.1 Transition Component

```typescript
import { Transition } from '@mantine/core';

// REQUEST: 元素進入/離開動畫
<Transition
  mounted={opened}
  transition="fade"
  duration={300}
  timingFunction="ease-in-out"
>
  {(styles) => <Box style={styles}>Content</Box>}
</Transition>

// AVAILABLE TRANSITIONS
type TransitionName = 
  | 'fade'
  | 'scale'
  | 'slide-down'
  | 'slide-up'
  | 'slide-left'
  | 'slide-right'
  | 'pop';

// EXAMPLE: 自訂過渡
const customTransition = {
  in: { opacity: 1, transform: 'scale(1)' },
  out: { opacity: 0, transform: 'scale(0.95)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'opacity, transform',
};

<Transition
  mounted={opened}
  transition={customTransition}
  duration={200}
>
  {(styles) => <Box style={styles}>Content</Box>}
</Transition>
```

**Contract Terms**:
- **Input**: `mounted` (boolean), `transition` (預設或自訂), `duration` (ms)
- **Output**: Render prop 函數,接收 styles 物件
- **Lifecycle**: mounted=true 觸發進入, mounted=false 觸發離開
- **Performance**: 使用 CSS transitions,不觸發 JS reflow

### 5.2 Framer Motion Integration

```typescript
import { motion } from 'framer-motion';
import { Box } from '@mantine/core';

// REQUEST: 使用 Framer Motion 配合 Mantine
const MotionBox = motion(Box);

<MotionBox
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
  bg="matcha.4"
  p="md"
>
  Animated Content
</MotionBox>

// LAYOUT ANIMATION
<MotionBox layout transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
  {/* 佈局變化時自動動畫 */}
</MotionBox>
```

**Contract Terms**:
- **Input**: Framer Motion props + Mantine props
- **Output**: 動畫化的 Mantine 元件
- **Compatibility**: 所有 Mantine 元件可用 `motion()` 包裝
- **Performance**: 使用 GPU 加速 (transform/opacity)

---

## 6. Accessibility APIs

### 6.1 ARIA Props

```typescript
import { Button, TextInput } from '@mantine/core';

// REQUEST: 設定無障礙屬性
<Button
  aria-label="提交偏好設定"
  aria-describedby="button-description"
  disabled={loading}
  aria-busy={loading}
>
  提交
</Button>

<TextInput
  label="訓練時長"
  required
  aria-required="true"
  aria-invalid={error ? 'true' : 'false'}
  aria-errormessage={error ? 'duration-error' : undefined}
  error={error}
  id="duration-input"
/>

{error && <Text id="duration-error" c="red">{error}</Text>}
```

**Contract Terms**:
- **Input**: ARIA 屬性 (aria-label, aria-describedby, etc.)
- **Output**: HTML 元素包含對應 ARIA 屬性
- **Validation**: Mantine 自動驗證必要 ARIA 屬性
- **Screen Reader**: 所有互動元件預設可存取

### 6.2 Keyboard Navigation

```typescript
import { Menu } from '@mantine/core';

// REQUEST: 鍵盤導航支援
<Menu>
  <Menu.Target>
    <Button>選單</Button>
  </Menu.Target>
  
  <Menu.Dropdown>
    <Menu.Item
      leftSection={<IconUser />}
      onClick={handleProfile}
      // 自動支援:
      // - Tab 切換焦點
      // - Enter/Space 觸發
      // - Arrow Keys 導航
    >
      個人資料
    </Menu.Item>
  </Menu.Dropdown>
</Menu>
```

**Contract Terms**:
- **Input**: Mantine 元件預設配置
- **Output**: 完整鍵盤導航支援
- **Shortcuts**: Tab (焦點切換), Enter/Space (觸發), Arrows (導航)
- **Focus Management**: 自動管理焦點環 (focus trap)

### 6.3 prefers-reduced-motion Support

```typescript
import { usePrefersReducedMotion } from '@mantine/hooks';

// REQUEST: 偵測使用者動畫偏好
const prefersReducedMotion = usePrefersReducedMotion();

// EXAMPLE: 根據偏好調整動畫
<Transition
  mounted={opened}
  transition="fade"
  duration={prefersReducedMotion ? 0 : 300}
>
  {(styles) => <Box style={styles}>Content</Box>}
</Transition>

// CSS-based approach
<Box
  sx={(theme) => ({
    transition: 'all 0.3s ease-in-out',
    
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  })}
>
  Content
</Box>
```

**Contract Terms**:
- **Input**: None (Hook)
- **Output**: `boolean` (true = 減少動畫)
- **Browser Support**: 支援 `prefers-reduced-motion` media query
- **Fallback**: 不支援時預設為 `false`

---

## Error Handling

### Error Codes

```typescript
enum ThemeError {
  INVALID_COLOR_SCHEME = 'THEME_001',
  MISSING_PROVIDER = 'THEME_002',
  INVALID_BREAKPOINT = 'THEME_003',
  CUSTOM_STYLE_ERROR = 'THEME_004',
}

// ERROR: 缺少 MantineProvider
// Code: THEME_002
// Message: "useMantineTheme must be used within MantineProvider"
// Solution: 確保元件在 <MantineProvider> 內部

// ERROR: 無效的色彩索引
// Code: THEME_001
// Message: "Color matcha[10] does not exist"
// Solution: 色彩陣列索引 0-9,使用有效索引

// ERROR: 自訂樣式函數錯誤
// Code: THEME_004
// Message: "Styles function threw an error: ..."
// Solution: 檢查 styles 函數語法和邏輯
```

---

## Performance Considerations

1. **CSS-in-JS Optimization**: Mantine 使用 emotion,支援自動 CSS 提取和去重
2. **Tree Shaking**: 僅引入使用的元件,減少 bundle size
3. **CSS Variables**: 主題令牌轉為 CSS 變數,避免 runtime 計算
4. **Lazy Loading**: 大型元件 (如 DatePicker) 使用 lazy loading

**Expected Performance**:
- Theme 初始化: <50ms
- CSS 注入: <100ms
- Component render: <16ms (60fps)

---

## Version Compatibility

- **Mantine**: ^7.0.0
- **React**: ^18.0.0 or ^19.0.0
- **TypeScript**: ^5.0.0

**All API contracts validated and ready for implementation.**
