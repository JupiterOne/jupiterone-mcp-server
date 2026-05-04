# Delete Rule Tool

Permanently delete an alert rule from your JupiterOne account. This action is irreversible — once deleted, the rule and its configuration cannot be recovered.

**Important**: Before deleting, use `get-rule-details` to confirm you are targeting the correct rule. Consider using `list-rules` first if you need to find the rule ID.

## Parameters
- `ruleId` (required): The unique identifier of the rule to delete

## Example Usage
Delete a specific rule:
```json
{
  "ruleId": "12345678-1234-1234-1234-123456789abc"
}
```
