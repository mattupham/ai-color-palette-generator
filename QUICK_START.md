# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites
- Docker installed and running
- pnpm installed
- Google OAuth credentials ready
- OpenAI API key ready

## Setup Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL
docker-compose up -d

# 3. Copy environment file
cp .env.example .env.local

# 4. Edit .env.local with your credentials
# - Add BETTER_AUTH_SECRET (generate: openssl rand -base64 32)
# - Add GOOGLE_CLIENT_ID
# - Add GOOGLE_CLIENT_SECRET  
# - Add OPENAI_API_KEY

# 5. Initialize database
pnpm db:push

# 6. Start development server
pnpm dev
```

## Google OAuth Setup (2 minutes)

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth client ID → Web application
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:push          # Push schema to database
pnpm db:studio        # Open database GUI
docker-compose up -d  # Start PostgreSQL
docker-compose down   # Stop PostgreSQL

# Code Quality
pnpm lint             # Check code
pnpm lint:fix         # Fix issues
pnpm format           # Format code
```

## Verify Setup

1. Open http://localhost:3000
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Generate a color palette
5. Success! 🎉

## Troubleshooting

**Can't connect to database?**
```bash
docker ps  # Check if PostgreSQL is running
docker-compose restart  # Restart if needed
```

**Google OAuth error?**
- Check redirect URI matches exactly
- Verify credentials in `.env.local`

**Build errors?**
```bash
rm -rf .next node_modules
pnpm install
pnpm dev
```

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup instructions
- Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for architecture overview
- Check [README.md](README.md) for full documentation

## Environment Variables Checklist

- [ ] `DATABASE_URL` - Default works for local Docker
- [ ] `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- [ ] `BETTER_AUTH_URL` - `http://localhost:3000` for local
- [ ] `NEXT_PUBLIC_BETTER_AUTH_URL` - Same as above
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `OPENAI_API_KEY` - From OpenAI Platform
- [ ] `OPENAI_MODEL` - `gpt-4-turbo-preview` recommended

## Tech Stack at a Glance

- **Frontend**: Next.js 16 + React 19 + TailwindCSS 4
- **Backend**: tRPC (type-safe APIs)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Better Auth + Google OAuth
- **AI**: OpenAI GPT-4

## Support

Having issues? Check:
1. [SETUP.md](SETUP.md) - Detailed setup guide
2. [GitHub Issues](https://github.com/mattupham/ai-color-palette-generator/issues)
3. [Better Auth Docs](https://www.better-auth.com/)
4. [tRPC Docs](https://trpc.io/)

