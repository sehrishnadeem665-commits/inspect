import { NextRequest, NextResponse } from 'next/server';

/**
 * Diagnostics endpoint for VIN API
 * GET /api/vin/diagnostics
 * 
 * This endpoint helps debug VIN API issues on live servers
 */
export async function GET(request: NextRequest) {
  try {
    const autoDevKey = process.env.AUTO_DEV_API_KEY;
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        autoDevApiKeyConfigured: !!autoDevKey,
        autoDevApiKeyPreview: autoDevKey ? `${autoDevKey.substring(0, 5)}...${autoDevKey.substring(autoDevKey.length - 3)}` : 'NOT SET',
        apiEndpoint: 'https://api.auto.dev/vin',
      },
      test: {
        testVin: 'WVWZZZ3CZ9E123456',
        testMessage: 'You can test the VIN API by making a POST request to /api/vin with { "vin": "WVWZZZ3CZ9E123456" }',
      },
      instructions: {
        problem: 'VIN API not working on live server',
        solutions: [
          '1. Verify AUTO_DEV_API_KEY is set in Hostinger environment variables',
          '2. Check Hostinger firewall allows outbound requests to api.auto.dev',
          '3. Ensure the environment variables are loaded by restarting the Node.js application',
          '4. Check the server logs for error messages',
          '5. Test connectivity to api.auto.dev from Hostinger terminal',
        ],
      },
      status: autoDevKey ? 'READY' : 'MISSING_API_KEY',
    };

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Diagnostics error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
