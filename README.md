# QR Registration System

A Nuxt.js application for QR code registration and management.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# yarn
yarn preview
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials and other configuration values:

```bash
cp .env.example .env
```

## Deployment

### Deploying to Netlify

1. Create a new site in Netlify
2. Connect your GitHub repository
3. Use these build settings:
   - Build command: `npm run generate`
   - Publish directory: `.output/public`
4. Add your environment variables in the Netlify dashboard under "Site settings" > "Environment variables"
5. Deploy!

#### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize a new Netlify site
netlify init

# Deploy to Netlify
netlify deploy --prod
```

### Deploying to Vercel

1. Create a new project in Vercel
2. Connect your GitHub repository
3. Vercel should automatically detect Nuxt.js settings
4. Add your environment variables in the Vercel dashboard under "Settings" > "Environment Variables"
5. Deploy!

#### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel (follow the prompts)
vercel

# Deploy to production
vercel --prod
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
