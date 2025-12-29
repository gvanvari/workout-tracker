# 🏋️ Workout Tracker - Quick Start

## 30 Seconds

```bash
cd /Users/gvanvari/code/workout-tracker
./setup.sh
npm run dev
```

Open http://localhost:5173 → Login with `yourPassword`

## Commands

```bash
npm run dev              # Both servers
npm run build            # Production build
npm -C backend run dev   # Backend only
npm -C frontend run dev  # Frontend only
```

## Common Tasks

```bash
# Reset database
rm backend/workout.db

# Kill process on port 4000
lsof -i :4000 && kill -9 <PID>

# View database
sqlite3 backend/workout.db "SELECT * FROM exercises;"

# Export data (also in UI)
GET http://localhost:4000/api/backup/export?token=YOUR_TOKEN
```

## Docs

- [SETUP.md](SETUP.md) - Full setup guide
- [tool-setup.md](tool-setup.md) - Tool installation
- [README.md](README.md) - Architecture & security
- [mvp-spec.md](mvp-spec.md) - Feature spec
