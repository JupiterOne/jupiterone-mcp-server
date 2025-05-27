# List Alerts Tool

List all currently active alerts in your JupiterOne account. This tool returns a list of active alert instances, including their IDs, names, descriptions, levels, statuses, timestamps, and related rule information. You can optionally specify a limit to restrict the number of alerts returned. If a user is looking for configuration behind an alert, then list out the rules or get the details of the rule associated with an alert. If they are looking for alert data or then use this tool rather than listing rules.

## Parameters
- `limit` (optional): Maximum number of alerts to return (between 1 and 1000).

## Example Usage
Request the first 5 active alerts:
```json
{
  "limit": 5
}
```