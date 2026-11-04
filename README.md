# HiPro: Job Portal for Students and Recruiters

HiPro is a job portal, similar to LinkedIn Jobs. **Recruiters** post jobs and review applicants. **Students** browse jobs, apply with a resume, and track their application status.

🌐 **Live demo:** https://hipro-backend.onrender.com
*(Hosted on Render's free plan. If the site was idle, the first load can take up to a minute.)*

## Features

**For students**
- Sign up and log in
- Browse all job postings, with sorting
- Apply with a resume upload (up to 5 MB) and a cover letter
- Track each application: Pending, Accepted or Rejected

**For recruiters**
- Sign up and log in
- Post new jobs (title, company, location, salary, job type)
- See all incoming applications and open candidate resumes
- Accept or reject applications
- Dashboard with totals for postings and pending reviews

## Tech stack
| Part | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| File upload | Multer |
| Hosting | Render (app) and MongoDB Atlas (database) |

## Folder structure
```
hipro-backend/
├── backend/
│   ├── models/        user.js, job.js, application.js
│   ├── routes/        auth.js, jobs.js
│   └── server.js      Express server (also serves the built frontend)
└── frontend/
    ├── src/           React pages and components
    └── vite.config.js
```

## Deploy on Render (step by step)

The backend serves the frontend too, so **one Render service runs the whole app.**

### Step 1: Create the database (MongoDB Atlas, free)
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free **M0** cluster.
2. **Database Access** → Add a database user. Save the username and password.
3. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`).
4. Click **Connect → Drivers** and copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/hipro`
   Put your real password in place of `<password>` and add `/hipro` before any `?`.

### Step 2: Create the Render web service
1. Sign in at [render.com](https://render.com) with GitHub.
2. Click **New → Web Service** and select this repository.
3. Fill in these settings:

| Setting | Value |
|---|---|
| Name | `hipro-backend` |
| Language | Node |
| Branch | `main` |
| Root Directory | *(leave empty)* |
| Build Command | `cd frontend && npm install --include=dev && npm run build && cd ../backend && npm install` |
| Start Command | `cd backend && node server.js` |
| Instance Type | Free |

> The name must be `hipro-backend`, because the frontend calls `https://hipro-backend.onrender.com/api`.

### Step 3: Add environment variables
In the **Environment** section, add:

| Key | Value |
|---|---|
| `MONGO_URL` | your Atlas connection string from Step 1 |
| `NODE_VERSION` | `22` |

### Step 4: Deploy and open
1. Click **Create Web Service**. The first build takes a few minutes.
2. When the logs show **"Database Connection Verified"**, open your URL: `https://hipro-backend.onrender.com`
3. Register as a recruiter, post a job, then register as a student and apply.

Every `git push` to `main` redeploys automatically.

## Run on your computer
You need [Node.js](https://nodejs.org) 20 or newer and a MongoDB connection string.

```bash
git clone https://github.com/ckkarthikeyan731-ai/hipro-backend.git
cd hipro-backend
```

1. Create `backend/.env`:
   ```
   MONGO_URL=your_mongodb_connection_string
   PORT=5000
   ```
2. The frontend is set to call the deployed server. To use your local server, replace `https://hipro-backend.onrender.com/api` with `http://localhost:5000/api` in `frontend/src/config.js` and `frontend/src/App.jsx`.
3. Build the frontend and start the server:
   ```bash
   cd frontend
   npm install
   npm run build
   cd ../backend
   npm install
   node server.js
   ```
4. Open http://localhost:5000

## Author
Karthikeyan C K, [GitHub](https://github.com/ckkarthikeyan731-ai)
