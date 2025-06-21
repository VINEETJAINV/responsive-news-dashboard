# 🚀 Deployment Guide

This guide will help you deploy your News Dashboard to various platforms.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **API Keys Ready**:
   - News API key from [newsapi.org](https://newsapi.org/)
   - Google OAuth credentials (optional, for authentication)

2. **Code Repository**:
   - Your code pushed to GitHub, GitLab, or Bitbucket

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Step 1: Prepare Your Repository
```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEWS_API_KEY=your-news-api-key
   ```
5. Click "Deploy"

#### Step 3: Custom Domain (Optional)
1. In your Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update `NEXTAUTH_URL` to your custom domain

### 2. Netlify

#### Step 1: Build Settings
Configure your build settings in Netlify:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18.x

#### Step 2: Environment Variables
Add these environment variables in Netlify dashboard:
```
NEXTAUTH_URL=https://your-app.netlify.app
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEWS_API_KEY=your-news-api-key
```

### 3. AWS Amplify

#### Step 1: Connect Repository
1. Go to AWS Amplify Console
2. Click "New App" → "Host web app"
3. Connect your Git repository

#### Step 2: Build Settings
Use these build settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 4. Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### Step 2: Build and Deploy
```bash
# Build the image
docker build -t news-dashboard .

# Run the container
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEWS_API_KEY=your-api-key \
  news-dashboard
```

## 🔧 Environment Variables

### Required Variables
```env
# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here

# News API (Required)
NEWS_API_KEY=your-news-api-key
```

### Optional Variables
```env
# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database (if using database sessions)
DATABASE_URL=your-database-url
```

## 🔐 Security Considerations

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use platform-specific secret management
- Rotate secrets regularly

### 2. API Keys
- Keep your News API key secure
- Monitor API usage to avoid rate limits
- Consider using API key rotation

### 3. Authentication
- Use strong NEXTAUTH_SECRET
- Configure proper OAuth redirect URIs
- Enable HTTPS in production

## 📊 Performance Optimization

### 1. Build Optimization
```bash
# Analyze bundle size
npm run build
npm run analyze
```

### 2. Image Optimization
- Use Next.js Image component
- Optimize chart images
- Compress static assets

### 3. Caching
- Enable CDN caching
- Use service workers for offline support
- Implement proper cache headers

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

#### 2. Environment Variables
- Check if all required variables are set
- Verify variable names match exactly
- Restart deployment after adding variables

#### 3. API Errors
- Verify News API key is valid
- Check API rate limits
- Test API endpoints manually

#### 4. Authentication Issues
- Verify OAuth redirect URIs
- Check NEXTAUTH_URL matches deployment URL
- Ensure HTTPS is enabled in production

### Debug Commands
```bash
# Check build output
npm run build

# Run production locally
npm run build
npm start

# Check environment variables
echo $NEXTAUTH_URL
echo $NEWS_API_KEY
```

## 📈 Monitoring

### 1. Performance Monitoring
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track API response times

### 2. Error Tracking
- Set up error logging
- Monitor API failures
- Track user interactions

### 3. Analytics
- Google Analytics integration
- User behavior tracking
- Performance metrics

## 🔄 Continuous Deployment

### GitHub Actions Example
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎉 Post-Deployment

### 1. Testing
- Test all features in production
- Verify authentication works
- Check chart functionality
- Test export features

### 2. Documentation
- Update README with live URL
- Document deployment process
- Add monitoring setup

### 3. Maintenance
- Set up automated backups
- Monitor performance
- Update dependencies regularly
- Security patches

---

**Need help?** Check the [Issues](https://github.com/yourusername/news-dashboard/issues) page or create a new issue. 