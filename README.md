# JupiterOne MCP Server

A Model Context Protocol (MCP) server that provides access to JupiterOne account rules and alert details. This server enables AI assistants and other MCP clients to interact with JupiterOne's security monitoring and alerting system.

## Features

- **List Alert Rules**: Get all alert rules for your JupiterOne account
- **Rule Details**: Retrieve detailed information about specific rules
- **Active Alerts**: Monitor currently active security alerts
- **Rule Evaluation**: Trigger on-demand evaluation of alert rules
- **Account Summary**: Get overview statistics of your security posture
- **Connection Testing**: Verify connectivity to JupiterOne API

## Installation

### Via npx (Recommended)

```bash
npx jupiterone-mcp
```

### Via npm

```bash
npm install -g jupiterone-mcp
jupiterone-mcp
```

### From Source

```bash
git clone <repository-url>
cd jupiterone-mcp
npm install
npm run build
npm start
```

## Configuration

The server requires JupiterOne API credentials to function. Set the following environment variables:

```bash
export JUPITERONE_API_KEY="your-api-key-here"
export JUPITERONE_ACCOUNT_ID="your-account-id-here"
export JUPITERONE_BASE_URL="https://graphql.us.jupiterone.io"  # Optional, defaults to US endpoint
```

### Getting JupiterOne Credentials

1. **API Key**:
   - Log into your JupiterOne account
   - Go to Settings → API Keys
   - Create a new API key with appropriate permissions

2. **Account ID**:
   - Found in your JupiterOne URL: `https://apps.us.jupiterone.io/accounts/{ACCOUNT_ID}/`
   - Or available in your account settings

## Usage

### As an MCP Server

The server implements the Model Context Protocol and can be used with any MCP-compatible client:

```bash
# Start the server
JUPITERONE_API_KEY="your-key" JUPITERONE_ACCOUNT_ID="your-account" jupiterone-mcp
```

### Available Tools

#### `list-alert-rules`
List all alert rules in your account with optional filtering.

**Parameters:**
- `status` (optional): Filter by alert status (`ACTIVE`, `INACTIVE`, `DISMISSED`)
- `limit` (optional): Limit the number of results (1-1000)

**Example:**
```json
{
  "name": "list-alert-rules",
  "arguments": {
    "status": "ACTIVE",
    "limit": 10
  }
}
```

#### `get-rule-details`
Get detailed information about a specific rule.

**Parameters:**
- `ruleId` (required): The ID of the rule to retrieve

**Example:**
```json
{
  "name": "get-rule-details",
  "arguments": {
    "ruleId": "rule-uuid-here"
  }
}
```

#### `get-active-alerts`
Get all currently active alerts.

**Parameters:**
- `limit` (optional): Limit the number of results (1-1000)

**Example:**
```json
{
  "name": "get-active-alerts",
  "arguments": {
    "limit": 50
  }
}
```

#### `evaluate-rule`
Trigger on-demand evaluation of a specific rule.

**Parameters:**
- `ruleId` (required): The ID of the rule to evaluate

**Example:**
```json
{
  "name": "evaluate-rule",
  "arguments": {
    "ruleId": "rule-uuid-here"
  }
}
```

#### `test-connection`
Test the connection to JupiterOne API.

**Parameters:** None

**Example:**
```json
{
  "name": "test-connection",
  "arguments": {}
}
```

### Available Resources

#### `jupiterone://account/summary`
Provides an overview of your JupiterOne account including:
- Account information
- Total number of rules
- Alert statistics by status and severity level

#### `jupiterone://rules/all`
Complete list of all alert rules in your account with full details.

