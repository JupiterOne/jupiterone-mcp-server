# JupiterOne J1QL Query Executor

**Purpose**: Executes JupiterOne Query Language (J1QL) queries against your JupiterOne data and returns the results. This tool is used to directly run J1QL queries that have been created, either manually or through the natural language converter.

This tool should be used when:
- You have a specific J1QL query you want to execute
- You need to get results from a previously generated query
- You want to test a query before using it in a rule or widget
- You need to analyze data directly using J1QL

The tool supports various query parameters including:
- Including/excluding deleted entities
- Returning row metadata
- Returning computed properties
- Applying scope filters
- Pagination using cursors
