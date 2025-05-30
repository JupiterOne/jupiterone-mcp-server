# Get Integration Definitions Tool

Get all available integration definitions in your JupiterOne account. This tool returns a list of integration definitions that can be used to create integration instances. Integration definitions define the types of integrations available (like AWS, Azure, GitHub, etc.) and their configuration requirements. If a user is needing a specific integration instance id for something such as a rule action, you will want to start here and then use the `get-integration-instances` tool. Each integration definition will have a Name and a Title field, you should use this to identify which definition is correct for what the user is looking for. As an example, if the user wants to send a slack notification as a part of a rule action, you would want to pull all of the integration definitions and find any that have Slack in the name and/or title. If there are multiple, then clarify the differences to the user and allow them to guide you on which one is correct.

## Parameters
- `cursor` (optional): Pagination cursor to get the next page of results. Use the `endCursor` from a previous response's `pageInfo`. When you are needing to find a specific type of integration, you will want to query all of the available pages until there are no more left to query so you can select from the entire list.
- `includeConfig` (optional): Whether to include configuration fields in the response. When true, returns detailed configuration schemas for each integration type. Typically this should be false or omitted entirely.

## Example Usage
Get all integration definitions without configuration details:
```json
{}
```

Get all integration definitions with configuration fields:
```json
{
  "includeConfig": true
}
```

Get the next page of integration definitions using a cursor:
```json
{
  "cursor": "cursor_here"
}
```