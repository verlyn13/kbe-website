# Roo Setup

Based on your Next.js KBE Portal project and the extensive Roo Code documentation, here's a comprehensive configuration guide to utilize Roo Code to its fullest potential:

## 🚀 Complete Roo Code Configuration Guide for KBE Portal

### 1. **Initial Setup & Core Configuration**

#### Enable Essential Features

````bash
# In Roo Code settings (gear icon)
✅ Enable editing through diffs (keep at 100% precision)
✅ Enable MCP Servers
✅ Enable MCP Server Creation
✅ Enable Codebase Indexing
```bash
### 2. **Codebase Indexing Setup (Free with Google Gemini)**

```yaml
# Quick setup for semantic code search
1. Get free Google AI Studio key: https://aistudio.google.com/
2. Use local Qdrant with Docker: docker run -p 6333:6333 qdrant/qdrant
3. Configure in Roo Code:
  - Provider: Google Gemini
  - Model: text-embedding-004
  - Qdrant URL: http://localhost:6333
```text
This enables queries like:

- "authentication logic"
- "sidebar navigation implementation"
- "dashboard component state management"

### 3. **Custom Modes for Your Project**

Create specialized modes for different aspects of your educational portal:

#### a) **Frontend UI Mode** (`~/.roo/custom_modes.yaml`)

```yaml
customModes:
  - slug: kbe-ui
    name: 🎨 KBE UI Designer
    description: Specialized for Next.js App Router, Tailwind CSS 4, and shadcn/ui components
    roleDefinition: |
      You are a UI specialist for the KBE educational portal with expertise in:
      - Next.js 15 App Router patterns
      - Tailwind CSS 4 with @config directive
      - shadcn/ui component architecture
      - Educational UX for parents and students
      - Responsive sidebar layouts with mobile sheets
      - Accessibility (WCAG 2.1 AA compliance)
    groups:
      - read
      - - edit
        - fileRegex: \.(tsx?|css|jsx?)$
          description: Frontend files only
    whenToUse: UI/UX implementation, component creation, styling, responsive design
    customInstructions: |
      - Use mobile-first responsive design
      - Implement KBE color scheme (teal #008080, gold #B8860B)
      - Ensure all components are accessible
      - Follow compound component patterns for shadcn/ui
```bash
#### b) **API Development Mode**

```yaml
- slug: kbe-api
  name: 🔌 KBE API Developer
  description: Next.js API routes and server components specialist
  roleDefinition: |
    You specialize in Next.js 15 server components and API routes for educational platforms
  groups:
    - read
    - - edit
      - fileRegex: (app/api/.*\.ts$|.*\.server\.ts$)
        description: API routes and server components
    - command
  whenToUse: API development, server components, database operations
```bash
#### c) **Testing Mode**

```yaml
- slug: kbe-test
  name: 🧪 KBE Test Engineer
  description: Comprehensive testing for educational portal features
  roleDefinition: |
    You write tests for React components, API routes, and user workflows
  groups:
    - read
    - - edit
      - fileRegex: \.(test|spec)\.(tsx?|jsx?)$
        description: Test files only
    - command
  whenToUse: Writing tests, debugging test failures, improving coverage
```bash
### 4. **Project-Specific Rules & Instructions**

#### Create `.roo/rules/` directory structure
```text
.roo/
├── rules/
│   ├── 01-project-context.md
│   ├── 02-coding-standards.md
│   └── 03-component-patterns.md
└── rules-kbe-ui/
    ├── 01-design-system.md
    └── 02-accessibility.md
```bash
#### `.roo/rules/01-project-context.md`
```markdown
# KBE Portal Context

This is an educational enrichment portal for Kachemak Bay families in Homer, Alaska.

## Key Features
- Parent dashboard for tracking student progress
- Student portal for accessing enrichment activities
- AI-powered content generation for educators
- Real-time collaboration features

## Technical Stack
- Next.js 15 with App Router
- TypeScript with strict mode
- Tailwind CSS 4 + shadcn/ui
- React Hook Form + Zod for forms
- Server Components for performance
```bash
#### `.roo/rules/02-coding-standards.md`
```markdown
# Coding Standards

1. **File Organization**:
   - Group by feature in `app/` directory
   - Shared components in `src/components/`
   - Utilities in `src/lib/`

2. **Component Patterns**:
   - Use server components by default
   - Client components only when needed ('use client')
   - Implement loading.tsx and error.tsx boundaries

3. **TypeScript**:
   - No `any` types
   - Explicit return types for functions
   - Use Zod schemas for runtime validation

4. **Performance**:
   - Lazy load heavy components
   - Use Next.js Image for all images
   - Implement proper caching strategies
```bash
### 5. **MCP Server Configuration**

#### Install Context7 for enhanced capabilities
Create `.roo/mcp.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7@latest"],
      "alwaysAllow": ["databases_list", "search_query", "files_diff"]
    },
    "kbe-content": {
      "command": "node",
      "args": ["./mcp-servers/content-generator.js"],
      "env": {
        "OPENAI_API_KEY": "${env:OPENAI_API_KEY}"
      },
      "alwaysAllow": ["generate_lesson_plan", "create_activity"]
    }
  }
}
```bash
### 6. **Custom Slash Commands**

Configure frequently used commands:

```yaml
# Access via Roo Code settings
/ui-component: Create a new shadcn/ui component with KBE styling
/api-route: Generate a Next.js API route with proper error handling
/test-component: Write comprehensive tests for a React component
/fix-a11y: Review and fix accessibility issues
/optimize-perf: Analyze and optimize component performance
```bash
### 7. **.rooignore Configuration**

Create `.rooignore` to protect sensitive data:

```gitignore
# Environment files
.env*
!.env.example

