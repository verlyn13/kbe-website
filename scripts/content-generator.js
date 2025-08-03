#!/usr/bin/env node

/**
 * KBE Content Generator MCP Server
 * 
 * This MCP server provides educational content generation tools for the
 * Kachemak Bay Educational Portal using OpenAI or Google AI APIs.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

class ContentGeneratorServer {
  constructor() {
    this.server = new Server(
      {
        name: 'kbe-content-generator',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'generate_lesson_plan',
            description: 'Generate a structured lesson plan for educational content',
            inputSchema: {
              type: 'object',
              properties: {
                subject: {
                  type: 'string',
                  description: 'The subject area (e.g., Math, Science, Reading)',
                },
                gradeLevel: {
                  type: 'string',
                  description: 'Grade level or age group (e.g., "K-2", "3-5", "6-8")',
                },
                topic: {
                  type: 'string',
                  description: 'Specific topic or learning objective',
                },
                duration: {
                  type: 'string',
                  description: 'Lesson duration (e.g., "30 minutes", "1 hour")',
                },
                learningStyle: {
                  type: 'string',
                  description: 'Preferred learning style (visual, auditory, kinesthetic, mixed)',
                },
              },
              required: ['subject', 'gradeLevel', 'topic'],
            },
          },
          {
            name: 'create_activity',
            description: 'Create an engaging educational activity or challenge',
            inputSchema: {
              type: 'object',
              properties: {
                activityType: {
                  type: 'string',
                  enum: ['puzzle', 'game', 'experiment', 'creative', 'research'],
                  description: 'Type of activity to create',
                },
                subject: {
                  type: 'string',
                  description: 'Subject area for the activity',
                },
                gradeLevel: {
                  type: 'string',
                  description: 'Target grade level',
                },
                skills: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Skills or concepts to reinforce',
                },
                materials: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Available materials or resources',
                },
              },
              required: ['activityType', 'subject', 'gradeLevel'],
            },
          },
          {
            name: 'generate_content',
            description: 'Generate educational content for various purposes',
            inputSchema: {
              type: 'object',
              properties: {
                contentType: {
                  type: 'string',
                  enum: ['announcement', 'newsletter', 'progress_summary', 'weekly_challenge'],
                  description: 'Type of content to generate',
                },
                audience: {
                  type: 'string',
                  enum: ['parents', 'students', 'educators'],
                  description: 'Target audience for the content',
                },
                topic: {
                  type: 'string',
                  description: 'Main topic or theme',
                },
                tone: {
                  type: 'string',
                  enum: ['professional', 'friendly', 'encouraging', 'informative'],
                  description: 'Desired tone for the content',
                },
                length: {
                  type: 'string',
                  enum: ['short', 'medium', 'long'],
                  description: 'Desired content length',
                },
              },
              required: ['contentType', 'audience', 'topic'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'generate_lesson_plan':
          return await this.generateLessonPlan(request.params.arguments);
        case 'create_activity':
          return await this.createActivity(request.params.arguments);
        case 'generate_content':
          return await this.generateContent(request.params.arguments);
        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    });
  }

  async generateLessonPlan(args) {
    const { subject, gradeLevel, topic, duration = '45 minutes', learningStyle = 'mixed' } = args;

    const prompt = `Create a detailed lesson plan for:
Subject: ${subject}
Grade Level: ${gradeLevel}
Topic: ${topic}
Duration: ${duration}
Learning Style: ${learningStyle}

Please include:
1. Learning objectives
2. Materials needed
3. Lesson structure with timing
4. Activities and engagement strategies
5. Assessment methods
6. Extension activities for advanced learners
7. Accommodations for different learning needs

Format the response as structured markdown with clear sections.`;

    try {
      const content = await this.callAI(prompt);
      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error generating lesson plan: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async createActivity(args) {
    const { activityType, subject, gradeLevel, skills = [], materials = [] } = args;

    const prompt = `Create an engaging ${activityType} activity for:
Subject: ${subject}
Grade Level: ${gradeLevel}
Skills to reinforce: ${skills.join(', ') || 'General subject skills'}
Available materials: ${materials.join(', ') || 'Basic classroom supplies'}

Please include:
1. Activity title and brief description
2. Learning objectives
3. Materials needed
4. Step-by-step instructions
5. Time required
6. Variations or extensions
7. Assessment criteria
8. Safety considerations (if applicable)

Make it engaging and age-appropriate for ${gradeLevel} students.`;

    try {
      const content = await this.callAI(prompt);
      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating activity: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async generateContent(args) {
    const { contentType, audience, topic, tone = 'friendly', length = 'medium' } = args;

    const prompts = {
      announcement: `Write a ${tone} announcement for ${audience} about: ${topic}`,
      newsletter: `Create a ${length} newsletter section for ${audience} covering: ${topic}`,
      progress_summary: `Generate a ${tone} progress summary for ${audience} regarding: ${topic}`,
      weekly_challenge: `Design an engaging weekly challenge for ${audience} focused on: ${topic}`,
    };

    const prompt = `${prompts[contentType]}

Guidelines:
- Tone: ${tone}
- Length: ${length}
- Audience: ${audience}
- Include actionable items where appropriate
- Use clear, accessible language
- Format as markdown for easy reading
- For parents: Include ways they can support learning at home
- For students: Make it engaging and age-appropriate
- For educators: Include practical implementation tips`;

    try {
      const content = await this.callAI(prompt);
      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error generating content: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async callAI(prompt) {
    const openaiKey = process.env.OPENAI_API_KEY;
    const googleKey = process.env.GOOGLE_AI_API_KEY;

    if (openaiKey) {
      return await this.callOpenAI(prompt, openaiKey);
    } else if (googleKey) {
      return await this.callGoogleAI(prompt, googleKey);
    } else {
      throw new Error('No AI API key found. Please set OPENAI_API_KEY or GOOGLE_AI_API_KEY environment variable.');
    }
  }

  async callOpenAI(prompt, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an educational content specialist creating materials for the Kachemak Bay Educational Portal in Homer, Alaska. Create engaging, age-appropriate content that reflects the local Alaskan context when relevant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callGoogleAI(prompt, apiKey) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an educational content specialist creating materials for the Kachemak Bay Educational Portal in Homer, Alaska. Create engaging, age-appropriate content that reflects the local Alaskan context when relevant.\n\n${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('KBE Content Generator MCP server running on stdio');
  }
}

// Check if this file is being run directly
if (require.main === module) {
  const server = new ContentGeneratorServer();
  server.run().catch((error) => {
    console.error('Failed to run server:', error);
    process.exit(1);
  });
}

module.exports = ContentGeneratorServer;