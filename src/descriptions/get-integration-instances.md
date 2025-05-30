# Get Integration Instances Tool

Get all integration instances in your JupiterOne account. This tool returns a list of configured integration instances, including their configuration, status, and recent job information. Integration instances are the actual configured connections to external services like AWS accounts, GitHub repositories, etc. Unless you have an integration definition id, you typically will not want to query this yet. To get an integration definition id, use the `get-integration-definitions` tool. If you need an integration instance id for another task (such as creating a rule action), ask the user which of the possible integrations they want you to use.

## Parameters
- `definitionId` (optional): Filter instances by a specific integration definition ID. Use this to get only instances of a particular integration type.
- `limit` (optional): Maximum number of instances to return (between 1 and 1000).

## Example Usage
Get all integration instances:
```json
{}
```

Get the first 10 integration instances:
```json
{
  "limit": 10
}
```

Get all instances of a specific integration type:
```json
{
  "definitionId": "integration-definition-id-here"
}
```

Get the first 5 instances of a specific integration type:
```json
{
  "definitionId": "integration-definition-id-here",
  "limit": 5
}
```