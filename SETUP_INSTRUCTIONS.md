# Development Setup Instructions

## Prerequisites
- Node.js 22+ (use `nvm use` to switch)
- npm 11+
- Firebase CLI (`npm install -g firebase-tools`)

## Initial Setup
1. Clone the repository
2. Copy environment variables: `cp .env.example .env.local`
3. Fill in your Firebase and SendGrid credentials
4. Install dependencies: `npm ci`
5. **Configure Firebase App Check** (CRITICAL):
   - Go to Firebase Console → App Check → Apps
   - Set Authentication API to "Unenforced"
   - Set Cloud Firestore API to "Unenforced"
   - Without this, Google OAuth will fail with `auth/internal-error`
6. Run development server: `npm run dev`

## Environment Variables Required
See `.env.example` for all required variables.

## Running Tests
```bash
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## Type Checking
```bash
npx tsc --noEmit           # Check types
npx tsc --noEmit --watch   # Watch mode
```

## Code Quality
```bash
npm run lint      # Run ESLint
npm run format    # Format with Prettier
```
