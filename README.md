# FunPhysics - Interactive Physics Learning App

A fun, engaging, and interactive app to learn physics through simulations, quizzes, and gamification. Designed as a Progressive Web App (PWA) that works beautifully on mobile and can be easily published to the Google Play Store.

## Features

- 🏠 **Home** with topic cards
- 🔬 **Interactive Labs**: Free Fall, Projectile Motion, Pendulum, Newton's Laws
- 🎯 **Quizzes** with instant feedback and scoring
- 📊 **Progress tracking** with points, levels, and achievements
- 💾 Local storage (works offline after first load)
- 🎨 Modern dark theme with smooth animations
- 📱 Fully responsive + installable as PWA

## How to Run Locally

1. Open `index.html` in any modern browser (Chrome, Edge, Firefox, Safari).
2. For best experience, serve it via a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   # Or Node
   npx serve .
   ```
3. Open `http://localhost:8000`

## Install as App (Mobile)

- On Android Chrome: Open the site → Menu → "Add to Home screen" or "Install app".
- On iOS: Share → Add to Home Screen.

## Publishing to Google Play Store

This is a PWA. The easiest way to publish it on Play Store is using **Trusted Web Activity (TWA)** via Bubblewrap or PWABuilder:

### Option 1: PWABuilder (Recommended, easiest)
1. Host this app on a public HTTPS domain (e.g., Netlify, Vercel, GitHub Pages, Firebase Hosting).
2. Go to [https://www.pwabuilder.com](https://www.pwabuilder.com)
3. Enter your URL → Generate Android package.
4. Download the Android Studio project or AAB.
5. Open in Android Studio, build signed AAB, and upload to Play Console.

### Option 2: Capacitor (More control)
1. Install Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init FunPhysics com.funphysics.app
   npx cap add android
   ```
2. Copy your web files into `www/` folder.
3. `npx cap sync`
4. Open Android project in Android Studio and build.

### Requirements for Play Store
- Host the PWA on HTTPS
- Provide screenshots, feature graphic, privacy policy
- Sign the AAB with your keystore
- Follow Google Play policies (this educational app is fully compliant)

## Customization Ideas

- Add more simulations (waves, electricity circuits, optics ray diagrams)
- Add sound effects
- Multiplayer challenges
- More quiz questions
- Backend for leaderboards (optional)

## Tech Stack

- Pure HTML + CSS + Vanilla JavaScript
- Canvas for physics simulations
- PWA (manifest + service worker)
- LocalStorage for progress

Enjoy learning physics the fun way! ⚡🚀
