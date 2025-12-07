# AI Color Palette Generator

![Color Palette Generator](public/placeholder-logo.svg)

A modern web application that generates beautiful, accessible color palettes based on vibes or moods using AI. Built with Next.js, React, and OpenAI.

## ✨ Features

- **AI-Powered Palettes**: Enter your vibe, and get personalized color palettes
- **Accessibility Focused**: All generated palettes follow WCAG 2.1 accessibility guidelines
- **Copy with Ease**: One-click copying of color hex codes
- **Accessibility Checker**: Verify text contrast ratios against background colors
- **Dark/Light Mode**: Full theme support with seamless transitions
- **Responsive Design**: Works beautifully on all devices
- **Quick Suggestions**: Pre-defined vibe options for instant inspiration

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS 4
- **Backend**: tRPC for type-safe API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Google OAuth
- **State Management**: TanStack Query (React Query)
- **UI Components**: Radix UI primitives with custom styling
- **AI**: OpenAI API for AI-generated color palettes
- **Styling**: TailwindCSS with class-variance-authority
- **Theming**: next-themes for dark/light mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or newer
- Docker and Docker Compose (for PostgreSQL)
- OpenAI API key
- Google OAuth credentials

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/ai-color-palette-generator
   cd ai-color-palette-generator
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Set up PostgreSQL with Docker

   ```bash
   docker-compose up -d
   ```

4. Set up environment variables

   Copy `.env.example` to `.env.local` and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:

   - `DATABASE_URL`: PostgreSQL connection string (default: `postgresql://postgres:postgres@localhost:5432/color_palette`)
   - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `BETTER_AUTH_URL`: Your app URL (default: `http://localhost:3000`)
   - `NEXT_PUBLIC_BETTER_AUTH_URL`: Same as above
   - `GOOGLE_CLIENT_ID`: From Google Cloud Console
   - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_MODEL`: OpenAI model to use (e.g., `gpt-4-turbo-preview`)

5. Set up Google OAuth

   a. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

   b. Create a new project or select an existing one

   c. Navigate to "Credentials" → "Create Credentials" → "OAuth client ID"

   d. Choose "Web application" as the application type

   e. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

   f. Copy the Client ID and Client Secret to your `.env.local` file

6. Run database migrations

   ```bash
   pnpm db:push
   ```

7. Start the development server

   ```bash
   pnpm dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

1. Sign in with your Google account
2. Enter a vibe or mood in the input field (e.g., "energetic", "calm", "professional")
3. Click "Generate" or press Enter
4. Browse through the AI-generated color palettes
5. Click on any color to copy its hex code
6. Toggle accessibility view to check contrast ratios
7. Save your favorite palettes to your account (coming soon)

## 🎨 Examples

- **Professional**: Clean, trustworthy color schemes for business applications
- **Creative**: Vibrant, inspiring colors that spark imagination
- **Calm**: Soft, soothing palettes that reduce anxiety
- **Energetic**: Bold, invigorating colors that motivate action

## 🧩 Project Structure

```
/
├── app/                    # Next.js app router
│   ├── api/                # API routes
│   │   ├── auth/           # Better Auth endpoints
│   │   └── trpc/           # tRPC endpoints
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Main application page
├── components/             # React components
│   ├── auth/               # Authentication components
│   ├── ui/                 # UI components (Radix UI)
│   └── ...                 # Feature components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configurations
│   ├── auth/               # Better Auth configuration
│   ├── db/                 # Drizzle ORM schema and client
│   ├── trpc/               # tRPC server and client setup
│   │   └── routers/        # tRPC API routers
│   ├── prompts/            # OpenAI prompt templates
│   └── ...                 # Other utilities
├── drizzle/                # Database migrations
├── public/                 # Static assets
└── docker-compose.yml      # PostgreSQL setup
```

## 🔧 Development

### Commands

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm lint`: Lint code with Biome
- `pnpm lint:fix`: Fix linting issues
- `pnpm format`: Format code with Biome
- `pnpm db:generate`: Generate database migrations
- `pnpm db:migrate`: Run database migrations
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open Drizzle Studio (database GUI)

### Database Management

The project uses PostgreSQL with Drizzle ORM. The database schema includes:

- **User authentication tables**: user, session, account, verification (Better Auth)
- **Application tables**: saved_palette, user_preferences

To reset the database:

```bash
docker-compose down -v
docker-compose up -d
pnpm db:push
```

### API Routes

All API routes are handled through tRPC for type-safe client-server communication:

- **Palette routes** (`/api/trpc/palette.*`):

  - `generatePalettes`: Generate AI color palettes
  - `savePalette`: Save palette to user account
  - `getUserPalettes`: Get user's saved palettes
  - `deletePalette`: Delete a saved palette

- **User routes** (`/api/trpc/user.*`):
  - `getPreferences`: Get user preferences
  - `updatePreferences`: Update user preferences

All routes require authentication.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- OpenAI for providing the API that powers palette generation
- Radix UI for accessible component primitives
- TailwindCSS for utility-first styling

---

Crafted by [Matt Upham](https://github.com/mattupham)
