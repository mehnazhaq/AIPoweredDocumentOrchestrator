# Deployment Guide: Vercel (Frontend) & Render (Backend)

## Overview
- **Frontend**: Deploy to Vercel (optimized for React/Vite apps)
- **Backend**: Deploy to Render (Node.js/Express server)

---

## Part 1: Backend Deployment on Render

### Prerequisites
- GitHub account (with your repository pushed)
- Render account (free tier available at render.com)

### Step-by-Step Backend Deployment

#### 1. Prepare Your Backend
```bash
# Ensure your backend is production-ready
cd backend
npm install  # Make sure all dependencies are installed
```

#### 2. Create Render Account & Deploy
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended for easy integration)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository containing this project
5. Fill in the deployment form:
   - **Name**: `ai-doc-orchestrator-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Runtime**: `node-18` (or latest available)

#### 3. Configure Environment Variables
In the Render dashboard:
1. Go to your service → **Environment**
2. Add environment variables:
   ```
   PORT=5000
   GEMINI_API_KEY=<your_actual_gemini_key>
   GROQ_API_KEY=<your_actual_groq_key>
   N8N_WEBHOOK_URL=<your_n8n_webhook_url>
   NODE_ENV=production
   ```
3. **Important**: Replace with your actual API keys

#### 4. Deploy
1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Once deployed, copy your Render backend URL (looks like: `https://ai-doc-orchestrator-backend.onrender.com`)
4. Note this URL - you'll need it for frontend configuration

---

## Part 2: Frontend Deployment on Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier available at vercel.com)

### Step-by-Step Frontend Deployment

#### 1. Update Backend URL
Before deploying, update your frontend's environment variable:

1. **Create production environment file**:
   - The `.env.production` file should contain:
     ```
     VITE_API_URL=https://your-render-backend-url.onrender.com/api
     ```
     Replace `your-render-backend-url` with your actual Render URL from Step 1

#### 2. Create Vercel Account & Deploy
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Import Project"**
4. Select your repository from the list
5. Configure the project:
   - **Root Directory**: Select `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci` (or `npm install`)

#### 3. Configure Environment Variables
1. In Vercel project settings → **Environment Variables**
2. Add the variable:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com/api
   ```
3. Apply to: **Production**

#### 4. Deploy
1. Click **"Deploy"**
2. Vercel will automatically build and deploy your frontend
3. Once complete, you'll get a live URL (looks like: `https://your-app.vercel.app`)

---

## Part 3: Verification & Testing

### 1. Test Backend API
Open your Render backend URL in browser:
```
https://your-render-backend-url.onrender.com/
```
You should see: `"Backend API is running. Please use the frontend application to interact with this service."`

### 2. Test Frontend
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Upload a document and test the extraction feature
3. Check browser console (F12) for any API errors

### 3. Fix CORS Issues (if any)
If you get CORS errors, the backend server.js already has CORS enabled, but verify:
- CORS is properly configured in `backend/server.js`
- The frontend is making requests to the correct API URL
- Backend environment variables are properly set

---

## Part 4: Production Considerations

### Security Notes
- ❌ **DO NOT** commit `.env` files with real API keys
- ✅ **DO** use `.env.example` as template
- ✅ **DO** add environment variables through the platform UI (Vercel/Render)

### Performance Tips
- The Vite build is already optimized with minification
- Frontend caching is automatically handled by Vercel CDN
- Monitor Render free tier limits (if using free tier)

### Common Issues & Solutions

#### Backend won't start
- Check the Render logs: Click service → Logs
- Verify all environment variables are set
- Ensure `server.js` has PORT configured: `process.env.PORT || 5000`

#### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct in Vercel environment variables
- Check browser console for CORS errors
- Ensure backend service is running (check Render dashboard)

#### Stuck on deployment
- Vercel: Check the **Deployments** tab for build logs
- Render: Check the **Logs** tab
- Look for error messages and fix accordingly

---

## Part 5: Post-Deployment

### Update Your README
Add deployment URLs to your project:
```markdown
## Deployed Application
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-render-backend-url.onrender.com
```

### Monitor Deployments
- **Vercel**: Dashboard shows all deployments
- **Render**: Check service dashboard for uptime and logs

### Redeploy on Updates
- **Frontend**: Push to GitHub main branch → Vercel auto-deploys
- **Backend**: Push to GitHub main branch → Render auto-deploys

---

## Useful Links
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Express Deployment](https://expressjs.com/en/advanced/best-practice-performance.html)

## Support
If you encounter issues:
1. Check platform logs (Vercel/Render dashboards)
2. Verify environment variables are correctly set
3. Ensure GitHub repository is up to date
4. Check that API keys are valid
