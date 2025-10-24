"use client";

import * as Sentry from "@sentry/nextjs";
import { useState } from "react";

export default function TestSentryPage() {
  const [result, setResult] = useState<string>("");

  const testClientError = () => {
    try {
      const eventId = Sentry.captureException(
        new Error("[TEST] Client-side error test from test page")
      );
      setResult(`Client error sent! Event ID: ${eventId}`);
    } catch (err) {
      setResult(`Error: ${err}`);
    }
  };

  const testServerError = async () => {
    try {
      const response = await fetch("/api/sentry-test");
      setResult(
        `Server error triggered! Status: ${response.status}. Check Sentry dashboard.`
      );
    } catch (err) {
      setResult(`Error: ${err}`);
    }
  };

  const testMessage = () => {
    const eventId = Sentry.captureMessage(
      "[TEST] Test message from client",
      "info"
    );
    setResult(`Message sent! Event ID: ${eventId}`);
  };

  const checkInit = () => {
    const client = Sentry.getClient();
    const dsn = client?.getDsn?.()?.toString() || "No DSN";
    setResult(`Sentry initialized: ${!!client}\nDSN: ${dsn}`);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sentry Test Page</h1>

      <div className="space-y-4">
        <button
          onClick={checkInit}
          className="w-full p-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Check Sentry Initialization
        </button>

        <button
          onClick={testMessage}
          className="w-full p-4 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Send Test Message
        </button>

        <button
          onClick={testClientError}
          className="w-full p-4 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          Trigger Client Error
        </button>

        <button
          onClick={testServerError}
          className="w-full p-4 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Trigger Server Error
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap">
            <strong>Result:</strong>
            <br />
            {result}
          </div>
        )}

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm">
            <strong>Note:</strong> Check your Sentry dashboard at:
            <br />
            https://sentry.io/organizations/happy-patterns-llc/issues/
          </p>
          <p className="text-sm mt-2">
            <strong>DSN Project ID:</strong> 4510242089795584
          </p>
        </div>
      </div>
    </div>
  );
}
