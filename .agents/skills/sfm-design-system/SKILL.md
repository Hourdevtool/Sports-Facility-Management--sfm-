---
name: sfm-design-system
description: SFM (Sports Facility Management) official design system skill. Read before creating or editing any UI, page, or component in this project. Enforces brand colors, typography (Bai Jamjuree & Anuphan), existing UI primitives, and strict lucide-react-only icon usage.
---

# SFM Design System

Use this design system whenever building or updating UI in **SFM (Sports Facility Management)**.
Reuse existing Tailwind v4 `@theme` tokens in `app/globals.css`, font setup in `app/layout.tsx`, and primitives in `app/components/ui/` before introducing new styles.

---

## 1. Color Palette

All core tokens are defined in `app/globals.css` (`@theme`).

### Brand & Accent Colors
| Role | Token / Class | Hex | Usage |
|---|---|---|---|
| **Brand Blue (น้ำเงินหลัก)** | `--color-brand-blue` (`brand-blue`) | `#2563EB` | Primary brand identity, active highlights, icon accents, interactive focus |
| **Button Primary / Hover** | `--color-button-primary` (`button-primary`) | `#3C55D0` | Secondary/action buttons, pill hover state (`หลังวางเมาส์`), circular info/user/pending icon badges |
| **Deep Navy Card** | `--color-card` (`card`) | `#262873` | High-emphasis dark cards, navy buttons, outline borders on light tint buttons |
| **Footer Surface** | `--color-footer-bg` (`footer-bg`) | `#161942` | Global footer background, floating scroll-to-top button |
| **Brand Yellow (เหลืองหลัก)** | `--color-brand-yellow` (`brand-yellow`) | `#FDD60A` | Primary CTA buttons (with black text), highlight cards, active dark-surface icons |
| **Brand Card Yellow** | `--color-brand-card` (`brand-card`) | `#FEC20A` | Warm yellow accent card surface |
| **Accent Volt Yellow (เหลืองนีออน)** | — (brand board accent) | `#A8FF00` | Logo accent and high-energy sport highlight (use sparingly; never as body text on white) |

### Gold Scale (`Gold1: #E5C100`)
Defined in `app/globals.css` for warm tonal surfaces, badges, and gold button variants:
- `gold-50`: `#FEFCF3` (lightest card tint)
- `gold-100`: `#FCF6DB`
- `gold-200`: `#F9EBB3`
- `gold-300`: `#F5DC83` (gold card border)
- `gold-400`: `#F0CB53` (gold button default)
- `gold-500`: `#E5C100` (**Gold1** — gold button hover / primary gold swatch)
- `gold-600`: `#B89300` (gold icon color)
- `gold-700`: `#8C6A00`
- `gold-800`: `#664B03`
- `gold-900`: `#3D2B02` (gold card heading/value text)

### Semantic & Neutral Colors
| Role | Hex / Tailwind | Usage |
|---|---|---|
| **Page Background** | `#FFFFFF` (`bg-white`) | Default application canvas |
| **Navbar Surface** | `#0A0A0A` (`bg-[#0a0a0a]`) | Top floating notch navbar |
| **Search / Soft Input** | `#E5DFDF` (`bg-[#E5DFDF]` / `bg-neutral-200/80`) | Search bar fill with muted gray placeholder (`#8C8C8C` / `text-neutral-500`) |
| **Light Tint Button** | `#E5E7F0` with `#262873` border | Soft secondary/outlined pill or button surface |
| **Destructive / Delete** | `#991B1B` (`bg-red-800`) | Delete icon badge (`Trash2`) and destructive actions |
| **Primary Text (Light BG)** | `#0F172A` (`text-slate-900`) / `#000000` | Headings, stat values, text on yellow/gold |
| **Secondary Text (Light BG)** | `#64748B` (`text-slate-500`) | Card labels, helper text, subtitles |
| **Primary Text (Dark BG)** | `#FFFFFF` (`--color-brand-text`) | Text on navy (`#262873`), blue (`#2563EB`), footer (`#161942`), navbar (`#0A0A0A`) |

### Color Rules
- **Contrast First:** Always use dark text (`text-black` or `text-gold-900`) on `brand-yellow`, `gold-400`, `gold-500`, and `#A8FF00`. Never put white text on yellow or gold.
- **Reuse Tokens:** Prefer Tailwind theme utilities (`bg-brand-blue`, `bg-brand-yellow`, `bg-card`, `bg-button-primary`, `bg-gold-*`) over hardcoded hex values.

---

## 2. Typography

Configured in `app/layout.tsx` via `next/font/google` (subsets: `thai`, `latin`) and mapped in `app/globals.css`.

- **Primary Font (`font-primary` / `font-sans`):** `Bai Jamjuree` (`--font-bai-jamjuree`) — weights `400`, `500`, `600`, `700`
  - **Use for:** Headings, brand title (`SFM`), primary buttons, navigation labels, KPI / stat numbers.
- **Secondary Font (`font-secondary`):** `Anuphan` (`--font-anuphan`) — weights `200`, `300`, `400`, `500`, `600`, `700`
  - **Use for:** Body paragraphs, card titles/units, form labels, descriptions, table details, footer copy.

### Type Hierarchy
- **Stat / KPI Value:** `font-primary font-bold text-3xl sm:text-4xl leading-tight tracking-tight`
- **Section Heading:** `font-primary font-bold text-2xl sm:text-3xl tracking-tight`
- **Card / Component Title:** `font-secondary font-medium text-sm sm:text-base`
- **Body Copy:** `font-secondary font-normal text-sm sm:text-base leading-relaxed`
- **Caption / Unit / Meta:** `font-secondary font-normal text-xs sm:text-sm`

---

## 3. Icons (`lucide-react` ONLY)

