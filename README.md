# Winzz

Badminton tournament management and sports platform.

**Web-first:** the web app is built and validated first (mobile-width, responsive); Android and iOS follow from the same codebase.

## Tech stack

- Expo (SDK ~54) and Expo Router ~6 (file-based routing)
- React Native + TypeScript
- Styling with React Native `StyleSheet` (no Tailwind / NativeWind)
- Static web export via `expo export --platform web`

## Getting started

```bash
npm install
npm run web          # dev server (web)
```

| Script | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run web` | Start for web |
| `npm run android` / `npm run ios` | Start for a native platform |
| `npm run build:web` | Static web export to `dist/` |
| `npm run lint` | Lint with `expo lint` |

## Screens

| Route | File | Description |
| --- | --- | --- |
| `/` | `app/index.tsx` | Loading screen; progress bar, then goes to `/login` |
| `/login` | `app/login.tsx` | Login; the Sign Up tab goes to `/signup` |
| `/signup` | `app/signup.tsx` | Sign up (playing level, hand) |
| `/welcome` | `app/welcome.tsx` | Shown after login |

## Project structure

```
app/            Expo Router screens
components/     Shared UI (WinzzBackground, WinzzLogo, AuthInput, GradientButton,
                OptionGroup, HandIcon, ...)
constants/      Colors and Fonts; brand colors live here, never hardcode hex in components
assets/images/  App icons, shared background (winzz_background.jpg), logo pieces
```

All screens share one background image. Auth screens are compact and not scrollable by design.

See [CLAUDE.md](CLAUDE.md) for design and layout conventions.
