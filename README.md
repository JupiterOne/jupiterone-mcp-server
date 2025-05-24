# JupiterOne MCP Server

A Model Context Protocol (MCP) server that provides access to JupiterOne account rules and alert details. This server enables AI assistants and other MCP clients to interact with JupiterOne's security monitoring and alerting system.

## Features

### Rules Management
- **list-rules** - List all rules with optional limit parameter
- **get-rule-details** - Get detailed information about a specific rule by ID
- **create-inline-question-rule** - Create new inline question-based rules with operations and actions
- **update-inline-question-rule** - Update existing inline question rule instances
- **evaluate-rule** - Trigger on-demand evaluation of a specific rule

### Rule Evaluations
- **list-rule-evaluations** - Get historical evaluation data for a rule with optional time filtering
- **get-rule-evaluation-details** - Get detailed evaluation information including query, condition, and action results
- **get-raw-data-download-url** - Get download URL for raw evaluation data
- **get-rule-evaluation-query-results** - Get the actual query results from a rule evaluation

### Alert Monitoring
- **get-active-alerts** - Get all currently active alerts with optional limit parameter

### Dashboard Management
- **get-dashboards** - List all dashboards in your account
- **create-dashboard** - Create new dashboards
- **get-dashboard-details** - Get detailed dashboard information including widgets and layouts

### Integration Management
- **get-integration-definitions** - List available integration definitions with optional configuration details
- **get-integration-instances** - Get integration instances with optional filtering by definition ID
- **get-integration-jobs** - List integration jobs with optional filtering by status, instance, or definition
- **get-integration-job** - Get details for a specific integration job
- **get-integration-events** - Get events for a specific integration job with pagination support

### Account Management
- **test-connection** - Test connection to JupiterOne API and get account information

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `list-rules` | List all rules in the account | `limit` (optional): Number of rules to return (1-1000) |
| `get-rule-details` | Get detailed rule information | `ruleId`: ID of the rule |
| `create-inline-question-rule` | Create new inline question rule | Complex object with name, description, queries, operations, etc. |
| `update-inline-question-rule` | Update existing rule | Rule ID and updated configuration |
| `evaluate-rule` | Trigger rule evaluation | `ruleId`: ID of the rule to evaluate |
| `list-rule-evaluations` | Get rule evaluation history | `ruleId`, optional: `beginTimestamp`, `endTimestamp`, `limit`, `tag` |
| `get-rule-evaluation-details` | Get detailed evaluation results | `ruleId`, `timestamp` |
| `get-raw-data-download-url` | Get download URL for raw data | `rawDataKey` |
| `get-rule-evaluation-query-results` | Get query results from evaluation | `rawDataKey` |
| `get-active-alerts` | List active alerts | `limit` (optional): Number of alerts to return (1-1000) |
| `get-dashboards` | List all dashboards | None |
| `create-dashboard` | Create new dashboard | `name`, `type` |
| `get-dashboard-details` | Get dashboard details | `dashboardId` |
| `get-integration-definitions` | List integration definitions | `includeConfig` (optional): Include configuration fields |
| `get-integration-instances` | List integration instances | `definitionId` (optional), `limit` (optional) |
| `get-integration-jobs` | List integration jobs | `status`, `integrationInstanceId`, `integrationDefinitionId`, `integrationInstanceIds`, `size` (all optional) |
| `get-integration-job` | Get specific job details | `integrationJobId`, `integrationInstanceId` |
| `get-integration-events` | Get job events | `jobId`, `integrationInstanceId`, optional: `cursor`, `size` |
| `test-connection` | Test API connection | None |

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