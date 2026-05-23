# 🚀 Production Deployment Guide

Complete guide for deploying Vet Buddy to production.

---

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] All environment variables configured in `.env.local` (frontend) and `server/.env`
- [ ] `JWT_SECRET` is strong (minimum 32 characters)
- [ ] `NODE_ENV=production` set in server `.env`
- [ ] MongoDB Atlas connection string configured (not localhost)
- [ ] All Firebase credentials are valid and not expired
- [ ] Cloudinary credentials are active
- [ ] Google Sheets credentials are correctly placed

### Security
- [ ] API keys and secrets are NOT in git (check `.gitignore`)
- [ ] Database backups are enabled
- [ ] CORS is properly configured for production domain
- [ ] SSL/TLS certificates are ready

### Performance
- [ ] Frontend build tested locally: `npm run build`
- [ ] Backend tested in production mode
- [ ] Database indexes are created
- [ ] Image optimization is enabled (Cloudinary)
- [ ] Firebase Realtime Database rules are configured

---

## 🏗️ Build for Production

### Frontend Build

```bash
# Install dependencies
npm install

# Build optimized frontend
npm run build

# Test production build locally
npm start
```

### Backend Build

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Verify environment variables
npm run start
```

---

## 📤 Deployment Platforms

### Option 1: Vercel (Recommended for Frontend)

1. **Connect Repository**
   ```bash
   npm i -g vercel
   vercel link
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all `NEXT_PUBLIC_*` variables from `.env.example`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Railway (Frontend + Backend)

1. **Frontend**
   - Connect GitHub repository
   - Set environment variables
   - Deploy automatically on push

2. **Backend**
   - Create new service
   - Connect to same GitHub repo
   - Set `ROOT_DIR` to `server/`
   - Configure environment variables
   - Set start command: `npm run start`

### Option 3: AWS (EC2 + RDS)

1. **EC2 Instance**
   ```bash
   # SSH into instance
   ssh -i key.pem ubuntu@instance-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Clone repository
   git clone <repo-url>
   cd Vet-Buddy

   # Install and build
   npm install
   npm run build

   # Install PM2 for process management
   sudo npm install -g pm2

   # Start servers
   pm2 start npm --name "frontend" -- start
   pm2 start npm --name "backend" -- run server:start --prefix server
   pm2 save
   sudo pm2 startup
   ```

2. **RDS Database**
   - Create MongoDB-compatible RDS instance
   - Update `MONGODB_URI` in environment variables
   - Create backups

3. **CloudFront (CDN)**
   - Create CloudFront distribution
   - Point to EC2/Vercel instance
   - Set cache policies

### Option 4: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .

   RUN npm run build

   EXPOSE 3000 5000

   CMD ["npm", "start"]
   ```

2. **Deploy to Docker Hub**
   ```bash
   docker build -t vetbuddy:1.0.0 .
   docker push your-registry/vetbuddy:1.0.0
   ```

---

## 🔒 Security Hardening

### Server Security

```javascript
// server/src/index.js additions

// Helmet for security headers
import helmet from 'helmet';
app.use(helmet());

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### Database Security

```bash
# MongoDB Atlas Security Groups
- Allow only your server IP
- Enable encryption at rest
- Regular backups enabled
```

### Frontend Security

```bash
# Vercel Security
- Enable HTTPS-only
- Set security headers
- Enable DDoS protection
```

---

## 📊 Monitoring & Logging

### Server Monitoring

```bash
# Install monitoring tools
npm install express-winston winston

# Setup centralized logging (LogRocket, Sentry, DataDog)
```

### Database Monitoring

- Enable MongoDB Atlas monitoring
- Set up alerts for high CPU/memory
- Monitor query performance

### Performance Monitoring

- Setup Vercel Analytics
- Configure CloudFlare Analytics
- Monitor Core Web Vitals

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build frontend
        run: npm run build

      - name: Build backend
        run: npm run server:build

      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        run: vercel --prod

      - name: Deploy backend to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          # Railway deployment commands
```

---

## 🔧 Post-Deployment

### Verification

```bash
# Check health endpoint
curl https://your-domain.com/api/health

# Test API endpoints
curl https://your-api.com/api/products

# Monitor logs
tail -f /var/log/app.log
```

### Updates & Maintenance

```bash
# Update dependencies
npm update

# Security audit
npm audit

# Performance check
npm run lint

# Database cleanup
# Remove old orders/appointments (keep 90 days)
```

### Backup Strategy

- Daily automated backups
- Store in S3/GCS
- Test restore process monthly
- Keep 30 days of backups

---

## 📞 Rollback Plan

If deployment fails:

```bash
# Revert to previous commit
git revert HEAD

# Rebuild and redeploy
npm run build
vercel --prod

# Monitor health endpoints
curl https://your-domain.com/api/health

# Check logs for errors
pm2 logs
```

---

## 🎯 Production Best Practices

1. **Never use development environment variables in production**
2. **Always test builds locally before deploying**
3. **Keep server and client repositories in sync**
4. **Monitor error logs continuously**
5. **Set up automated backups**
6. **Use environment-specific configurations**
7. **Implement health checks**
8. **Enable HTTPS everywhere**
9. **Use CDN for static assets**
10. **Implement rate limiting on APIs**

---

## 📞 Support

- **Emergency**: Check server logs first
- **Performance Issues**: Check database indexes
- **Deployment Issues**: Verify environment variables
- **Firebase Issues**: Check Firebase console

---

**Last Updated**: May 2026
