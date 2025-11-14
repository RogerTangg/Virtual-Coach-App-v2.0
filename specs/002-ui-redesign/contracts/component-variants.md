# Component Variants Contract

**Feature**: 002-ui-redesign | **Date**: 2025-11-15 | **Contract Type**: UI Component Specifications

本文件定義 UI 元件的變體規格,包含 Button、Card、Badge、Progress 等元件的視覺規範、props 介面、使用指南。

---

## 1. Button Component

### 1.1 Props Interface

```typescript
import { ButtonProps as MantineButtonProps } from '@mantine/core';

interface VirtualCoachButtonProps extends MantineButtonProps {
  variant?: 'filled' | 'outline' | 'subtle' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'matcha' | 'gray' | 'red';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// USAGE
<Button
  variant="filled"
  size="md"
  color="matcha"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  提交
</Button>
```

### 1.2 Visual Specifications

#### Variant: filled (預設)

```typescript
// 視覺規格
const filledVariant = {
  background: 'matcha.4',        // #66BB6A
  color: 'white',
  border: 'none',
  borderRadius: 'sm',            // 8px
  fontWeight: 600,
  boxShadow: 'none',
  
  // 狀態
  hover: {
    background: 'matcha.5',      // #4CAF50
    transform: 'scale(1.05)',
    transition: 'all 0.2s ease-in-out',
  },
  active: {
    background: 'matcha.6',      // #43A047
    transform: 'scale(0.98)',
  },
  disabled: {
    background: 'gray.200',
    color: 'gray.500',
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  loading: {
    background: 'matcha.4',
    cursor: 'wait',
    opacity: 0.7,
    // 顯示 Loader 元件
  },
};
```

#### Variant: outline

```typescript
const outlineVariant = {
  background: 'transparent',
  color: 'matcha.7',             // #388E3C
  border: '2px solid matcha.3',  // #81C784
  borderRadius: 'sm',
  fontWeight: 600,
  
  hover: {
    background: 'matcha.0',      // #E8F5E9
    borderColor: 'matcha.4',
  },
  active: {
    background: 'matcha.1',      // #C8E6C9
  },
};
```

#### Variant: subtle

```typescript
const subtleVariant = {
  background: 'matcha.0',        // #E8F5E9
  color: 'matcha.8',             // #2E7D32
  border: 'none',
  borderRadius: 'sm',
  
  hover: {
    background: 'matcha.1',      // #C8E6C9
  },
};
```

#### Variant: ghost

```typescript
const ghostVariant = {
  background: 'transparent',
  color: 'matcha.8',
  border: 'none',
  
  hover: {
    background: 'matcha.0',
  },
};
```

### 1.3 Size Specifications

```typescript
const buttonSizes = {
  xs: {
    height: '28px',
    padding: '4px 12px',
    fontSize: 'xs',              // 12px
    minWidth: '80px',
  },
  sm: {
    height: '36px',
    padding: '8px 16px',
    fontSize: 'sm',              // 14px
    minWidth: '100px',
  },
  md: {
    height: '44px',              // 預設,觸控友善
    padding: '12px 24px',
    fontSize: 'md',              // 16px
    minWidth: '120px',
  },
  lg: {
    height: '52px',
    padding: '16px 32px',
    fontSize: 'lg',              // 18px
    minWidth: '160px',
  },
};
```

### 1.4 Accessibility

```typescript
// 自動包含的無障礙屬性
<Button
  aria-label={loading ? '載入中' : children}
  aria-disabled={disabled || loading}
  aria-busy={loading}
  role="button"
  tabIndex={disabled ? -1 : 0}
>
  {loading ? <Loader size="sm" /> : children}
</Button>

// 鍵盤導航
// - Enter/Space: 觸發點擊
// - Tab: 切換焦點
// - 焦點可見: 2px 綠色外框
```

### 1.5 Usage Guidelines

