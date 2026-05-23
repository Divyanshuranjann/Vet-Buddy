# Vet Buddy - Full Stack Application

**Vet Buddy** is a modern veterinary clinic management and e-commerce platform built with Next.js, Express, MongoDB, and Firebase.

---

## 🚀 Features

### 🏥 Clinic Management
- **Appointment Booking** - Real-time appointment scheduling with Firebase
- **Doctor Profiles** - View veterinarians and their specializations
- **Services Listing** - Browse veterinary services with detailed descriptions
- **Emergency Banner** - Emergency contact information

### 🛍️ E-Commerce Shop
- **Product Catalog** - Browse pet products (food, toys, medicines, etc.)
- **Advanced Filtering** - Filter by category, price, and more
- **Shopping Cart** - Persistent cart with local storage
- **Checkout** - UPI/Payment integration with order tracking
- **Order Management** - Admin dashboard for order tracking

### 🔒 Admin Panel
- **Product Management** - Add, edit, delete products
- **Order Management** - Track and manage customer orders
- **Customer Management** - View customer details and order history
- **Coupon Management** - Create and manage discount coupons
- **Review Management** - Moderate customer reviews
- **Payments Dashboard** - Monitor payment transactions

### 📊 Real-Time Sync
- **Firebase Realtime Database** - Real-time appointment & order updates
- **Google Sheets Integration** - Auto-sync appointments and orders to Google Sheets
- **Live Listeners** - Automatic sync on data changes

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **UI Components**: React Icons, Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Firebase SDK**: Real-time database & authentication

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Cloudinary CDN
- **Services**: Firebase Admin SDK, Google Sheets API

---

## 📦 Project Structure

```
├── src/                          # Next.js frontend
│   ├── app/                      # Pages and layouts
│   │   ├── admin/               # Admin dashboard
│   │   ├── shop/                # E-commerce pages
│   │   └── layout.tsx           # Root layout
│   ├── components/              # Reusable React components
│   ├── context/                 # React Context (Cart, Theme, Wishlist)
│   ├── firebase/                # Firebase configuration
│   ├── lib/                     # Utility functions
│   └── types/                   # TypeScript type definitions
│
├── server/                       # Express backend
│   ├── src/
│   │   ├── config/              # Database, Firebase, Cloudinary config
│   │   ├── controllers/         # Route handlers
│   │   ├── middleware/          # Auth middleware
│   │   ├── models/              # MongoDB schemas
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic & sync services
│   │   ├── utils/               # Database seed script
│   │   └── index.js             # Server entry point
│   ├── credentials/             # Firebase & Google Sheets credentials (gitignored)
│   └── .env                     # Environment variables (gitignored)
│
├── package.json                 # Frontend dependencies
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js optimization config
└── .env.local                  # Frontend environment variables (gitignored)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB running locally or MongoDB Atlas connection
- Firebase project with Realtime Database
- Google Cloud project with Sheets & Drive APIs enabled
- Cloudinary account for image hosting

### 1️⃣ Clone & Install Dependencies

```bash
# Clone repository
git clone <repo-url>
cd Vet-Buddy

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2️⃣ Configure Environment Variables

**Frontend** - Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

**Backend** - Create `server/.env` from `server/.env.example`:
```bash
cp server/.env.example server/.env
```

Fill in all required environment variables (see `.env.example` files).

### 3️⃣ Setup Google Sheets Integration (Optional)

1. Enable Google Sheets API in [Google Cloud Console](https://console.cloud.google.com/)
2. Create a Service Account and download JSON credentials
3. Create two Google Sheets (Appointments & Orders) and share with service account email
4. Place credentials in `server/credentials/google-sheets-credentials.json`
5. Add spreadsheet IDs to `server/.env`

### 4️⃣ Start Development Servers

```bash
# Terminal 1 - Frontend (runs on http://localhost:3000)
npm run dev

# Terminal 2 - Backend (runs on http://localhost:5000)
npm run server
```

---

## 📝 Available Scripts

### Frontend
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run server     # Start backend server
npm run server:seed # Seed database with sample products
```

### Backend
```bash
npm run dev        # Start with auto-reload (from server folder)
npm run start      # Start production server
npm run seed       # Seed MongoDB with sample products
```

---

## 🔑 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_DATABASE_URL=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vetbuddy_shop
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000

# Firebase
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
FIREBASE_REALTIME_DB_URL=https://your-project.firebaseio.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# Google Sheets (Optional)
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials/google-sheets-credentials.json
GOOGLE_SHEETS_APPOINTMENTS_ID=xxx
GOOGLE_SHEETS_ORDERS_ID=xxx
```

---

## 🏗️ Building for Production

```bash
# Build frontend
npm run build

# Start production servers
npm start                    # Frontend on port 3000
npm run server              # Backend on port 5000 (from server folder)
```

---

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - Login customer
- `POST /api/auth/admin-login` - Admin login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get user's orders
- `PUT /api/orders/:id` - Update order status (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

### Sync (Google Sheets)
- `GET /api/sync/appointments` - Sync appointments manually
- `GET /api/sync/orders` - Sync orders manually

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Request size limits
- ✅ Firebase security rules
- ✅ Admin role verification
- ✅ Input validation

---

## 🐛 Troubleshooting

### Firebase Credentials Error
- Verify `FIREBASE_SERVICE_ACCOUNT` is a valid JSON string in `.env`
- Check Firebase Realtime Database URL matches project
- Ensure service account has proper permissions

### MongoDB Connection Failed
- Confirm MongoDB is running: `mongod`
- Check `MONGODB_URI` is correct
- For MongoDB Atlas, verify IP whitelist

### Cloudinary Upload Issues
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Check image size doesn't exceed 10MB limit

### Google Sheets Sync Not Working
- Verify service account email is shared with Google Sheets
- Confirm credentials JSON path is correct
- Check spreadsheet IDs are valid

---

## 📞 Support & Contact

- **Email**: admin@vetbuddy.com
- **Emergency Hotline**: Available in app
- **Support Hours**: 24/7 for emergencies

---

## 📄 License

Private Project - All Rights Reserved

---

**Last Updated**: May 2026 | **Version**: 1.0.0
