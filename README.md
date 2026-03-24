# Career Architect | Job Application Tracker

A completely modernized, full-stack job application tracker featuring a premium, glassmorphism-inspired dark theme and a cleanly structured, scalable Express backend. Designed and built to make tracking career opportunities an elegant, effortless experience.

## Features

- **Obsidian Glass Design System:** A beautifully minimalist, dark-themed React frontend built with Tailwind CSS, utilizing frost-glass paneling and kinetic gradient highlights.
- **RESTful Architecture:** A robust Node.js/Express backend, carefully restructured into a scalable `src/` modular layout.
- **User Authentication:** Fully secured with JWT and bcrypt hashing.
- **Job Tracker Dashboard:** Track positions across stages (Applied, Interview, Offer, Rejected) with real-time stats overview.
- **Resume Management:** Uses `multer` for seamless local file uploads, allowing you to associate specific resumes to distinct job applications and maintain a global "Master Resume" on your profile.
- **Concurrent Development Environment:** Run both the frontend and backend servers together locally with a single `npm run dev` command.

## Tech Stack

**Frontend:**
- React (React Router v6)
- Tailwind CSS (Custom Obsidian Theme)
- Axios
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- Multer (File upload system)

## Project Structure

This project follows a professional directory setup separating the view layer from business logic.

```
├── client/                 # React frontend
│   ├── public/           
│   ├── src/                
│   │   ├── components/     # Reusable layout and wrapper components
│   │   ├── contexts/       # React Context (Auth State)
│   │   ├── pages/          # Full page views (Dashboard, AddEditJob, etc.)
│   │   └── index.css       # Tailwind entry and global custom styles
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/                
│   │   ├── middleware/     # Auth and upload handlers
│   │   ├── models/         # Mongoose Schemas (User, Job)
│   │   ├── routes/         # Express API Routers
│   │   └── index.js        # Main server entry point
│   ├── .env                # Backend environment variables
│   └── package.json
│
└── uploads/                # Local directory for user resume storage (auto-created)
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB Database (Local or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Arjun-coder-ops/job-application-tracker.git
   cd job-application-tracker
   ```

2. Install dependencies for the root, client, and server workspaces:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

3. Setup Environment Variables:
   Inside the `server/` directory, create a `.env` file (you can copy `.env.example`):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/job-tracker
   JWT_SECRET=your_super_secret_key_here
   NODE_ENV=development
   ```

4. Run the Full Stack Application:
   In the root directory of the project, run:
   ```bash
   npm run dev
   ```
   The backend server will start on `http://localhost:5000`, and the React client will run concurrently on `http://localhost:3000`.