```typescript
// ✅ DO: 主要操作使用 filled
<Button variant="filled" color="matcha">提交</Button>

// ✅ DO: 次要操作使用 outline
<Button variant="outline">取消</Button>

// ✅ DO: 載入狀態顯示 Loader
<Button loading={isSubmitting}>儲存中...</Button>

// ❌ DON'T: 避免過多 filled 按鈕
<Group>
  <Button variant="filled">按鈕 1</Button>
  <Button variant="filled">按鈕 2</Button> {/* 應改為 outline */}
</Group>

// ❌ DON'T: 避免純色文字按鈕 (對比度不足)
<Button variant="ghost" color="matcha">文字</Button> {/* 使用 subtle 替代 */}
```

---

## 2. Card Component

### 2.1 Props Interface

```typescript
import { CardProps as MantineCardProps } from '@mantine/core';

interface VirtualCoachCardProps extends MantineCardProps {
  variant?: 'default' | 'elevated' | 'outline';
  interactive?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
}

// USAGE
<Card
  variant="default"
  interactive
  expanded={isExpanded}
  onToggle={() => setExpanded(!isExpanded)}
>
  <Card.Section>
    {/* 卡片內容 */}
  </Card.Section>
</Card>
```

### 2.2 Visual Specifications

#### Variant: default (預設)

```typescript
const defaultVariant = {
  background: 'white',
  border: '1px solid matcha.1',  // #C8E6C9
  borderRadius: 'md',            // 12px
  padding: 'lg',                 // 16px
  boxShadow: 'xs',               // 淡陰影
  
  // Interactive 狀態
  hover: {
    boxShadow: 'sm',
    borderColor: 'matcha.3',     // #81C784
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease-in-out',
  },
  
  // Expanded 狀態
  expanded: {
    boxShadow: 'sm',
    borderColor: 'matcha.4',     // #66BB6A (強調)
    borderWidth: '2px',
  },
};
```

#### Variant: elevated

```typescript
const elevatedVariant = {
  background: 'white',
  border: 'none',
  borderRadius: 'md',
  padding: 'lg',
  boxShadow: 'md',               // 明顯陰影
  
  hover: {
    boxShadow: 'lg',
    transform: 'translateY(-4px)',
  },
};
```

#### Variant: outline

```typescript
const outlineVariant = {
  background: 'transparent',
  border: '2px solid matcha.2',  // #A5D6A7
  borderRadius: 'md',
  padding: 'lg',
  boxShadow: 'none',
  
  hover: {
    borderColor: 'matcha.4',
    background: 'matcha.0',      // #E8F5E9
  },
};
```

### 2.3 Card Section Layout

```typescript
// 課表卡片結構
<Card variant="default" interactive>
  {/* 標題區 */}
  <Card.Section p="md" withBorder>
    <Group justify="space-between">
      <Text fw={600} size="lg">全身肌力訓練</Text>
      <Badge>30 分鐘</Badge>
    </Group>
  </Card.Section>
  
  {/* 內容區 */}
  <Card.Section p="md">
    <Group gap="xs">
      <Badge variant="outline">啞鈴</Badge>
      <Badge variant="outline">中等難度</Badge>
    </Group>
    <Text size="sm" c="gray.7" mt="sm">
      包含 5 個動作,強化全身肌群...
    </Text>
  </Card.Section>
  
  {/* 操作區 */}
  <Card.Section p="md" withBorder>
    <Button fullWidth>開始訓練</Button>
  </Card.Section>
</Card>
```

### 2.4 Accessibility

```typescript
// Interactive 卡片自動包含
<Card
  role="button"
  tabIndex={0}
  aria-pressed={expanded}
  onClick={onToggle}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onToggle();
    }
  }}
>
  {/* 內容 */}
</Card>

// 焦點樣式
// - 焦點可見: 2px 綠色外框
// - 焦點順序: 按文件流順序
```

### 2.5 Usage Guidelines

```typescript
// ✅ DO: 課表列表使用 default + interactive
<Card variant="default" interactive>
  {/* 課表內容 */}
</Card>

// ✅ DO: 偏好設定卡片使用 elevated
<Card variant="elevated">
  {/* 設定表單 */}
</Card>

// ✅ DO: 展開時增強視覺反饋
<Card expanded={isExpanded}>
  {/* 顯示額外內容 */}
</Card>

// ❌ DON'T: 避免非互動卡片使用 hover 效果
<Card interactive={false}>
  {/* 不應有 hover 樣式 */}
</Card>
```

