# JupiterOne Create Dashboard Widget Tool

**Purpose**: Adds a new widget to a specified JupiterOne dashboard. This tool allows you to programmatically create visual widgets (such as pie charts, bar charts, tables, etc.) on any dashboard, using custom queries and configuration.

This tool should be used when:
- You want to add a new visualization to an existing dashboard
- You need to automate dashboard widget creation for reporting or monitoring
- You want to programmatically manage dashboard content

## Required Parameters
- `dashboardId`: The ID of the dashboard to add the widget to
- `input`: The widget configuration object (CreateInsightsWidgetInput), including:
  - `title`: Widget title
  - `description`: Widget description (optional)
  - `type`: Widget type (e.g., 'pie', 'bar', 'table', etc.)
  - `noResultMessage`: Message to display when there are no results
  - `config`: Widget configuration, including queries and settings

## Supported Chart Types

The following values are supported for the `type` property when creating a widget:

```typescript
export enum ChartType {
  Area = 'area',
  Bar = 'bar',
  Graph = 'graph',
  Line = 'line',
  Matrix = 'matrix',
  Number = 'number',
  Pie = 'pie',
  Table = 'table',
  Status = 'status',
  Markdown = 'markdown',
}
```

## Example Usage
```json
{
  "dashboardId": "95936c1a-468a-494f-b11d-b134ac9b9577",
  "input": {
    "title": "Example title",
    "type": "pie",
    "noResultMessage": "Message that shows when no results",
    "config": {
      "queries": [
        {
          "query": "FIND (aws_db_cluster_snapshot|aws_db_snapshot) as snapshot\n  RETURN\n    snapshot.tag.AccountName as name,\n    sum(snapshot.allocatedStorage) * 0.02 as value",
          "name": "Query 1"
        }
      ],
      "settings": {
        "pie": {
          "customColors": {
            "0": "#26A69A",
            "1": "#3F51B5",
            "2": "#D81B60",
            "3": "#FF8F00",
            "4": "#9575CD",
            "5": "#8BC34A",
            "6": "#039BE5"
          },
          "upwardTrendIsGood": true
        }
      }
    }
  }
}
```

# Widget Options

When creating a dashboard, there are several options for widgets to choose from. This allows you to utilize the most impactful visual representation for your data. Below are the supported dashboard widgets, each with their own requirements and examples.

---

# Chart Types and Example Queries

> **Note:**
> To enable trend functionality for a chart, set `trendDataIsEnabled: true` in the relevant chart type's settings (e.g., `settings.pie.trendDataIsEnabled`). You can also use keys like `trendQueryResultsCount` to control the number of trend data points, and `upwardTrendIsGood` to indicate if an upward trend is positive.

## Number
The number chart visualization shows one large stat value. In the trend version of this chart you are able to track the value through a spark line to see if the result is getting larger or smaller over time.

### Query Requirements
Expects only a single `value` in the returned query response.

### Example Queries
**Trend:**
```j1ql
FIND User AS u
  RETURN count(u) AS value
```
**Non-Trend:**
```j1ql
FIND User AS u
  RETURN count(u) AS value
```

---

## Pie Chart
The pie chart displays values from one or more queries, as they relate to each other, in the form of slices of a pie. The arc length, area and central angle of a slice are all proportional to the slice's value, as it relates to the sum of all values. This type of chart is best used when you want a quick comparison of a small set of values in an aesthetically pleasing form. In the trend version of this chart you are able to track the value change of each slice value as well as the total value through a spark line to see if the data set is getting larger or smaller over time.

### Query Requirements
Expects 2 or more pairs of `name` and numeric `value` properties.

### Example Queries
**Trend:**
```j1ql
FIND DataStore AS ds
  THAT RELATES TO (Account|Service) AS a
RETURN
  a.tag.AccountName AS name,
  count(ds) AS value
```
**Non-Trend 1:**
```j1ql
FIND DataStore AS ds
  THAT RELATES TO (Account|Service) AS a
RETURN
  a.tag.AccountName AS name,
  count(ds) AS value
```
**Non-Trend 2:**
```j1ql
FIND DataStore AS ds
  THAT RELATES TO (Account|Service) AS a
RETURN
  count(ds) AS value
```

---

## Bar Chart
The bar chart visualization allows you to view categorical data to analyze your queries with a specified x and y axis. You are able to run multiple queries and visualize the bar chart in stacked format. This chart is best suited for categorizing your results. In the trend version of the chart you are able to visualize the value change of each categorical result through a %Change indicator and a reference category bar of the result value from the previous time period selected.

