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
app/              — Expo Router screens (file-based routing)
  _layout.tsx     — root layout (Stack: index, login, signup, welcome, (tabs)); loads fonts
  index.tsx       — Loading screen (Layout 001); 5s bar, then auto-navigates to /login
  login.tsx       — Login screen (Layout 002); Sign Up tab -> /signup; LOGIN -> /home
  signup.tsx      — Sign Up screen (Layout 003); "Login" link -> /login
  welcome.tsx     — old post-login placeholder (nothing navigates here any more)
  (tabs)/         — tab screens with the custom bottom nav
    _layout.tsx   — Tabs + BottomNavBar inside WinzzBackground (Home gets flat HOME_BG)
    home.tsx      — Home: background art + fixed-height sections in a ScrollView
    players.tsx / matches.tsx / more.tsx — "Coming soon" placeholders
components/
  WinzzBackground.tsx — full-screen splatter bg (Home: flat colour only, see below)
  WinzzLogo.tsx       — badge + WINZZ wordmark + tagline (fluid, fills parent width)
  RatioImage.tsx      — image sized by aspect ratio (use instead of <Image width + aspectRatio>)
  BottomNavBar.tsx    — custom tab bar (Home / Players / shuttle button / Matches / More)
  PlaceholderScreen.tsx — "Coming soon" screen used by the unfinished tabs
  AuthInput.tsx       — icon + text field, optional password eye toggle
  GradientButton.tsx  — dark-red gradient CTA with arrow ("LOGIN", "SIGN UP")
  AuthLogoArea.tsx    — flex:1 logo area for auth screens (bottom-aligned, shrinks to fit)
  Gap.tsx             — vertical spacer that shrinks first on short screens
  OptionGroup.tsx     — segmented selector (playing level, hand)
  OrDivider.tsx / SecureFooter.tsx — shared auth-screen bits
  GoogleIcon.tsx / FacebookIcon.tsx / HandIcon.tsx — SVG icons for the auth screens
  home/               — Home sections
    ProfileHeader.tsx    — avatar, "Hi, Player", gold badge, ranking
    ActionCards.tsx      — START NEW MATCH / TOURNAMENT buttons
    PerformancePanel.tsx — MY PERFORMANCE: 4 stat tiles
    LiveMatches.tsx      — LIVE MATCHES: 2 match cards + carousel dots
    TopPlayers.tsx       — TOP PLAYERS: 5 player cards
    Panel.tsx            — dark card with red->teal outline (used by every section)
    SectionTitle.tsx     — "TITLE ...... VIEW ALL >" row (+ Dot)
    GradientBorder.tsx   — red->teal border used by BottomNavBar
data/
  homeMock.ts     — placeholder Home data (performance, matches, point table, top players)
  teams.ts        — TeamKey -> team logo PNG + aspect ratio
assets/
  images/         — winzz_background.jpg (shared by all screens), winzz_home_background.png
                    (Home art), winzz_badge.png, winzz_text.png, winzz_nav_icons.png, app icons
  home/           — Home icons rasterised from the Figma SVGs
  team-logos/     — team logo PNGs
constants/
  index.ts        — Colors (incl. BRAND_RED, panel/live/score colours), Fonts, HomeFonts, GoldGradient
```

## Key Conventions
- Keep screens in `app/`, shared UI in `components/`
- **Auth screens (Login, Sign Up) must be compact and NOT scrollable** — scrolling is bad UX here. No ScrollView: use a flex column where the logo area is `flex: 1` (`minHeight: 0`, logo sized by height + aspectRatio, bottom-aligned) so it absorbs spare height or shrinks on short phones (it disappears below ~600px tall), and the form below stays fixed and tight. Use `Gap` (not margins) between form sections so spacing gives way before anything overflows. Verified on 320x568 up to 430x932 and desktop: page height == viewport height.
- Web output is `static` (pre-rendered, no window): never size with `useWindowDimensions`/`Dimensions` or other values that differ between server and client — React won't patch mismatched styles on hydration and widths stay 0. Use `%`, `flex`, `aspectRatio`, `maxWidth`.
- react-native-web sizes `<Image>` to its natural pixels unless BOTH width and height are explicit (aspectRatio is ignored, absoluteFill isn't enough). Use `RatioImage` for ratio-sized images.
- All screens share one background, the splatter extracted from the Figma splash frame (logo/UI blanked out), except Home: it uses `winzz_home_background.png` (smash player + splatter pinned to the top, flat `Colors.HOME_BG` below) drawn at the top of Home's `ScrollView` (so it scrolls with the page) over `WinzzBackground`'s flat `topArt` colour set in `app/(tabs)/_layout.tsx`. Don't add other per-screen backgrounds without asking.
- Home (`app/(tabs)/home.tsx`) is a plain vertical `ScrollView` of fixed-height sections (design: Figma 366x788 frame). Each section in `components/home/` exports its height (`HEADER_HEIGHT`, `ACTION_CARDS_HEIGHT`, `PERFORMANCE_HEIGHT`, `LIVE_MATCHES_HEIGHT`, `TOP_PLAYERS_HEIGHT`) and lays itself out with normal flexbox: width is automatic (fills the screen, max 414, 6px side padding), so rows use `flex: 1` + `gap`, never absolute coordinates or canvas scaling. Shared bits: `Panel` (red->teal outlined dark card) and `SectionTitle` (title + "VIEW ALL >"). Placeholder data in `data/homeMock.ts`, team logos (PNGs extracted from the supplied SVGs) in `assets/team-logos/` mapped in `data/teams.ts`, icons rasterised from the Figma SVGs in `assets/home/`. Fonts: Figma uses Roboto Condensed + Bahnschrift; the app uses Roboto Condensed + Barlow (`HomeFonts` in `constants/index.ts`, loaded in `app/_layout.tsx`).
- Check Home changes by screenshotting at 366x788 (deviceScaleFactor 2) against the design export.
- Auth-screen design sizes were measured against a 390px-wide phone. Text inputs use 16px font on purpose (iOS Safari zooms the page on focus below 16px).
- Visual check workflow: `npx expo export --platform web --output-dir <scratch>` then screenshot with playwright-core + system Chrome. Headless Chrome with virtual time does not run the animation or load all images reliably — wait in real time instead.
- Serving the export: routes inside `(tabs)` are written as `<out>/(tabs)/home.html`, so a plain static server 404s on `/home` — map `/home` to that file (or serve with a fallback) before screenshotting.
- Android (Expo Go): if a screen shows only the background and nav bar, the app is usually running a stale bundle after losing Metro — reload (`r` in Metro, or the dev menu) before debugging the code.

## What Was Removed
Previous iteration had prototype layout components (`Layout001Loading`, `Layout002Login`, etc.) and legacy badminton tournament screens. All removed in the web-first reset. Start fresh from Figma designs.
