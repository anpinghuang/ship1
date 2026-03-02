# ShipInPublic MVP

ShipInPublic is a developer SaaS that automatically turns GitHub activity into polished "build in public" posts on X (Twitter).

## Architecture
- **Frontend**: Next.js 14+ (App Router), TailwindCSS v4, shadcn/ui
- **Backend**: Next.js Route Handlers, NextAuth (Auth.js)
- **Database**: PostgreSQL (via Prisma v7)
- **Integrations**: GitHub Webhooks, X (Twitter) API v2, Mock AI

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root based on `.env.example` (or use the one below):
   ```env
   # Database (PostgreSQL)
   DATABASE_URL="postgresql://user:password@localhost:5432/shipinpublic"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="super-secret-key" # Run `openssl rand -base64 32` to generate

   # GitHub OAuth ID & Secret (for Login)
   GITHUB_ID="your_github_oauth_app_id"
   GITHUB_SECRET="your_github_oauth_app_secret"

   # GitHub Webhook Secret (for ingesting commits)
   GITHUB_WEBHOOK_SECRET="your_webhook_secret"

   # X (Twitter) API v2 Credentials
   TWITTER_API_KEY="your_twitter_api_key"
   TWITTER_API_SECRET="your_twitter_api_secret"

   # Email Provider (Optional NextAuth fallback)
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="user"
   EMAIL_SERVER_PASSWORD="password"
   EMAIL_FROM="noreply@shipinpublic.com"
   ```

3. **Database Setup**
   Push the schema to your database and generate the Prisma client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Seed Database (Optional)**
   We use `tsx` to run the typescript seed file:
   ```bash
   npx tsx prisma/seed.ts
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## Local Testing

### 1. Simulating the Twitter API
By default, if you don't provide `TWITTER_API_KEY` and `TWITTER_API_SECRET` in your `.env` (or if you are running in `NODE_ENV="development"`), the `TwitterIntegration` in `src/lib/twitter.ts` runs in **MOCK mode**.
- It bypasses network calls to genuine X endpoints.
- It logs generated posts directly to your Next.js console.
- It returns fake successful Twitter IDs to simulate real-world behavior.

### 2. Testing GitHub Webhooks Locally
To test the webhook ingestion flow on your local machine, you need to expose your `localhost:3000` to the public internet using **ngrok**. Ngrok provides one free, permanent domain per account.

1. **Install ngrok** (Windows):
   ```bash
   winget install ngrok.ngrok --source winget
   ```
2. **Start your Next.js App**:
   ```bash
   npm run dev
   ```
3. **Start the ngrok Tunnel (with your permanent domain)**:
   Open your ngrok dashboard to copy your assigned permanent domain (e.g. `snapper-meet-abnormally.ngrok-free.app`), then run this in a *new* terminal:
   ```bash
   ngrok http --domain=snapper-meet-abnormally.ngrok-free.app 3000
   ```
4. **Configure GitHub**:
   - Go to your test repository on GitHub -> **Settings** -> **Webhooks** -> **Add webhook**
   - **Payload URL:** `https://snapper-meet-abnormally.ngrok-free.app/api/webhooks/github` 
   *(Replace with your actual domain if different)*
   - **Content type:** `application/json`
   - **Secret:** Match the `GITHUB_WEBHOOK_SECRET` from your `.env` (e.g., `test123`).
   - Select **"Just the push event"** and click **Add Webhook**.
5. **Test**: Push a commit. You should see `GitHub webhook received 🚀` print in your Next.js terminal!

## Deployment Plan (Vercel)
1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Add all the Environment Variables exactly as they are in your `.env`.
4. In Vercel's build settings, the default Next.js configuration will run `prisma generate` and `next build`. You may add `prisma db push` as a pre-build step in your `package.json` if you wish to auto-migrate.
5. Setup a Cron Job mechanism (e.g. Vercel Cron, Trigger.dev, Inngest, or Upstash QStash) and point it to a new API route `/api/cron/process` that calls the `processScheduledPosts()` function from `src/lib/queue.ts`.

## UI/UX Guidelines Implemented
* Strict Palette: Backgrounds `#FFFFFF`, Primary `#30FFB4`, Secondary Hero Text `#BAA0FF`, Hero Bg `#6355FF`, Text `#131F60`.
* Corners: 20px radius implemented globally via CSS variables and shadcn. 

## Support
View `task.md` in the agent artifacts for the full specification checkout.
