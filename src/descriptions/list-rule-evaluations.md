# List Rule Evaluations Tool

List the evaluation history for a specific rule. This tool shows when a rule was evaluated and the results of each evaluation.

## Parameters
- `ruleId` (required): The ID of the rule to get evaluations for
- `beginTimestamp` (optional): Start time for the evaluation period (Unix timestamp)
- `endTimestamp` (optional): End time for the evaluation period (Unix timestamp)
- `limit` (optional): Maximum number of evaluations to return (1-1000)
- `tag` (optional): Filter evaluations by tag

## Example Usage
Get recent evaluations for a rule:
```json
{
  "ruleId": "rule-123",
  "limit": 10
}
```