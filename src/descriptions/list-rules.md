# List Rules Tool

List all rules in your JupiterOne account. This tool returns a list of rule instances, including their IDs, names, descriptions, versions, polling intervals, and other metadata. You can optionally specify a limit to restrict the number of rules returned. This does not get alerts, but rather the configuration behind what may generate an alert, or other workflow action.

## Parameters
- `limit` (optional): Maximum number of rules to return (between 1 and 1000).

## Example Usage
Request the first 10 rules:
```json
{
  "limit": 10
}
```