---

## 3. Badge Component

### 3.1 Props Interface

```typescript
import { BadgeProps as MantineBadgeProps } from '@mantine/core';

interface VirtualCoachBadgeProps extends MantineBadgeProps {
  variant?: 'filled' | 'outline' | 'dot';
  color?: 'matcha' | 'gray' | 'orange' | 'red';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
}

// USAGE
<Badge variant="filled" color="matcha" size="md">
  啞鈴
</Badge>
```

### 3.2 Visual Specifications

#### Variant: filled

```typescript
const filledVariant = {
  background: 'matcha.0',        // #E8F5E9
  color: 'matcha.8',             // #2E7D32
  border: 'none',
  borderRadius: 'xl',            // pill shape
  padding: '4px 12px',
  fontSize: 'sm',                // 14px
  fontWeight: 500,
};

// 色彩變體
const colorVariants = {
  matcha: { background: 'matcha.0', color: 'matcha.8' },
  gray: { background: 'gray.100', color: 'gray.800' },
  orange: { background: '#FFF3E0', color: '#E65100' },
  red: { background: '#FFEBEE', color: '#C62828' },
};
```

#### Variant: outline

```typescript
const outlineVariant = {
  background: 'transparent',
  color: 'matcha.7',
  border: '1px solid matcha.3',
  borderRadius: 'xl',
  padding: '4px 12px',
};
```

#### Variant: dot

```typescript
const dotVariant = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  background: 'transparent',
  color: 'matcha.8',
  
  // 小圓點樣式
  before: {
    content: '""',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'matcha.4',
  },
};
```

### 3.3 Size Specifications

```typescript
const badgeSizes = {
  sm: {
    height: '20px',
    padding: '2px 8px',
    fontSize: '12px',
  },
  md: {
    height: '24px',
    padding: '4px 12px',
    fontSize: '14px',
  },
  lg: {
    height: '28px',
    padding: '6px 16px',
    fontSize: '14px',
  },
};
```

### 3.4 Usage Guidelines

```typescript
// ✅ DO: 器材標籤使用 filled + matcha
<Badge variant="filled" color="matcha">啞鈴</Badge>

// ✅ DO: 時長標籤使用 filled + gray
<Badge variant="filled" color="gray">30 分鐘</Badge>

// ✅ DO: 難度標籤使用 dot (點數表示難度)
<Group gap="xs">
  <Badge variant="dot" color="matcha">●</Badge>
  <Badge variant="dot" color="matcha">●</Badge>
  <Badge variant="dot" color="gray">○</Badge>
</Group>

// ❌ DON'T: 避免過多不同色彩的標籤
<Group>
  <Badge color="matcha">標籤 1</Badge>
  <Badge color="orange">標籤 2</Badge> {/* 混亂 */}
  <Badge color="red">標籤 3</Badge>
</Group>
```

---

## 4. Progress Component

### 4.1 Props Interface

```typescript
import { ProgressProps, RingProgressProps } from '@mantine/core';

interface VirtualCoachProgressProps {
  type: 'linear' | 'circular';
  value: number;               // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'matcha' | 'gray';
  showLabel?: boolean;
  label?: string;
}

// USAGE: Linear Progress
<Progress value={75} size="md" color="matcha" />

// USAGE: Circular Progress (訓練計時器)
<RingProgress
  sections={[{ value: progress, color: 'matcha' }]}
  size={200}
  thickness={8}
  label={<Text size="xl">{timeRemaining}s</Text>}
/>
```

### 4.2 Visual Specifications

#### Type: linear

```typescript
const linearProgress = {
  height: '8px',
  background: 'matcha.1',        // #C8E6C9 (底色)
  borderRadius: 'full',          // 圓角
  
  bar: {
    background: 'matcha.4',      // #66BB6A (進度條)
    borderRadius: 'full',
    transition: 'width 0.3s ease-in-out',
  },
};

// 尺寸變體
const linearSizes = {
  sm: { height: '4px' },
  md: { height: '8px' },
  lg: { height: '12px' },
};
```

#### Type: circular

