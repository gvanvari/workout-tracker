# Tool Setup Guide - macOS Installation Instructions

Complete installation guide for all tools needed for the Workout Tracker MVP on macOS 13+ (Intel/Apple Silicon compatible).

---

## Table of Contents

1. [Homebrew](#homebrew)
2. [Node.js & npm](#nodejs--npm)
3. [Git & GitHub](#git--github)
4. [SQLite](#sqlite)
5. [Visual Studio Code](#visual-studio-code)
6. [TypeScript](#typescript)
7. [Postman (Testing)](#postman-testing)
8. [Project Setup](#project-setup)
9. [Troubleshooting](#troubleshooting)

---

## Node.js & npm

### What is it?

- **Node.js**: JavaScript runtime for backend development
- **npm**: Package manager (comes with Node.js)

### Installation

#### macOS (using Homebrew - Recommended)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (includes npm)
brew install node

# Verify installation
node --version
npm --version
```

#### macOS (Direct Download)

1. Go to https://nodejs.org
2. Download LTS version
3. Run installer
4. Verify:
   ```bash
   node --version
   npm --version
   ```

#### Windows

1. Go to https://nodejs.org
2. Download LTS version (.msi installer)
3. Run installer (accept defaults)
4. Restart terminal/PowerShell
5. Verify:
   ```bash
   node --version
   npm --version
   ```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install nodejs npm

# Verify
node --version
npm --version
```

### What You Get

- Node.js: JavaScript runtime
- npm: Package manager for installing libraries

---

## Git & GitHub

### What is it?

- **Git**: Version control system
- **GitHub**: Cloud repository for storing code

### Installation

#### macOS

```bash
# Using Homebrew
brew install git

# Verify
git --version
```

#### Windows

1. Download from https://git-scm.com/download/win
2. Run installer (accept defaults)
3. Restart terminal
4. Verify:
   ```bash
   git --version
   ```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git

# Verify
git --version
```

### GitHub Setup

1. Create account at https://github.com
2. Generate SSH key:

   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   # Press Enter 3 times (no passphrase)

   # Copy the public key
   cat ~/.ssh/id_ed25519.pub
   ```

3. Add SSH key to GitHub:

   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the public key

4. Test connection:
   ```bash
   ssh -T git@github.com
   # Should print: "Hi username! You've successfully authenticated..."
   ```

---

## SQLite

### What is it?

- File-based SQL database
- No server needed
- Perfect for local development

### Installation

#### macOS

```bash
# Using Homebrew
brew install sqlite

# Verify
sqlite3 --version
```

#### Windows

1. Download from https://www.sqlite.org/download.html
2. Download `sqlite-tools-win32-x86-*.zip`
3. Extract to a folder (e.g., `C:\sqlite`)
4. Add to PATH:
   - Right-click "This PC" → Properties
   - Advanced system settings → Environment variables
   - Add `C:\sqlite` to PATH
5. Verify in PowerShell:
   ```bash
   sqlite3 --version
   ```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install sqlite3

# Verify
sqlite3 --version
```

### Usage

```bash
# Open a database
sqlite3 data.db

# Inside SQLite:
.tables          # List tables
.schema          # Show schema
.exit            # Exit

# From command line:
sqlite3 data.db < schema.sql  # Run SQL file
```

---

## Visual Studio Code

### What is it?

- Code editor
- Lightweight but powerful

### Installation

#### macOS

```bash
# Using Homebrew
brew install visual-studio-code

# Or download from https://code.visualstudio.com
```

#### Windows

1. Download from https://code.visualstudio.com
2. Run installer
3. Accept defaults

#### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install code

# Or download from https://code.visualstudio.com
```

### Recommended Extensions

Install these in VS Code:

1. **TypeScript Vue Plugin** - For TypeScript support
2. **SQLite** - For database viewing
3. **REST Client** - For testing API endpoints
4. **Prettier** - Code formatter
5. **ESLint** - Code linter

```bash
# Install from command line
code --install-extension ms-vscode.vscode-typescript-vue
code --install-extension alexcvzz.vscode-sqlite
code --install-extension humao.rest-client
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

---

## TypeScript

### What is it?

- Superset of JavaScript with type safety
- Compiles to JavaScript

### Installation

```bash
# Install globally (recommended)
npm install -g typescript

# Verify
tsc --version

# Or install locally in project
npm install --save-dev typescript
npx tsc --version
```

### Quick Start

```bash
# Compile a file
tsc index.ts           # Creates index.js

# Watch mode (auto-compile on save)
tsc --watch

# Initialize TypeScript config
tsc --init
```

---

## npm - Package Management

### What is it?

- Package manager for JavaScript/Node.js
- Install libraries and dependencies

### Common Commands

```bash
# Install a package
npm install <package-name>

# Install as dev dependency (only for development)
npm install --save-dev <package-name>

# Install from package.json
npm install

# Update packages
npm update

# Check for vulnerable dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Remove a package
npm uninstall <package-name>

# List installed packages
npm list
```

### package.json

- Stores project metadata
- Lists all dependencies
- Defines scripts (start, build, test, etc.)

Example:

```json
{
  "name": "workout-tracker",
  "version": "1.0.0",
  "description": "Workout tracking app",
  "scripts": {
    "start": "node src/index.js",
    "dev": "ts-node src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

---

## Postman (Testing)

### What is it?

- GUI tool for testing API endpoints
- Alternative: curl (command line)

### Installation

#### macOS

```bash
brew install postman
```

#### Windows

1. Download from https://www.postman.com/downloads/
2. Run installer

#### Linux

1. Download from https://www.postman.com/downloads/
2. Extract and run

### Quick Usage

1. Open Postman
2. Create new request
3. Set method (GET, POST, PUT, DELETE)
4. Enter URL: `http://localhost:4000/api/exercises`
5. Add headers if needed
6. Send request
7. View response

### Alternative: curl (Command Line)

```bash
# GET request
curl http://localhost:4000/api/exercises

# POST request
curl -X POST http://localhost:4000/api/exercises \
  -H "Content-Type: application/json" \
  -d '{"date":"2025-01-20","name":"Squat","sets":3,"reps":"8,8,6","weight":225,"rpe":8}'

# With authentication
curl -H "Authorization: Bearer TOKEN" http://localhost:4000/api/exercises
```

---

## Project Setup Commands

### Step 1: Create Project Structure

```bash
# Create main directory
mkdir workout-tracker-v2
cd workout-tracker-v2

# Create subdirectories
mkdir frontend backend
```

### Step 2: Initialize Backend

```bash
cd backend

# Create package.json
npm init -y

# Install dependencies
npm install express sqlite3 bcrypt jsonwebtoken cors express-rate-limit dotenv
npm install --save-dev typescript @types/express @types/node ts-node

# Create TypeScript config
npx tsc --init

# Create source directory
mkdir src

cd ..
```

### Step 3: Initialize Frontend

```bash
cd frontend

# Create package.json
npm init -y

# Install dependencies
npm install --save-dev typescript vite

# Create TypeScript config
npx tsc --init

# Create source directory
mkdir src

cd ..
```

### Step 4: Verify Installation

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check Git
git --version

# Check SQLite
sqlite3 --version

# Check TypeScript (global)
tsc --version
```

---

## Environment Variables Setup

### Create .env file (Backend)

```bash
cd backend

# Create .env file (not committed to git)
cat > .env << EOF
PORT=4000
DB_PATH=./data.db
JWT_SECRET=your-super-secret-key-change-this-to-something-random-32-chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF

# Create .env.example (for git)
cat > .env.example << EOF
PORT=4000
DB_PATH=./data.db
JWT_SECRET=change-this-to-random-32-chars
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
EOF
```

### Create .gitignore

```bash
cd ..

cat > .gitignore << EOF
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# Database
*.db
*.sqlite

# Build
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
EOF
```

---

## Troubleshooting

### Node/npm Issues

**Problem: `npm: command not found`**

```bash
# Reinstall Node.js
# macOS:
brew uninstall node
brew install node

# Windows: Download and reinstall from nodejs.org
```

**Problem: Permission denied (npm)**

```bash
# macOS/Linux: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Problem: `EACCES` permission error**

```bash
# Option 1: Use sudo (not recommended)
sudo npm install -g <package>

# Option 2: Fix npm permissions (recommended)
npm install -g --prefix ~/.npm
export PATH=~/.npm/bin:$PATH
```

### Git/GitHub Issues

**Problem: `ssh: connect to host github.com port 22: Connection refused`**

```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/USERNAME/REPO.git
```

**Problem: `fatal: Not a git repository`**

```bash
# Initialize git
cd your-project
git init
git remote add origin https://github.com/USERNAME/REPO.git
```

### SQLite Issues

**Problem: `sqlite3: command not found`**

```bash
# macOS
brew install sqlite3

# Linux
sudo apt install sqlite3

# Windows: Add to PATH manually
```

### TypeScript Issues

**Problem: `tsc: command not found`**

```bash
# Install globally
npm install -g typescript

# Or use npx
npx tsc --version
```

**Problem: `Cannot find module`**

```bash
# Install missing types
npm install --save-dev @types/node @types/express

# Run npm install
npm install
```

---

## Verification Checklist

Run these commands to verify everything is installed:

```bash
# Node.js
node --version          # Should be v18+ or v20+

# npm
npm --version          # Should be 9+

# Git
git --version          # Should be 2.30+

# SQLite
sqlite3 --version      # Should show version

# TypeScript (if installed globally)
tsc --version         # Should show version

# VS Code
code --version        # Should show version
```

---

## Next Steps

Once everything is installed:

1. Create the project structure
2. Initialize git repository
3. Start with Phase 1 of the build plan
4. Follow the MVP specification

For questions or issues, refer back to this guide!
