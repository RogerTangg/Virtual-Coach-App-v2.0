# Implementation Plan: Virtual Coach App UI Redesign with Matcha Green Theme

**Branch**: `002-ui-redesign` | **Date**: 2025-11-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-ui-redesign/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

---

## Status

**Phase 1 Complete** ✅ | Generated: 2025-11-15

All implementation artifacts created:
- ✅ `research.md`: 8 comprehensive research topics (Mantine theme, Tailwind integration, Framer Motion, responsive design, accessibility, performance, testing, icons)
- ✅ `data-model.md`: Complete design token schema (colors, typography, spacing, shadows, radius, animation curves)
- ✅ `contracts/design-system-api.md`: Mantine theme API specifications (Provider setup, token access, component customization, responsive utilities, animation, accessibility)
- ✅ `contracts/component-variants.md`: UI component specifications (Button, Card, Badge, Progress, Input variants with visual specs, props interfaces, usage guidelines)
- ✅ `quickstart.md`: Step-by-step setup guide (8 steps: dependencies, theme setup, first component, testing, visual regression, Tailwind integration, accessibility, performance)
- ✅ Agent context updated: Added Mantine + Framer Motion to copilot-instructions.md
- ✅ `tasks.md`: Complete task breakdown (78 tasks organized into 7 phases by user story priority)

**Ready for implementation**. All planning artifacts complete. Execute tasks following tasks.md workflow.

---

## 1. Summary

重新設計 Virtual Coach App 的使用者介面,採用舒適的淡抹綠色作為主要色彩基調,建立完整的設計系統(Design System),包含色彩規範、字體階層、間距系統、圓角標準、陰影系統和動畫規範。透過 React 19.2.0 和 Mantine UI 元件庫實現卡片式佈局、視覺圖示、互動動畫和響應式設計,提升偏好設定、課表展示、訓練播放器三大核心介面的視覺體驗和使用者滿意度。

**Technical Approach**: 使用 Mantine v7 的主題系統(MantineProvider)實現設計令牌(Design Tokens),透過 CSS-in-JS 和 Tailwind CSS 3.4.20 實現綠色系配色和響應式佈局,使用 Mantine 內建元件(Card, Button, Badge, Progress)加速開發並確保 WCAG 2.1 AA 無障礙標準,透過 Framer Motion 實現流暢的過渡動畫和互動效果。

## Technical Context

**Language/Version**: JavaScript ES2022+ with TypeScript 5.8.3 (React 19.2.0)  
**Primary Dependencies**: 
  - React 19.2.0 (UI framework)
  - Mantine v7.x (UI component library)
  - Tailwind CSS 3.4.20 (utility-first CSS)
  - Framer Motion 11.x (animation library)
  - @mantine/hooks (React hooks utilities)
  - @mantine/form (form management)
  
**Storage**: Supabase PostgreSQL (existing, no schema changes for UI redesign)  
**Testing**: Vitest 3.0.0, React Testing Library 16.1.0, Playwright (E2E)  
**Target Platform**: Web (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)  
**Project Type**: Web application (frontend single-page application)  
**Performance Goals**: 
  - FCP < 1.5s (First Contentful Paint)
  - LCP < 2.5s (Largest Contentful Paint)
  - TTI < 3.5s (Time to Interactive)
  - 60fps animations (all transitions and effects)
  
