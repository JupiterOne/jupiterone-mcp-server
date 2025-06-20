# JupiterOne Rule Creation Tool - Complete Guide

**Purpose**: Creates inline question-based alert rules in JupiterOne to monitor entities and trigger alerts based on specified conditions.

The first step in creating a rule is to identify the query you want to use in order to get the data you want to take action with. Use the `execute-j1ql-query` tool to find the correct query.

## Key Requirements for Success

### 1. Condition Format (Critical)

The `condition` parameter must use JupiterOne's specific array format:

- **Structure**: `["LOGICAL_OPERATOR", [left_value, operator, right_value]]`
- **Example**: `["AND", ["queries.queryName.total", ">", 0]]`
- **Supported operators**: `>`, `<`, `>=`, `<=`, `=`, `!=`
- **Logical operators**: `"AND"`, `"OR"`

### 2. Operations Structure

The `when` clause should only contain:

- `type`: Always `"FILTER"`
- `condition`: The array format described above
- **Do NOT include**: `version`, `specVersion` (these belong at the rule level, not in the when clause)

### 3. Query Naming Convention

- Query names in the `queries` array must match the references in conditions
- Example: If query name is `"users"`, reference it as `"queries.users.total"`
- **IMPORTANT**: Use `"query0"` as the standard query name for compatibility with existing patterns

### 4. New Entity Detection

- Use `triggerActionsOnNewEntitiesOnly: true` to only alert on genuinely new entities
- This prevents re-alerting on existing entities every polling cycle
- Essential for "new user" or "new resource" type alerts

### 5. Polling Intervals

- **Default**: Use `"ONE_DAY"` unless the user specifically requests a different interval
- **Available options**: `"DISABLED"`, `"THIRTY_MINUTES"`, `"ONE_HOUR"`, `"FOUR_HOURS"`, `"EIGHT_HOURS"`, `"TWELVE_HOURS"`, `"ONE_DAY"`, `"ONE_WEEK"`
- Only use more frequent intervals (like `"THIRTY_MINUTES"`) when explicitly requested or for time-sensitive security alerts

### 6. Tags vs Labels (Important)

- **DEPRECATED**: The `tags` array field is deprecated and should always be set to an empty array `[]`
- **USE INSTEAD**: For tagging functionality, use the `labels` field with key-value pairs
- **Format**: `labels: [{"labelName": "key", "labelValue": "value"}]`
- **When users ask for tagging**: Always use the `labels` field to meet their needs
- **Note**: The `tags` field is still required in the schema for compatibility but should remain empty

## Required Schema Fields

### Complete Required Parameters for create-inline-question-rule

**CRITICAL**: All of these fields must be included for successful rule creation:

```json
{
  "name": "Rule Name",
  "description": "Rule description",
  "notifyOnFailure": true,
  "triggerActionsOnNewEntitiesOnly": true,
  "ignorePreviousResults": false,
  "pollingInterval": "ONE_DAY",
  "templates": {},
  "outputs": ["alertLevel"],
  "tags": [],
  "labels": [
    {"labelName": "environment", "labelValue": "production"},
    {"labelName": "team", "labelValue": "security"}
  ],
  "queries": [
    {
      "query": "FIND Entity...",
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
      "actions": [...]
    }
  ]
}
```

**Key Schema Requirements**:

- `ignorePreviousResults`: Must be included (typically `false`)
- `templates`: Must be included (use `{}` if empty)
- `tags`: Must be included but should always be empty `[]` (deprecated field)
- `labels`: Use this for actual tagging functionality with key-value pairs
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

**Required Information to Ask User**:

- Email addresses of recipients
- Custom email body content (if desired)

**Template Variables Available**:

- `{{alertWebLink}}` - Link to the alert in JupiterOne
- `{{queries.queryName.data|mapProperty('fieldName')|join('separator')}}` - Format query results

### 4. TAG_ENTITIES

Adds or removes tags from entities that triggered the rule.

**Configuration**:

```json
{
  "type": "TAG_ENTITIES",
  "entities": "{{queries.query0.data}}",
  "tags": [
    { "name": "existing tag to remove", "value": null },
    { "name": "new tag", "value": "tag value" }
  ]
}
```

**Required Information to Ask User**:

- Tag names and values to add
- Tag names to remove (set value to `null`)

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

**Required Information to Ask User**:

