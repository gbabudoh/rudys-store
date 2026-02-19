# Rudy's Store - Deployment Guide

Complete guide for deploying Rudy's Store to production.

## Prerequisites

- GitHub account with repository access
- Production database (MySQL 8.0+)
- Paystack production account
- Cloudinary account
- Domain name (optional)
- SSL certificate (recommended)

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure all production environment variables are configured:

```env
# Database (Production)
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-secure-production-password
DB_NAME=rudy_store_prod
DB_PORT=3306

# Paystack (Production Keys)
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_CALLBACK_URL=https://yourdomain.com/api/payment/callback

# JWT (Use Strong Secret)
JWT_SECRET=your-very-strong-random-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Database Setup

1. **Create Production Database**
   ```sql
   CREATE DATABASE rudy_store_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Run Schema Creation**
   ```bash
   # Update .env.local with production DB credentials
   node scripts/create-schema.js
   ```

3. **Create Super Admin**
   ```bash
   node scripts/create-super-admin.js
   ```

4. **Verify Database Connection**
   ```bash
   node scripts/test-db.js
   ```

### 3. Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable SSL/HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database SSL connections
- [ ] Review and update `.gitignore`
- [ ] Remove test/demo data

### 4. Code Preparation

- [ ] Remove console.log statements (or use logging service)
- [ ] Update API endpoints to production URLs
- [ ] Test all features in staging environment
- [ ] Optimize images
- [ ] Run build locally: `npm run build`
- [ ] Test production build: `npm start`

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Steps:

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for production"
   git push origin main
   ```

2. **Import Project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Environment Variables**
   - Add all environment variables from your `.env.local`
   - Use production values (not test/development)

4. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

6. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

#### Vercel Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT
PAYSTACK_SECRET_KEY
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
PAYSTACK_CALLBACK_URL
JWT_SECRET
JWT_EXPIRES_IN
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_UPLOAD_PRESET
NEXT_PUBLIC_GA_MEASUREMENT_ID
NODE_ENV
NEXT_PUBLIC_APP_URL
```

### Option 2: Self-Hosted (VPS/Server)

#### Requirements

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+ installed
- MySQL 8.0+ installed
- Nginx (for reverse proxy)
- PM2 (for process management)
- SSL certificate (Let's Encrypt)

#### Steps:

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js 18+
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install MySQL
   sudo apt install mysql-server -y

   # Install Nginx
   sudo apt install nginx -y

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/gbabudoh/rudys-store.git
   cd rudys-store
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp env.example.txt .env.local
   nano .env.local
   # Edit with production values
   ```

4. **Build Application**
   ```bash
   npm run build
   ```

5. **Start with PM2**
   ```bash
   pm2 start npm --name "rudy-store" -- start
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

   ```bash
   sudo nano /etc/nginx/sites-available/rudy-store
   sudo ln -s /etc/nginx/sites-available/rudy-store /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

8. **Configure Firewall**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

### Option 3: Docker Deployment

#### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - DB_USER=root
      - DB_PASSWORD=yourpassword
      - DB_NAME=rudy_store
      - DB_PORT=3306
      # Add other environment variables
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=yourpassword
      - MYSQL_DATABASE=rudy_store
    volumes:
      - db_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  db_data:
```

#### Deploy with Docker

```bash
docker-compose up -d
```

---

## Post-Deployment

### 1. Verify Deployment

- [ ] Test homepage loads correctly
- [ ] Test admin login
- [ ] Test product pages
- [ ] Test payment flow (test mode first)
- [ ] Test image uploads
- [ ] Verify database connections
- [ ] Check Google Analytics tracking

### 2. Database Backup

Set up automated database backups:

```bash
# Daily backup script
0 2 * * * mysqldump -u root -p'password' rudy_store_prod > /backups/rudy_store_$(date +\%Y\%m\%d).sql
```

### 3. Monitoring

Set up monitoring for:
- Application uptime
- Database performance
- Error tracking (Sentry, LogRocket, etc.)
- Server resources (CPU, memory, disk)

### 4. SSL Certificate Renewal

If using Let's Encrypt, set up auto-renewal:

```bash
sudo certbot renew --dry-run
```

Add to crontab:
```bash
0 0 1 * * certbot renew --quiet
```

---

## Production Optimizations

### 1. Enable Caching

- Configure CDN caching for static assets
- Enable Redis for session storage
- Implement API response caching

### 2. Database Optimization

- Add indexes to frequently queried columns
- Enable query caching
- Set up read replicas for scaling
- Regular database maintenance

### 3. Image Optimization

- Use Cloudinary transformations
- Enable Next.js image optimization
- Lazy load images
- Use WebP format

### 4. Performance Monitoring

- Set up APM (Application Performance Monitoring)
- Monitor Core Web Vitals
- Track API response times
- Monitor database query performance

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check firewall rules
   - Verify database credentials
   - Ensure database is accessible from server

2. **Build Fails**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

3. **Environment Variables Not Working**
   - Verify variables are set in deployment platform
   - Check variable names (case-sensitive)
   - Restart application after adding variables

4. **Payment Not Working**
   - Verify Paystack keys are production keys
   - Check callback URL is correct
   - Verify SSL certificate is valid

---

## Rollback Procedure

### Vercel

1. Go to Deployments
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Self-Hosted

```bash
# Stop current version
pm2 stop rudy-store

# Checkout previous version
git checkout <previous-commit-hash>

# Rebuild and restart
npm install
npm run build
pm2 restart rudy-store
```

---

## Security Best Practices

1. **Regular Updates**
   - Keep dependencies updated
   - Update Node.js regularly
   - Apply security patches

2. **Access Control**
   - Use strong passwords
   - Enable 2FA where possible
   - Limit admin access

3. **Monitoring**
   - Monitor for suspicious activity
   - Set up alerts for errors
   - Regular security audits

---

**Last Updated**: 2024

