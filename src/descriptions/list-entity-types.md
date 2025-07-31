# JupiterOne Entity Types Discoverer

**Purpose**: Discovers all entity classes and types in your JupiterOne account. This tool helps you find relevant entity types when building queries or exploring your data model.

**CRITICAL**: This tool should ALWAYS be run FIRST before writing any J1QL queries. Without knowing what entity classes and types exist in your JupiterOne account, you cannot write valid queries that will return results and are more likely to hallucinate. This is the essential first step for any query-writing task.

This tool provides a comprehensive count of all entity classes and types in your account using an efficient GraphQL query.

## Features
- Returns all entity classes and types in your account
- Shows counts for each class and type
- Provides results as key-value pairs for easy lookup
- Fast and efficient - no pagination required

## Example Usage

```
list-entity-types
```

## Response Format
Returns an object with two properties:
- `classes`: Object mapping class names to their counts (e.g., `{"User": 150, "Device": 200}`)
- `types`: Object mapping type names to their counts (e.g., `{"aws_instance": 50, "github_user": 25}`)

Example response:
```json
{
  "classes": {
    "User": 150,
    "Device": 200,
    "Finding": 1234,
    "DataStore": 45
  },
  "types": {
    "aws_instance": 50,
    "aws_s3_bucket": 30,
    "github_user": 25,
    "crowdstrike_device": 100
  }
}
```

## Use Cases
- **REQUIRED FIRST STEP**: Run this before writing any J1QL queries to know what entities exist
- Discovering available entity types before writing J1QL queries
- Finding integration-specific entities (e.g., all Snyk entities)
- Understanding your data model and available entity types
- Exploring what data is available from specific integrations

## Why This Is Essential

When writing J1QL queries, you need to specify entity classes (like `User`, `Device`, `Finding`) or entity types (like `aws_instance`, `github_user`). Without running this tool first, you're essentially guessing what entities exist in your account. This tool provides the complete list of valid entity classes and types that you can query, ensuring your J1QL queries will actually find and return data.