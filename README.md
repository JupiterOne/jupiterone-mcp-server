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
# Clone the repository
git clone <repository-url>
cd jupiterone-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Development

For local development:

1. Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd jupiterone-mcp
npm install
```

2. Create a `.env` file in the root directory with your JupiterOne credentials:

```bash
JUPITERONE_API_KEY=your-api-key
JUPITERONE_ACCOUNT_ID=your-account-id
JUPITERONE_BASE_URL=https://graphql.us.jupiterone.io  # Optional, defaults to US endpoint
```

3. For local development with hot reloading:

```bash
npm run dev
```

This will:

- Watch for changes in TypeScript files
- Automatically rebuild when files change
- Restart the MCP inspector with your environment variables

4. To use your local version globally (required for local testing):

```bash
# From the project directory
npm link

# Now you can use jupiterone-mcp from anywhere
jupiterone-mcp

# To unlink when done
npm unlink
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

#### `get-dashboards`

Get all dashboards in your JupiterOne account, including J1 managed dashboards.

**Parameters:** None

**Example:**

```json
{
  "name": "get-dashboards",
  "arguments": {}
}
```

**Response:**

```json
{
  "total": 10,
  "dashboards": [
    {
      "id": "dashboard-uuid",
      "name": "Dashboard Name",
      "category": "Category",
      "supportedUseCase": "Use Case",
      "isJ1ManagedBoard": true,
      "resourceGroupId": "resource-group-id",
      "starred": false,
      "lastUpdated": "2024-03-21T12:00:00Z",
      "createdAt": "2024-03-21T12:00:00Z",
      "prerequisites": {
        "prerequisitesMet": true,
        "preRequisitesGroupsFulfilled": true,
        "preRequisitesGroupsRequired": true
      }
    }
  ]
}
```

#### `create-dashboard`

Create a new dashboard in your JupiterOne account.

**Parameters:**

- `name` (required): The name of the dashboard
- `type` (required): The type of the dashboard (e.g., "Account")

**Example:**

```json
{
  "name": "create-dashboard",
  "arguments": {
    "name": "MCP Test",
    "type": "Account"
  }
}
```

**Response:**

```json
{
  "id": "dashboard-uuid",
  "name": "MCP Test",
  "type": "Account"
}
```

#### `get-dashboard-details`

Get detailed information about a specific dashboard.

**Parameters:**

- `dashboardId` (required): The ID of the dashboard to retrieve

**Example:**

```json
{
  "name": "get-dashboard-details",
  "arguments": {
    "dashboardId": "dashboard-uuid"
  }
}
```

**Response:**

```json
{
  "id": "dashboard-uuid",
  "name": "Dashboard Name",
  "category": "Category",
  "supportedUseCase": "Use Case",
  "isJ1ManagedBoard": true,
  "published": true,
  "publishedToUserIds": ["user-id-1", "user-id-2"],
  "publishedToGroupIds": ["group-id-1"],
  "groupIds": ["group-id-1"],
  "userIds": ["user-id-1"],
  "scopeFilters": {},
  "resourceGroupId": "resource-group-id",
  "starred": false,
  "lastUpdated": "2024-03-21T12:00:00Z",
  "createdAt": "2024-03-21T12:00:00Z",
  "prerequisites": {
    "prerequisitesMet": true,
    "preRequisitesGroupsFulfilled": true,
    "preRequisitesGroupsRequired": true
  },
  "parameters": [
    {
      "id": "param-id",
      "label": "Parameter Label",
      "name": "param_name",
      "type": "string",
      "valueType": "string",
      "default": "default_value",
      "options": [],
      "requireValue": true,
      "disableCustomInput": false
    }
  ],
  "widgets": [
    {
      "id": "widget-id",
      "title": "Widget Title",
      "description": "Widget Description",
      "type": "widget-type",
      "questionId": "question-id",
      "noResultMessage": "No results found",
      "includeDeleted": false,
      "config": {
        "queries": [
          {
            "id": "query-id",
            "name": "Query Name",
            "query": "Find *"
          }
        ],
        "settings": {},
        "postQueryFilters": {},
        "disableQueryPolicyFilters": false
      }
    }
  ],
  "layouts": {
    "xs": [
      {
        "i": "widget-id",
        "x": 0,
        "y": 0,
        "w": 6,
        "h": 4,
        "static": false,
        "moved": false
      }
    ],
    "sm": [],
    "md": [],
    "lg": [],
    "xl": []
  }
}
```

#### `create-inline-question-rule`

