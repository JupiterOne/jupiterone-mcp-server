# JupiterOne MCP Server

A Model Context Protocol (MCP) server that provides access to JupiterOne tools. This server enables AI assistants and other MCP clients to interact with JupiterOne's data.

## Configuration

### Prerequisites

1. **JupiterOne Account**: You need an active JupiterOne account
2. **API Key**: Generate an API key from your JupiterOne account settings
3. **Account ID**: Your JupiterOne account identifier
4. Working node installation with a version >= 18

### Installation with Claude Desktop

To use this MCP server with Claude Desktop, you need to add it to your Claude configuration file.

#### Option 1: Using npx (Recommended)

Add the following configuration to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "jupiterone": {
      "command": "npx",
      "args": ["-y", "@jupiterone/jupiterone-mcp"],
      "env": {
        "JUPITERONE_API_KEY": "your-api-key-here",
        "JUPITERONE_ACCOUNT_ID": "your-account-id-here",
        "JUPITERONE_BASE_URL": "https://graphql.us.jupiterone.io"
      }
    }
  }
}
```

#### Option 2: Global Installation (For nvm users or troubleshooting)

If you're using nvm or experiencing issues with Option 1, first install the package globally:

```bash
npm install -g @jupiterone/jupiterone-mcp
```

Then add this configuration to your Claude Desktop config file:

```json
{
  "mcpServers": {
    "jupiterone": {
      "command": "/usr/local/bin/node",
      "args": ["/usr/local/bin/jupiterone-mcp"],
      "env": {
        "JUPITERONE_API_KEY": "your-api-key-here",
        "JUPITERONE_ACCOUNT_ID": "your-account-id-here",
        "JUPITERONE_BASE_URL": "https://graphql.us.jupiterone.io"
      }
    }
  }
}
```

**Note**: You may need to adjust the paths in Option 2 based on your Node.js installation:
- For Homebrew Node.js: `/usr/local/bin/node` and `/usr/local/bin/jupiterone-mcp`
- For nvm: `~/.nvm/versions/node/v[version]/bin/node` and `~/.nvm/versions/node/v[version]/bin/jupiterone-mcp`

### Installation with Cursor

For Cursor IDE, add the same configuration to your Cursor settings:

1. Open Cursor Settings
2. Navigate to "Features" → "Model Context Protocol"
3. Add the server configuration using either Option 1 or Option 2 from above

### Environment Variables

Replace the placeholder values with your actual JupiterOne credentials:

- **JUPITERONE_API_KEY**: Your JupiterOne API key (required)
- **JUPITERONE_ACCOUNT_ID**: Your JupiterOne account ID (required).
- **JUPITERONE_BASE_URL**: JupiterOne GraphQL endpoint (optional, defaults to `https://graphql.us.jupiterone.io`)

### Getting Your JupiterOne Credentials

1. **API Key**:
   - Log into your JupiterOne account
   - Go to Settings → API Keys
   - Create a new API key or use an existing one

2. **Account ID**:
   -  This can be retrieved by either of the following:
    - Navigating to `https://j1dev.apps.us.jupiterone.io/settings/account-management`
    - Run the following query in your JupiterOne account: `find jupiterone_account as x return x.accountId`

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
- **update-dashboard** - Update an existing dashboard layout

### Integration Management
- **get-integration-definitions** - List available integration definitions with optional configuration details
- **get-integration-instances** - Get integration instances with optional filtering by definition ID
- **get-integration-jobs** - List integration jobs with optional filtering by status, instance, or definition
- **get-integration-job** - Get details for a specific integration job
- **get-integration-events** - Get events for a specific integration job with pagination support

### Account Management
- **test-connection** - Test connection to JupiterOne API and get account information

### Query Execution
- **execute-j1ql-query** - Execute a J1QL query

## Available Tools

### Rules Management
| Tool | Description | Parameters |
|------|-------------|------------|
| `list-rules` | List all rules in the account | `limit` (optional): Number of rules to return (1-1000) |
| `get-rule-details` | Get detailed rule information | `ruleId`: ID of the rule |
| `create-inline-question-rule` | Create new inline question rule | Complex object: `name`, `description`, `notifyOnFailure` (optional), `triggerActionsOnNewEntitiesOnly` (optional), `ignorePreviousResults` (optional), `pollingInterval`, `outputs`, `specVersion` (optional), `tags` (optional), `templates` (optional), `queries`, `operations` |
| `update-inline-question-rule` | Update existing rule | `id`, `name`, `description`, `notifyOnFailure`, `triggerActionsOnNewEntitiesOnly`, `ignorePreviousResults`, `pollingInterval`, `outputs`, `specVersion`, `version`, `tags`, `templates`, `labels`, `resourceGroupId`, `remediationSteps`, `question`, `operations` |
| `evaluate-rule` | Trigger rule evaluation | `ruleId`: ID of the rule to evaluate |

### Rule Evaluations
| Tool | Description | Parameters |
|------|-------------|------------|
| `list-rule-evaluations` | Get rule evaluation history | `ruleId`, `beginTimestamp` (optional), `endTimestamp` (optional), `limit` (optional), `tag` (optional) |
| `get-rule-evaluation-details` | Get detailed evaluation results | `ruleId`, `timestamp` |
| `get-raw-data-download-url` | Get download URL for raw data | `rawDataKey` |
| `get-rule-evaluation-query-results` | Get query results from evaluation | `rawDataKey` |

### Alert Monitoring
| Tool | Description | Parameters |
|------|-------------|------------|
| `get-active-alerts` | List active alerts | `limit` (optional): Number of alerts to return (1-1000) |

### Dashboard Management
| Tool | Description | Parameters |
|------|-------------|------------|
| `get-dashboards` | List all dashboards | None |
| `create-dashboard` | Create new dashboard | `name`, `type` |
| `get-dashboard-details` | Get dashboard details | `dashboardId` |
| `update-dashboard` | Update an existing dashboard layout | `dashboardId`, `layouts` |
| `create-dashboard-widget` | Create a widget on a dashboard | `dashboardId`, `input` |

### Integration Management
| Tool | Description | Parameters |
|------|-------------|------------|
| `get-integration-definitions` | List integration definitions | `includeConfig` (optional): Include configuration fields |
| `get-integration-instances` | Get integration instances | `definitionId` (optional), `limit` (optional) |
| `get-integration-jobs` | List integration jobs | `status` (optional), `integrationInstanceId` (optional), `integrationDefinitionId` (optional), `integrationInstanceIds` (optional), `size` (optional) |
| `get-integration-job` | Get details for a specific integration job | `integrationJobId`, `integrationInstanceId` |
| `get-integration-events` | Get events for a specific integration job | `jobId`, `integrationInstanceId`, `cursor` (optional), `size` (optional) |

### Account Management
| Tool | Description | Parameters |
|------|-------------|------------|
| `test-connection` | Test connection to JupiterOne API and get account information | None |

### Query Execution
| Tool | Description | Parameters |
|------|-------------|------------|
| `execute-j1ql-query` | Execute a J1QL query | `query`, `variables` (optional), `cursor` (optional), `includeDeleted` (optional), `deferredResponse` (optional), `flags` (optional), `scopeFilters` (optional) |