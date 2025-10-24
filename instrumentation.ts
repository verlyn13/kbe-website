export async function register() {
  console.log("[INSTRUMENTATION] Register called - Vercel Integration Test", {
    runtime: process.env.NEXT_RUNTIME,
    nodeEnv: process.env.NODE_ENV,
  });

  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("[INSTRUMENTATION] Loading Sentry server config for nodejs runtime");
    await import("./sentry.server.config");
    console.log("[INSTRUMENTATION] Sentry server config loaded successfully");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    console.log("[INSTRUMENTATION] Loading Sentry edge config for edge runtime");
    await import("./sentry.edge.config");
    console.log("[INSTRUMENTATION] Sentry edge config loaded successfully");
  }
}
