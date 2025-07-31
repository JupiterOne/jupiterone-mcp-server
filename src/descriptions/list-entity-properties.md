# JupiterOne Entity Properties Discoverer

**Purpose**: Lists all available properties for a specific entity type in your JupiterOne account. This tool is essential for understanding what data fields are available to query for a given entity type.

This tool should be used AFTER running `list-entity-types` to discover available entity types, and BEFORE writing J1QL queries that need to access specific properties.

## Features
- Returns all properties available for a specific entity type
- Shows property names, value types, and usage counts
- Helps you understand the data model for specific entities
- Essential for writing accurate J1QL queries with property filters

## Parameters
- `entityType`: The entity type to get properties for (e.g., `aws_instance`, `okta_user`, `github_user`)

## Example Usage

### Get properties for AWS instances:
```
entityType: "aws_instance"
```

### Get properties for Okta users:
```
entityType: "okta_user"
```

## Response Format
Returns an array of property objects, each containing:
- `id`: Unique identifier for the property
- `accountId`: The account ID
- `entity`: The entity type this property belongs to
- `name`: The property name (use this in J1QL queries)
- `valueType`: The data type of the property (e.g., "string", "number", "boolean")
- `count`: Number of entities that have this property

Example response:
```json
[
  {
    "id": "123456",
    "accountId": "j1dev",
    "entity": "okta_user",
    "name": "email",
    "valueType": "string",
    "count": 150
  },
  {
    "id": "123457",
    "accountId": "j1dev",
    "entity": "okta_user",
    "name": "active",
    "valueType": "boolean",
    "count": 150
  }
]
```

## Use Cases
- **Query Preparation**: Discover available properties before writing J1QL queries
- **Data Exploration**: Understand what data is available for specific entity types
- **Filter Development**: Find properties to use in WHERE clauses and WITH filters
- **Schema Understanding**: Learn about the data model of integrated services

## Workflow Integration
This tool is typically used as part of a three-step process:
1. Run `list-entity-types` to discover available entity types
2. Run `list-entity-properties` for relevant entity types
3. Write J1QL queries using the discovered types and properties