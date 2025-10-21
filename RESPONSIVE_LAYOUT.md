# Responsive Layout Design

**Optimized for split-screen gaming and multi-viewport usage**

---

## Overview

The dashboard now features a **fully responsive layout** that adapts intelligently from mobile phones to ultrawide monitors, with special optimization for **split-screen browser windows** commonly used by gamers.

---

## Breakpoint Strategy

### 📱 Mobile (<640px)
**Target:** Phones, portrait tablets
**Layout:**
- Single column
- Bottom navigation bar (fixed)
- Hamburger menu for full menu access
- Compact stats grid (1 column)
- Full-width content cards

### 📲 Tablet (640px - 1024px)
**Target:** Tablets, small laptops, **50% split-screen on 1920px displays**
**Layout:**
- Bottom navigation bar
- Collapsible left sidebar (hamburger menu)
- No right sidebar
- 2-column stats grid
- Optimized card spacing

### 💻 Small Desktop / Split-Screen (1024px - 1280px)
**Target:** Laptops, **split-screen gaming setups**
**Layout:**
- Left sidebar visible (fixed)
- No right sidebar (social features deprioritized)
- Full content area
- 3-column stats grid
- Optimized for 50-75% browser width

### 🖥️ Desktop (1280px - 1536px)
**Target:** Standard desktop monitors
**Layout:**
- Left sidebar visible
- Right sidebar hidden (can be toggled)
- Spacious main content
- 3-column stats grid

### 🖥️ Large Desktop (1536px+)
**Target:** Large monitors, ultrawide displays
**Layout:**
- Full three-column layout
- Left sidebar (Operations)
- Main content (primary focus)
- Right sidebar (Social)
- 4-column stats grid
- Maximum information density

---

## Layout Components

### Top Banner
```tsx
// Always visible at top
// Responsive height and padding
<TopBanner />
```

### Left Sidebar (Operations)
**Desktop (>1024px):**
- Fixed width: 256px (w-64)
- Vertical layout
- Full navigation labels

**Mobile/Tablet (<1024px):**
- Slide-in drawer (hamburger menu)
- Fixed overlay when open
- Transforms from left: `-translate-x-full` → `translate-x-0`

### Bottom Navigation
**Mobile/Tablet (<1024px):**
- Fixed bottom bar
- Horizontal icon grid
- 6 navigation items
- Active state highlighting
- Compact labels

**Desktop (>1024px):**
- Hidden (`lg:hidden`)

### Right Sidebar (Social)
**Large Desktop only (>1536px):**
- Fixed width: 256px (w-64)
- Social features (messages, notifications)
- Hidden on smaller screens to prioritize content

**Smaller screens:**
- Hidden (`xl:hidden`)
- Can be accessed via future modal/drawer

### Main Content Area
```tsx
// Responsive padding and width
<main className="flex-1 p-4 sm:p-6 lg:p-6 space-y-4 sm:space-y-6">
  <TopStatsGrid />   // Responsive grid columns
  {renderContent()}  // Route-specific content
</main>
```

---

## Split-Screen Optimization

### Problem Statement
Gamers often run games in windowed mode with browser split-screen:
- **Common setup:** 1920px monitor → 960px browser window (50%)
- **Issue:** Three-column layout becomes cramped
- **Solution:** Adaptive layout that removes non-essential sidebars

### Split-Screen Breakpoints

**960px (50% of 1920px):**
- Breakpoint: Tablet mode (640px - 1024px)
- Bottom navigation
- No sidebars
- Full content area

**1280px (67% of 1920px):**
- Breakpoint: Small desktop (1024px - 1280px)
- Left sidebar visible
- No right sidebar
- Optimized content

**Full Screen (1920px):**
- Large desktop mode (>1536px)
- All sidebars visible
- Maximum information density

---

## Responsive Features

### Mobile Menu (Hamburger)
```tsx
// Toggle button
<button
  onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
  className="lg:hidden fixed top-20 left-4 z-50"
>
  {leftSidebarOpen ? <X /> : <Menu />}
</button>

// Slide-in sidebar
<aside className={`
  fixed lg:static
  transform transition-transform
  ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
`}>
```

### Mobile Overlay
```tsx
// Dark overlay when sidebar is open
{leftSidebarOpen && (
  <div
    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
    onClick={() => setLeftSidebarOpen(false)}
  />
)}
```

### Bottom Navigation
```tsx
// Horizontal icon nav for mobile/tablet
<nav className="fixed bottom-0 left-0 right-0 bg-nordic-bg-dark">
  <div className="flex justify-around">
    {navigationItems.map(item => (
      <button className="flex flex-col items-center">
        <Icon />
        <span className="text-xs">{label}</span>
      </button>
    ))}
  </div>
</nav>
```

---

## Stats Grid Responsive Behavior

```tsx
// Tailwind responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <StatCard />
  <StatCard />
  <StatCard />
</div>
```

**Breakdowns:**
- **Mobile:** 1 column (stacked)
- **Tablet:** 2 columns
- **Small Desktop:** 3 columns
- **Large Desktop:** 4 columns

---

## Content Card Responsive Design

