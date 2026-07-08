# FoodGenie Deployment Guide

This guide provides step-by-step instructions on how to host and deploy the **FoodGenie** application. The backend is deployed to **Railway**, and the frontend is deployed to **Vercel**. 

---

## Table of Contents
1. [Git Setup & Pushing Code](#1-git-setup--pushing-code)
2. [MongoDB Atlas Setup](#2-mongodb-atlas-setup)
3. [Backend Deployment (Railway)](#3-backend-deployment-railway)
4. [Frontend Deployment (Vercel)](#4-frontend-deployment-vercel)
5. [Linking Frontend and Backend (Crucial)](#5-linking-frontend-and-backend-crucial)

---

## 1. Git Setup & Pushing Code

Before deploying to Railway or Vercel, your code must be pushed to a Git repository (like GitHub).

### Steps:
1. Initialize the repository (if not already done):
   ```bash
   git init
   ```
2. Add your GitHub remote repository as origin:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
3. Stage and commit all changes:
   ```bash
   git add .
   ```
   *Note: Sensitive files like `backend/config/config.env` and `.env` are automatically ignored by our [.gitignore](file:///.gitignore).*
4. Commit changes:
   ```bash
   git commit -m "Configure monorepo scripts, deployment files, and fallback port"
   ```
5. Push to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```

---

## 2. MongoDB Atlas Setup

The application uses MongoDB as its database. You can host a free cluster on MongoDB Atlas.

### Steps:
1. Sign up/log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project, then click **Create a Database** and select the **M0 (Free)** Shared Cluster.
3. Choose your cloud provider and region, then click **Create**.
4. In **Security Quickstart**:
   - Create a database user (remember the username and password!).
   - In IP Access List, add `0.0.0.0/0` (Allow access from anywhere) so that Railway can connect to the database.
5. Click **Database** under Deployment, then click **Connect** on your cluster.
6. Select **Drivers** and copy your **Connection String**. It will look like this:
   ```text
   mongodb+srv://<db_username>:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
7. Replace `<db_username>` and `<db_password>` with your database user credentials. Change the database name (before the `?`) to `foodgenie` (or any name you prefer). Keep this URI handy for Railway setup.

---

## 3. Backend Deployment (Railway)

We host the Node/Express backend on **Railway**.

### Steps:
1. Sign up/log in to [Railway.app](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo** and select your repository.
3. **DO NOT DEPLOY YET.** Click on the service once it's created and go to **Settings**:
   - Find the **Root Directory** setting under the **General** / **Build** section and set it to `backend`. This tells Railway to compile and start the app using `backend/package.json`.
4. Go to the **Variables** tab of the backend service and click **New Variable** or **Raw Editor** to paste the environment variables. Use the following keys (see `backend/config/config.env.example` as a template):
   
   | Key | Description / Value |
   | --- | --- |
   | `PORT` | `8080` (Railway will overwrite this automatically with its dynamic port, which is fine) |
   | `NODE_ENV` | `PRODUCTION` |
   | `DB_URI` | *Your MongoDB Atlas Connection String from Step 2* |
   | `JWT_SECRET` | *A random long string (e.g., `mySuperSecr3tToken123!`)* |
   | `JWT_EXPIRES` | `7d` |
   | `JWT_EXPIRES_TIME` | `7` |
   | `STRIPE_API_KEY` | *Your Stripe Publishable Key (`pk_test_...`)* |
   | `STRIPE_SECRET_KEY` | *Your Stripe Secret Key (`sk_test_...`)* |
   | `GROQ_API_KEY` | *Your Groq Cloud API Key (`gsk_...`)* |
   | `CLOUDINARY_CLOUD_NAME` | *Your Cloudinary Cloud Name* |
   | `CLOUDINARY_API_KEY` | *Your Cloudinary API Key* |
   | `CLOUDINARY_API_SECRET_KEY` | *Your Cloudinary API Secret Key* |
   | `EMAIL_HOST` | `smtp.mailtrap.io` (or your preferred SMTP host) |
   | `EMAIL_PORT` | `2525` |
   | `EMAIL_USERNAME` | *Your SMTP Username* |
   | `EMAIL_PASSWORD` | *Your SMTP Password* |
   | `EMAIL_FROM` | `noreply@foodgenie.com` |
   | `FRONTEND_URL` | *Temporary placeholder (e.g., `http://localhost:5173`). You will update this after Vercel deployment.* |

5. Once the variables are added, Railway will automatically redeploy the backend.
6. Go to **Settings** -> **Public Networking** and click **Generate Domain**. You will get a URL like `https://foodgenie-production.up.railway.app`. Copy this URL.

---

## 4. Frontend Deployment (Vercel)

We host the Vite/React frontend on **Vercel**.

### Steps:
1. Sign up/log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project** and select your GitHub repository.
3. In the configure screen:
   - Set **Root Directory** to `frontend`.
   - Vercel will automatically detect the **Vite** framework preset, configuration build command (`npm run build`), and output directory (`dist`).
4. Expand **Environment Variables** and add:
   - **Name**: `VITE_API_URL`
   - **Value**: *Your Railway public backend URL generated in Step 3 (e.g., `https://foodgenie-production.up.railway.app` without a trailing slash)*
5. Click **Deploy**. Vercel will build the frontend and host it (e.g., `https://foodgenie-frontend.vercel.app`). Copy this URL.

---

## 5. Linking Frontend and Backend (Crucial)

Now that you have your Vercel frontend URL, you need to configure the backend to accept requests from it and handle checkout redirects correctly.

### Steps:
1. Go back to your project dashboard on **Railway**.
2. Click on your backend service and open the **Variables** tab.
3. Edit the `FRONTEND_URL` variable:
   - Set it to your Vercel deployment URL (e.g., `https://foodgenie-frontend.vercel.app` without a trailing slash).
4. Save the variable change. Railway will automatically redeploy the backend with the new environment value.
5. Your application is now fully live and connected!

---

### Troubleshooting
- **CORS Errors**: Ensure that the `FRONTEND_URL` on Railway matches the exact Vercel URL (e.g., `https://...` with no trailing slash `/`).
- **Payment Crashes**: Ensure that `STRIPE_SECRET_KEY` and `STRIPE_API_KEY` are correctly pasted into the Railway variables tab.
