# APNIDUKAN Setup Guide

Complete setup instructions for both frontend and backend.

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5001` (Note: Port 5000 is used by macOS AirPlay Receiver)

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd APNIDUKAN
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your API URL:
```env
VITE_API_URL=http://localhost:5001/api
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Running Both Servers

### Option 1: Two Terminal Windows
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd APNIDUKAN && npm run dev`

### Option 2: Use the Helper Script
From the root directory:
```bash
# Start backend
cd backend && npm run dev &

# Start frontend (in new terminal)
cd APNIDUKAN && npm run dev
```

## Testing Authentication

1. **Register a new user:**
   - Go to `/sign-up`
   - Fill in the form
   - Choose "Customer" or "Shopkeeper" role
   - Submit

2. **Login:**
   - Go to `/sign-in`
   - Enter email and password
   - Submit

3. **Test Protected Routes:**
   - As a shopkeeper: Access `/shopkeeper/dashboard`
   - As a customer: Access `/checkout` (with items in cart)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout (Protected)

### Shops
- `GET /api/shops` - Get all shops
- `GET /api/shops/:id` - Get shop by ID
- `POST /api/shops` - Create shop (Protected - Shopkeeper)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Protected - Shopkeeper)

### Orders
- `GET /api/orders` - Get orders (Protected)
- `POST /api/orders` - Create order (Protected - Customer)
- `PUT /api/orders/:id/status` - Update order status (Protected - Shopkeeper)

## Notes

- Backend uses in-memory storage (data resets on server restart)
- For production, replace with a database (MongoDB, PostgreSQL, etc.)
- JWT tokens are stored in localStorage
- CORS is configured to allow requests from frontend URL

## Troubleshooting

**Backend won't start:**
- Check if port 5001 is available (port 5000 is used by macOS AirPlay Receiver)
- Verify `.env` file exists and has correct values
- Run `npm install` in backend directory

**Frontend can't connect to API:**
- Verify backend is running on port 5001
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors

**Authentication not working:**
- Verify JWT_SECRET is set in backend `.env`
- Check browser localStorage for `auth_token`
- Verify token is being sent in Authorization header

