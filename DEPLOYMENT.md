# Talk Trade - Deployment Guide

## Quick Deploy Options

### Option 1: Render (Recommended - Free & Easy)

#### Deploy Backend (5 minutes)
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub account (or upload this project to GitHub first)
4. Select your repository
5. Configure:
   - **Name**: `talktrade-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Add Environment Variables**:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: `your_secret_key`
     - `CLIENT_URL`: (will get from frontend deployment)
6. Click "Create Web Service"
7. **Save your backend URL**: `https://talktrade-api.onrender.com`

#### Deploy Frontend (5 minutes)
1. On Render, click "New +" → "Static Site"
2. Select your repository
3. Configure:
   - **Name**: `talktrade`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
4. Click "Create Static Site"
5. **Your website URL**: `https://talktrade.onrender.com`

#### Final Step: Update Environment Variables
1. Go back to your backend service on Render
2. Update `CLIENT_URL` to your frontend URL: `https://talktrade.onrender.com`
3. In your frontend, update the API URL (see below)

---

### Option 2: Vercel + Railway (Fast & Free)

#### Deploy Frontend to Vercel (3 minutes)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Deploy
6. **Your website URL**: `https://talktrade.vercel.app`

#### Deploy Backend to Railway (3 minutes)
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Configure:
   - **Root Directory**: `server`
   - Add environment variables (same as above)
5. Deploy
6. **Your backend URL**: `https://talktrade-production.up.railway.app`

---

### Option 3: Quick Local Network Access

If you just want to access it from other devices on your local network:

1. Run the app locally with `start.bat`
2. Find your local IP address:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

3. Access from any device on the same network:
   - Frontend: `http://192.168.1.100:5173`
   - Backend: `http://192.168.1.100:5000`

---

## Files to Update for Deployment

### Update Backend URL in Frontend
Edit `client/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://your-backend-url.com', // Change this
        changeOrigin: true,
      },
    },
  },
})
```

Or update `client/src/utils/api.js`:

```javascript
const api = axios.create({
  baseURL: "https://your-backend-url.com/api", // Change this
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## Recommended: Deploy to Render

**Step-by-step instructions included in deployment/RENDER.md**

After deployment, you'll get a single URL like:
**https://talktrade.onrender.com** ✨

This URL can be shared with anyone and accessed from anywhere!
