---
name: Obsidian Tech & Apex Precision
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#ccc3d8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#958da1'
  outline-variant: '#4a4455'
  surface-tint: '#d2bbff'
  primary: '#d2bbff'
  on-primary: '#3f008e'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#732ee4'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#905b00'
  on-tertiary-container: '#ffe1c0'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  headline-sm:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-tabular:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.25rem
  margin: 1rem
  margin-desktop: 2rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system establishes a high-performance, developer-grade aesthetic calibrated for mission-critical automation and financial flows. Drawing inspiration from modern high-craft product standards (Vercel, Linear, Raycast, and Stripe Dashboard), it delivers an uncompromising dark mode experience anchored in pure carbon foundations and precise mechanical clarity.

### Personality & Demeanor
- **Surgical Precision:** Every pixel, edge, and tabular numeral conveys absolute operational control and low-latency feedback.
- **Understated Dominance:** The presence is quiet, dark, and lethal, leaning into tonal graphite layers rather than gratuitous decorations or exaggerated ambient light blooms.
- **High-Density Utility:** Tailored for operators, power users, and engineers who demand immediate spatial parsing of financial telemetry, bot automation lifecycles, and transaction statuses without visual clutter.

### Design Movement: Technical Dark Minimalism
The visual execution fuses carbon minimalism with micro-structural affordances: razor-thin sub-pixel borders (`1px solid #222226`), crisp specular rim lighting (`border-t border-white/[0.07]`), restrained violet acceleration points, and monospaced numeric data. Tactility is achieved through subtle surface tiering rather than heavy elevation or loud drop shadows.

## Colors

The palette is engineered exclusively around an ultra-dark carbon foundation with precision-mapped semantic accents and a distinct Puma Violet core.

### Surface Architecture
- **Root Canvas (Carbon Dark):** `#09090B` — Base application backdrop across all main viewports.
- **Structural Containers (Sidebar & Base Cards):** `#111113` — Distinct low-luminance layer for navigation bars, modular panels, and tables.
- **Elevated Interactive Surfaces:** `#18181B` — Hover states, modal sheets, dropdown popovers, and elevated stat widgets.
- **Technical Structural Dividers:** `1px solid #222226` — Default boundary for all cards, table headers, and split panes.
- **Micro Highlight Rim:** `rgba(255, 255, 255, 0.07)` applied as an interior top border (`inset 0 1px 0 0`) for architectural depth.

### Puma Violet (Brand Primary)
- **Primary Base:** `#7C3AED` — Default interactive buttons, active state toggles, and primary indicators.
- **Primary Hover / Light:** `#8B5CF6` — Interactive hover states and active focus indicators.
- **Primary Highlight:** `#A855F7` — Micro accents, progress highlights, and precision focus rings.
- **Primary Subdued:** `rgba(124, 58, 237, 0.12)` — Subtle background fills for selected items and active row indicators.

### Transactional & Semantic Accents (PIX Operations)
- **Approved / Success (Emerald):** `#10B981` (Solid text/icon), `rgba(16, 185, 129, 0.12)` (Pill fill), `rgba(16, 185, 129, 0.25)` (Border).
- **Pending / In Flight (Amber):** `#F59E0B` (Solid text/icon), `rgba(245, 158, 11, 0.12)` (Pill fill), `rgba(245, 158, 11, 0.25)` (Border).
- **Blocked / Failed (Ruby):** `#EF4444` (Solid text/icon), `rgba(239, 68, 68, 0.12)` (Pill fill), `rgba(239, 68, 68, 0.25)` (Border).

### Neutral Scale
- **Text Dominant:** `#F4F4F5` — Primary metrics, critical labels, and headings.
- **Text Secondary:** `#A1A1AA` — Subtext, table field descriptors, and timestamps.
- **Text Muted:** `#71717A` — Placeholders, inactive breadcrumbs, and shortcut hints.

## Typography

Typography prioritizes high reading velocity, geometric rigidity, and zero jitter during real-time data streaming.

### Font System Division
- **Headlines & Structural Titles (`Geist`):** Delivers precise modern geometry and neutral proportions for viewport anchors, widget titles, and navigation headers.
- **Interface & Operational Text (`Inter`):** Handles UI body copy, input form controls, tooltips, and secondary operational details. Rendered with negative tracking (`-0.01em` to `-0.015em`) for a compact technical tone.
- **Monospaced Data & Telemetry (`JetBrains Mono`):** Dedicated to PIX keys, transaction hashes, timestamps, token payloads, and financial figures. Must always declare `font-variant-numeric: tabular-nums` to eliminate width shifting on streaming metric updates.

### Type Hierarchy Principles
1. Heading line-heights are tightly coupled (1.2 to 1.25x) to maintain a modern compact feel.
2. Micro labels (`label-badge`) are kept strictly at 11px uppercase with `+0.04em` tracking for instant readability at glance.
3. Contrast is created through color decay (`#F4F4F5` down to `#71717A`) rather than dramatic weight variance.

## Layout & Spacing

The layout is built for high information density, rapid visual scanning, and rigid screen economy. It utilizes an adaptive fluid grid with hard outer boundaries.

### Layout Philosophy
- **Desktop (1024px+):** Fixed 240px or collapsible 64px left navigation sidebar docked directly adjacent to an auto-stretching canvas container. Grid areas use 12 columns with 20px (`1.25rem`) gutters, optimized for 3-up metric cards and dual-pane transaction monitors.
- **Tablet (768px – 1023px):** Condensed 6-column grid with 16px gutters; sidebar converts to an off-canvas drawer or top toolbar navigation.
- **Mobile (< 768px):** Single-column stack with 16px page margins. Metrics reflow to horizontal scroll tracks or full-width stacked panels.