- Slack channel names (with # prefix)
- Slack integration instance ID (may need to query available integrations)
- Custom message content (if desired)

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

**Required Information to Ask User**:

- S3 bucket name
- AWS region
- S3 integration instance ID
- Data structure to send

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

**Required Information to Ask User**:

- Jira project key
- Issue type (Bug, Task, Story, etc.)
- Ticket summary/title
- Jira integration instance ID
- Additional fields as needed

**Common Entity Classes**: `"Finding"`, `"Incident"`, `"Issue"`

## Template Variables and Formatting

### Available Variables

- `{{alertWebLink}}` - Direct link to the alert in JupiterOne
- `{{queries.queryName.data}}` - Array of entities from the specified query
- `{{queries.queryName.total}}` - Count of entities from the query

### Data Formatting

- `|mapProperty('fieldName')` - Extract specific field from each entity
- `|join('separator')` - Join array elements with specified separator
- Example: `{{queries.users.data|mapProperty('displayName')|join(', ')}}` - Creates comma-separated list of user names

### Common Formatting Patterns

- **HTML list**: `{{queries.query0.data|mapProperty('displayName')|join('<br>* ')}}`
- **Markdown list**: `{{queries.query0.data|mapProperty('displayName')|join('\n- ')}}`
- **Simple list**: `{{queries.query0.data|mapProperty('displayName')|join('\n* ')}}`

## Integration Dependencies

For actions requiring integrations, you may need to:

1. Query available integration instances using `get-integration-instances`
2. Ask the user which integration to use
3. Use the integration's `id` as the `integrationInstanceId`

**Actions requiring integrations**:

- `SEND_SLACK_MESSAGE` (Slack integration)
- `SEND_TO_S3` (AWS S3 integration)
- `CREATE_JIRA_TICKET` (Jira integration)

## Working Example Template

### Complete Working Rule Structure

Based on confirmed working examples, use this template:

```json
{
  "name": "Your Rule Name",
  "description": "Your rule description",
  "notifyOnFailure": true,
  "triggerActionsOnNewEntitiesOnly": true,
  "ignorePreviousResults": false,
  "pollingInterval": "ONE_DAY",
  "templates": {},
  "outputs": ["alertLevel"],
  "tags": [],
  "labels": [
    { "labelName": "severity", "labelValue": "high" },
    { "labelName": "category", "labelValue": "security" }
  ],
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
          "recipients": ["user@company.com"],
          "body": "Affected Items: <br><br>* {{queries.query0.data|mapProperty('displayName')|join('<br>* ')}}"
        }
      ]
    }
  ]
}
```

## Common Patterns

### New Entity Monitoring

```json
{
  "condition": ["AND", ["queries.query0.total", ">", 0]],
  "triggerActionsOnNewEntitiesOnly": true
}
```

### Threshold-based Alerts

```json
{
  "condition": ["AND", ["queries.query0.total", ">=", 5]]
}
```

### Multi-action Rule Example

```json
"actions": [
  {"type": "SET_PROPERTY", "targetProperty": "alertLevel", "targetValue": "HIGH"},
  {"type": "CREATE_ALERT"},
  {"type": "SEND_EMAIL", "recipients": ["security@company.com"], "body": "Security issue detected: {{alertWebLink}}"},
  {"type": "TAG_ENTITIES", "entities": "{{queries.query0.data}}", "tags": [{"name": "needs-review", "value": "true"}]}
]
```

## Debugging Tips

- If you get "Invalid conjunction operator" errors, check the condition array format
- If you get "additional properties" errors, remove extra fields from the `when` clause
- If you get missing property errors, ensure all required schema fields are included
- **Always include**: `ignorePreviousResults`, `templates`, `tags`, query `version` and `includeDeleted`
- Always reference existing rules with `get-rule-details` to see working examples
- Test with simple conditions first, then add complexity
- Use `"query0"` as the standard query name for compatibility

## Best Practices

- Use descriptive query names that match their purpose (but prefer `"query0"` for main query)
- Include relevant entity fields in `outputs` for alert context
- Set appropriate polling intervals (default to `"ONE_DAY"` unless specified)
- Use the `labels` field for rule organization and tagging (not the deprecated `tags` field)
- Use `notifyOnFailure: true` to catch rule execution issues
- Always include `CREATE_ALERT` action as a baseline
- Always include all required schema fields from the working template
- Ask users for specific details when configuring notification actions (emails, channels, etc.)
- When users request tagging functionality, use the `labels` field with key-value pairs

This format ensures reliable rule creation and helps avoid common pitfalls encountered during rule development.
