# Roo Code Configuration for KBE Portal

This directory contains the complete Roo Code configuration for the Kachemak Bay Educational Portal project, optimized for Next.js 15 development with specialized modes and enhanced capabilities.

## 📁 Directory Structure

```bash
.roo/
├── README.md              # This file - setup documentation
├── custom_modes.yaml      # Specialized development modes
├── mcp.json              # MCP server configurations
└── rules/                # Project-specific rules and context
    ├── 01-project-context.md
    └── 02-coding-standards.md
```

## 🎯 Custom Modes Available

### 🎨 KBE UI Designer (`kbe-ui`)

- **Focus**: Frontend components, styling, responsive design
- **File Access**: `.tsx`, `.jsx`, `.css`, `.scss` files only
- **Capabilities**: `read`, `edit`, `browser`
- **When to Use**: Creating/modifying UI components, implementing designs, styling fixes

### 🔌 KBE API Developer (`kbe-api`)

- **Focus**: Server components, API routes, backend logic
- **File Access**: API routes and server component files only
- **Capabilities**: `read`, `edit`, `command`
- **When to Use**: Building APIs, server components, database operations

### 🧪 KBE Test Engineer (`kbe-test`)

- **Focus**: Testing React components, API routes, user workflows
- **File Access**: Test files (`.test.*`, `.spec.*`) only
- **Capabilities**: `read`, `edit`, `command`
- **When to Use**: Writing tests, debugging test failures, improving coverage

### 🐛 KBE Debugger (`kbe-debug`)

- **Focus**: Troubleshooting issues, performance optimization
- **File Access**: All frontend/backend files for debugging
- **Capabilities**: `read`, `edit`, `command`, `browser`
- **When to Use**: Fixing bugs, performance issues, hydration problems

### 📝 KBE Documentation (`kbe-docs`)

- **Focus**: Technical documentation, API docs, guides
- **File Access**: Documentation files (`.md`, `.mdx`, `.txt`) only
- **Capabilities**: `read`, `edit`
- **When to Use**: Creating/updating documentation, README files, specs

### ⚡ KBE Performance (`kbe-performance`)

- **Focus**: Performance optimization, Core Web Vitals
- **File Access**: All performance-related files
- **Capabilities**: `read`, `edit`, `command`, `browser`
- **When to Use**: Bundle optimization, performance analysis, speed improvements

## 🔧 MCP Servers Configured

### Context7

- **Purpose**: Enhanced context and semantic search capabilities
- **Tools**: `databases_list`, `search_query`, `files_diff`
- **Installation**: Automatic via npx

### KBE Content Generator

- **Purpose**: Educational content generation for the portal
- **Tools**: `generate_lesson_plan`, `create_activity`, `generate_content`
- **Requirements**: `OPENAI_API_KEY` or `GOOGLE_AI_API_KEY` environment variables

### Firebase Tools

- **Purpose**: Firebase deployment and management
- **Tools**: `deploy`, `hosting`, `functions`
- **Installation**: Automatic via npx

## 🛡️ Protected Files (.rooignore)

The following files and directories are protected from Roo Code access:

- Environment files (`.env*`)
- Build outputs (`.next/`, `dist/`, `build/`)
- Dependencies (`node_modules/`)
- Database files (`*.db`, `*.sqlite`)
- Logs and temporary files
- IDE and OS generated files

## 🚀 Quick Start Guide

### 1. **Choose the Right Mode**

Select the appropriate mode based on your task:

```bash
# For UI work
Switch to: 🎨 KBE UI Designer

# For API development
Switch to: 🔌 KBE API Developer

# For testing
Switch to: 🧪 KBE Test Engineer
```

### 2. **Mode-Specific Workflows**

#### UI Development Workflow

1. Switch to `kbe-ui` mode
2. Use browser tool for visual testing
3. Focus on responsive design and accessibility
4. Follow KBE design system (teal #008080, gold #B8860B)

#### API Development Workflow

1. Switch to `kbe-api` mode
2. Use TypeScript with strict mode
3. Implement proper error handling
4. Use Zod for validation

#### Testing Workflow

1. Switch to `kbe-test` mode
2. Write component tests with React Testing Library
3. Focus on user interactions and edge cases
4. Maintain 80%+ code coverage

### 3. **Environment Setup**

Set up required environment variables:

```bash
# For AI-powered content generation
export OPENAI_API_KEY="your-openai-key"
# OR
export GOOGLE_AI_API_KEY="your-google-ai-key"
```

### 4. **Enable Codebase Indexing (Optional)**

For enhanced semantic search:

```bash
# Start Qdrant vector database
docker run -p 6333:6333 qdrant/qdrant

# Configure in Roo Code settings:
# - Provider: Google Gemini
# - Model: text-embedding-004
# - Qdrant URL: http://localhost:6333
```

## 🎨 Design System Guidelines

### Colors

- **Primary**: Teal (#008080)
- **Secondary**: Gold (#B8860B)
- **Usage**: Educational, accessible, Alaska-inspired

### Typography & Spacing

- Mobile-first responsive design
- Consistent spacing using Tailwind scale
- WCAG 2.1 AA accessibility compliance

### Component Patterns

- Server components by default
- Client components only when needed
- Compound component patterns for complex UI
- Proper loading states and error boundaries

## 📋 Best Practices

### Mode Switching

- Don't stick to one mode - switch based on task type
- Use specific modes for focused, efficient work
- Leverage file restrictions for cleaner workflows

### Code Quality

- Use TypeScript strict mode
- Implement proper error handling
- Follow Next.js 15 best practices
- Optimize for Core Web Vitals

### Testing

- Write tests for all new components
- Test accessibility features
- Mock external dependencies
- Focus on user workflows

## 🔍 Troubleshooting

### YAML Schema Errors

The custom modes file uses a special tuple format for edit permissions. If you see schema errors, they can be safely ignored as this is the correct format for Roo Code.

### MCP Server Issues

1. Ensure environment variables are set
2. Check network connectivity for npx packages
3. Verify Node.js version compatibility

### Mode Restrictions

If you can't edit certain files, check which mode you're in. Each mode has specific file access patterns for focused development.

## 📚 Additional Resources

- [Roo Code Documentation](https://docs.roo.codes)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [KBE Portal Project Overview](../docs/blueprint.md)
- [Development Workflow](../docs/development-workflow.md)

## 🎯 Next Steps

1. **Restart Roo Code** or reload the workspace for new configurations to take effect
2. **Switch to specialized modes** using the mode selector in Roo Code
3. **Enable MCP servers** in Roo Code settings if desired
4. **Set up codebase indexing** for enhanced semantic search (optional)
5. **Start using project-specific modes** for focused KBE Portal development

---

**Setup Status**: ✅ Complete  
**Last Updated**: 2025-08-02  
**Configuration Version**: 1.0.0
