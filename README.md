# JupiterOne MCP Server

A Model Context Protocol (MCP) server that provides access to JupiterOne account rules and alert details. This server enables AI assistants and other MCP clients to interact with JupiterOne's security monitoring and alerting system.

## Features

- **Rules Management**
  - List all rules with filtering and pagination
  - Get detailed information about specific rules
  - Create inline question-based rules
  - Trigger on-demand rule evaluation

- **Alert Monitoring**
  - Get all currently active alerts
  - Monitor alert status and details
  - Track alert history and resolution

- **Dashboard Management**
  - List all dashboards in your account
  - Create new dashboards
  - Get detailed dashboard information
  - View dashboard layouts and widgets

- **Account Management**
  - Test connection to JupiterOne API
  - Get account information and status
  - Verify API credentials and permissions

## Claude Desktop Integration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "jupiterone": {
      "command": "npx",
      "args": ["jupiterone-mcp"],
      "env": {
        "JUPITERONE_API_KEY": "your-api-key",
        "JUPITERONE_ACCOUNT_ID": "your-account-id",
        "JUPITERONE_BASE_URL": "https://graphql.us.jupiterone.io"
      }
    }
  }
}
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- JupiterOne account with API access

### Setup

```bash
# Clone and install
git clone <repository-url>
cd jupiterone-mcp
npm install

# Create .env file
echo "JUPITERONE_API_KEY=your-api-key
JUPITERONE_ACCOUNT_ID=your-account-id
JUPITERONE_BASE_URL=https://graphql.us.jupiterone.io" > .env

# Run in development mode
npm run dev
```

### Testing

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Launch MCP Inspector
JUPITERONE_API_KEY="your-api-key" JUPITERONE_ACCOUNT_ID="your-account-id" npx @modelcontextprotocol/inspector node dist/index.js
```

The inspector will start and display a URL where you can access the testing interface.