Create a new inline question rule instance that monitors your JupiterOne environment and triggers alerts based on specified conditions.

**Parameters:**

- `name` (required): Name of the rule
- `description` (required): Description of the rule
- `pollingInterval` (required): How frequently to evaluate the rule (`DISABLED`, `THIRTY_MINUTES`, `ONE_HOUR`, `FOUR_HOURS`, `EIGHT_HOURS`, `TWELVE_HOURS`, `ONE_DAY`, `ONE_WEEK`)
- `outputs` (required): Array of output fields from the rule evaluation
- `queries` (required): Array of J1QL queries that define what entities to match
  - `query` (required): J1QL query string
  - `name` (required): Name identifier for the query
  - `version` (optional): Version of the query
  - `includeDeleted` (optional): Whether to include deleted entities
- `operations` (required): Array of operations that define when and what actions to take
  - `when` (required): Condition that triggers the actions
    - `type`: Must be `FILTER`
    - `condition`: Filter condition array
    - `version` (optional): Version of the filter condition
  - `actions` (required): Array of actions to perform when condition is met
    - `type` (required): Action type (e.g., `SET_PROPERTY`, `CREATE_ALERT`)
    - `targetProperty` (optional): Property to set (for `SET_PROPERTY` actions)
    - `targetValue` (optional): Value to set (for `SET_PROPERTY` actions)
- `notifyOnFailure` (optional): Whether to notify on failure
- `triggerActionsOnNewEntitiesOnly` (optional): Whether to trigger actions only on new entities
- `ignorePreviousResults` (optional): Whether to ignore previous results
- `specVersion` (optional): Specification version
- `tags` (optional): Array of tags for categorizing the rule
- `templates` (optional): Template variables object

**Example:**

```json
{
  "name": "create-inline-question-rule",
  "arguments": {
    "name": "Unencrypted Critical Data Stores",
    "description": "Monitor for critical data stores that are not encrypted",
    "notifyOnFailure": true,
    "triggerActionsOnNewEntitiesOnly": true,
    "ignorePreviousResults": false,
    "pollingInterval": "ONE_WEEK",
    "outputs": ["alertLevel"],
    "specVersion": 1,
    "tags": ["security", "encryption"],
    "templates": {},
    "queries": [
      {
        "query": "Find DataStore with classification='critical' and encrypted=false as d return d.tag.AccountName as Account, d.displayName as UnencryptedDataStores, d._type as Type, d.encrypted as Encrypted",
        "name": "query0",
        "version": "v1",
        "includeDeleted": false
      }
    ],
    "operations": [
      {
        "when": {
          "type": "FILTER",
          "condition": ["AND", ["queries.query0.total", ">", 0]]
        },
        "actions": [
          {
            "type": "SET_PROPERTY",
            "targetProperty": "alertLevel",
            "targetValue": "HIGH"
          },
          {
            "type": "CREATE_ALERT"
          }
        ]
      }
    ]
  }
}
```

**Response:**

```json
{
  "success": true,
  "rule": {
    "id": "rule-uuid",
    "name": "Unencrypted Critical Data Stores",
    "description": "Monitor for critical data stores that are not encrypted",
    "version": "1.0.0",
    "pollingInterval": "ONE_WEEK",
    "outputs": ["alertLevel"],
    "specVersion": 1,
    "notifyOnFailure": true,
    "triggerActionsOnNewEntitiesOnly": true,
    "ignorePreviousResults": false,
    "tags": ["security", "encryption"],
    "question": {
      "queries": [
        {
          "query": "Find DataStore with classification='critical' and encrypted=false as d return d.tag.AccountName as Account, d.displayName as UnencryptedDataStores, d._type as Type, d.encrypted as Encrypted",
          "name": "query0",
          "includeDeleted": false
        }
      ]
    },
    "operations": [
      {
        "when": {
          "type": "FILTER",
          "condition": ["AND", ["queries.query0.total", ">", 0]]
        },
        "actions": [
          {
            "type": "SET_PROPERTY",
            "targetProperty": "alertLevel",
            "targetValue": "HIGH"
          },
          {
            "type": "CREATE_ALERT"
          }
        ]
      }
    ],
    "latestAlertId": null,
    "latestAlertIsActive": false
  }
}
```

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
        "JUPITERONE_ACCOUNT_ID": "your-account-id",
        "JUPITERONE_BASE_URL": "https://graphql.us.jupiterone.io"
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
  - `list-rules` - List rules with filtering options
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