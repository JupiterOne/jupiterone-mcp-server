# Get Integration Jobs Tool

List integration job execution history. This tool returns information about integration runs including their status, timing, and results.

## Parameters
- `integrationDefinitionId` (optional): Filter jobs by definition ID
- `integrationInstanceId` (optional): Filter jobs by instance ID
- `integrationInstanceIds` (optional): Array of instance IDs to filter jobs
- `status` (optional): Filter by job status (PENDING, RUNNING, COMPLETED, FAILED, CANCELLED)
- `size` (optional): Maximum number of jobs to return (1-1000)

## Example Usage
Get all integration jobs:
```json
{}
```

Get jobs for a specific integration instance:
```json
{
  "integrationInstanceId": "abc123",
  "status": "FAILED",
  "size": 10
}
```