# Dashboard URL Prompting Guide

## Summary

The `CreateDashboardResponse` type doesn't return URLs directly. Instead, the MCP server now:

1. Fetches the account subdomain using `accountSubdomain` from the account query
2. Constructs the dashboard URL using the pattern: `https://{subdomain}.apps.us.jupiterone.io/insights/dashboards/{dashboardId}`
3. Returns the URL in the response when creating dashboards or widgets

## Changes Made

1. **Updated AccountService** (account-service.ts:10-18):
   - Now returns `subdomain` from the GraphQL response
   - Uses the existing `accountSubdomain` field from the API

2. **Added URL Construction** (dashboard-service.ts:22-26):
   - New method `constructDashboardUrl(dashboardId, subdomain)`
   - Defaults to 'j1' if no subdomain provided

3. **Updated MCP Server responses** (mcp-server.ts:460-476, 1697-1710):
   - `create-dashboard` now returns URL
   - `create-dashboard-widget` now returns dashboardUrl

## How to Prompt LLMs

When using Claude or GPT with the JupiterOne MCP integration:

### For Dashboard Creation:
```
"Create a dashboard named 'Security Overview' and give me the URL to access it"
```

The response will include:
```json
{
  "id": "dashboard-id",
  "name": "Security Overview",
  "type": "User",
  "url": "https://ripple-4e.apps.us.jupiterone.io/insights/dashboards/dashboard-id"
}
```

### For Widget Creation:
```
"Add a pie chart widget to dashboard {id} and show me the dashboard URL"
```

The response will include:
```json
{
  "id": "widget-id",
  "title": "Widget Title",
  ...
  "dashboardUrl": "https://ripple-4e.apps.us.jupiterone.io/insights/dashboards/dashboard-id"
}
```

## Account Base URL

To get the base URL for an account:
```
"What is the base URL for my JupiterOne account?"
```

This will call `getAccountInfo()` and construct: `https://{subdomain}.apps.us.jupiterone.io`

## Notes

- The subdomain comes from the account's `accountSubdomain` field
- If no subdomain is available, it defaults to 'j1'
- The URL pattern is consistent: `https://{subdomain}.apps.us.jupiterone.io/insights/dashboards/{dashboardId}`