# Development Workflow Guide

This guide covers the development setup and workflow for the KBE Website project using VS Code.

## Prerequisites

1. **VS Code** - Latest version (2025)
2. **Node.js 22** - Matches Firebase deployment environment
3. **Firebase CLI** - For deployment and local testing
4. **Git** - Version control

## Initial Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd kbe-website
npm install
```bash
### 2. Environment Variables

Create `.env.local` file (use `generate-env-local.sh` for template):

```bash
./generate-env-local.sh
```text
Fill in the values from Google Cloud Secret Manager or ask the team lead.

### 3. VS Code Setup

1. Open the project in VS Code
2. When prompted, install recommended extensions
3. Restart VS Code after extensions install

## Development Commands

### Start Development Server

```bash
npm run dev
```text
- Opens on [http://localhost:9002](http://localhost:9002)
- Uses Turbopack for fast refresh
- Hot module replacement enabled

### Start GenKit AI Development

```bash
npm run genkit:watch
```text
- Opens GenKit UI for testing AI flows
- Hot reloads on file changes

### Type Checking

```bash
npm run typecheck
```text
Run this before committing to catch type errors.

### Linting

```bash
npm run lint
```text
ESLint will auto-fix on save if VS Code is configured properly.

## CSS Development with Tailwind CSS 4

### Important Changes in v4

1. **Import syntax changed**:

   ```css
   /* Old (v3) */
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   /* New (v4) */
   @import 'tailwindcss/base';
   @import 'tailwindcss/components';
   @import 'tailwindcss/utilities';
   ```

2. **PostCSS config simplified**:

   ```js
   // postcss.config.mjs
   {
     plugins: {
       '@tailwindcss/postcss': {},
     }
   }
   ```

3. **CSS variables for theming** - All colors use CSS variables defined in globals.css

### VS Code Tailwind IntelliSense

- Auto-completes Tailwind classes
- Shows color previews
- Works with `cn()` utility function
- Configured for shadcn/ui components

## Debugging in VS Code

### Debug Next.js Server

1. Press `F5` or go to Run > Start Debugging
2. Select "Next.js: debug server-side"
3. Set breakpoints in server components or API routes

### Debug React Components

1. Select "Next.js: debug client-side"
2. Chrome will open with debugging enabled
3. Set breakpoints in client components

### Debug Full Stack

Use "Debug All" compound configuration to debug both client and server simultaneously.

## Git Workflow

### Before Committing

1. **Run type check**: `npm run typecheck`
2. **Check for CSS issues**: Verify styles render correctly at localhost:9002
3. **Test authentication**: Ensure login flow works
4. **Check console**: No errors in browser console

### Commit Guidelines

```bash
# Feature
git commit -m "feat: add user profile page"

# Bug fix
git commit -m "fix: resolve Tailwind CSS import issue"

# Chore
git commit -m "chore: update VS Code settings"
```bash
### Deployment

Pushing to `main` automatically triggers Firebase deployment:

```bash
git push origin main
```text
Monitor deployment at: [https://console.firebase.google.com](https://console.firebase.google.com)

## Common Issues and Solutions

### CSS Not Loading

1. Check globals.css has correct Tailwind imports
2. Restart dev server after CSS changes
3. Clear Next.js cache: `rm -rf .next`

### Type Errors

1. Run `npm run typecheck` to see all errors
2. VS Code shows inline errors with red squiggles
3. Hover over errors for quick fixes

### Module Not Found

1. Check import paths use `@/` for src directory
2. Restart TS server: Cmd+Shift+P > "TypeScript: Restart TS Server"
3. Check file exists and is committed to Git

### Firebase Build Failures

See `docs/firebase-deployment.md` for troubleshooting.

## VS Code Tips

### Keyboard Shortcuts

- **Cmd+P**: Quick file open
- **Cmd+Shift+P**: Command palette
- **Cmd+B**: Toggle sidebar
- **Cmd+J**: Toggle terminal
- **Cmd+Shift+F**: Search across files
- **F2**: Rename symbol (updates all references)
- **Cmd+.**: Quick fix menu
- **Option+Shift+F**: Format document

### Useful Commands (Cmd+Shift+P)

- "Tailwind CSS: Show Output" - Debug Tailwind issues
- "TypeScript: Restart TS Server" - Fix import issues
- "Developer: Reload Window" - Fresh start
- "Prettier: Format Document" - Manual format

### Extensions Tips

1. **GitLens**: Click on line blame to see commit history
2. **Todo Tree**: View all TODOs in sidebar
3. **Thunder Client**: Test API endpoints without leaving VS Code
4. **Error Lens**: Shows errors inline next to code

## Performance Tips

1. **Use Turbopack**: Already configured with `--turbopack` flag
2. **Exclude large folders**: Already configured in VS Code settings
3. **Use production build locally**: `npm run build && npm start`
4. **Monitor bundle size**: Check `.next/analyze/` after build

## Testing Changes Before Deploy

1. **Build locally**: `npm run build` - Must succeed
2. **Test production mode**: `npm start` - Check for runtime errors
3. **Check mobile responsive**: Use Chrome DevTools device mode
4. **Test auth flows**: Login, logout, session persistence
5. **Verify AI features**: Test content generator if you modified AI code

Remember: Firebase deployment is automatic on push to main, so always test thoroughly locally first!
