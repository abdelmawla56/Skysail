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

## 2. Prepare the Frontend (Vercel/Netlify)

### Step A: Configure API URL
I have updated `frontend/src/services/api.js` to use an environment variable. When deploying the frontend:
1.  **Vercel Settings**: Add an Environment Variable named `VITE_API_URL`.
2.  **Value**: Set this to your **Render Backend URL** (e.g., `https://skysail-backend.onrender.com/api`).

### Step B: Deploy to Vercel
1.  Go to [Vercel](https://vercel.com/) and import your GitHub repo.
2.  **Configure Settings**:
    - **Framework Preset**: `Vite`
    - **Root Directory**: `frontend`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
3.  **Deploy**: Hit deploy!

## 3. Configure MongoDB Atlas (CRITICAL)

Since your app is now running on a cloud server, you must whitelist the cloud server's IP in MongoDB Atlas:
1.  Go to **Network Access** in MongoDB Atlas.
2.  Click **Add IP Address**.
3.  Select **Allow Access from Anywhere** (0.0.0.0/0) – this is necessary for Render as their free IPs change.

## 4. Final Verification
1.  Open your Vercel URL.
2.  Check if flights load (fetching from Render).
3.  Try to sign up (Emails should still work via Mailtrap).
