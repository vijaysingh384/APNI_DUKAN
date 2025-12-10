# JWT Authentication Implementation

## Overview

Complete JWT-based authentication system has been implemented with Express.js backend and React frontend.

## Backend Structure

```
backend/
├── server.js              # Main Express server
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   └── User.js           # User model (in-memory storage)
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── shops.js          # Shop management routes
│   ├── products.js       # Product management routes
│   └── orders.js         # Order management routes
├── .env                  # Environment variables
└── package.json          # Dependencies
```

## Frontend Integration

```
APNIDUKAN/src/
├── lib/
│   └── api.ts            # API client with JWT token handling
├── store/
│   └── authStore.ts     # Zustand store for auth state
├── components/
│   └── ProtectedRoute.tsx # Route protection component
└── pages/
    ├── sign-in.tsx       # Login page
    └── sign-up.tsx       # Registration page
```

## Features Implemented

### Backend
✅ User registration with email/password
✅ User login with JWT token generation
✅ Password hashing with bcrypt
✅ JWT token verification middleware
✅ Protected routes (require authentication)
✅ Role-based access control (customer/shopkeeper)
✅ User profile management
✅ Password change functionality

### Frontend
✅ Sign up page with role selection
✅ Sign in page with form validation
✅ JWT token storage in localStorage
✅ Automatic token inclusion in API requests
✅ Protected route component
✅ Auth state management with Zustand
✅ Auto-check authentication on app load
✅ User info display in navbar
✅ Logout functionality

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "customer" // or "shopkeeper"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (Protected)
  - Requires: `Authorization: Bearer <token>`

- `POST /api/auth/logout` - Logout (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/password` - Change password (Protected)

## How It Works

1. **Registration/Login:**
   - User submits credentials
   - Backend validates and creates/verifies user
   - JWT token is generated and returned
   - Frontend stores token in localStorage
   - Token is included in all subsequent API requests

2. **Protected Routes:**
   - `ProtectedRoute` component checks authentication
   - If not authenticated, redirects to sign-in
   - If wrong role, redirects to home
   - Shows loading state while checking auth

3. **API Requests:**
   - All API calls automatically include JWT token
   - Token is sent in `Authorization: Bearer <token>` header
   - Backend middleware verifies token on protected routes

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens with expiration (7 days default)
- ✅ Token validation on every protected request
- ✅ CORS configuration for frontend
- ✅ Input validation with express-validator
- ✅ Error handling and proper status codes

## Usage Example

### Register a Shopkeeper
1. Go to `/sign-up`
2. Fill form with:
   - Name: "Vijay Kumar"
   - Email: "vijay@example.com"
   - Password: "password123"
   - Role: "Shopkeeper"
3. Submit → Redirected to `/create-shop`

### Login
1. Go to `/sign-in`
2. Enter email and password
3. Submit → Redirected based on role:
   - Shopkeeper → `/shopkeeper/dashboard`
   - Customer → `/shops`

### Access Protected Routes
- Shopkeeper routes require `role: 'shopkeeper'`
- Customer routes require `role: 'customer'`
- Unauthorized access redirects to sign-in

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Next Steps (Production)

1. **Database Integration:**
   - Replace in-memory storage with MongoDB/PostgreSQL
   - Add proper user schema
   - Implement connection pooling

2. **Enhanced Security:**
   - Add refresh tokens
   - Implement token blacklisting
   - Add rate limiting
   - Add email verification
   - Add password reset functionality

3. **Additional Features:**
   - Social login (Google, Apple, GitHub)
   - Two-factor authentication
   - Session management
   - Audit logging

## Testing

### Test Registration
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "role": "customer"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer <your-token>"
```

## Notes

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- In-memory storage resets on server restart
- All passwords are hashed before storage
- JWT tokens include user ID, email, role, and shopId

