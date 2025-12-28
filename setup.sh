#!/bin/bash

# Workout Tracker - Quick Setup Script for macOS
# This script installs all dependencies and prepares the application

set -e  # Exit on error

echo "======================================"
echo "🏋️  Workout Tracker - Setup"
echo "======================================"
echo ""

# Check Node.js
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Download from: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION found"
echo ""

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo "   ✅ Created .env file (default settings)"
else
    echo "   ✅ .env already exists"
fi
cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "📦 Installing Root Dependencies..."
npm install

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "📚 Next steps:"
echo ""
echo "   1. Review backend/.env if needed"
echo "   2. Start development servers:"
echo ""
echo "      npm run dev"
echo ""
echo "   3. Open http://localhost:5173 in your browser"
echo "   4. Login with password: yourPassword"
echo ""
echo "For detailed setup instructions, see SETUP.md"
echo ""
echo "Happy coding! 💪"
