# Deployment Guide for QR Registration System

This guide provides detailed instructions for deploying the QR Registration System to either Netlify or Vercel.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account where your repository is hosted
2. Firebase project set up with necessary services (Authentication, Firestore, Storage)
3. All environment variables ready (see `.env.example`)

## Option 1: Deploy to Netlify

### Method 1: Deploy via Netlify UI (recommended for beginners)

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Sign up or log in to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Sign up or log in with your preferred method

3. **Create a new site**
   - Click "Add new site" > "Import an existing project"
   - Connect to your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

4. **Configure build settings**
   - Owner: Your team
   - Branch: `main` (or your default branch)
   - Base directory: Leave blank
   - Build command: `npm run generate`
   - Publish directory: `.output/public`
   - Click "Deploy site"

5. **Add environment variables**
   - Go to "Site settings" > "Environment variables"
   - Add all variables from your `.env` file:
     - FIREBASE_API_KEY
     - FIREBASE_AUTH_DOMAIN
     - FIREBASE_PROJECT_ID
     - FIREBASE_STORAGE_BUCKET
     - FIREBASE_MESSAGING_SENDER_ID
     - FIREBASE_APP_ID
     - FIREBASE_MEASUREMENT_ID
     - SENDGRID_API_KEY (if using SendGrid)
     - PUBLIC_URL (set to your Netlify URL, e.g., `https://your-site-name.netlify.app`)

6. **Trigger a new deployment**
   - Go to "Deploys" > "Trigger deploy" > "Deploy site"

7. **Set up a custom domain (optional)**
   - Go to "Domain settings" > "Add custom domain"
   - Follow the instructions to set up your domain

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize a new Netlify site in your project directory**
   ```bash
   cd /path/to/your/project
   netlify init
   ```

4. **Deploy to Netlify**
   ```bash
   netlify deploy --prod
   ```

5. **Set environment variables**
   ```bash
   netlify env:set FIREBASE_API_KEY "your-api-key"
   netlify env:set FIREBASE_AUTH_DOMAIN "your-auth-domain"
   netlify env:set FIREBASE_PROJECT_ID "your-project-id"
   netlify env:set FIREBASE_STORAGE_BUCKET "your-storage-bucket"
   netlify env:set FIREBASE_MESSAGING_SENDER_ID "your-messaging-sender-id"
   netlify env:set FIREBASE_APP_ID "your-app-id"
   netlify env:set FIREBASE_MEASUREMENT_ID "your-measurement-id"
   netlify env:set SENDGRID_API_KEY "your-sendgrid-api-key"
   netlify env:set PUBLIC_URL "https://your-site-name.netlify.app"
   ```

## Option 2: Deploy to Vercel

### Method 1: Deploy via Vercel UI (recommended for beginners)

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Sign up or log in to Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Sign up or log in with your preferred method

3. **Create a new project**
   - Click "Add New" > "Project"
   - Import your Git repository
   - Select your repository

4. **Configure project settings**
   - Framework Preset: Nuxt.js
   - Build and Output Settings:
     - Build Command: `npm run generate`
     - Output Directory: `.output/public`
   - Click "Deploy"

5. **Add environment variables**
   - Go to your project > "Settings" > "Environment Variables"
   - Add all variables from your `.env` file:
     - FIREBASE_API_KEY
     - FIREBASE_AUTH_DOMAIN
     - FIREBASE_PROJECT_ID
     - FIREBASE_STORAGE_BUCKET
     - FIREBASE_MESSAGING_SENDER_ID
     - FIREBASE_APP_ID
     - FIREBASE_MEASUREMENT_ID
     - SENDGRID_API_KEY (if using SendGrid)
     - PUBLIC_URL (set to your Vercel URL, e.g., `https://your-project-name.vercel.app`)

6. **Redeploy your project**
   - Go to "Deployments" and click "Redeploy" on your latest deployment

7. **Set up a custom domain (optional)**
   - Go to "Settings" > "Domains"
   - Add your domain and follow the instructions

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**
   ```bash
   cd /path/to/your/project
   vercel
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

5. **Set environment variables**
   ```bash
   vercel env add FIREBASE_API_KEY
   vercel env add FIREBASE_AUTH_DOMAIN
   vercel env add FIREBASE_PROJECT_ID
   vercel env add FIREBASE_STORAGE_BUCKET
   vercel env add FIREBASE_MESSAGING_SENDER_ID
   vercel env add FIREBASE_APP_ID
   vercel env add FIREBASE_MEASUREMENT_ID
   vercel env add SENDGRID_API_KEY
   vercel env add PUBLIC_URL
   ```

## Troubleshooting

### Common Issues

1. **Build fails**
   - Check the build logs for specific errors
   - Make sure all dependencies are correctly listed in package.json
   - Verify that node_modules is not included in your Git repository

2. **Environment variables not working**
   - Double-check that all environment variables are correctly set
   - Deploy again after setting environment variables
   - Make sure your code accesses the environment variables correctly

3. **Firebase authentication not working**
   - Verify that your Firebase project's Authentication service has the correct providers enabled
   - Check that your Firebase project allows the domain you're deploying to

4. **Routing issues**
   - Make sure the redirects in `netlify.toml` or routes in `vercel.json` are correctly configured
   - For client-side routing problems, ensure your app is correctly handling the routes

## Updating Your Deployment

For both Netlify and Vercel, updates to your site will be automatically deployed when you push changes to your Git repository. If you need to manually trigger a deployment:

- **Netlify**: Go to "Deploys" > "Trigger deploy"
- **Vercel**: Go to your project > "Deployments" > "Redeploy"

## Security Considerations

1. **Never commit `.env` file to your repository**
2. **Use environment variables for all sensitive information**
3. **Set up proper Firebase security rules**
4. **Enable HTTPS for your custom domain** 