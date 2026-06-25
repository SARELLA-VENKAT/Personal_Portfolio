# Personal Portfolio & Site Roast

A premium, interactive developer portfolio built with Next.js 16 (Turbopack), Motion, Web Audio API, and Supabase.

## Features
- **Modern Interactive UI**: Dynamic marquee, drag-and-drop workspace, pitch shuffler, smooth custom transitions.
- **Web Audio Background Music**: Loops Michael Jackson's *Human Nature* instrumental dynamically starting from 3s, syncing mute state globally.
- **Site Roast**: AI-powered website analyzer with heuristic scores, terminal typing interface, metrics dashboard, and database leaderboard sync.
- **Roast Hall of Fame**: A 3D scroll-velocity-linked global leaderboard powered by Motion and real-time Supabase query hooks.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Supabase
- **Animations**: Motion
- **Parsing**: Cheerio

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://veraejmcsuugsswqzvwl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   GEMINI_API_KEY=your-gemini-api-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
