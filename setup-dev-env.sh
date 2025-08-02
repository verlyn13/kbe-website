#!/bin/bash
# Project-specific environment setup for KBE Website
# Source this file when starting work: source ./setup-dev-env.sh

echo "🚀 Setting up KBE Website development environment..."

# Setup fnm for Node.js 22
if command -v fnm &>/dev/null; then
	echo "📦 Configuring Node.js 22.16.0 with fnm..."
	eval "$(fnm env)" || true
	fnm use 22.16.0

	NODE_VERSION=$(node --version)
	NPM_VERSION=$(npm --version)
	echo "✅ Node.js version: ${NODE_VERSION}"
	echo "✅ npm version: ${NPM_VERSION}"
else
	echo "❌ fnm not found. Please install fnm first:"
	echo "   brew install fnm"
	exit 1
fi

# Verify environment
if [[ -f ".env.local" ]]; then
	echo "✅ Environment variables loaded"
else
	echo "⚠️  .env.local not found. Run ./generate-env-local.sh to create it"
fi

# Check if dependencies are installed
if [[ -d "node_modules" ]]; then
	echo "✅ Dependencies installed"
else
	echo "📦 Installing dependencies..."
	npm install
fi

echo ""
echo "🎯 Ready for development! Available commands:"
echo "   npm run dev          - Start development server (localhost:9002)"
echo "   npm run genkit:watch - Start GenKit AI development"
echo "   npm run typecheck    - Check TypeScript types"
echo "   npm run lint         - Run ESLint"
echo "   npm run build        - Build for production"
echo ""
echo "💡 Or use VS Code tasks (Cmd+Shift+P → 'Tasks: Run Task')"
echo "💡 Press F5 to start debugging"
