# 📊 Database Optimization Guide

MongoDB optimization strategies for Vet Buddy.

---

## 🔍 Essential Indexes

Add these indexes to MongoDB for optimal performance:

### Products Collection

```javascript
// Query: GET /api/products?category=dogFood&sort=-price
db.products.createIndex({ category: 1, price: -1 });

// Query: Search products
db.products.createIndex({ name: "text", description: "text" });

// Query: Get products by ID
db.products.createIndex({ _id: 1 });
```

### Orders Collection

```javascript
// Query: Get user's orders
db.orders.createIndex({ customerId: 1, createdAt: -1 });

// Query: Get orders by status
db.orders.createIndex({ status: 1, createdAt: -1 });

// Query: Get recent orders
db.orders.createIndex({ createdAt: -1 });
```

### Customers Collection

```javascript
// Query: Unique email
db.customers.createIndex({ email: 1 }, { unique: true });

// Query: Get customer by phone
db.customers.createIndex({ phone: 1 });
```

### Categories Collection

```javascript
// Query: Get all categories
db.categories.createIndex({ name: 1 });

// Query: Unique slug for SEO
db.categories.createIndex({ slug: 1 }, { unique: true });
```

---

## ⚡ Query Optimization

### Before (Slow)
```javascript
// Gets all orders and filters in application
const orders = await Order.find({});
const userOrders = orders.filter(o => o.customerId === userId);
```

### After (Fast)
```javascript
// Filter at database level
const userOrders = await Order.find({ customerId: userId })
  .sort({ createdAt: -1 })
  .limit(50);
```

---

## 💾 Connection Pooling

### mongoose Configuration

```javascript
// server/src/config/db.js
import mongoose from "mongoose";

const POOL_SIZE = 10; // connections in pool

const options = {
  maxPoolSize: POOL_SIZE,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  w: "majority",
};

await mongoose.connect(process.env.MONGODB_URI, options);
```

---

## 🗑️ Data Cleanup

### Remove Old Data

```bash
# Keep appointments from last 90 days
db.appointments.deleteMany({ 
  createdAt: { 
    $lt: new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000) 
  } 
});

# Archive old orders
db.orders.find({ 
  createdAt: { $lt: new Date("2024-01-01") } 
}).forEach(doc => {
  db.orders_archive.insertOne(doc);
  db.orders.deleteOne({ _id: doc._id });
});
```

### TTL (Time To Live) Indexes

```javascript
// Auto-delete sessions after 24 hours
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Auto-delete old temporary uploads
db.temp_uploads.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```

---

## 📈 Replication & Backups

### MongoDB Atlas Backups

1. Enable automated backups (24-hour frequency)
2. Set retention to 30 days
3. Test restore process monthly

### Manual Backup

```bash
# Backup to file
mongodump --uri="mongodb+srv://..." --out=backup/$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="mongodb+srv://..." --dir backup/20260524
```

---

## 🔒 Security

### Role-Based Access Control

```javascript
// Create users with limited permissions
db.createUser({
  user: "vetbuddy_app",
  pwd: "strong_password_here",
  roles: [
    {
      role: "readWrite",
      db: "vetbuddy_shop"
    }
  ]
});
```

### Enable Encryption

- MongoDB Atlas: Enable encryption at rest (free)
- Set `retryWrites: true` and `w: "majority"` for durability

---

## 📊 Performance Monitoring

### Check Slow Queries

```bash
# MongoDB Profiler (log queries > 100ms)
db.setProfilingLevel(1, { slowms: 100 });

# View slow queries
db.system.profile.find().pretty();
```

### Analyze Query Performance

```javascript
// Use explain() to see query plan
db.products.find({ category: "dogFood" }).explain("executionStats");

// Output shows:
// - totalDocs scanned
// - documents returned
// - executionStages
// If "COLLSCAN", add index!
```

---

## 🎯 Production Checklist

- [ ] All necessary indexes created
- [ ] Connection pooling configured
- [ ] Replication enabled
- [ ] Automated backups configured
- [ ] Encryption at rest enabled
- [ ] Firewall rules configured (IP whitelist)
- [ ] Monitoring and alerting enabled
- [ ] Query performance analyzed
- [ ] User authentication configured
- [ ] Database versioning kept up-to-date

---

**Last Updated**: May 2026
