#!/usr/bin/env node

/**
 * KBE Orchestrator MCP Server
 * Provides intelligent task orchestration for the KBE Portal project
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');

// Agent registry with capabilities
const AGENTS = {
  'kbe-ui': {
    name: '🎨 KBE UI Designer',
    expertise: ['Frontend', 'Components', 'Styling', 'Responsive Design'],
    triggerKeywords: ['ui', 'component', 'style', 'layout', 'responsive', 'design']
  },
  'kbe-api': {
    name: '🔌 KBE API Developer', 
    expertise: ['Backend', 'API Routes', 'Server Components', 'Firebase'],
    triggerKeywords: ['api', 'backend', 'server', 'database', 'firebase', 'auth']
  },
  'kbe-test': {
    name: '🧪 KBE Test Engineer',
    expertise: ['Testing', 'Quality Assurance', 'Coverage'],
    triggerKeywords: ['test', 'spec', 'coverage', 'quality', 'bug']
  },
  'kbe-debug': {
    name: '🐛 KBE Debugger',
    expertise: ['Troubleshooting', 'Performance', 'Diagnostics'],
    triggerKeywords: ['debug', 'error', 'issue', 'problem', 'fix', 'troubleshoot']
  },
  'kbe-performance': {
    name: '⚡ KBE Performance',
    expertise: ['Optimization', 'Core Web Vitals', 'Bundle Size'],
    triggerKeywords: ['performance', 'optimize', 'speed', 'bundle', 'vitals']
  }
};

// Project knowledge base
const PROJECT_CONTEXT = {
  stack: 'Next.js 15.4.5, React 19, Tailwind CSS 4, Firebase, TypeScript',
  port: 9002,
  theme: {
    primary: '#008080',
    accent: '#B8860B',
    background: '#E0EEEE'
  },
  architecture: {
    routing: 'App Router',
    styling: 'Tailwind CSS with shadcn/ui',
    state: 'React Hooks + Context API',
    forms: 'React Hook Form + Zod',
    ai: 'GenKit with Gemini 2.0'
  },
  firebaseRules: {
    dependencies: 'ALL build deps must be in dependencies, NOT devDependencies',
    tailwindCSS: 'Use @config and @import syntax, not @tailwind directives',
    apiKeys: 'Separate keys for Firebase Auth and GenKit',
    buildConfig: 'output: standalone in next.config.ts',
    cssVariables: 'Properly scope sidebar variables with [data-sidebar]'
  }
};

class KBEOrchestratorServer {
  constructor() {
    this.server = new Server(
      {
        name: 'kbe-orchestrator',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'analyze_task',
          description: 'Analyze a task and recommend agents for implementation',
          inputSchema: {
            type: 'object',
            properties: {
              task: {
                type: 'string',
                description: 'The task to analyze'
              }
            },
            required: ['task']
          }
        },
        {
          name: 'coordinate_agents',
          description: 'Coordinate multiple agents for a complex task',
          inputSchema: {
            type: 'object',
            properties: {
              task: {
                type: 'string',
                description: 'The task description'
              },
              agents: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of agent IDs to coordinate'
              }
            },
            required: ['task', 'agents']
          }
        },
        {
          name: 'get_project_status',
          description: 'Get current project status and active tasks',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'query_knowledge_base',
          description: 'Query project-specific knowledge',
          inputSchema: {
            type: 'object',
            properties: {
              topic: {
                type: 'string',
                description: 'Topic to query about'
              }
            },
            required: ['topic']
          }
        },
        {
          name: 'validate_firebase_config',
          description: 'Validate configuration for Firebase compatibility',
          inputSchema: {
            type: 'object',
            properties: {
              checkType: {
                type: 'string',
                enum: ['dependencies', 'tailwind', 'apikeys', 'all'],
                description: 'Type of validation to perform'
              }
            },
            required: ['checkType']
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'analyze_task':
          return this.analyzeTask(request.params.arguments);
        
        case 'coordinate_agents':
          return this.coordinateAgents(request.params.arguments);
        
        case 'get_project_status':
          return this.getProjectStatus();
        
        case 'query_knowledge_base':
          return this.queryKnowledgeBase(request.params.arguments);
        
        case 'validate_firebase_config':
          return this.validateFirebaseConfig(request.params.arguments);
        
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  analyzeTask({ task }) {
    const taskLower = task.toLowerCase();
    const recommendedAgents = [];
    
    // Analyze task for agent recommendations
    for (const [agentId, agent] of Object.entries(AGENTS)) {
      const relevance = agent.triggerKeywords.filter(keyword => 
        taskLower.includes(keyword)
      ).length;
      
      if (relevance > 0) {
        recommendedAgents.push({
          agent: agentId,
          name: agent.name,
          relevance,
          expertise: agent.expertise
        });
      }
    }
    
    // Sort by relevance
    recommendedAgents.sort((a, b) => b.relevance - a.relevance);
    
    // Determine execution strategy
    const isComplex = recommendedAgents.length > 2;
    const strategy = isComplex ? 'multi-agent-sequential' : 'single-agent';
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            task,
            analysis: {
              complexity: isComplex ? 'complex' : 'simple',
              strategy,
              recommendedAgents: recommendedAgents.slice(0, 3),
              estimatedDuration: isComplex ? '30-60 minutes' : '10-30 minutes',
              parallelizable: recommendedAgents.length > 1 && !taskLower.includes('sequential')
            }
          }, null, 2)
        }
      ]
    };
  }

  coordinateAgents({ task, agents }) {
    const coordination = {
      task,
      agents,
      workflow: [],
      handoffProtocol: {
        contextPreservation: true,
        artifactSharing: true,
        progressTracking: true
      }
    };
    
    // Create workflow steps
    agents.forEach((agent, index) => {
      coordination.workflow.push({
        step: index + 1,
        agent,
        action: `${AGENTS[agent]?.name || agent} handles their specialty`,
        dependencies: index > 0 ? [index] : [],
        outputs: ['Updated files', 'Documentation', 'Test results']
      });
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(coordination, null, 2)
        }
      ]
    };
  }

  getProjectStatus() {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            project: 'KBE Portal',
            status: 'Active Development',
            recentUpdates: [
              'Sidebar layout fixed',
              'Dashboard header implemented',
              'Magic link authentication working'
            ],
            activeAgents: Object.keys(AGENTS),
            environment: {
              development: `http://localhost:${PROJECT_CONTEXT.port}`,
              production: 'Firebase App Hosting'
            },
            health: {
              build: 'passing',
              tests: 'pending setup',
              deployment: 'configured'
            }
          }, null, 2)
        }
      ]
    };
  }

  queryKnowledgeBase({ topic }) {
    const topicLower = topic.toLowerCase();
    let response = {};
    
    if (topicLower.includes('stack') || topicLower.includes('tech')) {
      response = PROJECT_CONTEXT.stack;
    } else if (topicLower.includes('theme') || topicLower.includes('color')) {
      response = PROJECT_CONTEXT.theme;
    } else if (topicLower.includes('architecture')) {
      response = PROJECT_CONTEXT.architecture;
    } else if (topicLower.includes('firebase') || topicLower.includes('deploy')) {
      response = PROJECT_CONTEXT.firebaseRules;
    } else if (topicLower.includes('port') || topicLower.includes('dev')) {
      response = { devPort: PROJECT_CONTEXT.port, devUrl: `http://localhost:${PROJECT_CONTEXT.port}` };
    } else {
      response = {
        availableTopics: ['stack', 'theme', 'architecture', 'firebase', 'development'],
        suggestion: 'Try querying about: tech stack, color theme, architecture, firebase rules, or development setup'
      };
    }
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query: topic,
            result: response
          }, null, 2)
        }
      ]
    };
  }

  validateFirebaseConfig({ checkType }) {
    const validations = {
      dependencies: {
        rule: 'All build dependencies must be in "dependencies", not "devDependencies"',
        criticalDeps: ['tailwindcss', '@tailwindcss/postcss', 'typescript', '@types/node'],
        action: 'Move these from devDependencies to dependencies in package.json'
      },
      tailwind: {
        rule: 'Tailwind CSS 4 requires @config directive and @import syntax',
        correct: '@config "../../tailwind.config.ts";\n@import \'tailwindcss\';',
        incorrect: '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
        files: ['src/app/globals.css']
      },
      apikeys: {
        rule: 'Use separate API keys for different Google services',
        required: {
          FIREBASE_API_KEY: 'Identity Toolkit API',
          GOOGLE_AI_API_KEY: 'Generative Language API'
        },
        warning: 'Never use the same key for Firebase Auth and GenKit'
      },
      all: {
        checks: ['dependencies', 'tailwind', 'apikeys'],
        additionalRules: [
          'next.config.ts must have output: "standalone"',
          'CSS variables must be properly scoped with [data-sidebar]',
          'Test with npm run build before deploying'
        ]
      }
    };

    const result = checkType === 'all' 
      ? validations.all 
      : validations[checkType] || { error: 'Unknown check type' };

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            checkType,
            validation: result,
            reminder: 'These rules prevent common Firebase deployment failures'
          }, null, 2)
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('KBE Orchestrator MCP Server running...');
  }
}

// Start the server
const server = new KBEOrchestratorServer();
server.run().catch(console.error);