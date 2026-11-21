# Winzz — Badminton Tournament App

## Project Overview
Winzz is a badminton tournament management and sports platform.

## Platform Strategy
**Web-first.** We build and validate the web application first, then ship Android and iOS later.
- Primary target: web (mobile-width, responsive)
- Future: Android → iOS
- Stack: React Native + Expo Router with `expo-router` (supports web, android, ios from one codebase)

## Tech Stack
- **Framework:** Expo (SDK ~54), Expo Router ~6
- **Language:** TypeScript
- **Styling:** React Native StyleSheet (no Tailwind, no NativeWind)
- **Platform web output:** `expo export --platform web` (static)

## Design
- Designs are provided via Figma. Use Figma MCP to read and replicate designs.
- Brand colors are defined in `constants/index.ts` — always source from there, never hardcode hex values in components.
- Dark theme, deep dark background (`#07070A`), deep red accents (`#8B0000`, `#FF6B6B`).

## Repo Structure
```
app/            — Expo Router screens (file-based routing)
  _layout.tsx   — root layout (Stack: index, login, signup)
  index.tsx     — Loading screen (Layout 001); 5s bar, then auto-navigates to /login
  login.tsx     — Login screen (Layout 002); Sign Up tab -> /signup
  signup.tsx    — Sign Up screen (Layout 003); "Login" link -> /login
components/
  WinzzBackground.tsx — full-screen splatter bg, same image on every screen
  WinzzLogo.tsx       — badge + WINZZ wordmark + tagline (fluid, fills parent width)
  RatioImage.tsx      — image sized by aspect ratio (use instead of <Image width + aspectRatio>)
  AuthInput.tsx       — icon + text field, optional password eye toggle
  GradientButton.tsx  — dark-red gradient CTA with arrow ("LOGIN", "SIGN UP")
  AuthLogoArea.tsx    — flex:1 logo area for auth screens (bottom-aligned, shrinks to fit)
  Gap.tsx             — vertical spacer that shrinks first on short screens
  OptionGroup.tsx     — segmented selector (playing level, hand)
  OrDivider.tsx / SecureFooter.tsx — shared auth-screen bits
assets/images/  — in use: winzz_background.jpg (shared by all screens),
                  winzz_badge.png, winzz_text.png, winzz_nav_icons.png
constants/
  index.ts      — Colors (incl. BRAND_RED, button gradient, field/divider greys), Fonts
```

## Key Conventions
- Keep screens in `app/`, shared UI in `components/`
- **Auth screens (Login, Sign Up) must be compact and NOT scrollable** — scrolling is bad UX here. No ScrollView: use a flex column where the logo area is `flex: 1` (`minHeight: 0`, logo sized by height + aspectRatio, bottom-aligned) so it absorbs spare height or shrinks on short phones (it disappears below ~600px tall), and the form below stays fixed and tight. Use `Gap` (not margins) between form sections so spacing gives way before anything overflows. Verified on 320x568 up to 430x932 and desktop: page height == viewport height.
- Web output is `static` (pre-rendered, no window): never size with `useWindowDimensions`/`Dimensions` or other values that differ between server and client — React won't patch mismatched styles on hydration and widths stay 0. Use `%`, `flex`, `aspectRatio`, `maxWidth`.
- react-native-web sizes `<Image>` to its natural pixels unless BOTH width and height are explicit (aspectRatio is ignored, absoluteFill isn't enough). Use `RatioImage` for ratio-sized images.
- All screens share one background, the splatter extracted from the Figma splash frame (logo/UI blanked out). Do not add per-screen backgrounds.
- Design sizes were measured against a 390px-wide phone. Text inputs use 16px font on purpose (iOS Safari zooms the page on focus below 16px).
- Visual check workflow: `npx expo export --platform web --output-dir <scratch>` then screenshot with playwright-core + system Chrome. Headless Chrome with virtual time does not run the animation or load all images reliably — wait in real time instead.

## What Was Removed
Previous iteration had prototype layout components (`Layout001Loading`, `Layout002Login`, etc.) and legacy badminton tournament screens. All removed in the web-first reset. Start fresh from Figma designs.