# Build outputs
.next/
out/
dist/

# Dependencies
node_modules/

# Test coverage
coverage/

# User uploads
public/uploads/
data/private/

# Database
*.db
*.sqlite

# Temporary files
*.tmp
*.cache
```bash
### 8. **Orchestrator Mode Workflows**

Define complex workflows for common tasks:

#### Example: New Feature Workflow

```markdown
When asked to create a new feature:

1. Use 🏗️ Architect mode to design the data model and API structure
2. Switch to 🔌 KBE API Developer to implement server components
3. Use 🎨 KBE UI Designer for frontend implementation
4. Switch to 🧪 KBE Test Engineer for comprehensive testing
5. Use 📝 Docs mode to update documentation
```bash
### 9. **Advanced Boomerang Task Example**

```markdown
# In Orchestrator mode

"Create a new student progress tracking feature"

This will:

1. Create subtask for database schema design
2. Create subtask for API endpoints
3. Create subtask for UI components
4. Create subtask for parent dashboard integration
5. Create subtask for testing suite
```bash
### 10. **Performance Optimization Settings**

```yaml
# Global settings for Next.js optimization
customInstructions: |
  For all Next.js development:
  - Prefer Server Components over Client Components
  - Use dynamic imports for code splitting
  - Implement proper error boundaries
  - Use suspense for async components
  - Optimize images with next/image
  - Minimize client-side JavaScript
```bash
### 11. **Message Queueing Strategy**

Leverage the new message queueing feature:

```markdown
# Queue these messages while Roo works
1. "After implementing the component, add proper TypeScript types"
2. "Then create a Storybook story for documentation"
3. "Finally, write integration tests"
4. "Update the component index file"
```bash
### 12. **Quick Start Checklist**

```bash
# 1. Set up indexing (one-time)
docker run -p 6333:6333 qdrant/qdrant

# 2. Create project structure
mkdir -p .roo/rules .roo/rules-kbe-ui

# 3. Copy configurations
# - Add custom_modes.yaml to ~/.roo/
# - Add mcp.json to .roo/
# - Add rules files to .roo/rules/

# 4. Configure slash commands in UI

# 5. Start using specialized modes
```bash
### 13. **Best Practices for Your Project**

1. **Use Mode Switching**: Don't stick to one mode - switch based on task
2. **Leverage Indexing**: Use semantic search before manual file browsing
3. **Queue Complex Tasks**: Break down features into queued subtasks
4. **Version Control Rules**: Commit `.roo/` directory for team consistency
5. **Regular Reviews**: Use orchestrator mode for code reviews

### 14. **Debugging & Troubleshooting**

```yaml
# Debug mode configuration
- slug: kbe-debug
  name: 🐛 KBE Debugger
  description: Next.js and React debugging specialist
  customInstructions: |
    - Check React DevTools first
    - Verify server/client component boundaries
    - Inspect Network tab for API issues
    - Use console.log strategically
    - Check for hydration mismatches
```text
This configuration maximizes Roo Code's capabilities for your KBE Portal project, providing specialized modes, intelligent indexing, and automated workflows tailored to your Next.js educational platform.
````
