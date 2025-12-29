# Setup Instructions - Workout Tracker MVP

## Prerequisites

Ensure you have: Node.js 18+, npm 9+, SQLite, Git

See [tool-setup.md](tool-setup.md) to install these tools.

## Step 1: Install Dependencies

```bash
cd /Users/gvanvari/code/workout-tracker

# Root dependencies (for concurrent server startup)
npm install

# Backend & Frontend
npm -C backend install
npm -C frontend install
```

## Step 2: Configure Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` if needed (defaults are fine for local dev).

## Step 3: Start the Application

```bash
# Both servers (recommended)
npm run dev

# Or separately:
npm -C backend run dev    # Backend on :4000
npm -C frontend run dev   # Frontend on :5173
```

## Step 4: First Use

Open http://localhost:5173 → Login with `yourPassword`

**Default database:** `backend/workout.db` (auto-created on first run)

**Reset database:**

```bash
rm backend/workout.db
# Restart backend
```

## Troubleshooting

**Port already in use:**

```bash
lsof -i :4000
kill -9 <PID>
```

**Module errors:**

```bash
rm -rf backend/node_modules frontend/node_modules
npm install && npm -C backend install && npm -C frontend install
```

**Can't login:** Verify backend is running on http://localhost:4000 and password is `yourPassword`.

**Database locked:** Kill backend processes and restart.

## Security Notes

⚠️ **For production:**

- Change `JWT_SECRET` in `backend/.env`
- Change default password in `backend/src/auth.ts`
- Enable HTTPS
- Set `NODE_ENV=production`
- Configure database backups