**Constraints**: 
  - Main bundle < 250KB gzipped
  - WCAG 2.1 AA compliance (contrast ratio 4.5:1+)
  - Support 3 responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (≥1024px)
  - Color palette restricted to matcha green theme (#66BB6A, #C8E6C9, #E8F5E9, #2E7D32, #81C784)
  
**Scale/Scope**: 
  - 4 core UI pages (preference form, workout list, training player, completion screen)
  - ~15-20 React components to redesign
  - Design system with ~50 design tokens
  - 3 device breakpoints with responsive layouts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. 程式碼品質標準 (Code Quality Standards)

✅ **模組化設計**: UI 元件遵循單一職責原則,每個元件獨立可重用(Button, Card, Badge, Timer 等)
✅ **程式碼可讀性**: 遵循 ESLint 規範,元件命名清晰語意化(PreferenceCard, WorkoutItem, PlayerControls)
✅ **型別安全**: 使用 TypeScript 5.8.3 定義所有 props, state, design tokens 型別
✅ **錯誤處理**: 所有動畫、互動、圖示載入包含 fallback 和錯誤邊界(Error Boundary)

### II. 測試標準 (Testing Standards)

✅ **組件測試**: 所有 UI 元件必須包含 React Testing Library 測試,驗證渲染、樣式、互動
✅ **整合測試**: 關鍵使用者流程(偏好設定 → 課表展示 → 播放器)包含 E2E 視覺回歸測試(Playwright)
✅ **測試覆蓋率目標**: 設計系統元件測試覆蓋率達 80%+,確保樣式和互動正確性
✅ **測試優先原則**: 關鍵互動(按鈕點擊回饋、動畫觸發、響應式佈局)先寫測試確認需求

### III. 使用者體驗一致性 (User Experience Consistency)

✅ **設計系統**: 建立完整的 Mantine 主題配置,包含 50+ design tokens(colors, spacing, fonts, shadows)
✅ **響應式設計**: 支援 3 個斷點(mobile <768px, tablet 768-1024px, desktop ≥1024px)
✅ **無障礙設計**: 符合 WCAG 2.1 AA 標準(對比度 4.5:1+, 鍵盤導航, ARIA 標籤, 焦點管理)
✅ **載入與回饋**: 所有互動(按鈕點擊、卡片展開、動畫過渡)提供視覺回饋(loading, hover, active states)
✅ **一致性驗證**: PR 包含 Storybook 視覺快照測試和設計 QA checklist

### IV. 效能要求 (Performance Requirements)

✅ **首次內容繪製 (FCP)**: < 1.5 秒(透過 code splitting, CSS 內聯, Mantine lazy loading)
✅ **最大內容繪製 (LCP)**: < 2.5 秒(圖示 SVG 優化, 圖片 WebP 格式, lazy loading)
✅ **互動時間 (TTI)**: < 3.5 秒(最小化初始 JS, Mantine tree-shaking)
✅ **包大小 (Bundle Size)**: 主要 bundle < 250KB gzipped(Mantine 按需導入, Tailwind purge)
✅ **動畫效能**: 所有動畫維持 60fps(使用 CSS transform/opacity, GPU 加速, Framer Motion 優化)
✅ **效能監控**: Lighthouse CI 整合,每次 PR 檢測 Core Web Vitals

**Status**: ✅ **PASS** - All constitution requirements are satisfied by the technical approach

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-redesign/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output: Mantine theme config, Tailwind setup, animation patterns
├── data-model.md        # Phase 1 output: Design Token schema, Component Variant types
├── quickstart.md        # Phase 1 output: Setup Mantine theme, create first component
├── contracts/           # Phase 1 output: Design system API, theme configuration schema
│   ├── design-system-api.md      # Design Token interface, theme provider API
│   └── component-variants.md     # Button/Card/Badge variant specifications
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
virtual_coach_app_frontend/
├── src/
│   ├── theme/                          # 🆕 Design system configuration
│   │   ├── mantineTheme.ts            # Mantine theme provider config
│   │   ├── colors.ts                  # Matcha green color palette
│   │   ├── typography.ts              # Font sizes, weights, line heights
│   │   ├── spacing.ts                 # 4px-based spacing scale
│   │   ├── shadows.ts                 # Three-tier shadow system
│   │   ├── borderRadius.ts            # Corner radius standards
│   │   └── animations.ts              # Timing functions, durations
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx            # ✏️ Redesigned with green theme
│   │   │   ├── Loading.tsx           # ✏️ Green spinner animation
│   │   │   └── Toast.tsx             # ✏️ Green-themed notifications
│   │   │
│   │   ├── preferences/
│   │   │   ├── PreferenceForm.tsx     # ✏️ Card-based layout with icons
│   │   │   ├── PreferenceCard.tsx     # 🆕 Individual preference category card
│   │   │   ├── OptionButton.tsx       # 🆕 Icon + label selection button
│   │   │   └── DurationSlider.tsx     # 🆕 Green-themed slider component
│   │   │
│   │   ├── workout/
│   │   │   ├── WorkoutList.tsx        # ✏️ Card list layout
│   │   │   ├── WorkoutCard.tsx        # ✏️ Enhanced with badges, icons
│   │   │   ├── ExerciseCard.tsx       # ✏️ Expandable card with animations
│   │   │   └── WorkoutSummary.tsx     # 🆕 Top summary badges
│   │   │
│   │   ├── player/
│   │   │   ├── TrainingPlayer.tsx     # ✏️ Immersive dark green background
│   │   │   ├── Timer.tsx              # ✏️ Circular progress ring
│   │   │   ├── PlayerControls.tsx     # ✏️ Transparent control bar
│   │   │   ├── CompletionScreen.tsx   # ✏️ Celebration design
│   │   │   └── VideoPlayer.tsx        # ✏️ Enhanced info overlay
│   │   │
│   │   └── layout/                    # 🆕 Layout components
│   │       ├── AppShell.tsx           # 🆕 Main app container
│   │       └── ResponsiveContainer.tsx # 🆕 Breakpoint-aware wrapper
│   │
│   ├── styles/
│   │   ├── variables.css              # ✏️ CSS custom properties for tokens
│   │   └── global.css                 # ✏️ Global styles with green theme
│   │
│   ├── App.tsx                        # ✏️ Wrap with MantineProvider
│   └── main.tsx                       # ✏️ Import Mantine styles
│
├── public/
│   └── icons/                         # 🆕 SVG icon set
│       ├── goal-muscle.svg            # Muscle building icon
│       ├── goal-fat-loss.svg          # Fat loss icon
│       ├── goal-tone.svg              # Body toning icon
│       ├── equipment-*.svg            # Equipment icons
│       └── ...
│
└── tests/
    ├── visual/                        # 🆕 Visual regression tests
    │   └── component-snapshots.spec.ts
    └── e2e/
        └── ui-flow.spec.ts            # E2E tests with visual checks
```

**Legend**: 🆕 New file | ✏️ Modified file

**Structure Decision**: Web application with frontend-only changes. Using existing `virtual_coach_app_frontend/` structure. New `theme/` directory centralizes design system. Icon assets in `public/icons/`. No backend changes required as this is purely a UI redesign maintaining existing data contracts.

## Complexity Tracking

**Note**: No constitution violations identified. All technical decisions align with code quality, testing, UX consistency, and performance requirements.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| UI Library Choice | Mantine v7 | Provides comprehensive component library with built-in theme system, accessibility support (WCAG AA), and excellent TypeScript support. Reduces development time vs building from scratch while maintaining customization flexibility. |
| Animation Library | Framer Motion | Industry-standard for React animations with declarative API, GPU-accelerated transforms, and excellent performance (60fps capable). Complements Mantine's static components. |
| Dual Styling Approach | Mantine CSS-in-JS + Tailwind utilities | Mantine for component-level theming and design tokens, Tailwind for rapid utility styling and responsive layouts. Both tools complement each other without conflict. |
| Design Token Format | TypeScript objects + CSS variables | TypeScript provides type safety and autocomplete in code, CSS variables enable runtime theming and consistency. Hybrid approach maximizes benefits of both. |

**Complexity Justification**: None required - all choices follow established best practices and constitution principles.
