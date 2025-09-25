import { z } from 'zod';

// Widget Chart Types
export const ChartTypeSchema = z.enum([
  'area',
  'bar',
  'graph',
  'line',
  'matrix',
  'number',
  'pie',
  'table',
  'status',
  'markdown',
]);

// Widget Query Schema
export const WidgetQuerySchema = z.object({
  query: z.string().describe('J1QL query string'),
  name: z.string().describe('Name for the query'),
  id: z.string().optional().describe('Optional ID for the query'),
});

// Settings schemas for different chart types
export const PieChartSettingsSchema = z.object({
  customColors: z.record(z.string()).optional().describe('Custom colors for pie slices'),
  upwardTrendIsGood: z.boolean().optional().describe('Whether upward trend is positive'),
  trendDataIsEnabled: z.boolean().optional().describe('Enable trend visualization'),
  trendQueryResultsCount: z.number().optional().describe('Number of trend data points'),
});

export const BarChartSettingsSchema = z.object({
  stacked: z.boolean().optional().describe('Enable stacked bar chart'),
  upwardTrendIsGood: z.boolean().optional().describe('Whether upward trend is positive'),
  trendDataIsEnabled: z.boolean().optional().describe('Enable trend visualization'),
});

export const LineChartSettingsSchema = z.object({
  trendDataIsEnabled: z.boolean().optional().describe('Enable trend visualization'),
});

export const NumberChartSettingsSchema = z.object({
  upwardTrendIsGood: z.boolean().optional().describe('Whether upward trend is positive'),
  trendDataIsEnabled: z.boolean().optional().describe('Enable trend visualization'),
});

export const MarkdownChartSettingsSchema = z.object({
  text: z.string().describe('Markdown content to display'),
});

// Combined settings schema that varies based on chart type
export const WidgetSettingsSchema = z.object({
  pie: PieChartSettingsSchema.optional(),
  bar: BarChartSettingsSchema.optional(),
  line: LineChartSettingsSchema.optional(),
  number: NumberChartSettingsSchema.optional(),
  markdown: MarkdownChartSettingsSchema.optional(),
  area: z.record(z.any()).optional(),
  graph: z.record(z.any()).optional(),
  matrix: z.record(z.any()).optional(),
  table: z.record(z.any()).optional(),
  status: z.record(z.any()).optional(),
});

// Widget Config Schema
export const WidgetConfigSchema = z.object({
  queries: z
    .array(WidgetQuerySchema)
    .describe('Array of J1QL queries for the widget'),
  settings: WidgetSettingsSchema.optional().describe('Chart-specific settings'),
  postQueryFilters: z.record(z.any()).optional().describe('Filters to apply after query execution'),
  disableQueryPolicyFilters: z
    .boolean()
    .optional()
    .describe('Whether to disable policy filters on queries'),
});

// Create Dashboard Widget Input Schema
export const CreateInsightsWidgetInputSchema = z.object({
  title: z.string().describe('Widget title'),
  description: z.string().optional().describe('Widget description'),
  type: ChartTypeSchema.describe('Type of chart/widget'),
  noResultMessage: z.string().optional().describe('Message to display when no results'),
  includeDeleted: z.boolean().optional().describe('Whether to include deleted entities'),
  questionId: z.string().optional().describe('ID of an existing question to use'),
  config: WidgetConfigSchema.describe('Widget configuration including queries and settings'),
});

// Templates Schema for rules
export const RuleTemplatesSchema = z.record(
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.any()),
    z.record(z.any()),
  ])
).describe('Template variables for the rule');

// J1QL Query Variables Schema
export const QueryVariablesSchema = z.record(
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(z.any()),
    z.record(z.any()),
  ])
).describe('Variables to be used as parameters in the J1QL query');

// J1QL Query Flags Schema
export const QueryFlagsSchema = z.object({
  includeDeleted: z.boolean().optional().describe('Include deleted entities in results'),
  deferredResponse: z.enum(['DISABLED', 'FORCE']).optional().describe('Deferred response mode'),
  returnRowMetadata: z.boolean().optional().describe('Include metadata for each row'),
  returnComputedProperties: z.boolean().optional().describe('Include computed properties'),
}).passthrough(); // Allow additional flags

// Scope Filter Schema
export const ScopeFilterSchema = z.object({
  property: z.string().describe('Property to filter on'),
  value: z.any().describe('Value to filter by'),
  operator: z.string().optional().describe('Comparison operator'),
}).passthrough();

// Action target value schema (for rule actions)
export const ActionTargetValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.any()),
  z.record(z.any()),
]).describe('Value to set for the action target');

// Action data schema
export const ActionDataSchema = z.union([
  z.string(),
  z.object({
    description: z.string().optional(),
    title: z.string().optional(),
    content: z.any().optional(),
  }),
  z.record(z.any()),
]).describe('Additional data for the action');

// Additional fields for Jira tickets
export const JiraAdditionalFieldsSchema = z.object({
  description: z.union([
    z.string(),
    z.object({
      type: z.literal('doc'),
      version: z.number(),
      content: z.array(
        z.object({
          type: z.string(),
          content: z.array(
            z.object({
              type: z.string(),
              text: z.string(),
            })
          ),
        })
      ),
    }),
  ]).optional(),
  priority: z.string().optional(),
  labels: z.array(z.string()).optional(),
  components: z.array(z.string()).optional(),
}).passthrough(); // Allow additional Jira fields