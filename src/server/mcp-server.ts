import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { JupiterOneClient } from '../client/jupiterone-client.js';
import { JupiterOneConfig } from '../types/jupiterone.js';

export class JupiterOneMcpServer {
  private server: McpServer;
  private client: JupiterOneClient;

  constructor(config: JupiterOneConfig) {
    this.client = new JupiterOneClient(config);
    this.server = new McpServer({
      name: 'jupiterone-mcp',
      version: '1.0.0',
    });

    this.setupTools();
  }

  private setupTools(): void {
    // Tool: List all rules
    this.server.tool(
      'list-rules',
      {
        limit: z.number().min(1).max(1000).optional(),
      },
      async ({ limit }) => {
        try {
          const instances = await this.client.getAllRuleInstances();
          const limitedInstances = limit ? instances.slice(0, limit) : instances;

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    total: instances.length,
                    returned: limitedInstances.length,
                    rules: limitedInstances.map((instance) => ({
                      id: instance.id,
                      name: instance.name,
                      description: instance.description,
                      version: instance.version,
                      pollingInterval: instance.pollingInterval,
                      lastEvaluationStartOn: instance.lastEvaluationStartOn,
                      lastEvaluationEndOn: instance.lastEvaluationEndOn,
                      latestAlertId: instance.latestAlertId,
                      latestAlertIsActive: instance.latestAlertIsActive,
                      type: instance.type,
                      tags: instance.tags,
                      outputs: instance.outputs,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error listing rules: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get rule details
    this.server.tool(
      'get-rule-details',
      {
        ruleId: z.string(),
      },
      async ({ ruleId }) => {
        try {
          const instances = await this.client.getAllRuleInstances();
          const rule = instances.find((instance) => instance.id === ruleId);

          if (!rule) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Rule with ID ${ruleId} not found`,
                },
              ],
              isError: true,
            };
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    id: rule.id,
                    resourceGroupId: rule.resourceGroupId,
                    accountId: rule.accountId,
                    name: rule.name,
                    description: rule.description,
                    version: rule.version,
                    lastEvaluationStartOn: rule.lastEvaluationStartOn,
                    lastEvaluationEndOn: rule.lastEvaluationEndOn,
                    evaluationStep: rule.evaluationStep,
                    specVersion: rule.specVersion,
                    notifyOnFailure: rule.notifyOnFailure,
                    triggerActionsOnNewEntitiesOnly: rule.triggerActionsOnNewEntitiesOnly,
                    ignorePreviousResults: rule.ignorePreviousResults,
                    pollingInterval: rule.pollingInterval,
                    templates: rule.templates,
                    outputs: rule.outputs,
                    labels:
                      rule.labels?.map((label) => ({
                        labelName: label.labelName,
                        labelValue: label.labelValue,
                      })) || [],
                    question: rule.question
                      ? {
                          queries:
                            rule.question.queries?.map((query) => ({
                              query: query.query,
                              name: query.name,
                              includeDeleted: query.includeDeleted,
                            })) || [],
                        }
                      : null,
                    questionId: rule.questionId,
                    latest: rule.latest,
                    deleted: rule.deleted,
                    type: rule.type,
                    operations:
                      rule.operations?.map((op) => ({
                        when: op.when,
                        actions: op.actions,
                      })) || [],
                    latestAlertId: rule.latestAlertId,
                    latestAlertIsActive: rule.latestAlertIsActive,
                    state: rule.state
                      ? {
                          actions: rule.state.actions,
                        }
                      : null,
                    tags: rule.tags,
                    remediationSteps: rule.remediationSteps,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error getting rule details: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Test connection
    this.server.tool('test-connection', {}, async () => {
      try {
        const isConnected = await this.client.testConnection();
        const accountInfo = isConnected ? await this.client.getAccountInfo() : null;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  connected: isConnected,
                  account: accountInfo,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });

    // Tool: Evaluate rule
    this.server.tool(
      'evaluate-rule',
      {
        ruleId: z.string(),
      },
      async ({ ruleId }) => {
        try {
          const result = await this.client.evaluateRuleInstance(ruleId);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    ruleId,
                    id: result.id,
                    __typename: result.__typename,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error evaluating rule: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get active alerts
    this.server.tool(
      'get-active-alerts',
      {
        limit: z.number().min(1).max(1000).optional(),
      },
      async ({ limit }) => {
        try {
          const instances = await this.client.getAllAlertInstances('ACTIVE');

          if (!instances || !Array.isArray(instances)) {
            throw new Error('Invalid response from JupiterOne API: instances is not an array');
          }

          const limitedInstances = limit ? instances.slice(0, limit) : instances;

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    total: instances.length,
                    returned: limitedInstances.length,
                    activeAlerts: limitedInstances.map((instance) => ({
                      id: instance.id,
                      name:
                        instance.questionRuleInstance?.name ||
                        instance.reportRuleInstance?.name ||
                        'Unknown',
                      description:
                        instance.questionRuleInstance?.description ||
                        instance.reportRuleInstance?.description,
                      level: instance.level,
                      status: instance.status,
                      createdOn: instance.createdOn,
                      lastUpdatedOn: instance.lastUpdatedOn,
                      lastEvaluationBeginOn: instance.lastEvaluationBeginOn,
                      lastEvaluationEndOn: instance.lastEvaluationEndOn,
                      recordCount:
                        instance.lastEvaluationResult?.rawDataDescriptors?.[0]?.recordCount || 0,
                      tags: instance.questionRuleInstance?.tags || [],
                      labels: instance.questionRuleInstance?.labels || [],
                      outputs: instance.lastEvaluationResult?.outputs || [],
                      users: instance.users,
                      ruleId: instance.ruleId,
                      ruleVersion: instance.ruleVersion,
                      endReason: instance.endReason,
                      dismissedOn: instance.dismissedOn,
                    })),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          console.error('Error in get-active-alerts:', error);
          return {
            content: [
              {
                type: 'text',
                text: `Error getting active alerts: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your JupiterOne API credentials and connection.`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get dashboards
    this.server.tool('get-dashboards', {}, async () => {
      try {
        const dashboards = await this.client.getDashboards();

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  total: dashboards.length,
                  dashboards: dashboards.map((dashboard) => ({
                    id: dashboard.id,
                    name: dashboard.name,
                    category: dashboard.category,
                    supportedUseCase: dashboard.supportedUseCase,
                    isJ1ManagedBoard: dashboard.isJ1ManagedBoard,
                    resourceGroupId: dashboard.resourceGroupId,
                    starred: dashboard.starred,
                    lastUpdated: dashboard._timeUpdated,
                    createdAt: dashboard._createdAt,
                    prerequisites: dashboard.prerequisites
                      ? {
                          prerequisitesMet: dashboard.prerequisites.prerequisitesMet,
                          preRequisitesGroupsFulfilled:
                            dashboard.prerequisites.preRequisitesGroupsFulfilled,
                          preRequisitesGroupsRequired:
                            dashboard.prerequisites.preRequisitesGroupsRequired,
                        }
                      : null,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting dashboards: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });

    // Tool: Create dashboard
    this.server.tool(
      'create-dashboard',
      {
        name: z.string(),
        type: z.string(),
      },
      async ({ name, type }) => {
        try {
          const result = await this.client.createDashboard({ name, type });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    id: result.id,
                    name,
                    type,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error creating dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get dashboard details
    this.server.tool(
      'get-dashboard-details',
      {
        dashboardId: z.string(),
      },
      async ({ dashboardId }) => {
        try {
          const dashboard = await this.client.getDashboard(dashboardId);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    id: dashboard.id,
                    name: dashboard.name,
                    category: dashboard.category,
                    supportedUseCase: dashboard.supportedUseCase,
                    isJ1ManagedBoard: dashboard.isJ1ManagedBoard,
                    published: dashboard.published,
                    publishedToUserIds: dashboard.publishedToUserIds,
                    publishedToGroupIds: dashboard.publishedToGroupIds,
                    groupIds: dashboard.groupIds,
                    userIds: dashboard.userIds,
                    scopeFilters: dashboard.scopeFilters,
                    resourceGroupId: dashboard.resourceGroupId,
                    starred: dashboard.starred,
                    lastUpdated: dashboard._timeUpdated,
                    createdAt: dashboard._createdAt,
                    prerequisites: dashboard.prerequisites
                      ? {
                          prerequisitesMet: dashboard.prerequisites.prerequisitesMet,
                          preRequisitesGroupsFulfilled:
                            dashboard.prerequisites.preRequisitesGroupsFulfilled,
                          preRequisitesGroupsRequired:
                            dashboard.prerequisites.preRequisitesGroupsRequired,
                        }
                      : null,
                    parameters: dashboard.parameters.map((param) => ({
                      id: param.id,
                      label: param.label,
                      name: param.name,
                      type: param.type,
                      valueType: param.valueType,
                      default: param.default,
                      options: param.options,
                      requireValue: param.requireValue,
                      disableCustomInput: param.disableCustomInput,
                    })),
                    widgets: dashboard.widgets.map((widget) => ({
                      id: widget.id,
                      title: widget.title,
                      description: widget.description,
                      type: widget.type,
                      questionId: widget.questionId,
                      noResultMessage: widget.noResultMessage,
                      includeDeleted: widget.includeDeleted,
                      config: {
                        queries: widget.config.queries.map((query) => ({
                          id: query.id,
                          name: query.name,
                          query: query.query,
                        })),
                        settings: widget.config.settings,
                        postQueryFilters: widget.config.postQueryFilters,
                        disableQueryPolicyFilters: widget.config.disableQueryPolicyFilters,
                      },
                    })),
                    layouts: {
                      xs: dashboard.layouts.xs.map((item) => ({
                        i: item.i,
                        x: item.x,
                        y: item.y,
                        w: item.w,
                        h: item.h,
                        static: item.static,
                        moved: item.moved,
                      })),
                      sm: dashboard.layouts.sm.map((item) => ({
                        i: item.i,
                        x: item.x,
                        y: item.y,
                        w: item.w,
                        h: item.h,
                        static: item.static,
                        moved: item.moved,
                      })),
                      md: dashboard.layouts.md.map((item) => ({
                        i: item.i,
                        x: item.x,
                        y: item.y,
                        w: item.w,
                        h: item.h,
                        static: item.static,
                        moved: item.moved,
                      })),
                      lg: dashboard.layouts.lg.map((item) => ({
                        i: item.i,
                        x: item.x,
                        y: item.y,
                        w: item.w,
                        h: item.h,
                        static: item.static,
                        moved: item.moved,
                      })),
                      xl: dashboard.layouts.xl.map((item) => ({
                        i: item.i,
                        x: item.x,
                        y: item.y,
                        w: item.w,
                        h: item.h,
                        static: item.static,
                        moved: item.moved,
                      })),
                    },
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error getting dashboard details: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Create inline question rule instance
    this.server.tool(
      'create-inline-question-rule',
      `JupiterOne Rule Creation Tool - Enhanced Description
Purpose: Creates inline question-based alert rules in JupiterOne to monitor entities and trigger alerts based on specified conditions.
Key Requirements for Success:
1. Condition Format (Critical)
The condition parameter must use JupiterOne's specific array format:

Structure: ["LOGICAL_OPERATOR", [left_value, operator, right_value]]
Example: ["AND", ["queries.queryName.total", ">", 0]]
Supported operators: >, <, >=, <=, =, !=
Logical operators: "AND", "OR"

2. Operations Structure
The when clause should only contain:

type: Always "FILTER"
condition: The array format described above
Do NOT include: version, specVersion (these belong at the rule level, not in the when clause)

3. Query Naming Convention

Query names in the queries array must match the references in conditions
Example: If query name is "users", reference it as "queries.users.total"

4. New Entity Detection

Use triggerActionsOnNewEntitiesOnly: true to only alert on genuinely new entities
This prevents re-alerting on existing entities every polling cycle
Essential for "new user" or "new resource" type alerts

5. Common Patterns
New Entity Monitoring:
json{
  "condition": ["AND", ["queries.entityQuery.total", ">", 0]],
  "triggerActionsOnNewEntitiesOnly": true
}
Threshold-based Alerts:
json{
  "condition": ["AND", ["queries.entityQuery.total", ">=", 5]]
}
6. Debugging Tips

If you get "Invalid conjunction operator" errors, check the condition array format
If you get "additional properties" errors, remove extra fields from the when clause
Always reference existing rules with get-rule-details to see working examples
Test with simple conditions first, then add complexity

7. Best Practices

Use descriptive query names that match their purpose
Include relevant entity fields in outputs for alert context
Set appropriate polling intervals (30 minutes to 1 day typically)
Add meaningful tags for rule organization
Use notifyOnFailure: true to catch rule execution issues
      `,
      {
        name: z.string().describe('Name of the rule'),
        description: z.string().describe('Description of the rule'),
        notifyOnFailure: z.boolean().optional().describe('Whether to notify on failure'),
        triggerActionsOnNewEntitiesOnly: z
          .boolean()
          .optional()
          .describe('Whether to trigger actions only on new entities'),
        ignorePreviousResults: z
          .boolean()
          .optional()
          .describe('Whether to ignore previous results'),
        pollingInterval: z
          .enum([
            'DISABLED',
            'THIRTY_MINUTES',
            'ONE_HOUR',
            'FOUR_HOURS',
            'EIGHT_HOURS',
            'TWELVE_HOURS',
            'ONE_DAY',
            'ONE_WEEK',
          ])
          .describe('How frequently to evaluate the rule'),
        outputs: z.array(z.string()).describe('Output fields from the rule evaluation'),
        specVersion: z.number().optional().describe('Specification version'),
        tags: z.array(z.string()).optional().describe('Tags for categorizing the rule'),
        templates: z.record(z.any()).optional().describe('Template variables'),
        queries: z
          .array(
            z.object({
              query: z.string().describe('J1QL query string'),
              name: z.string().describe('Name identifier for the query'),
              version: z.string().optional().describe('Version of the query'),
              includeDeleted: z
                .boolean()
                .optional()
                .describe('Whether to include deleted entities'),
            })
          )
          .describe('J1QL queries that define what entities to match'),
        operations: z
          .array(
            z.object({
              when: z
                .object({
                  type: z.literal('FILTER'),
                  version: z.number().optional().describe('Version of the filter condition'),
                  condition: z.array(z.any()).describe('Filter condition array'),
                })
                .describe('Condition that triggers the actions'),
              actions: z
                .array(
                  z.object({
                    type: z.string().describe('Action type (e.g., SET_PROPERTY, CREATE_ALERT)'),
                    targetProperty: z
                      .string()
                      .optional()
                      .describe('Property to set (for SET_PROPERTY actions)'),
                    targetValue: z
                      .any()
                      .optional()
                      .describe('Value to set (for SET_PROPERTY actions)'),
                  })
                )
                .describe('Actions to perform when condition is met'),
            })
          )
          .describe('Operations that define when and what actions to take'),
      },
      async ({
        name,
        description,
        notifyOnFailure,
        triggerActionsOnNewEntitiesOnly,
        ignorePreviousResults,
        pollingInterval,
        outputs,
        specVersion,
        tags,
        templates,
        queries,
        operations,
      }) => {
        try {
          const instance = {
            name,
            description,
            notifyOnFailure,
            triggerActionsOnNewEntitiesOnly,
            ignorePreviousResults,
            pollingInterval,
            outputs,
            specVersion,
            tags,
            templates,
            question: {
              queries,
            },
            operations,
          };

          const result = await this.client.createInlineQuestionRuleInstance(instance);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(
                  {
                    success: true,
                    rule: {
                      id: result.id,
                      name: result.name,
                      description: result.description,
                      version: result.version,
                      pollingInterval: result.pollingInterval,
                      outputs: result.outputs,
                      specVersion: result.specVersion,
                      notifyOnFailure: result.notifyOnFailure,
                      triggerActionsOnNewEntitiesOnly: result.triggerActionsOnNewEntitiesOnly,
                      ignorePreviousResults: result.ignorePreviousResults,
                      tags: result.tags,
                      question: result.question,
                      operations: result.operations,
                      latestAlertId: result.latestAlertId,
                      latestAlertIsActive: result.latestAlertIsActive,
                    },
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error creating inline question rule: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async stop(): Promise<void> {
    // Cleanup if needed
  }
}
