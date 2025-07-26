# Evaluate Rule Tool

Manually trigger the evaluation of a JupiterOne alert rule. This tool forces an immediate evaluation of the rule's conditions and returns the results.

## Parameters
- `ruleId` (required): The unique identifier of the rule to evaluate

## Example Usage
Evaluate a specific rule:
```json
{
  "ruleId": "12345678-1234-1234-1234-123456789abc"
}
```