# APNIDUKAN Project

E-commerce platform for local shopkeepers with JWT authentication.

## Quick Start

### Backend Setup

**⚠️ IMPORTANT: Backend must be running before starting the frontend!**

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file:
```bash
# .env file (optional - defaults work):
PORT=5001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

4. Start backend server:
```bash
npm run dev    # Development mode with auto-reload
# or
npm start      # Production mode
```

**You should see:**
```
✅ Server is running on http://localhost:5001
📡 API available at http://localhost:5001/api
```

**If you see `ERR_CONNECTION_REFUSED` errors, the backend is not running!**

Backend runs on `http://localhost:5001` (Note: Port 5000 is used by macOS AirPlay Receiver)

### Frontend Setup

**Important:** All frontend npm commands must be run from the `APNIDUKAN` directory.

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
# Create .env file with:
VITE_API_URL=http://localhost:5001/api
```

4. Start frontend development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd APNIDUKAN
npm run dev
```

Or use the helper scripts:
```bash
./start-backend.sh    # Start backend
cd APNIDUKAN && npm run dev  # Start frontend
```

## Project Structure

```
dukan/
├── backend/            # Express.js backend with JWT auth
│   ├── server.js       # Main server file
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   └── models/         # Data models
├── APNIDUKAN/          # React frontend
│   ├── src/            # Source code
│   ├── package.json    # Dependencies
│   └── ...
├── start-backend.sh    # Backend startup script
└── run.sh              # Frontend helper script
```

## Features

### Authentication
- ✅ User registration (Customer/Shopkeeper)
- ✅ User login with JWT tokens
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Password hashing

### Frontend
- ✅ Complete shopping flow
- ✅ Shopkeeper dashboard
- ✅ Product management
- ✅ Order management
- ✅ Form validation
- ✅ Error handling
- ✅ Toast notifications

### Backend API
- ✅ RESTful API with Express
- ✅ JWT authentication
- ✅ Shop management
- ✅ Product management
- ✅ Order management
- ✅ Input validation

## Common Commands

### Frontend (APNIDUKAN directory)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Backend (backend directory)
- `npm run dev` - Start development server (with nodemon)
- `npm start` - Start production server

## API Documentation

See `AUTHENTICATION_SETUP.md` for complete API documentation.

## Testing Authentication

1. **Register:** Go to `/sign-up` and create an account
2. **Login:** Go to `/sign-in` and login
3. **Access Dashboard:** Shopkeepers can access `/shopkeeper/dashboard`
4. **Place Order:** Customers can checkout with items in cart

## Environment Variables

### Backend (.env in backend/)
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration (default: 7d)
- `FRONTEND_URL` - CORS allowed origin

### Frontend (.env in APNIDUKAN/)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