```typescript
const circularProgress = {
  diameter: {
    sm: 100,
    md: 200,
    lg: 300,
  },
  strokeWidth: {
    sm: 6,
    md: 8,
    lg: 12,
  },
  backgroundStroke: 'matcha.1',  // #C8E6C9
  foregroundStroke: 'matcha.4',  // #66BB6A
  
  // 中心標籤
  label: {
    fontSize: {
      sm: 'lg',
      md: '2xl',
      lg: '4xl',
    },
    fontWeight: 700,
    color: 'matcha.8',
  },
};
```

### 4.3 Animation

```typescript
// Linear Progress 動畫
@keyframes progress-fill {
  from { width: 0%; }
  to { width: var(--progress-value); }
}

.progress-bar {
  animation: progress-fill 0.5s ease-out forwards;
}

// Circular Progress 動畫 (CSS)
@keyframes circular-progress {
  from { stroke-dashoffset: var(--circumference); }
  to { stroke-dashoffset: var(--remaining); }
}

.circular-progress-ring {
  animation: circular-progress 0.5s ease-out forwards;
}
```

### 4.4 Usage Guidelines

```typescript
// ✅ DO: Loading 使用 linear progress
<Stack>
  <Text>載入中...</Text>
  <Progress value={loadingProgress} color="matcha" />
</Stack>

// ✅ DO: 訓練計時器使用 circular progress
<RingProgress
  sections={[{ value: (timeElapsed / totalTime) * 100, color: 'matcha' }]}
  size={200}
  thickness={8}
  label={
    <Stack align="center" gap={0}>
      <Text size="3xl" fw={700}>{timeRemaining}</Text>
      <Text size="sm" c="gray.6">秒</Text>
    </Stack>
  }
/>

// ✅ DO: 顯示進度百分比
<Progress
  value={75}
  label="75%"
  size="lg"
/>

// ❌ DON'T: 避免無限 loading 無進度反饋
<Progress value={undefined} /> {/* 應使用 Loader 或顯示進度 */}
```

---

## 5. Input Component

### 5.1 Props Interface

```typescript
import { TextInputProps, SelectProps } from '@mantine/core';

interface VirtualCoachInputProps extends TextInputProps {
  error?: string;
  helperText?: string;
}

// USAGE
<TextInput
  label="訓練時長"
  placeholder="輸入分鐘數"
  required
  error={errors.duration}
  helperText="建議 20-60 分鐘"
/>
```

### 5.2 Visual Specifications

```typescript
const inputStyles = {
  label: {
    fontSize: 'sm',
    fontWeight: 600,
    color: 'gray.800',
    marginBottom: '6px',
  },
  input: {
    height: '44px',              // 觸控友善
    padding: '12px 16px',
    fontSize: 'md',
    border: '2px solid matcha.2', // #A5D6A7
    borderRadius: 'xs',          // 6px
    background: 'white',
    
    // 狀態
    focus: {
      borderColor: 'matcha.4',
      boxShadow: '0 0 0 3px rgba(102, 187, 106, 0.2)',
      outline: 'none',
    },
    error: {
      borderColor: 'red.500',
    },
    disabled: {
      background: 'gray.100',
      color: 'gray.500',
      cursor: 'not-allowed',
    },
  },
  helperText: {
    fontSize: 'xs',
    color: 'gray.600',
    marginTop: '4px',
  },
  errorMessage: {
    fontSize: 'xs',
    color: 'red.600',
    marginTop: '4px',
  },
};
```

### 5.3 Accessibility

```typescript
// 自動包含的無障礙屬性
<TextInput
  id="duration-input"
  label="訓練時長"
  required
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={helperText ? 'duration-helper' : undefined}
  aria-errormessage={error ? 'duration-error' : undefined}
/>

{helperText && <Text id="duration-helper" size="xs">{helperText}</Text>}
{error && <Text id="duration-error" size="xs" c="red">{error}</Text>}
```

---

## Version Compatibility

- **Mantine Core**: ^7.0.0
- **React**: ^18.0.0 or ^19.0.0
- **Framer Motion**: ^11.0.0 (for advanced animations)

**All component variants validated and ready for implementation.**
