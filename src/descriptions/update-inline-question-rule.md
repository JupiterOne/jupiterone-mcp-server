# JupiterOne Rule Update Tool - Complete Guide

**Purpose**: Updates existing inline question-based alert rules in JupiterOne. This tool modifies the configuration of an existing rule while preserving its identity and version history.

**Important**: Before updating a rule, use the `get-rule-details` tool to retrieve the current configuration. This ensures you have all required fields and can see what needs to be changed.

## Key Requirements for Updates

### 1. Required Fields for Updates
When updating a rule, you must provide **ALL** fields, not just the ones you want to change. The update operation replaces the entire rule configuration, so missing fields will result in errors.

**Critical Required Fields**:
- `id`: The existing rule ID (from `get-rule-details`)
- `version`: The current version number (from `get-rule-details`)
- `specVersion`: Usually 1
- `ignorePreviousResults`: Must be included
- `templates`: Must be included (use `{}` if empty)
- `tags`: Must be included but should always be empty `[]` (deprecated)
- `labels`: Use this for actual tagging functionality
- `resourceGroupId`: Must be included (can be null)
- `remediationSteps`: Must be included (can be null)

### 2. Condition Format (Critical)
The `condition` parameter must use JupiterOne's specific array format:
- **Structure**: `["LOGICAL_OPERATOR", [left_value, operator, right_value]]`
- **Example**: `["AND", ["queries.queryName.total", ">", 0]]`
- **Supported operators**: `>`, `<`, `>=`, `<=`, `=`, `!=`
- **Logical operators**: `"AND"`, `"OR"`

### 3. Operations Structure
The `when` clause should only contain:
- `type`: Always `"FILTER"`
- `condition`: The array format described above
- **Do NOT include**: `version`, `specVersion` (these belong at the rule level, not in the when clause)

### 4. Query Naming Convention
- Query names in the `queries` array must match the references in conditions
- Example: If query name is `"users"`, reference it as `"queries.users.total"`
- **IMPORTANT**: Use `"query0"` as the standard query name for compatibility with existing patterns

### 5. Version Management
- The `version` field will be automatically incremented by JupiterOne
- You must provide the current version number in your update request
- Get the current version using `get-rule-details` before updating

### 6. Tags vs Labels (Important)
- **DEPRECATED**: The `tags` array field is deprecated and should always be set to an empty array `[]`
- **USE INSTEAD**: For tagging functionality, use the `labels` field with key-value pairs
- **Format**: `labels: [{"labelName": "key", "labelValue": "value"}]`
- **When users ask for tagging**: Always use the `labels` field to meet their needs
- **Note**: The `tags` field is still required in the schema for compatibility but should remain empty

## Update Workflow

### Step 1: Get Current Rule Configuration
```
Use get-rule-details with the rule ID to get the current configuration
```

### Step 2: Modify Required Fields
Update only the fields you need to change while preserving all other required fields.

### Step 3: Submit Update
Use this tool with the complete configuration including your changes.

## Required Schema Fields for Updates

### Complete Required Parameters for update-inline-question-rule
**CRITICAL**: All of these fields must be included for successful rule updates:

```json
{
  "id": "existing-rule-id",
  "name": "Updated Rule Name",
  "description": "Updated rule description",
  "notifyOnFailure": true,
  "triggerActionsOnNewEntitiesOnly": true,
  "ignorePreviousResults": false,
  "pollingInterval": "ONE_DAY",
  "specVersion": 1,
  "version": 2,
  "templates": {},
  "outputs": ["alertLevel"],
  "tags": [],
  "labels": [
    {"labelName": "environment", "labelValue": "production"},
    {"labelName": "team", "labelValue": "security"}
  ],
  "resourceGroupId": null,
  "remediationSteps": null,
  "question": {
    "queries": [
      {
        "query": "FIND Entity...",
        "name": "query0",
        "version": "v1",
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
      "actions": [...]
    }
  ]
}
```

**Key Update Requirements**:
- `id`: Must match the existing rule ID
- `version`: Must be the current version number from the existing rule
- `ignorePreviousResults`: Must be included (typically `false`)
- `templates`: Must be included (use `{}` if empty)
- `tags`: Must be included but should always be empty `[]` (deprecated field)
- `labels`: Use this for actual tagging functionality with key-value pairs
- `resourceGroupId`: Must be included (can be null)
- `remediationSteps`: Must be included (can be null)
- Query `name`: Use `"query0"` for primary query
- Query `version`: Include `"v1"` for compatibility
- Query `includeDeleted`: Must be explicitly set to `false`

## Available Action Types

### 1. SET_PROPERTY
Sets a property value on the alert (commonly used for alert severity levels).

**Configuration**:
```json
{
  "type": "SET_PROPERTY",
  "targetProperty": "alertLevel",
  "targetValue": "CRITICAL"
}
```

**Common Values for alertLevel**: `"LOW"`, `"MEDIUM"`, `"HIGH"`, `"CRITICAL"`, `"INFO"`

### 2. CREATE_ALERT
Creates a basic alert in JupiterOne.

**Configuration**:
```json
{
  "type": "CREATE_ALERT"
}
```

**Note**: This is the most basic action and should almost always be included.

### 3. SEND_EMAIL
Sends email notifications to specified recipients.

**Configuration**:
```json
{
  "type": "SEND_EMAIL",
  "recipients": ["user1@company.com", "user2@company.com"],
  "body": "Affected Items: <br><br>* {{queries.query0.data|mapProperty('displayName')|join('<br>* ')}}"
}
```

### 4. TAG_ENTITIES
Adds or removes tags from entities that triggered the rule.

