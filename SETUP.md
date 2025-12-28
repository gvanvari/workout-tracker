# Setup Instructions - Workout Tracker MVP

Complete step-by-step guide to get the application running on macOS.

## Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js version (should be 18.0.0 or higher)
node --version

# Check npm version (should be 9.0.0 or higher)
npm --version
```

If Node.js is not installed, download from https://nodejs.org (LTS version recommended)

## Step 1: Install Backend Dependencies

```bash
# Navigate to backend directory
cd /Users/gvanvari/code/workout-tracker/backend

# Install all dependencies
npm install

# Create environment file from template
cp .env.example .env
```

This installs:
- Express.js (web server framework)
- SQLite3 (database)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors (cross-origin requests)
- express-rate-limit (rate limiting)
- ts-node (TypeScript executor)
- TypeScript compiler

## Step 2: Install Frontend Dependencies

```bash
# Navigate to frontend directory (from project root)
cd /Users/gvanvari/code/workout-tracker/frontend

# Install all dependencies
npm install
```

This installs:
- Vite (build tool & dev server)
- TypeScript

## Step 3: Install Root Dependencies (Optional but Recommended)

```bash
# From project root
cd /Users/gvanvari/code/workout-tracker

npm install
```

This allows you to run both servers simultaneously with `npm run dev`

## Step 4: Configure Environment Variables

Edit `backend/.env` and customize if needed:

```bash
# Open the file
nano backend/.env
```

Default settings:
```
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
DB_PATH=./workout.db
```

**Important Security Notes:**
- Change `JWT_SECRET` to a random string for production
- Change the default password in `backend/src/auth.ts` (currently 'yourPassword')
- Never commit `.env` to version control (it's in `.gitignore`)

## Step 5: Start the Application

### Option A: Run Both Servers Together (Recommended)

```bash
# From project root
cd /Users/gvanvari/code/workout-tracker

npm run dev
```

This starts:
- Backend on http://localhost:4000
- Frontend on http://localhost:5173

Press `Ctrl+C` to stop both servers.

### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd /Users/gvanvari/code/workout-tracker/backend
npm run dev
```
Backend runs on http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd /Users/gvanvari/code/workout-tracker/frontend
npm run dev
```
Frontend opens at http://localhost:5173 (opens in browser automatically)

## Step 6: First Login

1. Open http://localhost:5173 in your browser
2. Enter the default password: `yourPassword`
3. Click "Login"

You should see an empty dashboard. You're ready to start logging workouts!

## First Test

1. Click "Add Exercise"
2. Fill in the form:
   - Date: Today's date (auto-filled)
   - Exercise Name: "Squat"
   - Sets: 4
   - Reps: "8,8,6,5"
   - Weight: 185
   - RPE: 8
   - Notes: "Test workout"
3. Click "Save Exercise"
4. Go to "History" to verify it was saved

## Database

The SQLite database is automatically created at `backend/workout.db` on first server startup.

To reset the database (delete all workouts):
```bash
# Backend must be stopped first
rm backend/workout.db
```

Restart the backend - it will recreate an empty database.

## Troubleshooting

### Port Already in Use

If you get "EADDRINUSE: address already in use :::4000":

```bash
# Kill process on port 4000
lsof -i :4000
kill -9 <PID>

# Or change the port in backend/.env
PORT=4001
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf backend/node_modules frontend/node_modules
cd backend && npm install
cd ../frontend && npm install
```

### "Cannot GET /" Error in Browser

Make sure both servers are running:
- Backend on port 4000
- Frontend on port 5173

Check terminal output for errors.

### Database Locked

Only one instance of the backend should access the database:
```bash
# Kill any running backend processes
ps aux | grep "npm\|node"
# Kill the relevant PID with: kill -9 <PID>
```

### TypeScript Errors on Startup

These are expected before `npm install`. They disappear after dependencies are installed.

## Build for Production

```bash
# From project root
npm run build

# Output files in:
# backend/dist/ - compiled backend
# frontend/dist/ - compiled frontend
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment
3. ✅ Run development servers
4. 📝 Start logging workouts
5. 🔐 Change default password for security
6. 📊 (Future) Add charts and analytics

## Getting Help

- Check `README.md` for architecture and API documentation
- Check `mvp-spec.md` for feature requirements
- Review error messages in terminal output
- Database stored in `backend/workout.db` (SQLite format)

## Quick Reference

```bash
# Development - both servers
npm run dev

# Build for production
npm run build

# Run compiled backend only
npm -C backend start

# View database contents (requires sqlite3 CLI)
sqlite3 backend/workout.db ".tables"
sqlite3 backend/workout.db "SELECT * FROM exercises;"

# Export your data
# Use the "Export Data" button in the app
# Or access via API: GET http://localhost:4000/api/backup/export
```

## Project Files

```
workout-tracker/
├── backend/              # Express API server
│   ├── src/
│   │   ├── index.ts      # Server setup
│   │   ├── database.ts   # SQLite schema
│   │   ├── auth.ts       # Authentication
│   │   ├── validators.ts # Input validation
│   │   └── routes.ts     # API endpoints
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── workout.db        # Database (created on first run)
│
├── frontend/             # Vite + TypeScript frontend
│   ├── src/
│   │   ├── main.ts       # App entry point
│   │   ├── api.ts        # API client
│   │   └── styles.css    # Styling
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── README.md             # Full documentation
├── SETUP.md              # This file
├── package.json          # Root scripts
└── .gitignore
```

---

**Congratulations!** Your Workout Tracker is ready to use. Start logging your workouts! 💪
