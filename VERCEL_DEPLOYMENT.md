# Vercel Deployment Guide

## Prerequisites

1. A Vercel account (https://vercel.com)
2. A Neon PostgreSQL database (https://neon.tech) or Vercel Postgres
3. A Clerk account for authentication (https://clerk.com)
4. A Meta Developer account with Instagram Business API access

## Environment Variables

Add these environment variables in your Vercel project settings:

### Required Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (from Neon or Vercel Postgres) |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key (starts with `pk_`) |
| `CLERK_SECRET_KEY` | Clerk secret key (starts with `sk_`) |
| `INSTAGRAM_APP_ID` | Your Instagram/Facebook App ID |
| `INSTAGRAM_APP_SECRET` | Your Instagram/Facebook App Secret |
| `VITE_CLERK_PUBLISHABLE_KEY` | Same as CLERK_PUBLISHABLE_KEY (for frontend) |
| `SESSION_SECRET` | A random string for session encryption |

## Setup Instructions

### 1. Update package.json

Add this script to your `package.json`:

```json
"scripts": {
  "build:vercel": "tsx script/build-vercel.ts"
}
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the environment variables
4. Deploy

### 3. Configure Meta Developer Console

After deploying, update your Meta Developer App settings:

1. Go to https://developers.facebook.com
2. Select your app
3. Navigate to **Products > Instagram > Settings**
4. Add your Vercel URLs:
   - **Valid OAuth Redirect URIs**: `https://your-app.vercel.app/api/auth/instagram/callback`
   - **Deauthorize Callback URL**: `https://your-app.vercel.app/api/webhooks/instagram/deauthorize`
   - **Data Deletion Request URL**: `https://your-app.vercel.app/api/webhooks/instagram/data-deletion`

### 4. Configure Clerk

1. Go to your Clerk Dashboard
2. Navigate to **Settings > URLs**
3. Add your Vercel domain to allowed origins
4. Update redirect URLs if needed

### 5. Update Webhook URL

For Instagram comment detection, update the webhook URL in Meta Developer Console:
- **Webhook Callback URL**: `https://your-app.vercel.app/api/webhooks/instagram`

## Database Setup

If using Neon PostgreSQL:

1. Create a new project at https://neon.tech
2. Copy the connection string
3. Run migrations:

```bash
DATABASE_URL="your-connection-string" npm run db:push
```

## Troubleshooting

### Token Expiration
- The app automatically exchanges short-lived tokens for long-lived tokens (59 days)
- Users need to reconnect their Instagram account before token expires

### CORS Issues
- Ensure your Vercel domain is added to Clerk's allowed origins
- Check that Meta Developer Console has correct redirect URIs

### Database Connection
- Neon uses serverless connections which are ideal for Vercel
- Ensure SSL is enabled in your connection string

## File Structure

```
├── api/
│   └── index.ts          # Vercel serverless function entry
├── client/               # React frontend
├── server/               # Express API routes and logic
├── shared/               # Shared types and schemas
├── vercel.json           # Vercel configuration
└── script/
    └── build-vercel.ts   # Vercel build script
```