**Configuration**:
```json
{
  "type": "TAG_ENTITIES",
  "entities": "{{queries.query0.data}}",
  "tags": [
    {"name": "existing tag to remove", "value": null},
    {"name": "new tag", "value": "tag value"}
  ]
}
```

### 5. SEND_SLACK_MESSAGE
Sends messages to Slack channels (requires Slack integration).

**Configuration**:
```json
{
  "integrationInstanceId": "d97d9127-c532-410a-bf0a-9ea93f66c3d2",
  "type": "SEND_SLACK_MESSAGE",
  "channels": ["#security-alerts", "#general"],
  "body": "*Affected Items:* \n\n- {{queries.query0.data|mapProperty('displayName')|join('\n- ')}}"
}
```

### 6. SEND_TO_S3
Sends alert data to an S3 bucket (requires AWS S3 integration).

**Configuration**:
```json
{
  "integrationInstanceId": "f89568b4-2a1b-4bd8-8abd-aee21270df75",
  "type": "SEND_TO_S3",
  "bucket": "security-alerts-bucket",
  "region": "us-east-1",
  "data": {
    "description": "{{alertWebLink}}\n\n**Affected Items:**\n\n* {{queries.query0.data|mapProperty('displayName')|join('\n* ')}}"
  }
}
```

### 7. CREATE_JIRA_TICKET
Creates a Jira ticket for the alert (requires Jira integration).

**Configuration**:
```json
{
  "integrationInstanceId": "53a99eaa-18a5-45ef-b748-2de39d642a91",
  "type": "CREATE_JIRA_TICKET",
  "entityClass": "Finding",
  "summary": "Security Alert: Critical Unencrypted Data Found",
  "issueType": "Bug",
  "project": "SEC",
  "updateContentOnChanges": false,
  "additionalFields": {
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": "{{alertWebLink}}\n\n**Affected Items:**\n\n* {{queries.query0.data|mapProperty('displayName')|join('\n* ')}}"
            }
          ]
        }
      ]
    }
  }
}
```

## Template Variables and Formatting

### Available Variables
- `{{alertWebLink}}` - Direct link to the alert in JupiterOne
- `{{queries.queryName.data}}` - Array of entities from the specified query
- `{{queries.queryName.total}}` - Count of entities from the query

### Data Formatting
- `|mapProperty('fieldName')` - Extract specific field from each entity
- `|join('separator')` - Join array elements with specified separator
- Example: `{{queries.users.data|mapProperty('displayName')|join(', ')}}` - Creates comma-separated list of user names

## Integration Dependencies

For actions requiring integrations, you may need to:
1. Query available integration instances using `get-integration-instances`
2. Ask the user which integration to use
3. Use the integration's `id` as the `integrationInstanceId`

**Actions requiring integrations**:
- `SEND_SLACK_MESSAGE` (Slack integration)
- `SEND_TO_S3` (AWS S3 integration)
- `CREATE_JIRA_TICKET` (Jira integration)

## Working Example Update

### Complete Working Rule Update Structure
```json
{
  "id": "12345678-1234-1234-1234-123456789abc",
  "name": "Updated Rule Name",
  "description": "Updated rule description",
  "notifyOnFailure": true,
  "triggerActionsOnNewEntitiesOnly": true,
  "ignorePreviousResults": false,
  "pollingInterval": "ONE_DAY",
  "specVersion": 1,
  "version": 3,
  "templates": {},
  "outputs": ["alertLevel"],
  "tags": [],
  "labels": [
    {"labelName": "severity", "labelValue": "high"},
    {"labelName": "category", "labelValue": "security"}
  ],
  "resourceGroupId": null,
  "remediationSteps": "1. Review the affected entities\n2. Apply security patches\n3. Update configurations",
  "question": {
    "queries": [
      {
        "query": "FIND Entity WITH condition",
        "name": "query0",
        "version": "v1",
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
          "targetValue": "CRITICAL"
        },
        {
          "type": "CREATE_ALERT"
        },
        {
          "type": "SEND_EMAIL",
          "recipients": ["updated-user@company.com"],
          "body": "Updated notification: {{alertWebLink}}"
        }
      ]
    }
  ]
}
```

## Common Update Scenarios

### 1. Changing Notification Recipients
Update only the `recipients` array in the `SEND_EMAIL` action while preserving all other fields.

### 2. Modifying Polling Interval
Update the `pollingInterval` field while keeping all other configuration the same.

### 3. Adding New Actions
Add new actions to the `actions` array in the operations.

### 4. Updating Query Logic
Modify the `query` string in the queries array or adjust the `condition` in operations.

### 5. Changing Labels
Update the `labels` array to add, remove, or modify rule labels.

## Debugging Tips
- Always start by getting the current rule configuration with `get-rule-details`
- Ensure the `version` number matches the current rule version
- Include ALL required fields, even if they're not changing
- If you get "Invalid conjunction operator" errors, check the condition array format
- If you get "additional properties" errors, remove extra fields from the `when` clause
- If you get missing property errors, ensure all required schema fields are included
- **Always include**: `id`, `version`, `ignorePreviousResults`, `templates`, `tags`, `labels`, `resourceGroupId`, `remediationSteps`
- Use `"query0"` as the standard query name for compatibility

## Best Practices for Updates
- Always retrieve the current rule configuration first using `get-rule-details`
- Only modify the fields that actually need to change
- Preserve the existing `version` number (it will be auto-incremented)
- Use the `labels` field for rule organization and tagging (not the deprecated `tags` field)
- Test rule changes with simple modifications first
- Document changes in the `description` field if significant
- When users request tagging functionality, use the `labels` field with key-value pairs
- Always include `CREATE_ALERT` action as a baseline unless specifically removing it

This format ensures reliable rule updates and helps avoid common pitfalls encountered during rule modification.