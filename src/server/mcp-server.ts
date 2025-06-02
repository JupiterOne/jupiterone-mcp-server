import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { JupiterOneClient } from '../client/jupiterone-client.js';
import { JupiterOneConfig } from '../types/jupiterone.js';
import {
  RuleEvaluation,
  QueryEvaluation,
  QueryEvaluationDetails,
  ConditionEvaluation,
  ActionEvaluation,
  ActionEvaluationDetails,
} from '../types/jupiterone.js';
import { loadDescription } from '../utils/load-description.js';
import { J1QLValidator } from '../utils/j1ql-validator.js';

export class JupiterOneMcpServer {
  private server: McpServer;
  private client: JupiterOneClient;
  private validator: J1QLValidator;

  constructor(config: JupiterOneConfig) {
    this.client = new JupiterOneClient(config);
    this.validator = new J1QLValidator(this.client.j1qlService);
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
      loadDescription('list-rules.md'),
      {
        limit: z.number().min(1).max(1000).optional(),
        cursor: z.string().optional(),
      },
      async ({ limit, cursor }) => {
        try {
          const response = await this.client.listRuleInstances(limit, cursor);
          const instances = response.questionInstances || [];

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    returned: instances.length,
                    rules: instances.map((instance) => ({
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
                    pageInfo: response.pageInfo,
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
                type: 'text' as const,
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
                  type: 'text' as const,
                  text: `Rule with ID ${ruleId} not found`,
                },
              ],
              isError: true,
            };
          }

          return {
            content: [
              {
                type: 'text' as const,
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
                type: 'text' as const,
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
                type: 'text' as const,
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
                type: 'text' as const,
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
      loadDescription('list-alerts.md'),
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
                type: 'text' as const,
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
                type: 'text' as const,
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
      loadDescription('create-dashboard.md'),
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
                type: 'text' as const,
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
                type: 'text' as const,
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
                type: 'text' as const,
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
                type: 'text' as const,
                text: `Error getting dashboard details: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get integration definitions
    this.server.tool(
      'get-integration-definitions',
      loadDescription('get-integration-definitions.md'),
      {
        cursor: z.string().optional().describe('Optional cursor for pagination'),
        includeConfig: z.boolean().optional().describe('Whether to include configuration fields'),
      },
      async ({ cursor, includeConfig }) => {
        try {
          const definitions = await this.client.getIntegrationDefinitions(cursor, includeConfig);

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    total: definitions.definitions.length,
                    definitions: definitions.definitions.map((def) => ({
                      id: def.id,
                      name: def.name,
                      type: def.type,
                      title: def.title,
                      displayMode: def.displayMode,
                      integrationType: def.integrationType,
                      integrationClass: def.integrationClass,
                      integrationCategory: def.integrationCategory,
                      beta: def.beta,
                      docsWebLink: def.docsWebLink,
                      repoWebLink: def.repoWebLink,
                      invocationPaused: def.invocationPaused,
                      managedExecutionDisabled: def.managedExecutionDisabled,
                      managedCreateDisabled: def.managedCreateDisabled,
                      managedDeleteDisabled: def.managedDeleteDisabled,
                      totalInstanceCount: def.totalInstanceCount,
                      description: def.description,
                      provisioningType: def.provisioningType,
                      customDefinitionType: def.customDefinitionType,
                      integrationPlatformFeatures: def.integrationPlatformFeatures,
                      configFields: def.configFields,
                      authSections: def.authSections,
                      configSections: def.configSections,
                    })),
                    pageInfo: definitions.pageInfo,
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
                type: 'text' as const,
                text: `Error getting integration definitions: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get integration instances
    this.server.tool(
      'get-integration-instances',
      loadDescription('get-integration-instances.md'),
      {
        definitionId: z
          .string()
          .optional()
          .describe('Optional ID to filter instances by definition'),
        limit: z
          .number()
          .min(1)
          .max(1000)
          .optional()
          .describe('Optional limit for number of instances to return'),
      },
      async ({ definitionId, limit }) => {
        try {
          const instances = await this.client.getIntegrationInstances(
            definitionId,
            undefined,
            limit
          );

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    total: instances.instances.length,
                    instances: instances.instances.map((instance) => ({
                      id: instance.id,
                      name: instance.name,
                      accountId: instance.accountId,
                      sourceIntegrationInstanceId: instance.sourceIntegrationInstanceId,
                      pollingInterval: instance.pollingInterval,
                      pollingIntervalCronExpression: instance.pollingIntervalCronExpression,
                      integrationDefinitionId: instance.integrationDefinitionId,
                      description: instance.description,
                      config: instance.config,
                      instanceRelationship: instance.instanceRelationship,
                      resourceGroupId: instance.resourceGroupId,
                      createdOn: instance.createdOn,
                      createdBy: instance.createdBy,
                      updatedOn: instance.updatedOn,
                      updatedBy: instance.updatedBy,
                      mostRecentJob: instance.mostRecentJob
                        ? {
                            status: instance.mostRecentJob.status,
                            hasSkippedSteps: instance.mostRecentJob.hasSkippedSteps,
                            createDate: instance.mostRecentJob.createDate,
                          }
                        : null,
                    })),
                    pageInfo: instances.pageInfo,
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
                type: 'text' as const,
                text: `Error getting integration instances: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get integration jobs
    this.server.tool(
      'get-integration-jobs',
      {
        status: z
          .enum(['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'])
          .optional()
          .describe('Optional status to filter jobs'),
        integrationInstanceId: z
          .string()
          .optional()
          .describe('Optional ID to filter jobs by instance'),
        integrationDefinitionId: z
          .string()
          .optional()
          .describe('Optional ID to filter jobs by definition'),
        integrationInstanceIds: z
          .array(z.string())
          .optional()
          .describe('Optional array of instance IDs to filter jobs'),
        size: z
          .number()
          .min(1)
          .max(1000)
          .optional()
          .describe('Optional size limit for number of jobs to return'),
      },
      async ({
        status,
        integrationInstanceId,
        integrationDefinitionId,
        integrationInstanceIds,
        size,
      }) => {
        try {
          const jobs = await this.client.getIntegrationJobs(
            status,
            integrationInstanceId,
            integrationDefinitionId,
            integrationInstanceIds,
            undefined,
            size
          );

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    total: jobs.jobs.length,
                    jobs: jobs.jobs.map((job) => ({
                      id: job.id,
                      status: job.status,
                      integrationInstanceId: job.integrationInstanceId,
                      createDate: job.createDate,
                      endDate: job.endDate,
                      hasSkippedSteps: job.hasSkippedSteps,
                      integrationInstance: {
                        id: job.integrationInstance.id,
                        name: job.integrationInstance.name,
                      },
                      integrationDefinition: {
                        id: job.integrationDefinition.id,
                        title: job.integrationDefinition.title,
                        integrationType: job.integrationDefinition.integrationType,
                      },
                    })),
                    pageInfo: jobs.pageInfo,
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
                type: 'text' as const,
                text: `Error getting integration jobs: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      loadDescription('create-inline-question-rule.md'),
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
                  condition: z.array(z.any()).describe('Filter condition array'),
                })
                .describe('Condition that triggers the actions'),
              actions: z
                .array(
                  z.object({
                    id: z.string().optional(),
                    type: z
                      .string()
                      .describe('Action type (e.g., SET_PROPERTY, CREATE_ALERT, SEND_EMAIL)'),
                    targetProperty: z
                      .string()
                      .optional()
                      .describe('Property to set (for SET_PROPERTY actions)'),
                    targetValue: z
                      .any()
                      .optional()
                      .describe('Value to set (for SET_PROPERTY actions)'),
                    integrationInstanceId: z
                      .string()
                      .optional()
                      .describe('ID of the integration instance for integration actions'),
                    recipients: z
                      .array(z.string())
                      .optional()
                      .describe('Email recipients for SEND_EMAIL action'),
                    body: z.string().optional().describe('Message body for email/slack actions'),
                    channels: z
                      .array(z.string())
                      .optional()
                      .describe('Slack channels for SEND_SLACK_MESSAGE action'),
                    bucket: z.string().optional().describe('S3 bucket name for SEND_TO_S3 action'),
                    region: z.string().optional().describe('AWS region for SEND_TO_S3 action'),
                    data: z.any().optional().describe('Additional data for actions'),
                    entityClass: z
                      .string()
                      .optional()
                      .describe('Entity class for CREATE_JIRA_TICKET action'),
                    summary: z
                      .string()
                      .optional()
                      .describe('Summary for CREATE_JIRA_TICKET action'),
                    issueType: z
                      .string()
                      .optional()
                      .describe('Issue type for CREATE_JIRA_TICKET action'),
                    project: z
                      .string()
                      .optional()
                      .describe('Project key for CREATE_JIRA_TICKET action'),
                    updateContentOnChanges: z
                      .boolean()
                      .optional()
                      .describe(
                        'Whether to update content on changes for CREATE_JIRA_TICKET action'
                      ),
                    additionalFields: z
                      .any()
                      .optional()
                      .describe('Additional fields for CREATE_JIRA_TICKET action'),
                  })
                )
                .describe('Actions to take when condition is met'),
            })
          )
          .describe('Operations to perform when conditions are met'),
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
          // Validate all queries before creating the rule
          const validationResults = await this.validateQueries(queries);
          if (validationResults.length > 0) {
            return this.createValidationErrorResponse(validationResults);
          }

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
                type: 'text' as const,
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
                type: 'text' as const,
                text: `Error creating inline question rule: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Update inline question rule instance
    this.server.tool(
      'update-inline-question-rule',
      loadDescription('update-inline-question-rule.md'),
      {
        id: z.string().describe('ID of the rule to update'),
        name: z.string().describe('Name of the rule'),
        description: z.string().describe('Description of the rule'),
        notifyOnFailure: z.boolean().describe('Whether to notify on failure'),
        triggerActionsOnNewEntitiesOnly: z
          .boolean()
          .describe('Whether to trigger actions only on new entities'),
        ignorePreviousResults: z.boolean().describe('Whether to ignore previous results'),
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
        specVersion: z.number().describe('Specification version'),
        version: z.number().describe('Version of the rule'),
        tags: z.array(z.string()).describe('Tags for categorizing the rule'),
        templates: z.record(z.any()).describe('Template variables'),
        labels: z
          .array(
            z.object({
              labelName: z.string(),
              labelValue: z.string().nullable(),
            })
          )
          .describe('Labels for the rule'),
        resourceGroupId: z.string().nullable().describe('Resource group ID'),
        remediationSteps: z
          .string()
          .nullable()
          .describe('Steps to remediate issues found by the rule'),
        question: z
          .object({
            queries: z.array(
              z.object({
                query: z.string().describe('J1QL query string'),
                name: z.string().describe('Name identifier for the query'),
                version: z.string().optional().describe('Version of the query'),
                includeDeleted: z.boolean().describe('Whether to include deleted entities'),
              })
            ),
          })
          .describe('Question configuration'),
        operations: z
          .array(
            z.object({
              when: z
                .object({
                  type: z.literal('FILTER'),
                  condition: z.array(z.any()).describe('Filter condition array'),
                })
                .describe('Condition that triggers the actions'),
              actions: z.array(
                z.object({
                  id: z.string().optional(),
                  type: z.string().describe('Action type (e.g., SET_PROPERTY, CREATE_ALERT)'),
                  targetProperty: z
                    .string()
                    .optional()
                    .describe('Property to set (for SET_PROPERTY actions)'),
                  targetValue: z
                    .any()
                    .optional()
                    .describe('Value to set (for SET_PROPERTY actions)'),
                  integrationInstanceId: z
                    .string()
                    .optional()
                    .describe('ID of the integration instance for integration actions'),
                  recipients: z
                    .array(z.string())
                    .optional()
                    .describe('Email recipients for SEND_EMAIL action'),
                  body: z.string().optional().describe('Message body for email/slack actions'),
                  channels: z
                    .array(z.string())
                    .optional()
                    .describe('Slack channels for SEND_SLACK_MESSAGE action'),
                  bucket: z.string().optional().describe('S3 bucket name for SEND_TO_S3 action'),
                  region: z.string().optional().describe('AWS region for SEND_TO_S3 action'),
                  data: z.any().optional().describe('Additional data for actions'),
                  entityClass: z
                    .string()
                    .optional()
                    .describe('Entity class for CREATE_JIRA_TICKET action'),
                  summary: z.string().optional().describe('Summary for CREATE_JIRA_TICKET action'),
                  issueType: z
                    .string()
                    .optional()
                    .describe('Issue type for CREATE_JIRA_TICKET action'),
                  project: z.string().optional().describe('Project for CREATE_JIRA_TICKET action'),
                  updateContentOnChanges: z
                    .boolean()
                    .optional()
                    .describe('Whether to update content on changes for CREATE_JIRA_TICKET action'),
                  additionalFields: z
                    .any()
                    .optional()
                    .describe('Additional fields for CREATE_JIRA_TICKET action'),
                  entities: z.string().optional().describe('Entities for TAG_ENTITIES action'),
                  tags: z
                    .array(
                      z.object({
                        name: z.string(),
                        value: z.string().nullable(),
                      })
                    )
                    .optional()
                    .describe('Tags for TAG_ENTITIES action'),
                })
              ),
            })
          )
          .describe('Operations that define when and what actions to take'),
      },
      async ({
        id,
        name,
        description,
        notifyOnFailure,
        triggerActionsOnNewEntitiesOnly,
        ignorePreviousResults,
        pollingInterval,
        outputs,
        specVersion,
        version,
        tags,
        templates,
        labels,
        resourceGroupId,
        remediationSteps,
        question,
        operations,
      }) => {
        try {
          // Validate all queries before updating the rule
          const validationResults = await this.validateQueries(question?.queries);
          if (validationResults.length > 0) {
            return this.createValidationErrorResponse(validationResults);
          }

          const instance = {
            id,
            name,
            description,
            notifyOnFailure,
            triggerActionsOnNewEntitiesOnly,
            ignorePreviousResults,
            pollingInterval,
            outputs,
            specVersion,
            version,
            tags,
            templates,
            labels,
            resourceGroupId,
            remediationSteps,
            question,
            operations,
          };

          const result = await this.client.updateInlineQuestionRuleInstance(instance);

          return {
            content: [
              {
                type: 'text' as const,
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
                      labels: result.labels,
                      question: result.question,
                      operations: result.operations,
                      latestAlertId: result.latestAlertId,
                      latestAlertIsActive: result.latestAlertIsActive,
                      resourceGroupId: result.resourceGroupId,
                      remediationSteps: result.remediationSteps,
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
                type: 'text' as const,
                text: `Error updating inline question rule: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Add get-integration-job tool
    this.server.tool(
      'get-integration-job',
      {
        integrationJobId: z.string().describe('ID of the job to get'),
        integrationInstanceId: z.string().describe('ID of the instance the job belongs to'),
      },
      async ({ integrationJobId, integrationInstanceId }) => {
        try {
          const job = await this.client.getIntegrationJob(integrationJobId, integrationInstanceId);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    id: job.id,
                    status: job.status,
                    integrationInstanceId: job.integrationInstanceId,
                    createDate: job.createDate,
                    endDate: job.endDate,
                    hasSkippedSteps: job.hasSkippedSteps,
                    integrationInstance: job.integrationInstance,
                    integrationDefinition: job.integrationDefinition,
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
                type: 'text' as const,
                text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Add get-integration-events tool
    this.server.tool(
      'get-integration-events',
      {
        jobId: z.string().describe('ID of the job to get events for'),
        integrationInstanceId: z.string().describe('ID of the instance the job belongs to'),
        cursor: z.string().optional().describe('Optional cursor for pagination'),
        size: z
          .number()
          .min(1)
          .max(1000)
          .optional()
          .describe('Optional size limit for number of events to return (1-1000)'),
      },
      async ({ jobId, integrationInstanceId, cursor, size }) => {
        try {
          const events = await this.client.getIntegrationEvents(
            jobId,
            integrationInstanceId,
            cursor,
            size
          );
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    events: events.events.map((event) => ({
                      id: event.id,
                      name: event.name,
                      description: event.description,
                      createDate: event.createDate,
                      jobId: event.jobId,
                      level: event.level,
                      eventCode: event.eventCode,
                    })),
                    pageInfo: events.pageInfo,
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
                type: 'text' as const,
                text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: List rule evaluations
    this.server.tool(
      'list-rule-evaluations',
      {
        ruleId: z.string(),
        beginTimestamp: z.number().optional(),
        endTimestamp: z.number().optional(),
        limit: z.number().min(1).max(1000).optional(),
        tag: z.string().optional(),
      },
      async ({ ruleId, beginTimestamp, endTimestamp, limit, tag }) => {
        try {
          const evaluations = await this.client.getAllRuleEvaluations({
            collectionType: 'RULE_EVALUATION',
            collectionOwnerId: ruleId,
            beginTimestamp: beginTimestamp || 0,
            endTimestamp: endTimestamp || Date.now(),
            limit,
            tag,
          });

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    total: evaluations.length,
                    evaluations: evaluations.map((evaluation: RuleEvaluation) => ({
                      accountId: evaluation.accountId,
                      collectionOwnerId: evaluation.collectionOwnerId,
                      collectionOwnerVersion: evaluation.collectionOwnerVersion,
                      collectionType: evaluation.collectionType,
                      outputs: evaluation.outputs,
                      rawDataDescriptors: evaluation.rawDataDescriptors,
                      tag: evaluation.tag,
                      timestamp: evaluation.timestamp,
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
                type: 'text' as const,
                text: `Error listing rule evaluations: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get rule evaluation details
    this.server.tool(
      'get-rule-evaluation-details',
      {
        ruleId: z.string(),
        timestamp: z.number(),
      },
      async ({ ruleId, timestamp }) => {
        try {
          const details = await this.client.getRuleEvaluationDetails({
            ruleInstanceId: ruleId,
            timestamp,
          });

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    accountRuleId: details.accountRuleId,
                    startedOn: details.startedOn,
                    question: {
                      totalDuration: details.question.totalDuration,
                      queries: Array.isArray(details.question.queries)
                        ? details.question.queries.map((query: QueryEvaluation) => ({
                            status: query.status,
                            queryEvaluationDetails: Array.isArray(query.queryEvaluationDetails)
                              ? query.queryEvaluationDetails.map(
                                  (detail: QueryEvaluationDetails) => ({
                                    name: detail.name,
                                    duration: detail.duration,
                                    status: detail.status,
                                    error: detail.error,
                                  })
                                )
                              : [],
                          }))
                        : [],
                    },
                    conditions: Array.isArray(details.conditions)
                      ? details.conditions.map((condition: ConditionEvaluation) => ({
                          status: condition.status,
                          condition: condition.condition,
                        }))
                      : [],
                    actions: Array.isArray(details.actions)
                      ? details.actions.map((action: ActionEvaluation) => ({
                          status: action.status,
                          actionEvaluationDetails: Array.isArray(action.actionEvaluationDetails)
                            ? action.actionEvaluationDetails.map(
                                (detail: ActionEvaluationDetails) => ({
                                  actionId: detail.actionId,
                                  action: detail.action,
                                  status: detail.status,
                                  duration: detail.duration,
                                  finishedOn: detail.finishedOn,
                                  logs: detail.logs,
                                })
                              )
                            : [],
                        }))
                      : [],
                    ruleEvaluationOrigin: details.ruleEvaluationOrigin,
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
                type: 'text' as const,
                text: `Error getting rule evaluation details: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get raw data download URL
    this.server.tool(
      'get-raw-data-download-url',
      {
        rawDataKey: z.string(),
      },
      async ({ rawDataKey }) => {
        try {
          const downloadUrl = await this.client.getRawDataDownloadUrl(rawDataKey);

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(
                  {
                    rawDataKey,
                    downloadUrl,
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
                type: 'text' as const,
                text: `Error getting raw data download URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Get rule evaluation query results
    this.server.tool(
      'get-rule-evaluation-query-results',
      {
        rawDataKey: z.string(),
      },
      async ({ rawDataKey }) => {
        try {
          const results = await this.client.getRawDataResults(rawDataKey);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(results, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error getting rule evaluation query results: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // The server is not doing a great job of this, will uncomment when we have better support for this
    // Tool: Create J1QL from natural language
    // this.server.tool(
    //   'create-j1ql-from-natural-language',
    //   loadDescription('create-j1ql-from-natural-language.md'),
    //   {
    //     naturalLanguage: z.string().describe('Natural language description of what you want to find'),
    //   },
    //   async ({ naturalLanguage }) => {
    //     try {
    //       const result = await this.client.createJ1qlFromNaturalLanguage(naturalLanguage);

    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: JSON.stringify(
    //               {
    //                 success: true,
    //                 result: {
    //                   uuid: result.uuid,
    //                   question: result.question,
    //                   query: result.query,
    //                 },
    //               },
    //               null,
    //               2
    //             ),
    //           },
    //         ],
    //       };
    //     } catch (error) {
    //       return {
    //         content: [
    //           {
    //             type: 'text',
    //             text: `Error creating J1QL from natural language: ${error instanceof Error ? error.message : 'Unknown error'}`,
    //           },
    //         ],
    //         isError: true,
    //       };
    //     }
    //   }
    // );

    // Tool: Create dashboard widget
    this.server.tool(
      'create-dashboard-widget',
      loadDescription('create-dashboard-widget.md'),
      {
        dashboardId: z.string().describe('ID of the dashboard to add the widget to'),
        input: z.any().describe('Widget input object (CreateInsightsWidgetInput)'),
      },
      async ({ dashboardId, input }) => {
        try {
          let widgetInput = input;
          if (typeof input === 'string') {
            try {
              widgetInput = JSON.parse(input);
            } catch (e) {
              throw new Error('Input must be a valid object or JSON string');
            }
          }

          // Validate queries before creating widget
          const validationResults = await this.validateWidgetQueries(widgetInput.config?.queries);
          if (validationResults.length > 0) {
            return this.createValidationErrorResponse(validationResults);
          }

          const widget = await this.client.createDashboardWidget(dashboardId, widgetInput);
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(widget, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error creating dashboard widget: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Update dashboard
    this.server.tool(
      'update-dashboard',
      loadDescription('update-dashboard.md'),
      {
        dashboardId: z.string().describe('ID of the dashboard to update'),
        layouts: z
          .object({
            xs: z
              .array(
                z.object({
                  w: z.number(),
                  h: z.number(),
                  x: z.number(),
                  y: z.number(),
                  i: z.string(),
                  moved: z.boolean(),
                  static: z.boolean(),
                })
              )
              .optional(),
            sm: z
              .array(
                z.object({
                  w: z.number(),
                  h: z.number(),
                  x: z.number(),
                  y: z.number(),
                  i: z.string(),
                  moved: z.boolean(),
                  static: z.boolean(),
                })
              )
              .optional(),
            md: z
              .array(
                z.object({
                  w: z.number(),
                  h: z.number(),
                  x: z.number(),
                  y: z.number(),
                  i: z.string(),
                  moved: z.boolean(),
                  static: z.boolean(),
                })
              )
              .optional(),
            lg: z
              .array(
                z.object({
                  w: z.number(),
                  h: z.number(),
                  x: z.number(),
                  y: z.number(),
                  i: z.string(),
                  moved: z.boolean(),
                  static: z.boolean(),
                })
              )
              .optional(),
            xl: z
              .array(
                z.object({
                  w: z.number(),
                  h: z.number(),
                  x: z.number(),
                  y: z.number(),
                  i: z.string(),
                  moved: z.boolean(),
                  static: z.boolean(),
                })
              )
              .optional(),
          })
          .describe('Layouts object for the dashboard'),
      },
      async ({ dashboardId, layouts }) => {
        try {
          const updated = await this.client.updateDashboard({ dashboardId, layouts });
          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(updated, null, 2),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error updating dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );

    // Tool: Execute J1QL query
    this.server.tool(
      'execute-j1ql-query',
      loadDescription('execute-j1ql-query.md'),
      {
        query: z.string().describe('A J1QL query string that describes what data to return'),
        variables: z
          .record(z.any())
          .optional()
          .describe('A JSON map of values to be used as parameters for the query'),
        cursor: z
          .string()
          .optional()
          .describe('A token that can be exchanged to fetch the next page of information'),
        includeDeleted: z
          .boolean()
          .optional()
          .describe('Include recently deleted information in the results'),
        deferredResponse: z
          .enum(['DISABLED', 'FORCE'])
          .optional()
          .describe('Allows for a deferred response to be returned'),
        flags: z.record(z.any()).optional().describe('Flags for query execution'),
        scopeFilters: z
          .array(z.record(z.any()))
          .optional()
          .describe('Array of filters that define the desired vertex'),
      },
      async ({
        query,
        variables,
        cursor,
        includeDeleted,
        deferredResponse,
        flags,
        scopeFilters,
      }) => {
        try {
          // Build flags object
          const queryFlags = { ...flags };
          if (typeof includeDeleted === 'boolean') queryFlags.includeDeleted = includeDeleted;
          if (deferredResponse) queryFlags.deferredResponse = deferredResponse;

          const result = await this.client.executeJ1qlQuery({
            query,
            variables,
            cursor,
            scopeFilters,
            flags: Object.keys(queryFlags).length > 0 ? queryFlags : undefined,
          });

          return {
            content: [
              {
                type: 'text' as const,
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error) {
          return this.createQueryErrorResponse(error, query);
        }
      }
    );
  }

  // Helper methods for validation
  private async validateQueries(queries: any[]): Promise<Array<{queryName: string, error: string, suggestion: string}>> {
    if (!queries || !Array.isArray(queries)) return [];
    
    const validationResults = [];
    for (const queryObj of queries) {
      if (queryObj.query) {
        const validation = await this.validator.validateQuery(queryObj.query);
        if (!validation.isValid) {
          validationResults.push({
            queryName: queryObj.name || 'Unnamed query',
            error: validation.error || 'Query validation failed',
            suggestion: validation.suggestion || 'Please check the query syntax and try again'
          });
        }
      }
    }
    return validationResults;
  }

  private async validateWidgetQueries(queries: any[]): Promise<Array<{queryName: string, error: string, suggestion: string}>> {
    // Use the same validation logic as rules - actually execute the queries
    return this.validateQueries(queries);
  }

  private createValidationErrorResponse(validationResults: Array<{queryName: string, error: string, suggestion: string}>) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Query validation failed. Please fix the following issues:\n\n${validationResults.map(r => 
            `Query: ${r.queryName}\nError: ${r.error}\nSuggestion: ${r.suggestion}`
          ).join('\n\n')}\n\nUse the execute-j1ql-query tool to test and refine your queries first.`,
        },
      ],
      isError: true,
    };
  }

  private createQueryErrorResponse(error: any, query: string) {
    const errorResult = this.validator.handleQueryError(error, query);
    
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error executing J1QL query:\n\n${errorResult.error}\n\nSuggestion: ${errorResult.suggestion}\n\nDebugging tips:\n1. Modify existing queries that are already working as expected.\n2. Use discovery queries to understand available data\n3. Verify entity classes exist (use proper capitalization)\n4. Check property names match exactly\n5. Use single quotes for strings, not double quotes\n6. Place aliases after WITH statements\n7. Add LIMIT clause to prevent timeouts`,
        },
      ],
      isError: true,
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async stop(): Promise<void> {
    // Cleanup if needed
  }
}
