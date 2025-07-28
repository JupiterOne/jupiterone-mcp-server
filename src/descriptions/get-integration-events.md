# Get Integration Events Tool

Get events and logs from a specific integration job execution. This tool provides detailed execution logs for troubleshooting integration issues.

## Parameters
- `jobId` (required): The ID of the job to get events for
- `integrationInstanceId` (required): The ID of the instance the job belongs to
- `size` (optional): Maximum number of events to return (1-1000)
- `cursor` (optional): Pagination cursor for fetching additional events

## Example Usage
Get events for a specific job:
```json
{
  "jobId": "job-123",
  "integrationInstanceId": "instance-456",
  "size": 50
}
```