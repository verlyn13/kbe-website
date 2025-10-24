# MCP Integration Guide for KBE Portal

## Overview

This guide explains how to properly configure and use the Model Context Protocol (MCP) servers with the KBE Orchestrator for intelligent, multi-agent development workflows.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐
│   User/IDE      │────▶│  KBE Orchestrator │
└─────────────────┘     └────────┬─────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
   ┌────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐
   │ kbe-ui   │          │   kbe-api   │         │  kbe-test   │
   │  Agent   │          │    Agent    │         │    Agent    │
   └──────────┘          └─────────────┘         └─────────────┘
        │                        │                        │
   ┌────▼─────┐          ┌──────▼──────┐         ┌──────▼──────┐
   │   MCP    │          │     MCP     │         │     MCP     │
   │ Servers  │          │   Servers   │         │   Servers   │
   └──────────┘          └─────────────┘         └─────────────┘
```

## Configuration Files

### 1. VS Code Settings (`.vscode/settings.json`)

```json
{
  "roo-cline.mcpServers": {
    "kbe-orchestrator": {
      "command": "node",
      "args": ["./scripts/kbe-orchestrator-server.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### 2. Project MCP Config (`.roo/mcp.json`)

Already configured with:

- **context7**: Semantic search capabilities
- **kbe-content**: Educational content generation
- **firebase-tools**: Deployment management

### 3. Agent Modes (`.roomodes`)

Already configured with specialized agents:

- **kbe-ui**: Frontend development
- **kbe-api**: Backend development
- **kbe-test**: Testing
- **kbe-debug**: Troubleshooting
- **kbe-performance**: Optimization

## Usage Patterns

### 1. Simple Task (Single Agent)

```
User: "Update the dashboard header color"
→ Orchestrator analyzes task
→ Assigns to kbe-ui agent
→ kbe-ui completes task
→ Reports completion
```

### 2. Complex Task (Multi-Agent)

```
User: "Add a new weekly challenge feature with AI generation"
→ Orchestrator decomposes task:
  1. webdesign_agent: Design UI patterns
  2. kbe-api: Create GenKit integration
  3. kbe-ui: Implement components
  4. kbe-test: Write tests
  5. kbe-performance: Optimize
→ Coordinates handoffs between agents
→ Reports progress at each step
```

### 3. Emergency Response

```
User: "The dashboard is not loading on mobile"
→ Orchestrator triggers emergency protocol
→ kbe-debug: Immediate investigation
→ kbe-performance: Parallel performance check
→ Appropriate agent fixes issue
→ kbe-test: Validates fix
```

## Troubleshooting MCP Connections

### Common Issues

1. **MCP Server Not Starting**

   ```bash
   # Test connection
   node scripts/test-mcp-connection.js
   ```

2. **Missing Dependencies**

   ```bash
   # Install MCP SDK
   npm install @modelcontextprotocol/sdk
   ```

3. **Permission Issues**

   ```bash
   # Fix permissions
   chmod +x scripts/*.js
   ```

4. **Environment Variables**
   ```bash
   # Check required env vars
   echo $GOOGLE_AI_API_KEY
   echo $NODE_ENV
   ```

### Debug Commands

```bash
# Test orchestrator directly
node scripts/kbe-orchestrator-server.js

# Check MCP logs
tail -f .roo/mcp.log

# Validate configuration
node -e "console.log(require('./.roo/mcp.json'))"
```

## Best Practices

### 1. Task Description

- Be specific about requirements
- Mention if task needs multiple capabilities
- Specify any constraints or preferences

### 2. Agent Communication

- Agents preserve context during handoffs
- Progress is reported at each major step
- Blockers are escalated immediately

### 3. Workflow Optimization

- Parallel tasks run simultaneously when possible
- Sequential dependencies are respected
- Quality gates between major transitions

## Integration with VS Code

### Roo Cline Extension

The Roo Cline extension should automatically:

1. Detect `.roomodes` configuration
2. Load MCP servers from `.roo/mcp.json`
3. Connect to the KBE Orchestrator
4. Enable agent switching via UI

### Manual Agent Selection

You can manually select agents:

- Click the agent selector in VS Code status bar
- Choose appropriate agent for your task
- Orchestrator coordinates automatically

## Project-Specific Context

The orchestrator knows:

- **Tech Stack**: Next.js 15.4.5, React 19, Tailwind CSS 4
- **Port**: Development on 9002
- **Theme**: Teal (#008080) and Gold (#B8860B)
- **Architecture**: App Router, shadcn/ui, Supabase
- **Mission**: Educational portal for Homer, Alaska

## Extending the System

### Adding New Agents

1. Define in `.roomodes`
2. Register in `.roo/agents.json`
3. Update orchestrator knowledge base
4. Test integration

### Creating Custom MCP Servers

1. Follow the pattern in `kbe-orchestrator-server.js`
2. Implement standard MCP protocol
3. Register in `.roo/mcp.json`
4. Test with `test-mcp-connection.js`

## Quick Commands

```bash
# Start development with orchestration
npm run dev

# Test MCP connections
node scripts/test-mcp-connection.js

# View orchestrator status
curl http://localhost:9002/api/orchestrator/status

# Trigger agent coordination
curl -X POST http://localhost:9002/api/orchestrator/coordinate \
  -H "Content-Type: application/json" \
  -d '{"task": "Your task here", "agents": ["kbe-ui", "kbe-api"]}'
```

## Support

For issues:

1. Check this guide first
2. Run connection tests
3. Review logs in `.roo/mcp.log`
4. Check GitHub issues for similar problems

The orchestrator and MCP integration enable intelligent, efficient development workflows tailored specifically for the KBE Portal project.
