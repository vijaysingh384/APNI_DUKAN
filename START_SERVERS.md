# Starting the Servers

## Quick Start

### 1. Start Backend Server

Open a terminal and run:

```bash
cd backend
npm install  # Only needed first time
npm run dev
```

You should see:
```
✅ Server is running on http://localhost:5001
📡 API available at http://localhost:5001/api
🌍 Environment: development
📁 Uploads directory: /path/to/backend/uploads
```

### 2. Start Frontend Server

Open a **new terminal** and run:

```bash
cd APNIDUKAN
npm install  # Only needed first time
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Troubleshooting

### Error: `ERR_CONNECTION_REFUSED`

This means the backend server is not running. 

**Solution:**
1. Make sure the backend server is started (see step 1 above)
2. Check that it's running on port 5001
3. Verify the frontend `.env` file has: `VITE_API_URL=http://localhost:5001/api`

### Error: Port Already in Use

If you see `Port 5001 is already in use`:

**Solution:**
```bash
# Kill the process using port 5001
lsof -ti:5001 | xargs kill -9

# Or change the port in backend/.env
PORT=5002
```

### Backend Not Starting

**Check:**
1. Are you in the `backend` directory?
2. Did you run `npm install`?
3. Is there a `.env` file? (It's optional, defaults work)
4. Check for error messages in the terminal

### Frontend Can't Connect to Backend

**Check:**
1. Backend is running (see terminal 1)
2. Backend is on port 5001 (check backend terminal output)
3. Frontend `.env` has correct URL: `VITE_API_URL=http://localhost:5001/api`
4. No firewall blocking localhost connections

## Environment Variables

### Backend (.env in `backend/` directory)
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env in `APNIDUKAN/` directory)
```env
VITE_API_URL=http://localhost:5001/api
```

## Testing Connection

Once both servers are running, test the connection:

```bash
# Test backend health
curl http://localhost:5001/api/health

# Should return: {"status":"ok","message":"Server is running"}
```

## Common Issues

1. **Backend starts but frontend shows connection refused**
   - Restart the frontend dev server after starting backend
   - Clear browser cache
   - Check browser console for exact error

2. **Uploads not working**
   - Make sure `backend/uploads/` directory exists
   - Check file permissions
   - Verify multer is installed: `cd backend && npm install multer`

3. **CORS errors**
   - Verify `FRONTEND_URL` in backend `.env` matches frontend URL
   - Default is `http://localhost:5173`

