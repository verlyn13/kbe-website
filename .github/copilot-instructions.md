# GitHub Copilot Instructions

## Critical Firebase App Hosting Requirements

### ⚠️ NEVER move these packages to devDependencies:
- `typescript` - Required for build process
- `@tailwindcss/postcss` - Required for CSS processing
- `postcss` - Required for CSS processing  
- `tailwindcss` - Required for CSS processing

### Why: 
Firebase App Hosting runs `npm ci --omit=dev` which skips devDependencies. Moving build tools to devDependencies will cause deployment failures.

### Safe for devDependencies:
- ESLint and plugins
- Prettier and plugins
- @types/* packages
- Testing frameworks
- Development-only tools

## Project Specific Rules

1. **Zod Version**: Always use Zod v3 (not v4) for GenKit compatibility
2. **Tailwind CSS Imports**: Use `@import 'tailwindcss/base'` syntax (not `@tailwind`)
3. **TypeScript Paths**: Use `@/*` for src directory imports
4. **Node Version**: Use Node.js 22 to match Firebase deployment
5. **Port**: Development server runs on port 9002 (not 3000)

## When suggesting dependency changes:
- ALWAYS keep build dependencies in `dependencies`
- ONLY suggest moving true dev tools to `devDependencies`
- Check Firebase deployment requirements before suggesting moves

## Do NOT:
- Auto-fix by moving TypeScript to devDependencies
- Suggest npm audit fix --force (can break version compatibility)
- Change Zod from v3 to v4
- Add custom webpack configs to next.config.js