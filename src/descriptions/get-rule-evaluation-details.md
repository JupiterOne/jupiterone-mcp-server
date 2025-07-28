# Get Rule Evaluation Details Tool

Get detailed information about a specific rule evaluation including query results and any generated alerts.

## Parameters
- `ruleId` (required): The ID of the rule
- `timestamp` (required): The timestamp of the evaluation to retrieve (Unix timestamp)

## Example Usage
Get details of a specific rule evaluation:
```json
{
  "ruleId": "rule-123",
  "timestamp": 1641024000000
}
```