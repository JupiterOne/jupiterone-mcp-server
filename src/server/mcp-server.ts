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
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async stop(): Promise<void> {
    // Cleanup if needed
  }
}
