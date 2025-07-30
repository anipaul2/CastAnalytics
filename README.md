# Castlytics - Farcaster Miniapp

Discover which of your casts sparked the most engagement. Understand your audience's preferences and craft better content.

## Features

- 🔐 **QuickAuth Integration**: Seamless Farcaster authentication using QuickAuth
- 📊 **Top Engaged Casts**: View your most engaged casts ranked by total engagement
- 🎯 **Engagement Analytics**: See likes, recasts, and replies for each cast
- 📱 **Miniapp Ready**: Optimized for Farcaster miniapp experience
- 🚀 **Real-time Data**: Fetches live data from Neynar API

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd castanalytics
npm install
```

### 2. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Neynar API Key for fetching user casts (backend)
NEYNAR_API_KEY=your_neynar_api_key_here

# Neynar API Key for frontend (if needed)
NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_api_key_here

# App URL for sharing (update this when deploying)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Seed phrase for signer creation (optional)
SEED_PHRASE=your_seed_phrase_here

# Sponsor signer (optional)
SPONSOR_SIGNER=false
```

### 3. Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Deploy to Vercel

```bash
npm run deploy:vercel
```

This will:
- Deploy your app to Vercel
- Configure environment variables
- Set up the domain for miniapp testing

## Miniapp Development

### Testing in Farcaster

1. Deploy your app to Vercel
2. Use the Farcaster Developer Tools to test your miniapp
3. The app uses QuickAuth for seamless authentication

### Authentication Flow

The app uses Farcaster's QuickAuth for authentication:

1. User opens the miniapp in Farcaster
2. QuickAuth automatically provides authentication token
3. Backend validates the token and extracts user FID
4. App fetches user's casts and displays top engaged content

### API Endpoints

- `GET /api/casts?fid={fid}` - Fetch user's casts with engagement data
- `POST /api/auth/validate` - Validate QuickAuth tokens

## Architecture

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### Backend
- **Next.js API Routes** for backend logic
- **Neynar API** for Farcaster data
- **QuickAuth** for authentication

### Key Components

- `src/app/page.tsx` - Main miniapp page with QuickAuth
- `src/components/TopEngagedCasts.tsx` - Displays user's top casts
- `src/components/CastlyticsLanding.tsx` - Landing page with features
- `src/app/api/casts/route.ts` - API for fetching user casts

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEYNAR_API_KEY` | Neynar API key for backend calls | Yes |
| `NEXT_PUBLIC_NEYNAR_API_KEY` | Neynar API key for frontend calls | No |
| `NEXT_PUBLIC_APP_URL` | Your app's URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret for token signing | Yes |
| `NEXTAUTH_URL` | NextAuth URL | Yes |

## Troubleshooting

### Authentication Issues

1. **Sign-in keeps loading**: Check that your app is deployed and accessible
2. **Token validation fails**: Ensure `NEXTAUTH_SECRET` is set correctly
3. **No casts displayed**: Verify your `NEYNAR_API_KEY` is valid

### Deployment Issues

1. **Environment variables not set**: Use `npm run deploy:vercel` to auto-configure
2. **Domain issues**: Check that your Vercel domain is accessible
3. **API errors**: Verify all required environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

