# Deploy Talk Trade to Render (Free)

Follow these steps to get a single public URL for your Talk Trade application.

## Prerequisites
- GitHub account
- MongoDB Atlas account (free)
- Render account (free) - Sign up at [render.com](https://render.com)

## Step 1: Prepare Your MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster if you haven't already
3. Click "Connect" → "Connect your application"
4. Copy your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/talktrade?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Keep this connection string handy

## Step 2: Push Your Code to GitHub

1. Create a new repository on GitHub
2. In your project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Talk Trade"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/talktrade.git
   git push -u origin main
   ```

## Step 3: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Click "Connect a repository" and authorize GitHub
4. Select your `talktrade` repository
5. Configure the service:

**Basic Settings:**
- **Name**: `talktrade-api`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables** (Click "Add Environment Variable"):
- `MONGO_URI` = Your MongoDB connection string from Step 1
- `JWT_SECRET` = `talktrade_secret_key_2024`
- `PORT` = `5000`
- `CLIENT_URL` = `https://talktrade.onrender.com` (we'll update this after frontend deployment)
- `NODE_ENV` = `production`

6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. **Copy your backend URL**: It will be something like `https://talktrade-api.onrender.com`

## Step 4: Update Frontend to Use Deployed Backend

Before deploying the frontend, update the API URL:

Edit `client/src/utils/api.js` and change:

```javascript
const api = axios.create({
  baseURL: "https://talktrade-api.onrender.com/api", // Use your actual backend URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Commit this change:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

## Step 5: Deploy Frontend to Render

1. Go back to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Static Site"
3. Select your `talktrade` repository
4. Configure:

**Basic Settings:**
- **Name**: `talktrade`
- **Branch**: `main`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

5. Click "Create Static Site"
6. Wait 5-10 minutes for deployment
7. **Your website URL**: `https://talktrade.onrender.com`

## Step 6: Final Configuration

1. Go back to your backend service settings
2. Update the `CLIENT_URL` environment variable to your frontend URL: `https://talktrade.onrender.com`
3. Manually deploy the backend again (click "Manual Deploy" → "Deploy latest commit")

## Step 7: Test Your Application

1. Visit your frontend URL: `https://talktrade.onrender.com`
2. Try registering a new account
3. Test creating a gig, messaging, etc.

## Your Single Access URL

**🎉 Your Talk Trade website is now live at:**
```
https://talktrade.onrender.com
```

Share this URL with anyone - they can access it from anywhere in the world!

## Important Notes

- **Free tier limitations**: 
  - Backend may sleep after 15 minutes of inactivity
  - First request after sleep takes 30-60 seconds
  - Upgrade to paid plan ($7/month) to prevent sleeping

- **Custom Domain**: You can add your own domain (e.g., www.talktrade.com) in Render's settings

- **Updates**: To update your app, just push to GitHub:
  ```bash
  git add .
  git commit -m "Your update message"
  git push
  ```
  Render will automatically redeploy!

## Troubleshooting

**Backend not connecting?**
- Check environment variables are correct
- Verify MongoDB connection string
- Check backend logs in Render dashboard

**Frontend blank page?**
- Check if API URL is correct in `client/src/utils/api.js`
- Check browser console for errors
- Verify backend is running

**CORS errors?**
- Ensure `CLIENT_URL` in backend matches your frontend URL exactly
- Backend CORS is already configured for your frontend
