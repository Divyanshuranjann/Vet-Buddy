# 📡 API Documentation

Complete API reference for Vet Buddy Backend.

**Base URL**: `http://localhost:5000/api` (development) | `https://api.vetbuddy.com/api` (production)

---

## 🏥 Health Check

### Check Server Status

**Request:**
```
GET /api/health
```

**Response:**
```json
{
  "ok": true,
  "service": "vet-buddy-shop-api",
  "timestamp": "2026-05-24T10:30:00Z",
  "environment": "production"
}
```

---

## 🔐 Authentication

### Register User

**Request:**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login User

**Request:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Admin Login

**Request:**
```
POST /api/auth/admin-login
Content-Type: application/json

{
  "email": "admin@vetbuddy.com",
  "password": "admin_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "admin_jwt_token",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Admin User",
    "email": "admin@vetbuddy.com",
    "role": "admin"
  }
}
```

---

## 📦 Products

### Get All Products

**Request:**
```
GET /api/products?category=dogFood&sort=-price&page=1&limit=20
```

**Query Parameters:**
- `category` - Filter by category slug
- `sort` - Sort field (e.g., `-price`, `name`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search in name/description

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Premium Dog Food",
      "price": 999,
      "image": "https://res.cloudinary.com/...",
      "category": "dogFood",
      "description": "High-quality dog food...",
      "stock": 50,
      "rating": 4.5
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

### Get Product Details

**Request:**
```
GET /api/products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Premium Dog Food",
    "price": 999,
    "image": "https://res.cloudinary.com/...",
    "category": "dogFood",
    "description": "High-quality dog food...",
    "stock": 50,
    "rating": 4.5,
    "reviews": [
      {
        "rating": 5,
        "comment": "Great product!",
        "author": "John Doe"
      }
    ]
  }
}
```

### Create Product (Admin Only)

**Request:**
```
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Premium Dog Food",
  "price": 999,
  "category": "dogFood",
  "description": "High-quality dog food",
  "image": "https://res.cloudinary.com/...",
  "stock": 50
}
```

### Update Product (Admin Only)

**Request:**
```
PUT /api/products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 1099,
  "stock": 45
}
```

### Delete Product (Admin Only)

**Request:**
```
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

---

## 🛒 Orders

### Create Order

**Request:**
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "customer_123",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "name": "Premium Dog Food",
      "price": 999,
      "quantity": 2,
      "image": "https://..."
    }
  ],
  "shippingAddress": {
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "pincode": "10001"
  },
  "paymentMethod": "upi",
  "notes": "Deliver after 5 PM"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "VB1779556707834",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "orderId": "VB1779556707834",
    "customerId": "customer_123",
    "items": [...],
    "totalAmount": 1998,
    "status": "pending",
    "paymentStatus": "unpaid",
    "createdAt": "2026-05-24T10:30:00Z"
  }
}
```

### Get Order Details

**Request:**
```
GET /api/orders/:id
Authorization: Bearer <token>
```

### Get User Orders

**Request:**
```
GET /api/orders
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by order status (pending, confirmed, shipped, delivered, cancelled)
- `page` - Page number
- `limit` - Items per page

### Update Order Status (Admin Only)

**Request:**
```
PUT /api/orders/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "TRK123456"
}
```

---

## 📂 Categories

### Get All Categories

**Request:**
```
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "name": "Dog Food",
      "slug": "dogFood",
      "description": "Premium dog food products"
    }
  ]
}
```

### Create Category (Admin Only)

**Request:**
```
POST /api/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Dog Food",
  "description": "Premium dog food products"
}
```

---

## 📤 File Upload

### Upload Product Image

**Request:**
```
POST /api/upload
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

[binary image data]
```

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/vetbuddy/image/upload/v1679123456/products/abc123.jpg"
}
```

---

## 🔄 Sync (Google Sheets)

### Sync Appointments

**Request:**
```
GET /api/sync/appointments
```

### Sync Orders

**Request:**
```
GET /api/sync/orders
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🔑 Authentication

All protected routes require the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

Tokens expire after `JWT_EXPIRES_IN` (default: 7 days).

---

## 📊 Rate Limiting

- **Endpoints**: 100 requests per 15 minutes per IP
- **Uploads**: 10 requests per 15 minutes per user

---

## 🎯 API Best Practices

1. Always include `Content-Type: application/json` header
2. Send authentication token in `Authorization` header
3. Use query parameters for filtering/sorting
4. Handle errors gracefully on client
5. Implement exponential backoff for retries
6. Cache responses when appropriate

---

**Last Updated**: May 2026
