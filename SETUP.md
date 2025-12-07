# Setup Guide

This guide will walk you through setting up the AI Color Palette Generator with Better Auth, Drizzle ORM, and tRPC.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Docker and Docker Compose installed
- Google Cloud account (for OAuth)
- OpenAI API account

## Step-by-Step Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL Database

Start the PostgreSQL database using Docker:

```bash
docker-compose up -d
```

Verify the database is running:

```bash
docker ps
```

You should see a container named `color-palette-db` running.

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the required values:

#### Database URL
Already configured for local Docker setup:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/color_palette
```

#### Better Auth Secret
Generate a secure random secret:
```bash
openssl rand -base64 32
```

Copy the output and set it:
```env
BETTER_AUTH_SECRET=<paste-generated-secret-here>
```

#### Better Auth URLs
For local development:
```env
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

For production, replace with your actual domain (e.g., `https://yourapp.com`).

### 4. Set Up Google OAuth

#### Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Create a new project or select an existing one:
   - Click the project dropdown at the top
   - Click "New Project"
   - Enter a name (e.g., "AI Color Palette Generator")
   - Click "Create"

3. Enable the Google+ API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen:
     - Choose "External" user type
     - Fill in app name, user support email, and developer email
     - Add scopes: `email`, `profile`, `openid`
     - Add test users if needed
     - Click "Save and Continue"

5. Create the OAuth client ID:
   - Application type: **Web application**
   - Name: "AI Color Palette Generator"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production URL (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourapp.com/api/auth/callback/google` (for production)
   - Click "Create"

6. Copy the credentials:
   - Copy the **Client ID** and **Client Secret**
   - Add them to your `.env.local`:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 5. Set Up OpenAI API

1. Go to [OpenAI Platform](https://platform.openai.com/)

2. Create an API key:
   - Go to "API keys"
   - Click "Create new secret key"
   - Copy the key (you won't be able to see it again!)

3. Add to `.env.local`:

```env
OPENAI_API_KEY=sk-...your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

### 6. Initialize the Database

Push the database schema to PostgreSQL:

```bash
pnpm db:push
```

This will create all necessary tables:
- `user` - User accounts
- `session` - User sessions
- `account` - OAuth accounts
- `verification` - Email verification tokens
- `saved_palette` - User's saved palettes
- `user_preferences` - User preferences

### 7. Start the Development Server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Testing the Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the sign-in page
3. Click "Sign in with Google"
4. Complete the Google OAuth flow
5. You should be redirected back to the app
6. Try generating a color palette!

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check if PostgreSQL is running:
   ```bash
   docker ps
   ```

2. Check the logs:
   ```bash
   docker logs color-palette-db
   ```

3. Restart the database:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Make sure the redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- No trailing slashes
- Check for http vs https

**Error: "Access blocked: This app's request is invalid"**
- Make sure you've configured the OAuth consent screen
- Add your email as a test user if the app is not published

### OpenAI API Issues

**Error: "Incorrect API key provided"**
- Double-check your API key in `.env.local`
- Make sure there are no extra spaces or quotes
- Verify the key is active in your OpenAI dashboard

**Error: "You exceeded your current quota"**
- Check your OpenAI billing and usage
- Add credits to your account if needed

### Build/Runtime Errors

**Error: "Cannot find module '@/lib/...'**
- Make sure all dependencies are installed: `pnpm install`
- Restart the dev server

**Type errors in IDE**
- Restart your TypeScript server
- In VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

## Database Management

### View Database Contents

Use Drizzle Studio to browse your database:

```bash
pnpm db:studio
```

This opens a web interface at [https://local.drizzle.studio](https://local.drizzle.studio).

### Reset Database

To completely reset the database:

```bash
docker-compose down -v
docker-compose up -d
pnpm db:push
```

### Backup Database

To backup your database:

```bash
docker exec color-palette-db pg_dump -U postgres color_palette > backup.sql
```

To restore:

```bash
docker exec -i color-palette-db psql -U postgres color_palette < backup.sql
```

## Production Deployment

### Environment Variables

Update these for production:

```env
DATABASE_URL=<your-production-database-url>
BETTER_AUTH_SECRET=<generate-new-secret-for-production>
BETTER_AUTH_URL=https://yourapp.com
NEXT_PUBLIC_BETTER_AUTH_URL=https://yourapp.com
GOOGLE_CLIENT_ID=<production-google-client-id>
GOOGLE_CLIENT_SECRET=<production-google-client-secret>
OPENAI_API_KEY=<your-openai-key>
OPENAI_MODEL=gpt-4-turbo-preview
```

### Google OAuth for Production

1. Go back to Google Cloud Console
2. Add your production URLs to:
   - Authorized JavaScript origins: `https://yourapp.com`
   - Authorized redirect URIs: `https://yourapp.com/api/auth/callback/google`
3. Publish your OAuth consent screen if needed

### Database Migration

For production, use proper migrations:

```bash
pnpm db:generate  # Generate migration files
pnpm db:migrate   # Run migrations
```

## Next Steps

- Customize the color palette generation prompts in `lib/prompts/palette-generator.ts`
- Add more OAuth providers (GitHub, Twitter, etc.) in `lib/auth/index.ts`
- Implement palette saving functionality using the `savePalette` tRPC mutation
- Add user preferences management
- Deploy to Vercel, Railway, or your preferred platform

## Support

If you encounter any issues not covered here, please:
1. Check the main [README.md](README.md)
2. Review the [Better Auth documentation](https://www.better-auth.com/)
3. Review the [tRPC documentation](https://trpc.io/)
4. Open an issue on GitHub

