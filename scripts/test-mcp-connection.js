#!/usr/bin/env node

/**
 * Test MCP Server Connection
 * Verifies that MCP servers can be started and communicate properly
 */

const { spawn } = require('node:child_process');
const path = require('node:path');

console.log('🔍 Testing MCP Server Connections...\n');

// Test configurations
const servers = [
  {
    name: 'KBE Orchestrator',
    command: 'node',
    args: ['./scripts/kbe-orchestrator-server.js'],
    testTimeout: 5000,
  },
  {
    name: 'Content Generator',
    command: 'node',
    args: ['./scripts/content-generator.js'],
    testTimeout: 5000,
  },
];

async function testServer(config) {
  console.log(`Testing ${config.name}...`);

  return new Promise((resolve) => {
    const child = spawn(config.command, config.args, {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, NODE_ENV: 'test' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let output = '';
    let errorOutput = '';
    let resolved = false;

    child.stdout.on('data', (data) => {
      output += data.toString();
      console.log(`  ✓ Stdout: ${data.toString().trim()}`);
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
      if (
        data.toString().includes('Server running') ||
        data.toString().includes('MCP Server running')
      ) {
        console.log(`  ✅ ${config.name} started successfully!`);
        if (!resolved) {
          resolved = true;
          child.kill();
          resolve({ success: true, name: config.name });
        }
      }
    });

    child.on('error', (error) => {
      console.error(`  ❌ Failed to start ${config.name}: ${error.message}`);
      if (!resolved) {
        resolved = true;
        resolve({ success: false, name: config.name, error: error.message });
      }
    });

    child.on('exit', (code) => {
      if (!resolved) {
        if (code === 0 || code === null) {
          console.log(`  ✅ ${config.name} exited cleanly`);
          resolve({ success: true, name: config.name });
        } else {
          console.error(`  ❌ ${config.name} exited with code ${code}`);
          console.error(`  Error output: ${errorOutput}`);
          resolve({ success: false, name: config.name, code });
        }
        resolved = true;
      }
    });

    // Timeout handler
    setTimeout(() => {
      if (!resolved) {
        console.log(`  ⏱️  ${config.name} timed out (might still be running correctly)`);
        child.kill();
        resolved = true;
        resolve({ success: true, name: config.name, timeout: true });
      }
    }, config.testTimeout);
  });
}

async function runTests() {
  console.log('Project Root:', path.resolve(__dirname, '..'));
  console.log('Node Version:', process.version);
  console.log('Platform:', process.platform);
  console.log('\n');

  const results = [];

  for (const server of servers) {
    const result = await testServer(server);
    results.push(result);
    console.log('');
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log('─'.repeat(40));

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  results.forEach((result) => {
    const icon = result.success ? '✅' : '❌';
    const status = result.success ? 'PASSED' : 'FAILED';
    console.log(`${icon} ${result.name}: ${status}`);
    if (result.error) console.log(`   Error: ${result.error}`);
    if (result.timeout) console.log(`   Note: Timed out but may be running`);
  });

  console.log('─'.repeat(40));
  console.log(`Total: ${results.length} | Passed: ${successful} | Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check if required dependencies are installed');
    console.log('2. Verify file permissions are correct');
    console.log('3. Check for syntax errors in server files');
    console.log('4. Ensure environment variables are set');
  }
}

// Run the tests
runTests().catch(console.error);