```tsx
// Responsive padding and sizing
<div className="bg-nordic-bg-dark p-4 sm:p-6 rounded-lg">
  <h2 className="text-lg sm:text-xl lg:text-2xl">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
</div>
```

---

## Z-Index Hierarchy

```
50: Mobile menu button
40: Left sidebar (mobile drawer)
30: Mobile overlay
20: Modals (future)
10: Dropdowns (future)
0:  Base content
```

---

## Accessibility Features

### Keyboard Navigation
- Tab through navigation items
- Enter/Space to activate
- Escape to close mobile menu

### ARIA Labels
```tsx
<button aria-label="Toggle navigation menu">
<nav role="navigation" aria-label="Main navigation">
```

### Focus States
- Visible focus rings on all interactive elements
- `:focus-visible` for keyboard navigation

### Screen Reader Support
- Semantic HTML (`<nav>`, `<main>`, `<aside>`)
- Descriptive labels
- Hidden elements properly marked

---

## Performance Optimizations

### CSS Transitions
```css
transition-transform duration-300 ease-in-out
```
- Hardware-accelerated transforms
- Smooth 300ms animations
- Reduced motion support (future)

### Overflow Handling
```tsx
overflow-x-hidden    // Prevent horizontal scroll
overflow-y-auto      // Allow vertical scroll in sidebars
min-w-0             // Prevent flex item overflow
```

### Safe Area Insets
```tsx
safe-area-inset-bottom  // iOS notch/home indicator support
```

---

## Testing Checklist

### Viewport Sizes
- [ ] 375px (iPhone SE)
- [ ] 640px (Small tablet)
- [ ] 768px (iPad)
- [ ] 960px (50% split-screen on 1920px)
- [ ] 1024px (iPad Pro, small laptop)
- [ ] 1280px (720p, 67% split-screen)
- [ ] 1440px (Laptop)
- [ ] 1920px (Full HD)
- [ ] 2560px (2K)
- [ ] 3840px (4K)

### Features to Test
- [ ] Hamburger menu opens/closes
- [ ] Bottom nav works on mobile
- [ ] Sidebar visible at correct breakpoints
- [ ] Stats grid adjusts columns correctly
- [ ] Content cards don't overflow
- [ ] Touch targets are at least 44x44px
- [ ] No horizontal scrolling
- [ ] Smooth transitions

### Split-Screen Scenarios
- [ ] 50% width (960px on 1920px)
- [ ] 60% width (1152px on 1920px)
- [ ] 67% width (1280px on 1920px)
- [ ] 75% width (1440px on 1920px)

---

## Browser Support

### Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### CSS Features Used
- Flexbox
- CSS Grid
- Transforms
- Transitions
- Fixed positioning
- CSS Custom Properties (via Tailwind)

### Fallbacks
- `lg:hidden` → `display: none` for older browsers
- Transform transitions degrade gracefully
- Grid falls back to block layout

---

## Future Enhancements

### Planned Features
1. **Collapsible Sidebar Toggle**
   - Button to manually collapse sidebars
   - Persist state in localStorage
   - More space for content

2. **Customizable Layout**
   - User preference for sidebar visibility
   - Compact/comfortable/spacious modes
   - Layout presets (gamer, productivity, mobile)

3. **Picture-in-Picture Stats**
   - Floating stats widget
   - Always visible during scrolling
   - Drag-and-drop positioning

4. **Swipe Gestures (Mobile)**
   - Swipe right to open menu
   - Swipe left to close
   - Swipe between routes

5. **Reduced Motion Support**
   - Respect `prefers-reduced-motion`
   - Instant transitions for users who need it

6. **Multi-Column Content**
   - Masonry layout for cards
   - Newspaper-style columns on ultrawide
   - Dynamic column count

---

## Implementation Details

### Tailwind Responsive Prefixes
```
sm:   640px
md:   768px
lg:   1024px
xl:   1280px
2xl:  1536px
```

### Custom Breakpoints (if needed)
```typescript
// tailwind.config.ts
theme: {
  screens: {
    'split': '960px',  // 50% split-screen
  }
}
```

### State Management
```tsx
const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
```

---

## Design Philosophy

### Mobile-First Approach
1. Design for smallest screen first
2. Progressively enhance for larger screens
3. Hide non-essential elements on small screens
4. Prioritize content over chrome

### Split-Screen Priority
1. Optimize for 960px-1280px range (common split sizes)
2. Single sidebar max in mid-range
3. Full functionality without both sidebars
4. Bottom nav as primary mobile/tablet navigation

### Performance First
1. Hardware-accelerated animations
2. Minimal DOM manipulation
3. CSS-only responsive behavior
4. No JavaScript layout calculations

---

## Summary

The responsive layout provides:

✅ Mobile-optimized bottom navigation
✅ Tablet-friendly single sidebar
✅ **Split-screen gaming optimization (960px-1280px)**
✅ Desktop three-column layout
✅ Ultrawide support (4K+)
✅ Smooth transitions
✅ Accessible navigation
✅ Performance-optimized
✅ Future-proof architecture

Perfect for gamers who split-screen their browser while playing!