### Spacing Density Principles
- Component inner paddings are tight and purposeful: `0.5rem` (`space-sm`) on input fields, `0.75rem` (`space-md`) on list items, and `1rem` to `1.25rem` on cards.
- Vertical space between card headers and contents is standardized to `0.75rem` to keep telemetry data tightly bound to its contextual title.

## Elevation & Depth

Visual hierarchy does not use diffuse blurs or exaggerated neon drop shadows. Instead, depth is conveyed through **tonal stacking**, **chiseled micro-borders**, and **specular rim lights**.

### The Multi-Tier Surface Stack
1. **Base Layer (`#09090B`):** The ground plane.
2. **First Tier (`#111113`):** Canvas containers, sidebars, dashboard grid cards, and data tables. Outlined with `1px solid #222226`.
3. **Second Tier (`#18181B`):** Modal dialogs, contextual command palettes (CMD+K), and flyout dropdown menus.

### The Linear/Raycast Rim Highlight
To simulate an industrial hardware bevel in pure CSS without muddy shadow artifacts:
- Apply `border: 1px solid #222226` to card outlines.
- Apply an inner edge highlight: `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.07)`.
- On interactive card hover, transition the border color to `#2E2E34` and increment the top rim light to `rgba(255, 255, 255, 0.12)`.

### Drop Shadows
Reserved strictly for floating overlays (modals and tooltips):
- `box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.65), 0 0 0 1px #222226`.
- Never apply blurred neon glows to Violet accent elements or status indicators.

## Shapes

The geometric framework is sharp, architectural, and restrained. Circular or high-radius pill buttons are forbidden for primary UI cards and inputs.

### Geometric Constraints
- **Micro Radius (2px - 4px):** Badges, status pills, inline code tags, and small utility indicators.
- **Component Base (6px):** Form controls, text input boxes, dropdown trigger items, and buttons.
- **Structural Containers (8px - 12px):** Data tables, cards, stat panels, and dialog sheets. The absolute maximum radius allowed across the system is 12px (`rounded-xl` equivalent).

This restrained radius ensures lines remain crisp, borders don't distort adjacent layouts, and the interface matches high-craft desktop utilities.

## Components

### 1. Buttons
- **Primary (Violet):** Background `#7C3AED`, color `#FFFFFF`, border `1px solid #8B5CF6`, subtle top specular line `inset 0 1px 0 0 rgba(255, 255, 255, 0.20)`. Hover: `#8B5CF6`. Active: `#6D28D9`.
- **Secondary (Carbon Tech):** Background `#18181B`, color `#F4F4F5`, border `1px solid #222226`, top specular rim `inset 0 1px 0 0 rgba(255, 255, 255, 0.07)`. Hover: `#222226`.
- **Ghost / Icon Utility:** Background transparent, color `#A1A1AA`. Hover: Background `#18181B`, color `#F4F4F5`.
- **Dimensions:** 32px default height (high-density compact), 6px border-radius, font-size 13px font-weight 500.

### 2. Status Badges (PIX Telemetry)
Compact indicators (22px height) featuring a live status beacon dot (6px) and semibold monospaced or uppercase Inter text:
- **Aprovado (Approved):**
  - Dot: Solid `#10B981`.
  - Pill Background: `rgba(16, 185, 129, 0.10)`.
  - Border: `1px solid rgba(16, 185, 129, 0.25)`.
  - Label: `#10B981`, font-size 11px.
- **Pendente (Pending):**
  - Dot: Solid `#F59E0B`.
  - Pill Background: `rgba(245, 158, 11, 0.10)`.
  - Border: `1px solid rgba(245, 158, 11, 0.25)`.
  - Label: `#F59E0B`, font-size 11px.
- **Bloqueado (Blocked/Failed):**
  - Dot: Solid `#EF4444`.
  - Pill Background: `rgba(239, 68, 68, 0.10)`.
  - Border: `1px solid rgba(239, 68, 68, 0.25)`.
  - Label: `#EF4444`, font-size 11px.

### 3. Cards & Panels
- **Structure:** Background `#111113`, border `1px solid #222226`, radius `10px`, inner top highlight `inset 0 1px 0 0 rgba(255, 255, 255, 0.07)`.
- **Card Header:** Border bottom `1px solid #222226`, padding `12px 16px`. Title rendered in `Geist` 14px 500 weight (`#F4F4F5`), accompanied by secondary metadata or timestamp.
- **Body:** Padding `16px`. Tabular metrics aligned with monospaced counters.

### 4. Input Fields & Search Bars
- **Frame:** Background `#09090B`, border `1px solid #222226`, radius `6px`, height `34px`, padding `0 10px`.
- **Text:** Font `Inter`, 13px, color `#F4F4F5`. Placeholder color `#71717A`.
- **Focus State:** Border color `#7C3AED`, outline `1px solid #7C3AED`, with zero diffuse glow.

### 5. Data Tables & Lists
- **Header Row:** Height 32px, background `#09090B`, border bottom `1px solid #222226`, text 11px uppercase `Inter` with `tracking-wider` and color `#71717A`.
- **Data Rows:** Height 44px, background transparent, border bottom `1px solid rgba(34, 34, 38, 0.6)`. Hover: Background `#141416`.
- **Numeric Fields:** Rendered using `JetBrains Mono` with `tabular-nums` right-aligned.

### 6. Interactive Toggles & Controls
- **Track:** 36px width, 20px height, background `#222226`, border `1px solid #2E2E34`. Checked: Background `#7C3AED`, border `#8B5CF6`.
- **Thumb:** 16px diameter, pure white `#FFFFFF`, radius `4px` or `9999px`, transitions with snappy duration (`150ms cubic-bezier(0.16, 1, 0.3, 1)`).