> **STRICT RULE:** All UI icons in this project **MUST** be imported from **`lucide-react`** only.
> - **DO NOT** write raw hand-coded `<svg>` paths for UI icons.
> - **DO NOT** install or mix other icon libraries (Heroicons, FontAwesome, react-icons, etc.).
> - **DO NOT** use emojis as UI icons.
> - *(Exception: Brand logo `/icon.svg` and structural SVG masks like navbar concave corners.)*

### Standard Icon Mapping (from SFM Brand Board)
| Meaning / UI Use | `lucide-react` Component | Default Style / Badge |
|---|---|---|
| Menu / Navigation | `Menu` | Outline (`strokeWidth={1.75}`–`2`), dark slate `#1E293B` |
| Booking / Schedule | `Calendar` | Outline, `w-5 h-5` |
| Report / Milestone | `Flag` | Outline, `w-5 h-5` |
| Download / Export | `Download` | Outline, `w-5 h-5` |
| Operating Hours / Timer | `AlarmClock` | Outline, `w-5 h-5` |
| Feedback / Comments | `MessageCircleMore` | Outline, `w-5 h-5` |
| Notifications | `Bell` | Outline, `w-5 h-5` |
| Search Input | `Search` | `w-4 h-4 text-neutral-500` |
| Image / Media Upload | `Image` | Dark navy/slate or muted neutral |
| Warning / Issue Alert | `TriangleAlert` | Dark slate or amber/red semantic state |
| User / Profile Badge | `User` | White icon inside `rounded-full bg-button-primary` (`#3C55D0`) |
| Pending / In-Progress Badge | `Hourglass` | White icon inside `rounded-full bg-button-primary` (`#3C55D0`) |
| Delete / Remove Action | `Trash2` | White icon inside `rounded-full bg-red-800` (`#991B1B`) |

### Icon Sizing & Accessibility
- Inline / input / button icons: `size={16}` (`w-4 h-4`) or `size={18}` (`w-[18px] h-[18px]`).
- Navigation / toolbar / card header icons: `size={20}` (`w-5 h-5`).
- Icon-only buttons must always include `aria-label` (in Thai matching the UI copy).

---

## 4. Existing UI Components (Reuse First)

Before creating new UI primitives, use or extend the existing components:

1. **Buttons** — `app/components/ui/Button.tsx`
   - Variants: `primary` (`brand-yellow`, black text), `secondary` (`button-primary`, white text), `gold` (`gold-400` → `gold-500` hover), `outline` (transparent with border).
   - Sizes: `default` (`145×37px`), `sm` (`110×32px`), `lg` (`180×44px`), `auto`, `full`.
   - Radius: `rounded-[10px]`, active feedback `active:scale-[0.98]`.
   - Action / Status Pills (from brand board): `rounded-full`, default dark blue (`#0038A8` / `bg-brand-blue`), hover `bg-button-primary` (`#3C55D0`), destructive circular action `rounded-full bg-red-800 text-white`.

2. **Cards & Stat Cards** — `app/components/ui/Card.tsx`
   - Exports `Card` and `StatCard` (supports `icon`, `title`, `value`, `unit`, `extra`).
   - Variants: `default` (clean white, subtle shadow `0_4px_24px_rgba(0,0,0,0.05)`), `primary` (`bg-card` `#262873`), `blue` (`bg-brand-blue`), `yellow` (`bg-brand-yellow`), `gold` (`bg-gold-50` + `border-gold-300`), `outline`.
   - Radii: `sm` (`18px`), `default`/`full` (`22px`), `lg` (`26px`), `auto` (`20px`).

3. **Search Input** (from brand board)
   - Soft neutral pill/rounded container: `rounded-xl bg-[#E5DFDF] px-3.5 py-2.5 flex items-center gap-2.5`.
   - Leading `<Search className="w-4 h-4 text-neutral-500 shrink-0" />` from `lucide-react`.
   - Focus state: `focus-within:ring-2 focus-within:ring-brand-blue/40`.

4. **Navigation & Footer**
   - `app/components/Navbar.tsx`: Fixed centered dark notch (`#0a0a0a`) with `/icon.svg` brand mark and pill nav items.
   - `app/components/Footer.tsx`: `bg-footer-bg` (`#161942`) 4-column layout with `brand-yellow` hover accents.

---

## 5. Layout, Shapes & Motion

- **Max Width:** `max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12`
- **Corner Radius Hierarchy:**
  - Buttons / inputs: `10px`–`12px` (`rounded-[10px]` / `rounded-xl`)
  - Action pills & icon badges: `rounded-full`
  - Cards: `18px`–`26px` (`rounded-[18px]` to `rounded-[26px]`)
- **Motion:** Keep micro-interactions crisp (`duration-200`, `active:scale-[0.98]`). Respect `prefers-reduced-motion` when using GSAP animations.

---

## 6. Do's and Don'ts

### Do
- **Do** import every UI icon exclusively from `lucide-react`.
- **Do** use `font-primary` (`Bai Jamjuree`) for headings, buttons, and KPI numbers, and `font-secondary` (`Anuphan`) for body text and labels.
- **Do** reuse `Button`, `Card`, and `StatCard` from `app/components/ui/` and color tokens from `app/globals.css`.
- **Do** preserve high contrast (black/dark text on yellow and gold surfaces; white text on navy/blue/red surfaces).

### Don't
- **Don't** use inline hand-coded `<svg>` icons, emojis, or any icon package other than `lucide-react`.
- **Don't** introduce unrelated brand colors or fonts outside the SFM palette and `Bai Jamjuree` / `Anuphan`.
- **Don't** duplicate button or card markup when `app/components/ui/Button.tsx` or `Card.tsx` already covers the variant.
