# Create Dashboard Tool

Creates a new dashboard in JupiterOne. This tool is simple and self-descriptive: provide a name and a type to create a dashboard. Unless specified otherwise, default to creating personal dashboards.
After creating a dashboard and all its widgets, you will typically want to call `update-dashboard` tool to set a layout favorable for the user, widgets should never be left at their default size.

## Valid Dashboard Types
```typescript
export enum DashboardType {
  USER = 'User',
  ACCOUNT = 'Account',
}
```

After creating a dashboard, you should include the dashboard's url in your response to the user.