# ⚡ Performance Optimization Guide

Frontend and backend performance optimization strategies.

---

## 🖥️ Frontend Optimization

### 1. Image Optimization

Already configured in `next.config.mjs`:
- WebP/AVIF format support
- Responsive image sizing
- Lazy loading by default

```jsx
// Use next/image for automatic optimization
import Image from 'next/image';

<Image
  src="image.jpg"
  alt="Pet"
  width={600}
  height={400}
  loading="lazy"
  priority={false}
/>
```

### 2. Code Splitting

Next.js automatically code-splits by page. For manual splitting:

```jsx
// Dynamic imports for large components
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(
  () => import('@/components/admin/AdminPanel'),
  { loading: () => <div>Loading...</div> }
);
```

### 3. Font Optimization

Using system fonts is faster than Google Fonts:

```css
/* globals.css */
@font-face {
  font-family: 'System';
  src: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

body {
  font-family: 'System', sans-serif;
}
```

### 4. Bundle Analysis

```bash
# Analyze production bundle
npm install --save-dev @next/bundle-analyzer

# In next.config.mjs
import withBundleAnalyzer from '@next/bundle-analyzer';

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### 5. Caching Strategy

```javascript
// next.config.mjs
const nextConfig = {
  headers: async () => [
    {
      source: '/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ],
};
```

---

## 🔧 Backend Optimization

### 1. Database Query Optimization

```javascript
// ❌ Slow: N+1 query problem
const orders = await Order.find();
for (let order of orders) {
  order.customer = await Customer.findById(order.customerId);
}

// ✅ Fast: Populate in single query
const orders = await Order.find().populate('customerId');
```

### 2. Response Compression

```javascript
// server/src/index.js
import compression from 'compression';

app.use(compression({ level: 6 }));
```

### 3. Request Pagination

```javascript
// ❌ Slow: Return all 10,000 products
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// ✅ Fast: Paginate results
app.get('/api/products', async (req, res) => {
  const page = req.query.page || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const products = await Product.find()
    .skip(skip)
    .limit(limit);

  res.json({
    data: products,
    total: await Product.countDocuments(),
    page,
    pages: Math.ceil(total / limit),
  });
});
```

### 4. Caching with Redis

```javascript
import redis from 'redis';

const client = redis.createClient();

app.get('/api/products', async (req, res) => {
  // Check cache first
  const cached = await client.get('products');
  if (cached) return res.json(JSON.parse(cached));

  // Fetch from DB
  const products = await Product.find();

  // Cache for 1 hour
  await client.setex('products', 3600, JSON.stringify(products));

  res.json(products);
});
```

### 5. Async Operations

```javascript
// ❌ Slow: Wait for all operations
app.post('/api/orders', async (req, res) => {
  const order = await Order.create(req.body);
  await sendOrderConfirmationEmail(order); // Blocking
  await syncToGoogleSheets(order);         // Blocking
  res.json(order);
});

// ✅ Fast: Don't wait for non-critical operations
app.post('/api/orders', async (req, res) => {
  const order = await Order.create(req.body);
  res.json(order); // Send response immediately

  // Fire and forget
  sendOrderConfirmationEmail(order).catch(err => console.error(err));
  syncToGoogleSheets(order).catch(err => console.error(err));
});
```

---

## 📊 Performance Monitoring

### Frontend Metrics

```javascript
// Track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

### Backend Metrics

```javascript
// Track response times
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

---

## 🎯 Production Checklist

### Frontend
- [ ] Image optimization enabled
- [ ] Code splitting configured
- [ ] Caching headers set
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals optimized

### Backend
- [ ] Query optimization completed
- [ ] Indexes created on frequently queried fields
- [ ] Response compression enabled
- [ ] Caching strategy implemented
- [ ] API response time < 200ms (p95)
- [ ] Database connection pooling optimized

### Deployment
- [ ] CDN configured for static assets
- [ ] Gzip compression enabled
- [ ] Minification enabled
- [ ] Environment variables optimized
- [ ] Monitoring/alerting configured
- [ ] Load testing completed

---

## 🚀 Quick Performance Wins

1. **Add CDN** - Serve static assets from CloudFlare/AWS CloudFront
2. **Enable Gzip** - Reduces transferred data by 60-80%
3. **Optimize images** - Use WebP format, resize appropriately
4. **Database indexes** - Can reduce query time by 100x
5. **Implement caching** - Redis for frequently accessed data
6. **Lazy load components** - Improve initial page load
7. **Remove unused CSS** - PurgeCSS/TailwindCSS built-in
8. **Minimize bundles** - Tree-shaking, code splitting

---

**Last Updated**: May 2026
