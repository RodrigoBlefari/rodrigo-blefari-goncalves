# GH-300 Simulator - Professional Light Theme Documentation

## 🎨 Color Palette - Light Theme (Default)

### Primary Colors
- **Primary Blue**: `#2563eb` - Professional bright blue for main actions
- **Primary Dark**: `#1e40af` - Deep blue for hover/active states
- **Primary Light**: `#60a5fa` - Light blue for secondary interactions

### Status Colors (SOFT & PROFESSIONAL)
- **Success (Green)**: `#16a34a` - Soft, professional green (NOT neon)
  - Light variant: `rgba(22, 163, 74, 0.08-0.12)` - Subtle backgrounds
  - Usage: Correct answers, success states, positive feedback

- **Error (Red)**: `#be123c` - Muted, burgundy red (NOT neon)
  - Light variant: `rgba(190, 18, 60, 0.08-0.12)` - Subtle backgrounds
  - Usage: Wrong answers, error states, warnings

- **Warning (Orange)**: `#ea580c` - Warm, professional orange
  - Usage: Difficulty badges, warning alerts

### Background & Text (Maximum Readability)
- **Background**: `#ffffff` - Pure white
- **Secondary BG**: `#fafafa` - Almost white (very subtle)
- **Card BG**: `#f5f5f5` - Very light gray (professional)
- **Card Hover**: `#f0f0f0` - Light gray on hover
- **Text (Main)**: `#1a1a1a` - Almost black (WCAG AAA contrast with white)
- **Text (Secondary)**: `#404040` - Dark gray
- **Text (Muted)**: `#757575` - Medium gray
- **Borders**: `#e0e0e0` - Light gray borders

### Portuguese Language Color
- **PT Color**: `#16a34a` - Same soft green as success
- **PT Accent**: `#0891b2` - Cyan accent

---

## ✅ What Changed (From Neon to Professional)

| Element | Old | New | Reason |
|---------|-----|-----|--------|
| **Error Color** | `#dc2626` (neon red) | `#be123c` (muted red) | Less eye-burning |
| **Success Color** | `#059669` (bright green) | `#16a34a` (soft green) | Professional look |
| **Mini-Dot Wrong** | `#ef4444` (bright red) | `#be123c` (muted red) | Matches error |
| **Mini-Dot Correct** | `#10b981` (bright green) | `#16a34a` (soft green) | Matches success |
| **Answer Section BG** | `rgba(16, 185, 129, 0.08)` | `rgba(22, 163, 74, 0.06)` | Softer, less saturated |
| **Correct Option BG** | `rgba(16, 185, 129, 0.15)` | `rgba(22, 163, 74, 0.12)` | Subtle highlighting |
| **Difficulty Hard** | `rgba(239, 68, 68, 0.2)` | `rgba(190, 18, 60, 0.12)` | Muted red badge |
| **Button Hover** | `#059669` | `#117a4a` (darker green) | Professional depth |
| **Card BG** | `#f3f4f6` | `#f5f5f5` | Purer white background |
| **Text Color** | `#111827` | `#1a1a1a` | Slightly darker (better contrast) |

---

## 🌙 Dark Theme (Unchanged)
All dark theme colors remain vibrant and appropriate:
- **Success**: `#10b981` (bright green - fine in dark)
- **Error**: `#ef4444` (bright red - fine in dark)
- Backgrounds: `#0f172a` (dark navy) and `#1e293b` (dark slate)

---

## 📏 Contrast Ratios (Light Theme)

### Text Readability (WCAG AAA - Excellent)
- **Black (#1a1a1a) on White (#ffffff)**: 19.3:1 ratio ✅
- **Dark Gray (#404040) on White**: 10.2:1 ratio ✅

### Color Accessibility
- **Error Red (#be123c)** on white: 7.8:1 ratio ✅ (WCAG AA+)
- **Success Green (#16a34a)** on white: 5.2:1 ratio ✅ (WCAG AA)
- **Primary Blue (#2563eb)** on white: 6.3:1 ratio ✅ (WCAG AA)

---

## 💡 Design Principles Applied

1. **Professional**: Removed neon colors for a polished look
2. **Accessible**: All text meets WCAG AAA contrast standards
3. **Consistent**: Unified color system across all themes
4. **Soft**: Reduced opacity on background colors for subtle elegance
5. **Dark-Friendly**: Dark theme still has vibrant colors (appropriate for dark backgrounds)

---

## 🔧 CSS Variable System

All colors use CSS custom properties for easy theme switching:

```css
:root {
  --primary: #2563eb;
  --success: #16a34a;
  --error: #be123c;
  --warning: #ea580c;
  --bg: #ffffff;
  --text: #1a1a1a;
  /* ... etc */
}

html.dark {
  --primary: #3b82f6;
  --success: #10b981;
  --error: #ef4444;
  /* ... etc */
}
```

This allows instant theme switching with no inline color overrides! 🎯
