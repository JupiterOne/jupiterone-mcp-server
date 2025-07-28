/* AUTO-GENERATED — DO NOT EDIT MANUALLY */
export const descriptionMap: Record<string, string> = {
  "create-dashboard-widget.md": `# JupiterOne Create Dashboard Widget Tool

**Purpose**: Adds a new widget to a specified JupiterOne dashboard. This tool allows you to programmatically create visual widgets (such as pie charts, bar charts, tables, etc.) on any dashboard, using custom queries and configuration.

This tool should be used when:
- You want to add a new visualization to an existing dashboard
- You need to automate dashboard widget creation for reporting or monitoring
- You want to programmatically manage dashboard content

## Required Parameters
- \`dashboardId\`: The ID of the dashboard to add the widget to
- \`input\`: The widget configuration object (CreateInsightsWidgetInput), including:
  - \`title\`: Widget title
  - \`description\`: Widget description (optional)
  - \`type\`: Widget type (e.g., 'pie', 'bar', 'table', etc.)
  - \`noResultMessage\`: Message to display when there are no results
  - \`config\`: Widget configuration, including queries and settings

## Supported Chart Types

The following values are supported for the \`type\` property when creating a widget:

\`\`\`typescript
export enum ChartType {
  Area = 'area',
  Bar = 'bar',
  Graph = 'graph',
  Line = 'line',
  Matrix = 'matrix',
  Number = 'number',
  Pie = 'pie',
  Table = 'table',
  Status = 'status',
  Markdown = 'markdown',
}
\`\`\`

## Example Usage
\`\`\`json
{
  "dashboardId": "95936c1a-468a-494f-b11d-b134ac9b9577",
  "input": {
    "title": "Example title",
    "type": "pie",
    "noResultMessage": "Message that shows when no results",
    "config": {
      "queries": [
        {
          "query": "FIND (aws_db_cluster_snapshot|aws_db_snapshot) as snapshot\n  RETURN\n    snapshot.tag.AccountName as name,\n    sum(snapshot.allocatedStorage) * 0.02 as value",
          "name": "Query 1"
        }
      ],
      "settings": {
        "pie": {
          "customColors": {
            "0": "#26A69A",
            "1": "#3F51B5",
            "2": "#D81B60",
            "3": "#FF8F00",
            "4": "#9575CD",
            "5": "#8BC34A",
            "6": "#039BE5"
          },
          "upwardTrendIsGood": true
        }
      }
    }
  }
}
\`\`\`

# Widget Options

When creating a dashboard, there are several options for widgets to choose from. This allows you to utilize the most impactful visual representation for your data. Below are the supported dashboard widgets, each with their own requirements and examples.

---

# Chart Types and Example Queries

> **Note:**
> To enable trend functionality for a chart, set \`trendDataIsEnabled: true\` in the relevant chart type's settings (e.g., \`settings.pie.trendDataIsEnabled\`). You can also use keys like \`trendQueryResultsCount\` to control the number of trend data points, and \`upwardTrendIsGood\` to indicate if an upward trend is positive.

## Number
The number chart visualization shows one large stat value. In the trend version of this chart you are able to track the value through a spark line to see if the result is getting larger or smaller over time.

### Query Requirements
Expects only a single \`value\` in the returned query response.

### Example Queries
**Trend:**
\`\`\`j1ql
FIND User AS u
  RETURN count(u) AS value
\`\`\`
**Non-Trend:**
\`\`\`j1ql
FIND User AS u
  RETURN count(u) AS value
\`\`\`

---

## Pie Chart
The pie chart displays values from one or more queries, as they relate to each other, in the form of slices of a pie. The arc length, area and central angle of a slice are all proportional to the slice's value, as it relates to the sum of all values. This type of chart is best used when you want a quick comparison of a small set of values in an aesthetically pleasing form. In the trend version of this chart you are able to track the value change of each slice value as well as the total value through a spark line to see if the data set is getting larger or smaller over time.

### Query Requirements
Expects 2 or more pairs of \`name\` and numeric \`value\` properties.

### Example Queries
**Trend:**
\`\`\`j1ql
FIND DataStore AS ds
  THAT RELATES TO (Account|Service) AS a
RETURN
  a.tag.AccountName AS name,
  count(ds) AS value
\`\`\`
**Non-Trend 1:**
\`\`\`j1ql
FIND DataStore AS ds
  THAT RELATES TO (Account|Service) AS a
RETURN
  a.tag.AccountName AS name,
  count(ds) AS value
\`\`\`
**Non-Trend 2:**
\`\`\`j1ql
FIND DataStore AS ds
  THAT RELATES TO (Account|Service) AS a
RETURN
  count(ds) AS value
\`\`\`

---

## Bar Chart
The bar chart visualization allows you to view categorical data to analyze your queries with a specified x and y axis. You are able to run multiple queries and visualize the bar chart in stacked format. This chart is best suited for categorizing your results. In the trend version of the chart you are able to visualize the value change of each categorical result through a %Change indicator and a reference category bar of the result value from the previous time period selected.

### Query Requirements
Expects one or more \`x\` and \`y\` values.

### Example Queries
**Trend:**
\`\`\`j1ql
FIND Person AS p
  THAT IS User AS u
  THAT opened PR
  WITH state='OPEN' AS pr
RETURN
  p.displayName AS x,
  count(pr) AS y
ORDER BY y DESC
\`\`\`
**Non-Trend:**
\`\`\`j1ql
FIND Person AS p
  THAT IS User AS u
  THAT opened PR
  WITH state='OPEN' AS pr
RETURN
  p.displayName AS x,
  count(pr) AS y
ORDER BY y DESC
LIMIT 5
\`\`\`

---

## Line Chart
The line chart is created by plotting a series of several points and connecting them with a straight line. This is best suited for data that has historical trend data enabled.

### Query Requirements
Expects \`line\` and \`y\` values.

### Example Queries
**Trend:**
\`\`\`j1ql
FIND Finding
  WITH createdOn > date.now-7day AS f
RETURN
  count(f) AS y,
  f.numericSeverity AS line
\`\`\`
**Non-Trend:**
\`\`\`j1ql
FIND Finding
  WITH createdOn > date.now-7day AS f
RETURN
  f.createdOn AS x,
  count(f) AS y,
  f.numericSeverity AS line
\`\`\`

---

## Matrix Chart
The matrix chart is used for analyzing and displaying the relationship between data sets. The matrix diagram shows the relationship between two, three, or four groups of information.

### Query Requirements
Expects \`x\` and \`y\` row and column names. Optional \`label\` to be shown in each cell. Any additional properties returned will be shown as key: value.

### Example Queries
**Firewall matrix:**
\`\`\`j1ql
FIND Firewall AS row
  THAT allows AS rel
  Network AS col
RETURN
  row.displayName AS x,
  col.displayName AS y,
  rel.egress AS egress,
  rel.ingress AS ingress,
  rel.fromPort as fromPort,
  rel.toPort as toPort,
  rel.ipProtocol AS label
\`\`\`

---

## Table
The tables chart present data in as close to raw form as possible. Tables are meant to be read, so they are ideal when you have data that cannot easily be presented visually, or when the data requires more specific attention.

### Query Requirements
Note: This chart is currently limited to displaying 250 rows, and it does not handle pagination. It is recommended to use LIMIT and ORDER BY to sort and limit the results.

### Example Queries
**Most recent people:**
\`\`\`j1ql
FIND Person AS p
  RETURN
    p.name AS Name,
    p.email AS Email,
    p.manager AS Manager
  ORDER BY p._createdOn DESC
  LIMIT 5
\`\`\`

---

## Graph Chart
The graph chart displays a tree graph of query results. This chart is best used to visualize specific relationships between entities.

### Example Queries
**Most recent people:**
\`\`\`j1ql
FIND Person RETURN TREE
\`\`\`

---

## Status
The status chart displays a visual summary of correlating queries. This chart is best used to show positive or negative results based on if relationships are present in query results. This chart is best suited by multiple queries.

### Example Queries
**Users passing security check:**
\`\`\`j1ql
Find Person as p
  Return
    p.email as id,
    p.name as displayName,
    p.acceptedSecurityPolicyOn,
    p.backgroundCheck,
    p.iconWebLink as iconWebLink
\`\`\`
\`\`\`j1ql
Find Person as p that owns Device as d
  Return
    p.email as id,
    d.encrypted
\`\`\`
\`\`\`j1ql
Find Person as p that is User as u
  Return
    p.email as id,
    count(u)
\`\`\`

---

## Area Chart
The area chart is a graph that combines a line chart and a bar chart to show changes in quantities over time. This chart requires the assets in the query to have relevant dates in their properties. For the best results, these charts can be generated by J1 Questions that have trend collection enabled. (This will soon be available straight from Insights.)

### Query Requirements
Expects two or more \`x\` and \`y\` values.

### Example Queries
**Top 5 most open PRs by Person:**
\`\`\`j1ql
FIND Person AS p
  THAT IS User AS u
  THAT opened PR
  WITH state='OPEN' AS pr
RETURN
  p.displayName AS x,
  count(pr) AS y
ORDER BY y DESC
LIMIT 5
\`\`\`

---

## Markdown Chart
The markdown chart/widget allows you to display custom Markdown content directly on your dashboard. This is useful for adding documentation, instructions, or contextual information alongside your visualizations.

### Query Requirements
- No queries are required for this widget type.
- The widget's settings must include a \`markdown.text\` property containing the Markdown content to display.

### Example Configuration
**Simple Markdown widget:**
\`\`\`json
{
  "type": "markdown",
  "config": {
    "queries": [],
    "settings": {
      "markdown": {
        "text": "# test markdown here\nsome more content"
      }
    }
  }
}
\`\`\`

---

After creating a widget you should include the dashboard url in your response to the user.`,
  "create-dashboard.md": `# Create Dashboard Tool

Creates a new dashboard in JupiterOne. This tool is simple and self-descriptive: provide a name and a type to create a dashboard. Unless specified otherwise, default to creating personal dashboards.
After creating a dashboard and all its widgets, you will typically want to call \`update-dashboard\` tool to set a layout favorable for the user, widgets should never be left at their default size.

## Valid Dashboard Types
\`\`\`typescript
export enum DashboardType {
  USER = 'User',
  ACCOUNT = 'Account',
}
\`\`\`

After creating a dashboard, you should include the dashboard's url in your response to the user.`,
  "create-inline-question-rule.md": `# JupiterOne Rule Creation Tool - Complete Guide

**Purpose**: Creates inline question-based alert rules in JupiterOne to monitor entities and trigger alerts based on specified conditions.

The first step in creating a rule is to identify the query you want to use in order to get the data you want to take action with. Use the \`execute-j1ql-query\` tool to find the correct query.

## Key Requirements for Success

### 1. Condition Format (Critical)

The \`condition\` parameter must use JupiterOne's specific array format:

- **Structure**: \`["LOGICAL_OPERATOR", [left_value, operator, right_value]]\`
- **Example**: \`["AND", ["queries.queryName.total", ">", 0]]\`
- **Supported operators**: \`>\`, \`<\`, \`>=\`, \`<=\`, \`=\`, \`!=\`
- **Logical operators**: \`"AND"\`, \`"OR"\`

### 2. Operations Structure

The \`when\` clause should only contain:

- \`type\`: Always \`"FILTER"\`
- \`condition\`: The array format described above
- **Do NOT include**: \`version\`, \`specVersion\` (these belong at the rule level, not in the when clause)

### 3. Query Naming Convention

- Query names in the \`queries\` array must match the references in conditions
- Example: If query name is \`"users"\`, reference it as \`"queries.users.total"\`
- **IMPORTANT**: Use \`"query0"\` as the standard query name for compatibility with existing patterns

### 4. New Entity Detection

- Use \`triggerActionsOnNewEntitiesOnly: true\` to only alert on genuinely new entities
- This prevents re-alerting on existing entities every polling cycle
- Essential for "new user" or "new resource" type alerts

### 5. Polling Intervals

- **Default**: Use \`"ONE_DAY"\` unless the user specifically requests a different interval
- **Available options**: \`"DISABLED"\`, \`"THIRTY_MINUTES"\`, \`"ONE_HOUR"\`, \`"FOUR_HOURS"\`, \`"EIGHT_HOURS"\`, \`"TWELVE_HOURS"\`, \`"ONE_DAY"\`, \`"ONE_WEEK"\`
- Only use more frequent intervals (like \`"THIRTY_MINUTES"\`) when explicitly requested or for time-sensitive security alerts

### 6. Tags vs Labels (Important)

- **DEPRECATED**: The \`tags\` array field is deprecated and should always be set to an empty array \`[]\`
- **USE INSTEAD**: For tagging functionality, use the \`labels\` field with key-value pairs
- **Format**: \`labels: [{"labelName": "key", "labelValue": "value"}]\`
- **When users ask for tagging**: Always use the \`labels\` field to meet their needs
- **Note**: The \`tags\` field is still required in the schema for compatibility but should remain empty

## Required Schema Fields

### Complete Required Parameters for create-inline-question-rule

**CRITICAL**: All of these fields must be included for successful rule creation:

\`\`\`json
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
\`\`\`

**Key Schema Requirements**:

- \`ignorePreviousResults\`: Must be included (typically \`false\`)
- \`templates\`: Must be included (use \`{}\` if empty)
- \`tags\`: Must be included but should always be empty \`[]\` (deprecated field)
- \`labels\`: Use this for actual tagging functionality with key-value pairs
- Query \`name\`: Use \`"query0"\` for primary query
- Query \`version\`: Include \`"v1"\` for compatibility
- Query \`includeDeleted\`: Must be explicitly set to \`false\`

## Available Action Types

### 1. SET_PROPERTY

Sets a property value on the alert (commonly used for alert severity levels).

**Configuration**:

\`\`\`json
{
  "type": "SET_PROPERTY",
  "targetProperty": "alertLevel",
  "targetValue": "CRITICAL"
}
\`\`\`

**Common Values for alertLevel**: \`"LOW"\`, \`"MEDIUM"\`, \`"HIGH"\`, \`"CRITICAL"\`, \`"INFO"\`

### 2. CREATE_ALERT

Creates a basic alert in JupiterOne.

**Configuration**:

\`\`\`json
{
  "type": "CREATE_ALERT"
}
\`\`\`

**Note**: This is the most basic action and should almost always be included.

### 3. SEND_EMAIL

Sends email notifications to specified recipients.

**Configuration**:

\`\`\`json
{
  "type": "SEND_EMAIL",
  "recipients": ["user1@company.com", "user2@company.com"],
  "body": "Affected Items: <br><br>* {{queries.query0.data|mapProperty('displayName')|join('<br>* ')}}"
}
\`\`\`

**Required Information to Ask User**:

- Email addresses of recipients
- Custom email body content (if desired)

**Template Variables Available**:

- \`{{alertWebLink}}\` - Link to the alert in JupiterOne
- \`{{queries.queryName.data|mapProperty('fieldName')|join('separator')}}\` - Format query results

### 4. TAG_ENTITIES

Adds or removes tags from entities that triggered the rule.

**Configuration**:

\`\`\`json
{
  "type": "TAG_ENTITIES",
  "entities": "{{queries.query0.data}}",
  "tags": [
    { "name": "existing tag to remove", "value": null },
    { "name": "new tag", "value": "tag value" }
  ]
}
\`\`\`

**Required Information to Ask User**:

- Tag names and values to add
- Tag names to remove (set value to \`null\`)

### 5. SEND_SLACK_MESSAGE

Sends messages to Slack channels (requires Slack integration).

**Configuration**:

\`\`\`json
{
  "integrationInstanceId": "d97d9127-c532-410a-bf0a-9ea93f66c3d2",
  "type": "SEND_SLACK_MESSAGE",
  "channels": ["#security-alerts", "#general"],
  "body": "*Affected Items:* \n\n- {{queries.query0.data|mapProperty('displayName')|join('\n- ')}}"
}
\`\`\`

**Required Information to Ask User**:

- Slack channel names (with # prefix)
- Slack integration instance ID (may need to query available integrations)
- Custom message content (if desired)

### 6. SEND_TO_S3

Sends alert data to an S3 bucket (requires AWS S3 integration).

**Configuration**:

\`\`\`json
{
  "integrationInstanceId": "f89568b4-2a1b-4bd8-8abd-aee21270df75",
  "type": "SEND_TO_S3",
  "bucket": "security-alerts-bucket",
  "region": "us-east-1",
  "data": {
    "description": "{{alertWebLink}}\n\n**Affected Items:**\n\n* {{queries.query0.data|mapProperty('displayName')|join('\n* ')}}"
  }
}
\`\`\`

**Required Information to Ask User**:

- S3 bucket name
- AWS region
- S3 integration instance ID
- Data structure to send

### 7. CREATE_JIRA_TICKET

Creates a Jira ticket for the alert (requires Jira integration).

**Configuration**:

\`\`\`json
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
\`\`\`

**Required Information to Ask User**:

- Jira project key
- Issue type (Bug, Task, Story, etc.)
- Ticket summary/title
- Jira integration instance ID
- Additional fields as needed

**Common Entity Classes**: \`"Finding"\`, \`"Incident"\`, \`"Issue"\`

## Template Variables and Formatting

### Available Variables

- \`{{alertWebLink}}\` - Direct link to the alert in JupiterOne
- \`{{queries.queryName.data}}\` - Array of entities from the specified query
- \`{{queries.queryName.total}}\` - Count of entities from the query

### Data Formatting

- \`|mapProperty('fieldName')\` - Extract specific field from each entity
- \`|join('separator')\` - Join array elements with specified separator
- Example: \`{{queries.users.data|mapProperty('displayName')|join(', ')}}\` - Creates comma-separated list of user names

### Common Formatting Patterns

- **HTML list**: \`{{queries.query0.data|mapProperty('displayName')|join('<br>* ')}}\`
- **Markdown list**: \`{{queries.query0.data|mapProperty('displayName')|join('\n- ')}}\`
- **Simple list**: \`{{queries.query0.data|mapProperty('displayName')|join('\n* ')}}\`

## Integration Dependencies

For actions requiring integrations, you may need to:

1. Query available integration instances using \`get-integration-instances\`
2. Ask the user which integration to use
3. Use the integration's \`id\` as the \`integrationInstanceId\`

**Actions requiring integrations**:

- \`SEND_SLACK_MESSAGE\` (Slack integration)
- \`SEND_TO_S3\` (AWS S3 integration)
- \`CREATE_JIRA_TICKET\` (Jira integration)

## Working Example Template

### Complete Working Rule Structure

Based on confirmed working examples, use this template:

\`\`\`json
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
\`\`\`

## Common Patterns

### New Entity Monitoring

\`\`\`json
{
  "condition": ["AND", ["queries.query0.total", ">", 0]],
  "triggerActionsOnNewEntitiesOnly": true
}
\`\`\`

### Threshold-based Alerts

\`\`\`json
{
  "condition": ["AND", ["queries.query0.total", ">=", 5]]
}
\`\`\`

### Multi-action Rule Example

\`\`\`json
"actions": [
  {"type": "SET_PROPERTY", "targetProperty": "alertLevel", "targetValue": "HIGH"},
  {"type": "CREATE_ALERT"},
  {"type": "SEND_EMAIL", "recipients": ["security@company.com"], "body": "Security issue detected: {{alertWebLink}}"},
  {"type": "TAG_ENTITIES", "entities": "{{queries.query0.data}}", "tags": [{"name": "needs-review", "value": "true"}]}
]
\`\`\`

## Debugging Tips

- If you get "Invalid conjunction operator" errors, check the condition array format
- If you get "additional properties" errors, remove extra fields from the \`when\` clause
- If you get missing property errors, ensure all required schema fields are included
- **Always include**: \`ignorePreviousResults\`, \`templates\`, \`tags\`, query \`version\` and \`includeDeleted\`
- Always reference existing rules with \`get-rule-details\` to see working examples
- Test with simple conditions first, then add complexity
- Use \`"query0"\` as the standard query name for compatibility

## Best Practices

- Use descriptive query names that match their purpose (but prefer \`"query0"\` for main query)
- Include relevant entity fields in \`outputs\` for alert context
- Set appropriate polling intervals (default to \`"ONE_DAY"\` unless specified)
- Use the \`labels\` field for rule organization and tagging (not the deprecated \`tags\` field)
- Use \`notifyOnFailure: true\` to catch rule execution issues
- Always include \`CREATE_ALERT\` action as a baseline
- Always include all required schema fields from the working template
- Ask users for specific details when configuring notification actions (emails, channels, etc.)
- When users request tagging functionality, use the \`labels\` field with key-value pairs

This format ensures reliable rule creation and helps avoid common pitfalls encountered during rule development.
After creating a rule, you should include the rule's url in your message to the user.
`,
  "create-j1ql-from-natural-language.md": `# JupiterOne Natural Language to J1QL Converter

**Purpose**: Converts natural language queries into JupiterOne Query Language (J1QL) syntax using AI-powered translation.
Unless the user gives a specific query to run, this should always be used for determing a query to use for any (but not exclusively) of the following:
- Queries for rules
- Queries for widgets
- Queries to answer a user's question regarding their data in jupiterone`,
  "evaluate-rule.md": `# Evaluate Rule Tool

Manually trigger the evaluation of a JupiterOne alert rule. This tool forces an immediate evaluation of the rule's conditions and returns the results.

## Parameters
- \`ruleId\` (required): The unique identifier of the rule to evaluate

## Example Usage
Evaluate a specific rule:
\`\`\`json
{
  "ruleId": "12345678-1234-1234-1234-123456789abc"
}
\`\`\``,
  "execute-j1ql-query.md": `# JupiterOne J1QL Query Executor

**Purpose**: Executes JupiterOne Query Language (J1QL) queries against your JupiterOne data and returns the results. This tool is used to directly run J1QL queries that have been created, either manually or through the natural language converter.

This tool should be used when:
- You need to validate the data of a query
- You need to get results from a previously generated query
- You want to test a query before using it in a rule or widget
- You need to analyze data directly using J1QL

The tool supports various query parameters including:
- Including/excluding deleted entities
- Returning row metadata
- Returning computed properties
- Applying scope filters
- Pagination using cursors

### JupiterOne Query Language (J1QL) Quick Reference

> **IMPORTANT:** Always validate queries using this tool before creating rules or widgets. Start with discovery queries if unsure about data structure.

#### Core Concepts

**Entity and Relationship Structure**
- **Entities**: Assets in your environment with specific classes and types
  - **Entity Class**: Always \`TitleCase\` (e.g., \`User\`, \`Host\`, \`Application\`)
  - **Entity Type**: Always \`snake_case\` (e.g., \`aws_iam_user\`, \`github_user\`)
- **Relationships**: Connections between entities
  - **Relationship Class**: Always \`ALLCAPS\` (e.g., \`HAS\`, \`USES\`, \`PROTECTS\`)
- **Default Returns**: Queries return the first entity after FIND unless explicitly modified with RETURN
- **Unified Entities**: Deduplicated repersentation of assets seen in JupiterOne have a \`_type: unified_entity\`

#### Unified Entities

Unified entities are the deduplicated "real-world" repersentation of data seen by JupiterOne. All Unified entities have a \`_type = unified_entity\`, and this is often the entity the user wants referenced.

Unified Entities currently supported:
- **UnifiedDevice**: Deduplicated representation of devices in the inventory
- **UnifiedIdentity**: Deduplicated representation of identities in the inventory
- **UnifiedVulnerability**: Deduplicated representation of vulnerabilities in the inventory

Unified entities typically also have additional enrichment making them valuable assets to search off of or reference back to. Unified entities only have relationships to the entities that they deduplicate, and you need to query off of their source components to get more context - for example a list of all devices related to users would look like:

\`\`\`
FIND UnifiedIdentity AS identity
    THAT IS << User 
    THAT RELATES TO AS rel (Device|Host) 
    THAT IS >> UnifiedDevice AS device
RETURN identity.displayName, rel._class, device.displayName
\`\`\`

**IMPORTANT**: Whenever answering questions about entities that have a unified entity representation, answer the question in terms of unified entities.

#### MANDATORY Query Structure

\`\`\`
FIND <entity> [WITH <property_filter>] [AS <alias>]
  [THAT <relationship> [<direction>] <entity> [WITH <property_filter>] [AS <alias>]]
  [WHERE <condition>]
  [RETURN <field_selection>]
  [ORDER BY <field>]
  [SKIP <number>]
  [LIMIT <number>]
\`\`\`

#### ⚠️ CRITICAL SYNTAX RULES ⚠️ ALL QUERIES MUST ADHERE TO THESE RULES

1. **Alias Placement**: Aliases MUST follow the WITH statement when filtering
   ✅ \`FIND Device WITH name~='TEST' AS dev\`
   ❌ \`FIND Device AS dev WITH name~='TEST'\`

2. **String Values**: ALWAYS use single quotes for strings, NEVER double quotes
   ✅ \`name ~= 'john'\`
   ❌ \`name ~= "john"\`

3. **WITH vs WHERE**: Use WITH for entity properties, WHERE only for relationship properties or cross-entity comparisons
   ✅ \`FIND User WITH active = true\`
   ✅ \`FIND User AS u THAT HAS Device AS d WHERE u.active = true AND d.platform = 'darwin'\`
   ❌ \`FIND User WHERE active = true\`

4. **LIMIT Usage**: ALWAYS include LIMIT (5-100) or use COUNT for discovery
   ✅ \`FIND User LIMIT 50\`
   ✅ \`FIND User AS u RETURN u._type, count(u)\`
   ❌ \`FIND User\` (no limit specified)

5. **Relationship Direction**: Direction arrows MUST follow the relationship verb
   ✅ \`FIND User THAT HAS >> Device\`
   ❌ \`FIND User THAT >> HAS Device\`

6. **Optional Traversals**: Use parentheses and question mark
   ✅ \`FIND User AS u (THAT IS Person AS p)?\`
   ❌ \`FIND User AS u THAT IS? Person AS p\`

7. **Using Aggregates For Discovery**: Alias COUNT and use ORDER BY
   ✅ \`FIND * AS ent RETURN ent._class, COUNT(ent) AS cnt ORDER BY cnt DESC LIMIT 50\`
   ❌ \`FIND * AS ent RETURN ent._class, COUNT(ent) LIMIT 50\`

#### Entity Selection

**Finding by class or type**:
\`\`\`j1ql
FIND User LIMIT 10                 # Find entities with _class = 'User'
FIND aws_iam_user LIMIT 10         # Find entities with _type = 'aws_iam_user'
FIND * WITH _type='aws_instance' LIMIT 10  # Filter any entity by type
\`\`\`

**Finding multiple entity types**:
\`\`\`j1ql
FIND (User | Host) LIMIT 10        # Find entities with _class = 'User' OR _class = 'Host'
\`\`\`

#### Property Filtering (WITH)

**Basic property filtering**:
\`\`\`j1ql
FIND User WITH active = true LIMIT 10
FIND DataStore WITH encrypted = false LIMIT 10
\`\`\`

**WITH filtering with alias** (CORRECT ORDER):
\`\`\`j1ql
FIND User WITH active = true AS u LIMIT 10
FIND DataStore WITH encrypted = false AS ds LIMIT 10
\`\`\`

**WITH filtering with alias AND Advanced fiiltering** (CORRECT ORDER):
\`\`\`j1ql
FIND User WITH accountCount > 0 AS u RETURN u.displayName
FIND DataStore WITH name~='ROOT' OR name=/iam/i AS ds RETURN ds.name, ds.encrypted LIMIT 10
\`\`\`

**Multiple property filters**:
\`\`\`j1ql
FIND User WITH active = true AND mfaEnabled = false LIMIT 10
FIND Host WITH platform = 'darwin' OR platform = 'linux' LIMIT 10
\`\`\`

**Multiple value matching**:
\`\`\`j1ql
FIND Host WITH platform = ('darwin' OR 'linux') LIMIT 10
\`\`\`

**Property existence check**:
\`\`\`j1ql
FIND DataStore WITH encrypted = undefined LIMIT 10
\`\`\`

**Special character property names**:
\`\`\`j1ql
FIND Host WITH [tag.special-name] = 'value' LIMIT 10
\`\`\`

#### String Comparisons

J1QL comparison operators:
- \`=\` : equals (exact match)
- \`!=\` : not equals
- \`~=\` : contains
- \`^=\` : starts with
- \`$=\` : ends with
- \`!~=\` : does not contain
- \`!^=\` : does not start with
- \`!$=\` : does not end with

\`\`\`j1ql
FIND User WITH username ~= 'john' LIMIT 10
FIND Host WITH name ^= 'web' LIMIT 10
\`\`\`

#### Case-Insensitive Matching (Regex)

\`\`\`j1ql
FIND User WITH username=/john/ LIMIT 10  # Case-insensitive match
\`\`\`

#### Traversing Relationships (THAT)

## Important: Don't assume relationship VERBS, either do discovery to determine the correct relationship or use the wild card relationship "THAT RELATES TO"

**Any relationship traversal (i.e. wildcard)**:
\`\`\`j1ql
FIND User THAT RELATES TO Application LIMIT 10
\`\`\`

**Basic traversal**:
\`\`\`j1ql
FIND User THAT HAS Device LIMIT 10
\`\`\`

**Multiple traversal steps**:
\`\`\`j1ql
FIND User THAT HAS Device THAT INSTALLED Application LIMIT 10
\`\`\`

**Multi-step traversal with filtering**:
\`\`\`j1ql
FIND User WITH active = true THAT HAS Device THAT INSTALLED Application WITH vendor = 'Microsoft' LIMIT 10
\`\`\`

**Multiple relationship types**:
\`\`\`j1ql
FIND HostAgent THAT (MONITORS|PROTECTS) Host LIMIT 10
\`\`\`

**Negating relationships**:
\`\`\`j1ql
FIND User THAT !HAS Device LIMIT 10         # Find users that don't have devices
\`\`\`

**Relationship direction** (arrows MUST follow relationship):
\`\`\`j1ql
FIND User THAT HAS >> Device LIMIT 10       # Direction from User to Device
FIND Device THAT HAS << User LIMIT 10       # Direction from User to Device
\`\`\`

#### Using Aliases (AS) - ALWAYS AFTER WITH CLAUSE

\`\`\`j1ql
FIND User WITH active = true AS u
  THAT HAS AS relationship Device WITH platform = 'darwin' AS d
RETURN u._type, relationship._class, d._type, COUNT(relationship)
LIMIT 10
\`\`\`

#### Post-Traversal Filtering (WHERE) - ONLY FOR RELATIONSHIPS OR CROSS-ENTITY COMPARISON

**Example of filtering on relationship properties**
\`\`\`j1ql
FIND Firewall AS fw
  THAT ALLOWS AS rule * AS n
WHERE rule.ingress = true
LIMIT 10
\`\`\`

\`\`\`j1ql
FIND User AS u
  THAT HAS Device AS d
WHERE u.active = true AND d.platform = 'darwin'
LIMIT 10
\`\`\`

#### Selecting Return Values (RETURN)

\`\`\`j1ql
FIND User AS u
  THAT HAS Device AS d
RETURN u.username, d.name
LIMIT 10
\`\`\`

Return all properties:
\`\`\`j1ql
FIND User AS u RETURN u.* LIMIT 10
\`\`\`

#### Aggregation Functions (USE FOR DISCOVERY)

Available aggregations:
- \`count(selector)\`
- \`min(selector.field)\`
- \`max(selector.field)\`
- \`avg(selector.field)\`
- \`sum(selector.field)\`

\`\`\`j1ql
# Basic count
FIND User AS u RETURN count(u)

# Group by with count
FIND User AS u RETURN u._type, count(u)

# Multiple aggregations
FIND Account AS acct THAT HAS User AS user
  RETURN acct.name, count(user), avg(user.lastLoginOn)
\`\`\`

#### Date Comparisons

\`\`\`j1ql
FIND User WITH createdOn > date.now - 7 days LIMIT 10
\`\`\`

Supported units: \`hour(s)\`, \`day(s)\`, \`month(s)\`, \`year(s)\`

#### Math Operations

\`\`\`j1ql
FIND aws_instance AS i
  RETURN i.name, i.memorySize * 0.001 AS memoryGB
LIMIT 10
\`\`\`

#### Sorting and Pagination

\`\`\`j1ql
FIND User AS u
  ORDER BY u.username
  SKIP 10
  LIMIT 5
\`\`\`

#### Optional Traversals (PROPER SYNTAX)

\`\`\`j1ql
FIND User AS u
  (THAT IS Person AS p)?
  THAT HAS Device AS d
LIMIT 10
\`\`\`

Optional traversal with property access:
\`\`\`j1ql
FIND User AS u
  (THAT IS Person AS p)?
  THAT HAS Device AS d
RETURN u.username, p.email, d.name
LIMIT 10
\`\`\`

#### Discovery Queries - ALWAYS START HERE

1. **Find all entity classes**: \`FIND * AS e RETURN e._class, COUNT(e)\`
2. **Explore entity properties**: \`FIND EntityClass AS e RETURN e.* LIMIT 10\`
3. **Discover relationships**: \`FIND Entity1 THAT RELATES TO AS rel Entity2 RETURN rel._class\`
4. **Check property values**: \`FIND Entity AS e RETURN e.property, COUNT(e)\`

#### ⚠️ QUERY VALIDATION CHECKLIST ⚠️

Before running any J1QL query, verify:

1. ✓ FIND statement specifies entity class or type
2. ✓ All string values use single quotes, not double quotes
3. ✓ Aliases are placed AFTER the WITH statement
4. ✓ All queries include either LIMIT or use COUNT aggregation
5. ✓ WITH is used for entity properties, WHERE only for relationship properties or cross-entity comparisons
6. ✓ Direction arrows (>> or <<) are placed after relationship verbs
7. ✓ Optional traversals use proper parentheses and question mark syntax
8. ✓ All aliases referenced in RETURN or WHERE are properly defined earlier

#### Most Common Errors (Quick Reference)

1. **Missing quotes**: \`name = john\` → \`name = 'john'\`
2. **Wrong quotes**: \`name = "john"\` → \`name = 'john'\`  
3. **Alias placement**: \`AS u WITH active = true\` → \`WITH active = true AS u\`
4. **WHERE needs alias**: \`WHERE active = true\` → \`AS u WHERE u.active = true\`
5. **Undefined alias**: \`FIND User RETURN u.name\` → \`FIND User AS u RETURN u.name\`
6. **No LIMIT**: Add \`LIMIT 100\` or use \`COUNT()\` to prevent timeouts

#### Common Patterns & Examples

**Security Queries**:
- Unencrypted data: \`FIND DataStore WITH encrypted = false\`
- Users without MFA: \`FIND User WITH mfaEnabled != true\`
- Critical findings: \`FIND Finding WITH severity = "critical"\`

**Dashboard Queries**:
- Pie chart: Return \`name\` and \`value\` pairs
- Number chart: Return single \`value\`
- Bar chart: Return \`x\` and \`y\` values
- Table: Return named columns

**Rule Queries**:
- New entities: Add time filter \`WITH _createdOn > date.now - 1 day\`
- Always test with \`execute-j1ql-query\` first
- Use condition: \`["AND", ["queries.query0.total", ">", 0]]\`

#### Best Practices

1. **Always start with discovery** - Don't assume entity names or properties
2. **Test incrementally** - Build complex queries step by step
3. **Use this tool to validate** - Test every query before using in rules/widgets
4. **Check error suggestions** - The tool provides specific fixes for common issues
5. **Use proper syntax**:
   - Single quotes for strings
   - Alias AFTER WITH clause
   - LIMIT to prevent timeouts
   - Proper capitalization for classes

**Remember**: The execute-j1ql-query tool now provides enhanced error messages with specific suggestions. Always test queries here first!`,
  "get-dashboard-details.md": `# Get Dashboard Details Tool

Get detailed information about a specific JupiterOne dashboard including its widgets, layout, and configuration.

## Parameters
- \`dashboardId\` (required): The unique identifier of the dashboard to retrieve

## Example Usage
Get details of a specific dashboard:
\`\`\`json
{
  "dashboardId": "95936c1a-468a-494f-b11d-b134ac9b9577"
}
\`\`\``,
  "get-dashboards.md": `# Get Dashboards Tool

List all dashboards available in your JupiterOne account. This tool returns both personal and account-level dashboards with their metadata.

## Parameters
None required.

## Example Usage
Get all dashboards:
\`\`\`json
{}
\`\`\``,
  "get-integration-definitions.md": `# Get Integration Definitions Tool

Get all available integration definitions in your JupiterOne account. This tool returns a list of integration definitions that can be used to create integration instances. Integration definitions define the types of integrations available (like AWS, Azure, GitHub, etc.) and their configuration requirements. If a user is needing a specific integration instance id for something such as a rule action, you will want to start here and then use the \`get-integration-instances\` tool. Each integration definition will have a Name and a Title field, you should use this to identify which definition is correct for what the user is looking for. As an example, if the user wants to send a slack notification as a part of a rule action, you would want to pull all of the integration definitions and find any that have Slack in the name and/or title. If there are multiple, then clarify the differences to the user and allow them to guide you on which one is correct.

## Parameters
- \`cursor\` (optional): Pagination cursor to get the next page of results. Use the \`endCursor\` from a previous response's \`pageInfo\`. When you are needing to find a specific type of integration, you will want to query all of the available pages until there are no more left to query so you can select from the entire list.
- \`includeConfig\` (optional): Whether to include configuration fields in the response. When true, returns detailed configuration schemas for each integration type. Typically this should be false or omitted entirely.

## Example Usage
Get all integration definitions without configuration details:
\`\`\`json
{}
\`\`\`

Get all integration definitions with configuration fields:
\`\`\`json
{
  "includeConfig": true
}
\`\`\`

Get the next page of integration definitions using a cursor:
\`\`\`json
{
  "cursor": "cursor_here"
}
\`\`\``,
  "get-integration-events.md": `# Get Integration Events Tool

Get events and logs from a specific integration job execution. This tool provides detailed execution logs for troubleshooting integration issues.

## Parameters
- \`jobId\` (required): The ID of the job to get events for
- \`integrationInstanceId\` (required): The ID of the instance the job belongs to
- \`size\` (optional): Maximum number of events to return (1-1000)
- \`cursor\` (optional): Pagination cursor for fetching additional events

## Example Usage
Get events for a specific job:
\`\`\`json
{
  "jobId": "job-123",
  "integrationInstanceId": "instance-456",
  "size": 50
}
\`\`\``,
  "get-integration-instances.md": `# Get Integration Instances Tool

Get all integration instances in your JupiterOne account. This tool returns a list of configured integration instances, including their configuration, status, and recent job information. Integration instances are the actual configured connections to external services like AWS accounts, GitHub repositories, etc. Unless you have an integration definition id, you typically will not want to query this yet. To get an integration definition id, use the \`get-integration-definitions\` tool. If you need an integration instance id for another task (such as creating a rule action), ask the user which of the possible integrations they want you to use.

## Parameters
- \`definitionId\` (optional): Filter instances by a specific integration definition ID. Use this to get only instances of a particular integration type.
- \`limit\` (optional): Maximum number of instances to return (between 1 and 1000).

## Example Usage
Get all integration instances:
\`\`\`json
{}
\`\`\`

Get the first 10 integration instances:
\`\`\`json
{
  "limit": 10
}
\`\`\`

Get all instances of a specific integration type:
\`\`\`json
{
  "definitionId": "integration-definition-id-here"
}
\`\`\`

Get the first 5 instances of a specific integration type:
\`\`\`json
{
  "definitionId": "integration-definition-id-here",
  "limit": 5
}
\`\`\``,
  "get-integration-job.md": `# Get Integration Job Tool

Get detailed information about a specific integration job execution.

## Parameters
- \`integrationJobId\` (required): The ID of the job to retrieve
- \`integrationInstanceId\` (required): The ID of the instance the job belongs to

## Example Usage
Get details of a specific integration job:
\`\`\`json
{
  "integrationJobId": "job-123",
  "integrationInstanceId": "instance-456"
}
\`\`\``,
  "get-integration-jobs.md": `# Get Integration Jobs Tool

List integration job execution history. This tool returns information about integration runs including their status, timing, and results.

## Parameters
- \`integrationDefinitionId\` (optional): Filter jobs by definition ID
- \`integrationInstanceId\` (optional): Filter jobs by instance ID
- \`integrationInstanceIds\` (optional): Array of instance IDs to filter jobs
- \`status\` (optional): Filter by job status (PENDING, RUNNING, COMPLETED, FAILED, CANCELLED)
- \`size\` (optional): Maximum number of jobs to return (1-1000)

## Example Usage
Get all integration jobs:
\`\`\`json
{}
\`\`\`

Get jobs for a specific integration instance:
\`\`\`json
{
  "integrationInstanceId": "abc123",
  "status": "FAILED",
  "size": 10
}
\`\`\``,
  "get-raw-data-download-url.md": `# Get Raw Data Download URL Tool

Generate a signed URL for downloading raw data from JupiterOne. This is typically used to download large result sets from rule evaluations.

## Parameters
- \`rawDataKey\` (required): The key identifying the raw data to download

## Example Usage
Get download URL for raw data:
\`\`\`json
{
  "rawDataKey": "data-key-123"
}
\`\`\``,
  "get-rule-details.md": `# Get Rule Details Tool

Get detailed information about a specific JupiterOne alert rule by its ID. This tool returns comprehensive rule configuration including queries, conditions, actions, and metadata.

## Parameters
- \`ruleId\` (required): The unique identifier of the rule to retrieve

## Example Usage
Request the details of a specific rule:
\`\`\`json
{
  "ruleId": "12345678-1234-1234-1234-123456789abc"
}
\`\`\``,
  "get-rule-evaluation-details.md": `# Get Rule Evaluation Details Tool

Get detailed information about a specific rule evaluation including query results and any generated alerts.

## Parameters
- \`ruleId\` (required): The ID of the rule
- \`timestamp\` (required): The timestamp of the evaluation to retrieve (Unix timestamp)

## Example Usage
Get details of a specific rule evaluation:
\`\`\`json
{
  "ruleId": "rule-123",
  "timestamp": 1641024000000
}
\`\`\``,
  "get-rule-evaluation-query-results.md": `# Get Rule Evaluation Query Results Tool

Retrieve the actual query results from a rule evaluation. This tool fetches the entities that matched the rule's query conditions.

## Parameters
- \`rawDataKey\` (required): The key identifying the query results to retrieve

## Example Usage
Get query results from a rule evaluation:
\`\`\`json
{
  "rawDataKey": "results-key-123"
}
\`\`\``,
  "list-alerts.md": `# List Alerts Tool

List all currently active alerts in your JupiterOne account. This tool returns a list of active alert instances, including their IDs, names, descriptions, levels, statuses, timestamps, and related rule information. You can optionally specify a limit to restrict the number of alerts returned. If a user is looking for configuration behind an alert, then list out the rules or get the details of the rule associated with an alert. If they are looking for alert data or then use this tool rather than listing rules.

## Parameters
- \`limit\` (optional): Maximum number of alerts to return (between 1 and 1000).

## Example Usage
Request the first 5 active alerts:
\`\`\`json
{
  "limit": 5
}
\`\`\``,
  "list-rule-evaluations.md": `# List Rule Evaluations Tool

List the evaluation history for a specific rule. This tool shows when a rule was evaluated and the results of each evaluation.

## Parameters
- \`ruleId\` (required): The ID of the rule to get evaluations for
- \`beginTimestamp\` (optional): Start time for the evaluation period (Unix timestamp)
- \`endTimestamp\` (optional): End time for the evaluation period (Unix timestamp)
- \`limit\` (optional): Maximum number of evaluations to return (1-1000)
- \`tag\` (optional): Filter evaluations by tag

## Example Usage
Get recent evaluations for a rule:
\`\`\`json
{
  "ruleId": "rule-123",
  "limit": 10
}
\`\`\``,
  "list-rules.md": `# List Rules Tool

List rules in your JupiterOne account using cursor pagination. This tool returns a page of rule instances, including their IDs, names, descriptions, versions, polling intervals, and other metadata. Use the cursor parameter to navigate through pages of results. This does not get alerts, but rather the configuration behind what may generate an alert, or other workflow action.

## Parameters
- \`limit\` (optional): Maximum number of rules to return per page (between 1 and 1000). Defaults to 100 if not specified.
- \`cursor\` (optional): Pagination cursor to get the next page of results. Use the \`endCursor\` from a previous response's \`pageInfo\`. Omit this parameter to get the first page.

## Example Usage
Get the first page of rules (default page size):
\`\`\`json
{}
\`\`\`

Get the first page with specific limit:
\`\`\`json
{
  "limit": 50
}
\`\`\`

Get the next page using a cursor:
\`\`\`json
{
  "limit": 50,
  "cursor": "cursor_value_from_previous_response"
}
\`\`\`

## Response Format
All responses include pagination information:
\`\`\`json
{
  "returned": 50,
  "rules": [...],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "cursor_for_next_page"
  }
}
\`\`\`

- \`returned\`: Number of rules in this page
- \`rules\`: Array of rule objects
- \`pageInfo.hasNextPage\`: Whether there are more pages available
- \`pageInfo.endCursor\`: Cursor to use for the next page (if \`hasNextPage\` is true)

## Pagination Pattern
To get all rules across multiple pages:
1. Call with no cursor to get the first page
2. Check if \`pageInfo.hasNextPage\` is true
3. If true, call again with \`cursor\` set to \`pageInfo.endCursor\`
4. Repeat until \`hasNextPage\` is false`,
  "test-connection.md": `# Test Connection Tool

Test the connection to JupiterOne API and verify authentication credentials. This tool validates that the MCP server can successfully communicate with JupiterOne.

## Parameters
None required.

## Example Usage
Test the connection:
\`\`\`json
{}
\`\`\``,
  "update-dashboard.md": `Patch an existing dashboard's layout configuration. This tool is primarily used for modifying the layout of widgets on a dashboard after they have been created.
You will always want to call this after creating a dashboard and all its widgets so you can give a favorable layout to the user. Widgets should always have a size specified.
The layout configuration is organized by screen breakpoint sizes (xs, sm, md, lg, xl) and includes positioning information for each widget. Each layout item contains:

- \`i\`: Widget ID
- \`x\`: X coordinate (horizontal position)
- \`y\`: Y coordinate (vertical position)
- \`w\`: Width in grid units
- \`h\`: Height in grid units
- \`moved\`: Whether the widget has been moved (should always be false)
- \`static\`: Whether the widget position is fixed (should always be false)

Example layout configuration:

\`\`\`json
{
  "xs": [],
  "sm": [],
  "md": [
    {
      "w": 5,
      "h": 2,
      "x": 0,
      "y": 0,
      "i": "widget-id-1",
      "moved": false,
      "static": false
    }
  ],
  "lg": [],
  "xl": []
}
\`\`\`

Here's an example layout that should be used for inspiration:

\`\`\`json
"layouts": {
    "xs": [],
    "sm": [
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 0,
        "i": "cc1bb92b-736b-4b76-bb2a-4ffb3fb6db04"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 1,
        "i": "750ea929-fb31-46ef-b1d4-68c53b06e5a3"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 2,
        "i": "92507e3e-2c99-4089-b75a-ce97ad4743d5"
      },
      {
        "w": 2,
        "h": 2,
        "x": 0,
        "y": 3,
        "i": "f1535f10-a7ba-4c74-8ae6-d5be8c5655ee"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 7,
        "i": "29df3495-eea3-45a2-b779-788d92c8baa4"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 8,
        "i": "814000f8-9ffd-4ac3-90f8-26d321e9eba6"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 9,
        "i": "293fc7fd-eb34-4383-82b8-068b62ffdd61"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 10,
        "i": "b2e1c9b2-9da8-40d9-a068-9a6a4e0f2ed3"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 11,
        "i": "24bf65f6-e196-4e49-9e91-7d5bceb5c080"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 12,
        "i": "ce89d0fe-cd1d-4590-bffe-91c6f394ae4d"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 13,
        "i": "883dc4ba-6e75-44e6-8c42-8979c63c2a12"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 14,
        "i": "6ed5488a-0969-4cda-af4b-2ecb74b3963c"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 15,
        "i": "7a5c6998-df18-474c-be1c-5938a5e68943"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 16,
        "i": "3810193b-b6b6-428c-ab5c-48217d234ab4"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 17,
        "i": "f6a487a4-b385-421e-bfb8-03b1e651ce25"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 18,
        "i": "fd572af2-0df0-4d66-95e0-913cd79b973d"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 19,
        "i": "d1096b70-22fb-47d2-95d3-e1d63416d8e3"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 20,
        "i": "7d2e98b1-48cb-40bd-bef0-19e735c1fd3f"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 21,
        "i": "373a6c3e-77ee-4044-ba11-af176c813fb0"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 22,
        "i": "d679fc5e-ead3-4b7d-b650-559167edbeff"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 23,
        "i": "ce48c3e2-5ff9-42c6-85c3-e87ae9148762"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 24,
        "i": "384f066c-a4fe-4c26-b7cb-08f333cf9fac"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 25,
        "i": "b1caf3ba-4c6e-45aa-8def-e94f1d9e0e3c"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 26,
        "i": "c18dbb26-ecd1-4f19-ab9a-0de6980da2dc"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 27,
        "i": "450cc2ff-8f00-4311-b508-db8084df8725"
      },
      {
        "w": 2,
        "h": 2,
        "x": 0,
        "y": 5,
        "i": "befe345c-e392-40de-ad1b-97a38ac18503"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 28,
        "i": "e8f652ba-d3ac-4adb-a16e-f410af56414b"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 29,
        "i": "448f356d-d79f-47a2-a6ed-6ddf93d50f90"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 30,
        "i": "4d8ec87c-9a01-41eb-a659-bb9ad2afd283"
      },
      {
        "w": 1,
        "h": 1,
        "x": 0,
        "y": 31,
        "i": "6022a63e-38c0-42a4-bb9c-6a2c2e571da2"
      }
    ],
    "md": [],
    "lg": [
      {
        "w": 8,
        "h": 2,
        "x": 4,
        "y": 34,
        "i": "cc1bb92b-736b-4b76-bb2a-4ffb3fb6db04"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 9,
        "i": "750ea929-fb31-46ef-b1d4-68c53b06e5a3"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 8,
        "i": "92507e3e-2c99-4089-b75a-ce97ad4743d5"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 1,
        "i": "f1535f10-a7ba-4c74-8ae6-d5be8c5655ee"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 24,
        "i": "29df3495-eea3-45a2-b779-788d92c8baa4"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 29,
        "i": "814000f8-9ffd-4ac3-90f8-26d321e9eba6"
      },
      {
        "w": 4,
        "h": 2,
        "x": 0,
        "y": 18,
        "i": "293fc7fd-eb34-4383-82b8-068b62ffdd61"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 22,
        "i": "b2e1c9b2-9da8-40d9-a068-9a6a4e0f2ed3"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 15,
        "i": "24bf65f6-e196-4e49-9e91-7d5bceb5c080"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 33,
        "i": "ce89d0fe-cd1d-4590-bffe-91c6f394ae4d"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 20,
        "i": "883dc4ba-6e75-44e6-8c42-8979c63c2a12"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 22,
        "i": "6ed5488a-0969-4cda-af4b-2ecb74b3963c"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 31,
        "i": "7a5c6998-df18-474c-be1c-5938a5e68943"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 20,
        "i": "3810193b-b6b6-428c-ab5c-48217d234ab4"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 6,
        "i": "f6a487a4-b385-421e-bfb8-03b1e651ce25"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 3,
        "i": "fd572af2-0df0-4d66-95e0-913cd79b973d"
      },
      {
        "w": 7,
        "h": 2,
        "x": 5,
        "y": 11,
        "i": "d1096b70-22fb-47d2-95d3-e1d63416d8e3"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 5,
        "i": "7d2e98b1-48cb-40bd-bef0-19e735c1fd3f"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 3,
        "i": "373a6c3e-77ee-4044-ba11-af176c813fb0"
      },
      {
        "w": 8,
        "h": 2,
        "x": 4,
        "y": 18,
        "i": "d679fc5e-ead3-4b7d-b650-559167edbeff"
      },
      {
        "w": 6,
        "h": 2,
        "x": 0,
        "y": 31,
        "i": "ce48c3e2-5ff9-42c6-85c3-e87ae9148762"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 26,
        "i": "384f066c-a4fe-4c26-b7cb-08f333cf9fac"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 36,
        "i": "b1caf3ba-4c6e-45aa-8def-e94f1d9e0e3c"
      },
      {
        "w": 6,
        "h": 2,
        "x": 6,
        "y": 1,
        "i": "c18dbb26-ecd1-4f19-ab9a-0de6980da2dc"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 0,
        "i": "450cc2ff-8f00-4311-b508-db8084df8725"
      },
      {
        "w": 5,
        "h": 2,
        "x": 0,
        "y": 11,
        "i": "befe345c-e392-40de-ad1b-97a38ac18503"
      },
      {
        "w": 12,
        "h": 1,
        "x": 0,
        "y": 17,
        "i": "e8f652ba-d3ac-4adb-a16e-f410af56414b"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 13,
        "i": "448f356d-d79f-47a2-a6ed-6ddf93d50f90"
      },
      {
        "w": 4,
        "h": 2,
        "x": 0,
        "y": 34,
        "i": "4d8ec87c-9a01-41eb-a659-bb9ad2afd283"
      },
      {
        "w": 12,
        "h": 2,
        "x": 0,
        "y": 27,
        "i": "6022a63e-38c0-42a4-bb9c-6a2c2e571da2"
      }
    ],
    "xl": []
  }
\`\`\`
`,
  "update-inline-question-rule.md": `# JupiterOne Rule Update Tool - Complete Guide

**Purpose**: Updates existing inline question-based alert rules in JupiterOne. This tool modifies the configuration of an existing rule while preserving its identity and version history.

**Important**: Before updating a rule, use the \`get-rule-details\` tool to retrieve the current configuration. This ensures you have all required fields and can see what needs to be changed.

## Key Requirements for Updates

### 1. Required Fields for Updates
When updating a rule, you must provide **ALL** fields, not just the ones you want to change. The update operation replaces the entire rule configuration, so missing fields will result in errors.

**Critical Required Fields**:
- \`id\`: The existing rule ID (from \`get-rule-details\`)
- \`version\`: The current version number (from \`get-rule-details\`)
- \`specVersion\`: Usually 1
- \`ignorePreviousResults\`: Must be included
- \`templates\`: Must be included (use \`{}\` if empty)
- \`tags\`: Must be included but should always be empty \`[]\` (deprecated)
- \`labels\`: Use this for actual tagging functionality
- \`resourceGroupId\`: Must be included (can be null)
- \`remediationSteps\`: Must be included (can be null)

### 2. Condition Format (Critical)
The \`condition\` parameter must use JupiterOne's specific array format:
- **Structure**: \`["LOGICAL_OPERATOR", [left_value, operator, right_value]]\`
- **Example**: \`["AND", ["queries.queryName.total", ">", 0]]\`
- **Supported operators**: \`>\`, \`<\`, \`>=\`, \`<=\`, \`=\`, \`!=\`
- **Logical operators**: \`"AND"\`, \`"OR"\`

### 3. Operations Structure
The \`when\` clause should only contain:
- \`type\`: Always \`"FILTER"\`
- \`condition\`: The array format described above
- **Do NOT include**: \`version\`, \`specVersion\` (these belong at the rule level, not in the when clause)

### 4. Query Naming Convention
- Query names in the \`queries\` array must match the references in conditions
- Example: If query name is \`"users"\`, reference it as \`"queries.users.total"\`
- **IMPORTANT**: Use \`"query0"\` as the standard query name for compatibility with existing patterns

### 5. Version Management
- The \`version\` field will be automatically incremented by JupiterOne
- You must provide the current version number in your update request
- Get the current version using \`get-rule-details\` before updating

### 6. Tags vs Labels (Important)
- **DEPRECATED**: The \`tags\` array field is deprecated and should always be set to an empty array \`[]\`
- **USE INSTEAD**: For tagging functionality, use the \`labels\` field with key-value pairs
- **Format**: \`labels: [{"labelName": "key", "labelValue": "value"}]\`
- **When users ask for tagging**: Always use the \`labels\` field to meet their needs
- **Note**: The \`tags\` field is still required in the schema for compatibility but should remain empty

## Update Workflow

### Step 1: Get Current Rule Configuration
\`\`\`
Use get-rule-details with the rule ID to get the current configuration
\`\`\`

### Step 2: Modify Required Fields
Update only the fields you need to change while preserving all other required fields.

### Step 3: Submit Update
Use this tool with the complete configuration including your changes.

## Required Schema Fields for Updates

### Complete Required Parameters for update-inline-question-rule
**CRITICAL**: All of these fields must be included for successful rule updates:

\`\`\`json
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
\`\`\`

**Key Update Requirements**:
- \`id\`: Must match the existing rule ID
- \`version\`: Must be the current version number from the existing rule
- \`ignorePreviousResults\`: Must be included (typically \`false\`)
- \`templates\`: Must be included (use \`{}\` if empty)
- \`tags\`: Must be included but should always be empty \`[]\` (deprecated field)
- \`labels\`: Use this for actual tagging functionality with key-value pairs
- \`resourceGroupId\`: Must be included (can be null)
- \`remediationSteps\`: Must be included (can be null)
- Query \`name\`: Use \`"query0"\` for primary query
- Query \`version\`: Include \`"v1"\` for compatibility
- Query \`includeDeleted\`: Must be explicitly set to \`false\`

## Available Action Types

### 1. SET_PROPERTY
Sets a property value on the alert (commonly used for alert severity levels).

**Configuration**:
\`\`\`json
{
  "type": "SET_PROPERTY",
  "targetProperty": "alertLevel",
  "targetValue": "CRITICAL"
}
\`\`\`

**Common Values for alertLevel**: \`"LOW"\`, \`"MEDIUM"\`, \`"HIGH"\`, \`"CRITICAL"\`, \`"INFO"\`

### 2. CREATE_ALERT
Creates a basic alert in JupiterOne.

**Configuration**:
\`\`\`json
{
  "type": "CREATE_ALERT"
}
\`\`\`

**Note**: This is the most basic action and should almost always be included.

### 3. SEND_EMAIL
Sends email notifications to specified recipients.

**Configuration**:
\`\`\`json
{
  "type": "SEND_EMAIL",
  "recipients": ["user1@company.com", "user2@company.com"],
  "body": "Affected Items: <br><br>* {{queries.query0.data|mapProperty('displayName')|join('<br>* ')}}"
}
\`\`\`

### 4. TAG_ENTITIES
Adds or removes tags from entities that triggered the rule.

**Configuration**:
\`\`\`json
{
  "type": "TAG_ENTITIES",
  "entities": "{{queries.query0.data}}",
  "tags": [
    {"name": "existing tag to remove", "value": null},
    {"name": "new tag", "value": "tag value"}
  ]
}
\`\`\`

### 5. SEND_SLACK_MESSAGE
Sends messages to Slack channels (requires Slack integration).

**Configuration**:
\`\`\`json
{
  "integrationInstanceId": "d97d9127-c532-410a-bf0a-9ea93f66c3d2",
  "type": "SEND_SLACK_MESSAGE",
  "channels": ["#security-alerts", "#general"],
  "body": "*Affected Items:* \n\n- {{queries.query0.data|mapProperty('displayName')|join('\n- ')}}"
}
\`\`\`

### 6. SEND_TO_S3
Sends alert data to an S3 bucket (requires AWS S3 integration).

**Configuration**:
\`\`\`json
{
  "integrationInstanceId": "f89568b4-2a1b-4bd8-8abd-aee21270df75",
  "type": "SEND_TO_S3",
  "bucket": "security-alerts-bucket",
  "region": "us-east-1",
  "data": {
    "description": "{{alertWebLink}}\n\n**Affected Items:**\n\n* {{queries.query0.data|mapProperty('displayName')|join('\n* ')}}"
  }
}
\`\`\`

### 7. CREATE_JIRA_TICKET
Creates a Jira ticket for the alert (requires Jira integration).

**Configuration**:
\`\`\`json
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
\`\`\`

## Template Variables and Formatting

### Available Variables
- \`{{alertWebLink}}\` - Direct link to the alert in JupiterOne
- \`{{queries.queryName.data}}\` - Array of entities from the specified query
- \`{{queries.queryName.total}}\` - Count of entities from the query

### Data Formatting
- \`|mapProperty('fieldName')\` - Extract specific field from each entity
- \`|join('separator')\` - Join array elements with specified separator
- Example: \`{{queries.users.data|mapProperty('displayName')|join(', ')}}\` - Creates comma-separated list of user names

## Integration Dependencies

For actions requiring integrations, you may need to:
1. Query available integration instances using \`get-integration-instances\`
2. Ask the user which integration to use
3. Use the integration's \`id\` as the \`integrationInstanceId\`

**Actions requiring integrations**:
- \`SEND_SLACK_MESSAGE\` (Slack integration)
- \`SEND_TO_S3\` (AWS S3 integration)
- \`CREATE_JIRA_TICKET\` (Jira integration)

## Working Example Update

### Complete Working Rule Update Structure
\`\`\`json
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
\`\`\`

## Common Update Scenarios

### 1. Changing Notification Recipients
Update only the \`recipients\` array in the \`SEND_EMAIL\` action while preserving all other fields.

### 2. Modifying Polling Interval
Update the \`pollingInterval\` field while keeping all other configuration the same.

### 3. Adding New Actions
Add new actions to the \`actions\` array in the operations.

### 4. Updating Query Logic
Modify the \`query\` string in the queries array or adjust the \`condition\` in operations.

### 5. Changing Labels
Update the \`labels\` array to add, remove, or modify rule labels.

## Debugging Tips
- Always start by getting the current rule configuration with \`get-rule-details\`
- Ensure the \`version\` number matches the current rule version
- Include ALL required fields, even if they're not changing
- If you get "Invalid conjunction operator" errors, check the condition array format
- If you get "additional properties" errors, remove extra fields from the \`when\` clause
- If you get missing property errors, ensure all required schema fields are included
- **Always include**: \`id\`, \`version\`, \`ignorePreviousResults\`, \`templates\`, \`tags\`, \`labels\`, \`resourceGroupId\`, \`remediationSteps\`
- Use \`"query0"\` as the standard query name for compatibility

## Best Practices for Updates
- Always retrieve the current rule configuration first using \`get-rule-details\`
- Only modify the fields that actually need to change
- Preserve the existing \`version\` number (it will be auto-incremented)
- Use the \`labels\` field for rule organization and tagging (not the deprecated \`tags\` field)
- Test rule changes with simple modifications first
- Document changes in the \`description\` field if significant
- When users request tagging functionality, use the \`labels\` field with key-value pairs
- Always include \`CREATE_ALERT\` action as a baseline unless specifically removing it

This format ensures reliable rule updates and helps avoid common pitfalls encountered during rule modification.`
};
