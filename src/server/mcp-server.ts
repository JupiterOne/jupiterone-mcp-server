import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { JupiterOneClient } from '../client/jupiterone-client.js';
import { JupiterOneConfig, AlertStatusSchema } from '../types/jupiterone.js';

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
    this.setupResources();
  }

  private setupTools(): void {
    // Tool: List all alert rules
    this.server.tool(
      'list-alert-rules',
      {
        status: AlertStatusSchema.optional(),
        limit: z.number().min(1).max(1000).optional(),
      },
      async ({ status, limit }) => {
        try {
          const instances = await this.client.getAllAlertInstances(status);
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
                      name: instance.questionRuleInstance?.name || 'Unknown',
                      description: instance.questionRuleInstance?.description || '',
                      status: instance.status,
                      level: instance.level,
                      lastUpdated: instance.lastUpdatedOn,
                      created: instance.createdOn,
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
                text: `Error listing alert rules: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
          const instances = await this.client.getAllAlertInstances();
          const rule = instances.find(
            (instance) =>
              instance.id === ruleId ||
              instance.ruleId === ruleId ||
              instance.questionRuleInstance?.id === ruleId
          );

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
                    ruleId: rule.ruleId,
                    accountId: rule.accountId,
                    name: rule.questionRuleInstance?.name || 'Unknown',
                    description: rule.questionRuleInstance?.description || '',
                    status: rule.status,
                    level: rule.level,
                    lastUpdated: rule.lastUpdatedOn,
                    lastEvaluationBegin: rule.lastEvaluationBeginOn,
                    lastEvaluationEnd: rule.lastEvaluationEndOn,
                    created: rule.createdOn,
                    dismissed: rule.dismissedOn,
                    queries: rule.questionRuleInstance?.question?.queries || [],
                    evaluationResult: rule.lastEvaluationResult,
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
                    outputs: result.outputs,
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
                      name: instance.questionRuleInstance?.name || 'Unknown',
                      level: instance.level,
                      lastUpdated: instance.lastUpdatedOn,
                      recordCount:
                        instance.lastEvaluationResult?.rawDataDescriptors?.[0]?.recordCount || 0,
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
                text: `Error getting active alerts: ${error instanceof Error ? error.message : 'Unknown error'}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  private setupResources(): void {
    // Resource: Account summary
    this.server.resource('account-summary', 'jupiterone://account/summary', async () => {
      try {
        const accountInfo = await this.client.getAccountInfo();
        const allRules = await this.client.getAllAlertInstances();
        const activeAlerts = allRules.filter((rule) => rule.status === 'ACTIVE');
        const inactiveAlerts = allRules.filter((rule) => rule.status === 'INACTIVE');
        const dismissedAlerts = allRules.filter((rule) => rule.status === 'DISMISSED');

        const summary = {
          account: accountInfo,
          statistics: {
            totalRules: allRules.length,
            activeAlerts: activeAlerts.length,
            inactiveAlerts: inactiveAlerts.length,
            dismissedAlerts: dismissedAlerts.length,
          },
          alertsByLevel: {
            critical: allRules.filter((rule) => rule.level === 'CRITICAL').length,
            high: allRules.filter((rule) => rule.level === 'HIGH').length,
            medium: allRules.filter((rule) => rule.level === 'MEDIUM').length,
            low: allRules.filter((rule) => rule.level === 'LOW').length,
            info: allRules.filter((rule) => rule.level === 'INFO').length,
          },
        };

        return {
          contents: [
            {
              uri: 'jupiterone://account/summary',
              text: JSON.stringify(summary, null, 2),
              mimeType: 'application/json',
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: 'jupiterone://account/summary',
              text: `Error getting account summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
              mimeType: 'text/plain',
            },
          ],
        };
      }
    });

    // Resource: All rules list
    this.server.resource('all-rules', 'jupiterone://rules/all', async () => {
      try {
        const instances = await this.client.getAllAlertInstances();

        return {
          contents: [
            {
              uri: 'jupiterone://rules/all',
              text: JSON.stringify(instances, null, 2),
              mimeType: 'application/json',
            },
          ],
        };
      } catch (error) {
        return {
          contents: [
            {
              uri: 'jupiterone://rules/all',
              text: `Error getting all rules: ${error instanceof Error ? error.message : 'Unknown error'}`,
              mimeType: 'text/plain',
            },
          ],
        };
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async stop(): Promise<void> {
    // Cleanup if needed
  }
}
