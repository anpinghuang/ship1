# ShipInPublic — Design System

> A single reference document for colors, typography, components, and patterns used across the entire application. Update this whenever new patterns are standardized.

---

## 🎨 Color Palette

### Base

| Token | Value | Usage |
|-------|-------|-------|
| Page background | `#FFFFFF` | Root page bg, all sections |
| Surface light | `#FAFAFA` | Feature cards, elevated surfaces |
| Surface mid | `#F3F4F6` | Card headers, icon backgrounds |

### Text

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#111111` | Headings, primary text, labels |
| Secondary | `#374151` | Body copy in cards |
| Muted | `#6B7280` | Subtitles, descriptions, nav links |
| Dimmed | `#9CA3AF` | Fine print, timestamps, placeholders |

### Borders / Dividers

| Token | Value | Usage |
|-------|-------|-------|
| Light | `#F3F4F6` | Section dividers, subtle card edges |
| Standard | `#E5E7EB` | Card borders, table dividers, inputs |

### Accent

| Token | Value | Usage |
|-------|-------|-------|
| Primary action | `#111111` | CTA buttons, active states, icons |
| Hover | `#333333` | Button hover state |
| Destructive | `text-red-500` | Delete actions, error states |

---

## 🔤 Typography

**Font families:**
- **Sans**: `Geist` (variable: `--font-geist-sans`) — all body and UI text
- **Mono**: `Geist Mono` (variable: `--font-geist-mono`) — code labels, timestamps

**Scale:**

| Size class | Use case |
|------------|----------|
| `clamp(2.5rem, 6vw, 4rem)` | Hero H1 (fluid, responsive) |
| `text-3xl` / `text-4xl` | Section H2 headings |
| `text-xl` / `text-lg` | Card H3 sub-headings |
| `text-base` | Body copy, CTA button text |
| `text-sm` | Secondary copy, card descriptions |
| `text-xs` | Badges, section labels, fine print |
| `text-[14px]` | Navbar links |

**Font weights:**
- `font-extrabold` — Hero H1 only
- `font-bold` — H2, H3, card titles, logo
- `font-semibold` — CTA button labels, nav active
- `font-medium` — Nav links, secondary buttons
- `font-normal` — Body text

**Tracking:** `tracking-tight` on all headings; `tracking-wider` / `tracking-[0.2em]` on uppercase labels.

---

## 🧩 Components

### Primary CTA Button

```tsx
<Link
  href="/login"
  className="inline-flex items-center gap-2 text-base font-semibold text-white bg-[#111111] hover:bg-[#333333] rounded-full px-8 py-3.5 transition-colors"
>
  Get started free
  <ArrowRight className="w-4 h-4" />
</Link>
```

**Rules:**
- Solid black `#111111`, no gradients
- `rounded-full`
- Always include `ArrowRight` icon
- `hover:bg-[#333333]`

---

### Navbar CTA Button

```tsx
<Link
  href="/login"
  className="text-[14px] font-medium text-white bg-[#111111] hover:bg-[#333333] rounded-full px-5 py-2 transition-colors"
>
  Sign Up
</Link>
```

**No arrow icon. Compact sizing.**

---

### Section Label

```tsx
<p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.2em] mb-3">
  Features
</p>
```

**No pill/badge. Plain uppercase text.**

---

### Card (Feature, Dashboard, Settings)

```tsx
<div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#D1D5DB] transition-colors">
  ...
</div>
```

**Rules:**
- Light background `#FAFAFA` or white `#FFFFFF`
- Border `#E5E7EB`
- `rounded-2xl` for large cards, `rounded-xl` for dashboard cards
- No glassmorphism. No shadows except subtle `shadow-sm` if needed.

---

### Dashboard Action Button (Primary)

```tsx
<Button className="h-10 bg-[#111111] text-white hover:bg-[#333333] rounded-lg font-medium px-4">
  <Github className="mr-2 h-4 w-4" /> Sync GitHub
</Button>
```

---

### Dashboard Action Button (Outline)

```tsx
<Button variant="outline" className="h-10 border-[#E5E7EB] bg-white text-[#111111] hover:bg-[#F3F4F6] rounded-lg font-medium px-4">
  <Plus className="mr-2 h-4 w-4" /> Manual Post
</Button>
```

---

### FAQ Accordion

```tsx
<div className="rounded-2xl border border-[#E5E7EB] overflow-hidden">
  <details className="group border-b border-[#E5E7EB] last:border-b-0">
    <summary className="flex items-center justify-between px-6 py-5 text-base font-semibold text-[#111111] cursor-pointer list-none gap-4 hover:bg-[#FAFAFA] transition-colors">
      Question text
      <span className="shrink-0 w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] transition-transform group-open:rotate-45 text-xl leading-none font-light">+</span>
    </summary>
    <div className="px-6 pb-5 text-sm text-[#6B7280] leading-relaxed">
      Answer text
    </div>
  </details>
</div>
```

---

## 📐 Layout & Spacing

| Token | Value |
|-------|-------|
| Max content width | `max-w-6xl` (landing), `max-w-5xl` (dashboard) |
| Section vertical padding | `py-20 md:py-28` |
| Section horizontal padding | `px-6` |
| Footer padding | `py-16` |
| Card border radius | `rounded-2xl` (large), `rounded-xl` (dashboard) |
| Navbar height | `h-16` |

---

## ♿ Accessibility

- `prefers-reduced-motion` disables all transitions/animations globally (in `globals.css`)
- `suppressHydrationWarning` on `<html>`
- `selection:bg-black/10` for text selection color

---

## 📦 Icon Library

**`lucide-react`** — used exclusively.

Core icons: `ArrowRight`, `Check`, `Code2`, `Clock`, `Github`, `MessageSquare`, `Send`, `Zap`

---

## 🚫 Don'ts

- Do **not** use cyan/blue gradients (`#31d9f6`, `#1283D4`)
- Do **not** use `glassStyle` or glassmorphism effects
- Do **not** use `.tech-grid` or `.grain` background patterns
- Do **not** use radial gradient glows
- Do **not** use dark backgrounds (`#0A0D14`, `#111827`, `#050505`)
- Do **not** apply colored accents to buttons — monochrome only
