# List Rules Tool

List rules in your JupiterOne account using cursor pagination. This tool returns a page of rule instances, including their IDs, names, descriptions, versions, polling intervals, and other metadata. Use the cursor parameter to navigate through pages of results. This does not get alerts, but rather the configuration behind what may generate an alert, or other workflow action.

## Parameters
- `limit` (optional): Maximum number of rules to return per page (between 1 and 1000). Defaults to 100 if not specified.
- `cursor` (optional): Pagination cursor to get the next page of results. Use the `endCursor` from a previous response's `pageInfo`. Omit this parameter to get the first page.

## Example Usage
Get the first page of rules (default page size):
```json
{}
```

Get the first page with specific limit:
```json
{
  "limit": 50
}
```

Get the next page using a cursor:
```json
{
  "limit": 50,
  "cursor": "cursor_value_from_previous_response"
}
```

## Response Format
All responses include pagination information:
```json
{
  "returned": 50,
  "rules": [...],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "cursor_for_next_page"
  }
}
```

- `returned`: Number of rules in this page
- `rules`: Array of rule objects
- `pageInfo.hasNextPage`: Whether there are more pages available
- `pageInfo.endCursor`: Cursor to use for the next page (if `hasNextPage` is true)

## Pagination Pattern
To get all rules across multiple pages:
1. Call with no cursor to get the first page
2. Check if `pageInfo.hasNextPage` is true
3. If true, call again with `cursor` set to `pageInfo.endCursor`
4. Repeat until `hasNextPage` is false