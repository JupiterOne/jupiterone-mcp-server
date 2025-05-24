# Create Dashboard Tool

Creates a new dashboard in JupiterOne. This tool is simple and self-descriptive: provide a name and a type to create a dashboard. Unless specified otherwise, default to creating personal dashboards.

## Valid Dashboard Types
```typescript
export enum DashboardType {
  USER = 'User',
  ACCOUNT = 'Account',
}
```