### Query Requirements
Expects one or more `x` and `y` values.

### Example Queries
**Trend:**
```j1ql
FIND Person AS p
  THAT IS User AS u
  THAT opened PR
  WITH state='OPEN' AS pr
RETURN
  p.displayName AS x,
  count(pr) AS y
ORDER BY y DESC
```
**Non-Trend:**
```j1ql
FIND Person AS p
  THAT IS User AS u
  THAT opened PR
  WITH state='OPEN' AS pr
RETURN
  p.displayName AS x,
  count(pr) AS y
ORDER BY y DESC
LIMIT 5
```

---

## Line Chart
The line chart is created by plotting a series of several points and connecting them with a straight line. This is best suited for data that has historical trend data enabled.

### Query Requirements
Expects `line` and `y` values.

### Example Queries
**Trend:**
```j1ql
FIND Finding
  WITH createdOn > date.now-7day AS f
RETURN
  count(f) AS y,
  f.numericSeverity AS line
```
**Non-Trend:**
```j1ql
FIND Finding
  WITH createdOn > date.now-7day AS f
RETURN
  f.createdOn AS x,
  count(f) AS y,
  f.numericSeverity AS line
```

---

## Matrix Chart
The matrix chart is used for analyzing and displaying the relationship between data sets. The matrix diagram shows the relationship between two, three, or four groups of information.

### Query Requirements
Expects `x` and `y` row and column names. Optional `label` to be shown in each cell. Any additional properties returned will be shown as key: value.

### Example Queries
**Firewall matrix:**
```j1ql
FIND Firewall AS row
  THAT allows AS rel
  Network AS col
RETURN
  row.displayName AS x,
  col.displayName AS y,
  rel.egress AS egress,
  rel.ingress AS ingress,
  rel.fromPort as fromPort,
  rel.toPort as toPort,
  rel.ipProtocol AS label
```

---

## Table
The tables chart present data in as close to raw form as possible. Tables are meant to be read, so they are ideal when you have data that cannot easily be presented visually, or when the data requires more specific attention.

### Query Requirements
Note: This chart is currently limited to displaying 250 rows, and it does not handle pagination. It is recommended to use LIMIT and ORDER BY to sort and limit the results.

### Example Queries
**Most recent people:**
```j1ql
FIND Person AS p
  RETURN
    p.name AS Name,
    p.email AS Email,
    p.manager AS Manager
  ORDER BY p._createdOn DESC
  LIMIT 5
```

---

## Graph Chart
The graph chart displays a tree graph of query results. This chart is best used to visualize specific relationships between entities.

### Example Queries
**Most recent people:**
```j1ql
FIND Person RETURN TREE
```

---

## Status
The status chart displays a visual summary of correlating queries. This chart is best used to show positive or negative results based on if relationships are present in query results. This chart is best suited by multiple queries.

### Example Queries
**Users passing security check:**
```j1ql
Find Person as p
  Return
    p.email as id,
    p.name as displayName,
    p.acceptedSecurityPolicyOn,
    p.backgroundCheck,
    p.iconWebLink as iconWebLink
```
```j1ql
Find Person as p that owns Device as d
  Return
    p.email as id,
    d.encrypted
```
```j1ql
Find Person as p that is User as u
  Return
    p.email as id,
    count(u)
```

---

## Area Chart
The area chart is a graph that combines a line chart and a bar chart to show changes in quantities over time. This chart requires the assets in the query to have relevant dates in their properties. For the best results, these charts can be generated by J1 Questions that have trend collection enabled. (This will soon be available straight from Insights.)

### Query Requirements
Expects two or more `x` and `y` values.

### Example Queries
**Top 5 most open PRs by Person:**
```j1ql
FIND Person AS p
  THAT IS User AS u
  THAT opened PR
  WITH state='OPEN' AS pr
RETURN
  p.displayName AS x,
  count(pr) AS y
ORDER BY y DESC
LIMIT 5
```

---

## Markdown Chart
The markdown chart/widget allows you to display custom Markdown content directly on your dashboard. This is useful for adding documentation, instructions, or contextual information alongside your visualizations.

### Query Requirements
- No queries are required for this widget type.
- The widget's settings must include a `markdown.text` property containing the Markdown content to display.

### Example Configuration
**Simple Markdown widget:**
```json
{
  "type": "markdown",
  "config": {
    "queries": [],
    "settings": {
      "markdown": {
        "text": "# test markdown here\nsome more content"
      }
    }
  }
}
```

---

After creating a widget you should include the dashboard url in your response to the user.