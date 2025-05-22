#!/usr/bin/env node

import { JupiterOneMcpServer } from './server/mcp-server.js';
import dotenv from 'dotenv';
import { JupiterOneConfig } from './types/jupiterone.js';

dotenv.config();

async function main() {
  try {
    // Get configuration from environment variables
    const config: JupiterOneConfig = {
      apiKey: process.env.JUPITERONE_API_KEY || '',
      accountId: process.env.JUPITERONE_ACCOUNT_ID || '',
      baseUrl: process.env.JUPITERONE_BASE_URL || 'https://graphql.us.jupiterone.io'
    };

    // Validate required fields
    if (!config.apiKey) {
      throw new Error('JUPITERONE_API_KEY environment variable is required');
    }
    if (!config.accountId) {
      throw new Error('JUPITERONE_ACCOUNT_ID environment variable is required');
    }

    // Create and start the MCP server
    const server = new JupiterOneMcpServer(config);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.error('Received SIGINT, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.error('Received SIGTERM, shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });

    // Start the server
    await server.start();

  } catch (error) {
    console.error('Failed to start JupiterOne MCP server:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}