#!/usr/bin/env bun

const BASE_URL = process.env.VERCEL_URL || "https://kbe-website-ecg6ndhrl-jeffrey-johnsons-projects-4efd9acb.vercel.app";

interface TestResult {
  path: string;
  expected: number;
  actual: number;
  success: boolean;
  error?: string;
}

async function testEndpoint(path: string, expectedStatus: number): Promise<TestResult> {
  try {
    console.log(`Testing ${path}...`);
    const res = await fetch(`${BASE_URL}${path}`, {
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    const success = res.status === expectedStatus;
    const emoji = success ? "✅" : "❌";
    console.log(`  ${emoji} ${path}: ${res.status} (expected ${expectedStatus})`);
    
    return {
      path,
      expected: expectedStatus,
      actual: res.status,
      success,
    };
  } catch (error) {
    console.log(`  ❌ ${path}: Error - ${error}`);
    return {
      path,
      expected: expectedStatus,
      actual: 0,
      success: false,
      error: String(error),
    };
  }
}

async function main() {
  console.log("🧪 Testing Vercel deployment...");
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log("");
  
  const tests = [
    // Basic functionality
    { path: "/", expected: 200, description: "Homepage loads" },
    { path: "/login", expected: 200, description: "Login page loads" },
    { path: "/programs", expected: 200, description: "Programs page loads" },
    { path: "/signup", expected: 200, description: "Signup page loads" },
    
    // Protected routes (should redirect to login)
    { path: "/dashboard", expected: 307, description: "Dashboard redirects to login" },
    { path: "/admin", expected: 307, description: "Admin redirects to login" },
    
    // API endpoints
    { path: "/api/webhooks/sendgrid", expected: 405, description: "SendGrid webhook (method not allowed for GET)" },
    
    // Firebase OAuth rewrite test
    { path: "/__/auth/handler", expected: 404, description: "Firebase auth rewrite (404 expected - no active auth flow)" },
  ];
  
  const results: TestResult[] = [];
  
  for (const test of tests) {
    console.log(`\n📋 ${test.description}`);
    const result = await testEndpoint(test.path, test.expected);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Summary");
  console.log("=".repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed < total) {
    console.log("\n🔍 Failed Tests:");
    results.filter(r => !r.success).forEach(r => {
      console.log(`  • ${r.path}: got ${r.actual}, expected ${r.expected}`);
      if (r.error) {
        console.log(`    Error: ${r.error}`);
      }
    });
  }
  
  console.log("\n🚀 Next steps:");
  console.log("1. Test Google OAuth manually in browser");
  console.log("2. Test mobile OAuth on actual device");
  console.log("3. If tests pass, proceed to production deployment");
  
  process.exit(passed === total ? 0 : 1);
}

main().catch(console.error);