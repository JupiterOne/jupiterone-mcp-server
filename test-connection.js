#!/usr/bin/env node

import { JupiterOneClient } from './dist/client/jupiterone-client.js';

async function testConnection() {
  const config = {
    apiKey: process.env.JUPITERONE_API_KEY,
    accountId: process.env.JUPITERONE_ACCOUNT_ID || 'j1dev',
    baseUrl: process.env.JUPITERONE_GRAPHQL_URL || 'https://graphql.dev.jupiterone.io'
  };

  if (!config.apiKey) {
    console.error('❌ JUPITERONE_API_KEY environment variable is required');
    console.log('Usage: JUPITERONE_API_KEY="your-key" node test-connection.js');
    process.exit(1);
  }

  console.log('🔍 Testing JupiterOne connection...');
  console.log(`📍 Account ID: ${config.accountId}`);
  console.log(`🌐 Base URL: ${config.baseUrl}`);
  console.log(`🔑 API Key: ${config.apiKey.substring(0, 8)}...`);

  const client = new JupiterOneClient(config);

  try {
    console.log('\n⏳ Testing connection...');
    const isConnected = await client.testConnection();

    if (isConnected) {
      console.log('✅ Connection successful!');

      console.log('\n⏳ Getting account info...');
      const accountInfo = await client.getAccountInfo();
      console.log('📊 Account Info:', accountInfo);

      console.log('\n⏳ Listing alert rules (first 5)...');
      const alerts = await client.listAlertInstances(undefined, 5);
      console.log(`📋 Found ${alerts.listAlertInstances.instances.length} alert instances`);

      if (alerts.listAlertInstances.instances.length > 0) {
        console.log('📄 First alert:', {
          id: alerts.listAlertInstances.instances[0].id,
          level: alerts.listAlertInstances.instances[0].level,
          status: alerts.listAlertInstances.instances[0].status,
          name: alerts.listAlertInstances.instances[0].questionRuleInstance?.name
        });
      }

      console.log('\n🎉 All tests passed! Your MCP server should work correctly.');
    } else {
      console.log('❌ Connection failed!');
      console.log('Please check your API key and account ID.');
    }
  } catch (error) {
    console.error('❌ Error testing connection:', error.message);
    if (error.response) {
      console.error('Response:', error.response.errors || error.response);
    }
  }
}

testConnection();