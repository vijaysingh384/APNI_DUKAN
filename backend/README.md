# APNIDUKAN Backend API

Backend server for APNIDUKAN e-commerce platform with JWT authentication.

## Features

- JWT-based authentication
- User registration and login
- Shop management (for shopkeepers)
- Product management (for shopkeepers)
- Order management
- Protected routes with middleware

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

4. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)
- `PUT /api/auth/password` - Change password (Protected)

### Shops
- `GET /api/shops` - Get all shops
- `GET /api/shops/:id` - Get shop by ID
- `POST /api/shops` - Create shop (Protected - Shopkeeper)
- `PUT /api/shops/:id` - Update shop (Protected - Owner)
- `DELETE /api/shops/:id` - Delete shop (Protected - Owner)

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Protected - Shopkeeper)
- `PUT /api/products/:id` - Update product (Protected - Shopkeeper)
- `DELETE /api/products/:id` - Delete product (Protected - Shopkeeper)

### Orders
- `GET /api/orders` - Get orders (Protected - filtered by role)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `POST /api/orders` - Create order (Protected - Customer)
- `PUT /api/orders/:id/status` - Update order status (Protected - Shopkeeper)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Example Requests

### Register
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "customer"
  }'
```

### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## Notes

- This is a demo implementation using in-memory storage
- For production, replace with a proper database (MongoDB, PostgreSQL, etc.)
- Implement refresh tokens for better security
- Add rate limiting
- Add input sanitization
- Implement proper error logging

