#!/usr/bin/env node

/**
 * Hostinger Next.js Server Starter
 * This script starts the Next.js application on Hostinger
 */

const { spawn } = require('child_process');
const path = require('path');

// Load environment variables from a .env file if present in common locations.
// This allows the app to pick up .env placed outside public_html (for security).
try {
  const dotenv = require('dotenv')
  const tryPaths = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '..', '..', '.env'),
  ]

  let loaded = false
  for (const p of tryPaths) {
    try {
      const res = dotenv.config({ path: p })
      if (res.parsed) {
        console.log(`Loaded .env from ${p}`)
        loaded = true
        break
      }
    } catch (e) {
      // ignore and try next
    }
  }
  if (!loaded) {
    if (process.env.NODE_ENV !== 'production') console.log('No .env file loaded from common locations')
  }
} catch (e) {
  // dotenv not available — environment variables must be provided by the host
  if (process.env.NODE_ENV !== 'production') console.warn('dotenv not installed; skipping .env load')
}

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';

console.log(`Starting True Inspectify Next.js Server`);
console.log(`Environment: ${NODE_ENV}`);
console.log(`Port: ${PORT}`);
console.log('-------------------------------------------\n');

// Start Next.js server
const server = spawn('node', [
  path.join(__dirname, 'node_modules', '.bin', 'next'),
  'start',
  '-p',
  PORT
], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV,
    PORT
  }
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`\nServer exited with code ${code}`);
  process.exit(code);
});

// Handle signals
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});