## MCP Client Integration

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "jupiterone": {
      "command": "npx",
      "args": ["jupiterone-mcp"],
      "env": {
        "JUPITERONE_API_KEY": "your-api-key",
        "JUPITERONE_ACCOUNT_ID": "your-account-id"
      }
    }
  }
}
```

### Other MCP Clients

The server uses stdio transport and follows the MCP specification. It should work with any compliant MCP client.

## API Reference

### JupiterOne GraphQL API

This server interacts with JupiterOne's GraphQL API. The following operations are supported:

- `listAlertInstances` - List alert rule instances
- `createInlineQuestionRuleInstance` - Create new inline rules
- `updateInlineQuestionRuleInstance` - Update existing inline rules
- `createReferencedQuestionRuleInstance` - Create rules referencing saved questions
- `updateReferencedQuestionRuleInstance` - Update referenced rules
- `deleteRuleInstance` - Delete rules
- `evaluateRuleInstance` - Trigger rule evaluation

### Rate Limits

JupiterOne enforces rate limits based on your account tier:
- **Free**: 10/min, no burst
- **Freemium**: 30/min, no burst
- **Enterprise**: 30-60/min with burst

The server handles rate limiting gracefully and will retry requests when appropriate.

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- JupiterOne account with API access

### Setup

```bash
git clone <repository-url>
cd jupiterone-mcp
npm install
```

### Development Commands

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

### Local Testing with MCP Inspector

For local development and testing, you can use the MCP Inspector to interactively test your server:

#### **Step 1: Install MCP Inspector**

```bash
npm install -g @modelcontextprotocol/inspector
```

#### **Step 2: Build the Project**

```bash
npm run build
```

#### **Step 3: Test Connection First**

Verify your JupiterOne credentials work:

```bash
JUPITERONE_API_KEY="your-api-key" JUPITERONE_ACCOUNT_ID="your-account-id" npm run test-connection
```

#### **Step 4: Launch MCP Inspector**

Use the direct node command to ensure environment variables are properly passed:

```bash
JUPITERONE_API_KEY="your-api-key" JUPITERONE_ACCOUNT_ID="your-account-id" JUPITERONE_BASE_URL="https://graphql.dev.jupiterone.io" npx @modelcontextprotocol/inspector node dist/index.js
```

**For JupiterOne Dev Environment:**
```bash
JUPITERONE_API_KEY="your-api-key" JUPITERONE_ACCOUNT_ID="j1dev" JUPITERONE_BASE_URL="https://graphql.dev.jupiterone.io" npx @modelcontextprotocol/inspector node dist/index.js
```

#### **Step 5: Test in Web Interface**

The inspector will start and display:
```
Starting MCP inspector...
⚙️ Proxy server listening on port XXXX
🔍 MCP Inspector is up and running at http://127.0.0.1:YYYY 🚀
```

Open the displayed URL in your browser to access the testing interface where you can:

- **Tools Tab**: Test all 5 available tools interactively
  - `test-connection` - Verify API connectivity
  - `list-alert-rules` - List alert rules with filtering options
  - `get-rule-details` - Get detailed rule information
  - `get-active-alerts` - View currently active alerts
  - `evaluate-rule` - Trigger on-demand rule evaluation

- **Resources Tab**: View account resources
  - `jupiterone://account/summary` - Account overview and statistics
  - `jupiterone://rules/all` - Complete list of all rules

- **Logs Tab**: Monitor real-time communication between the inspector and your server

#### **Alternative: Using npm link for npx Testing**

If you want to test the `npx jupiterone-mcp` command locally:

```bash
# Create a local npm link
npm link

# Now you can use npx locally
JUPITERONE_API_KEY="your-api-key" npx @modelcontextprotocol/inspector npx jupiterone-mcp
```

**Note**: Due to environment variable passing issues with some versions of the inspector, the direct node command approach (Step 4) is recommended for reliable local testing.

### Project Structure

```
src/
├── types/           # TypeScript type definitions
│   └── jupiterone.ts
├── client/          # JupiterOne API client
│   └── jupiterone-client.ts
├── server/          # MCP server implementation
│   └── mcp-server.ts
└── index.ts         # Main entry point
```

## Security Considerations

- **API Keys**: Never commit API keys to version control
- **Permissions**: Use API keys with minimal required permissions
- **Network**: The server connects to JupiterOne's GraphQL endpoint over HTTPS
- **Data**: No sensitive data is cached or stored locally

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify your API key is correct and has not expired
   - Ensure your account ID matches your JupiterOne account

2. **Rate Limiting**
   - Reduce the frequency of requests
   - Consider upgrading your JupiterOne plan for higher limits

3. **Network Issues**
   - Check your internet connection
   - Verify the base URL is correct for your region

### Debug Mode

Set the `DEBUG` environment variable for verbose logging:

```bash
DEBUG=jupiterone-mcp* jupiterone-mcp
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: JupiterOne API documentation at https://docs.jupiterone.io/
- **Community**: Join the MCP community discussions

## Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [JupiterOne](https://jupiterone.com/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)