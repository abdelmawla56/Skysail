# 🚀 Skysail Deployment Guide

Follow these steps to move your application from localhost to the web.

## 1. Prepare the Backend (Render.com)

1.  **Create account**: Go to [Render](https://render.com/) and connect your GitHub.
2.  **New Web Service**: Select your `Skysail` repository.
3.  **Configure Settings**:
    - **Root Directory**: `backend`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
4.  **Environment Variables**: Add everything from your `.env` file:
    - `MONGODB_URI`: (Your Atlas string)
    - `JWT_SECRET`: (Your secret)
    - `MAIL_HOST`, `MAIL_USER`, etc.
    - `PORT`: `10000` (Render will set this automatically, but good to have)

## 2. Prepare the Frontend (Netlify - RECOMMENDED)

### Step A: Configure API URL
I have updated `frontend/src/services/api.js` to use an environment variable. When deploying the frontend:
1.  **Netlify Settings**: Go to **Site Settings** > **Environment variables**.
2.  **Add Variable**: Name it `VITE_API_URL`.
3.  **Value**: Set this to your **Render Backend URL** (e.g., `https://skysail-backend.onrender.com/api`).

### Step B: Deploy to Netlify
1.  Go to [Netlify](https://app.netlify.com/) and click **"Add new site"** > **"Import an existing project"**.
2.  Connect to GitHub and select `Skysail`.
3.  **Configure Settings**:
    - **Base directory**: `frontend`
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
4.  **Deploy**: Netlify will automatically use the `netlify.toml` I created to handle everything else!

## 3. Alternative: Prepare the Frontend (Vercel)
... (keep existing Vercel instructions below)

## 3. Configure MongoDB Atlas (CRITICAL)

Since your app is now running on a cloud server, you must whitelist the cloud server's IP in MongoDB Atlas:
1.  Go to **Network Access** in MongoDB Atlas.
2.  Click **Add IP Address**.
3.  Select **Allow Access from Anywhere** (0.0.0.0/0) – this is necessary for Render as their free IPs change.

## 4. Final Verification
1.  Open your Vercel URL.
2.  Check if flights load (fetching from Render).
3.  Try to sign up (Emails should still work via Mailtrap).
