# AI Color Palette Generator

![Color Palette Generator](public/placeholder-logo.svg)

A modern web application that generates beautiful, accessible color palettes based on feelings or moods using AI. Built with Next.js, React, and OpenAI.

## ✨ Features

- **AI-Powered Palettes**: Enter how you're feeling, and get personalized color palettes
- **Accessibility Focused**: All generated palettes follow WCAG 2.1 accessibility guidelines
- **Copy with Ease**: One-click copying of color hex codes
- **Accessibility Checker**: Verify text contrast ratios against background colors
- **Dark/Light Mode**: Full theme support with seamless transitions
- **Responsive Design**: Works beautifully on all devices
- **Quick Suggestions**: Pre-defined feeling options for instant inspiration

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **State Management**: React Query
- **UI Components**: Radix UI primitives with custom styling
- **API**: OpenAI API for AI-generated color palettes
- **Styling**: TailwindCSS with class-variance-authority
- **Theming**: next-themes for dark/light mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or newer
- OpenAI API key

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/ai-color-palette-generator
   cd ai-color-palette-generator
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with your OpenAI API key

   ```
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4-turbo
   ```

4. Start the development server

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

1. Enter a feeling or mood in the input field (e.g., "energetic", "calm", "professional")
2. Click "Generate" or press Enter
3. Browse through the AI-generated color palettes
4. Click on any color to copy its hex code
5. Toggle accessibility view to check contrast ratios
6. Use the refresh button to generate new palettes for the same feeling

## 🎨 Examples

- **Professional**: Clean, trustworthy color schemes for business applications
- **Creative**: Vibrant, inspiring colors that spark imagination
- **Calm**: Soft, soothing palettes that reduce anxiety
- **Energetic**: Bold, invigorating colors that motivate action

## 🧩 Project Structure

```
/
├── app/               # Next.js app router
│   ├── api/           # API routes
│   └── page.tsx       # Main application page
├── components/        # React components
│   ├── ui/            # UI components
│   └── ...            # Feature components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and API clients
│   ├── prompts/       # OpenAI prompt templates
│   └── ...            # Other utilities
├── providers/         # React context providers
└── public/            # Static assets
```

## 🔧 Development

### Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Lint code

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- OpenAI for providing the API that powers palette generation
- Radix UI for accessible component primitives
- TailwindCSS for utility-first styling

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
