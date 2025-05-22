import { GraphQLClient } from 'graphql-request';
import {
  JupiterOneConfig,
  AlertStatus,
  ListAlertInstancesResponse,
  InlineQuestionRuleInstance,
  ReferencedQuestionRuleInstance,
  CreateInlineQuestionRuleInstanceInput,
  UpdateInlineQuestionRuleInstanceInput,
  CreateReferencedQuestionRuleInstanceInput,
  UpdateReferencedQuestionRuleInstanceInput,
  ListAlertInstancesResponseSchema,
  InlineQuestionRuleInstanceSchema,
  ReferencedQuestionRuleInstanceSchema,
  ListRuleInstancesResponse,
  ListRuleInstancesResponseSchema,
  ListRuleInstancesFilters,
  QuestionRuleInstance,
} from '../types/jupiterone.js';

export class JupiterOneClient {
  private client: GraphQLClient;
  private config: JupiterOneConfig;

  constructor(config: JupiterOneConfig) {
    this.config = config;
    this.client = new GraphQLClient(config.baseUrl, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'LifeOmic-Account': config.accountId,
      },
    });
  }

  /**
   * List alert instances with optional filtering
   */
  async listAlertInstances(
    alertStatus?: AlertStatus,
    limit?: number,
    cursor?: string
  ): Promise<ListAlertInstancesResponse> {
    const query = `
      query ListAlertInstances(
        $alertStatus: AlertStatus
        $limit: Int
        $cursor: String
      ) {
        listAlertInstances(
          alertStatus: $alertStatus
          limit: $limit
          cursor: $cursor
        ) {
          instances {
            id
            accountId
            ruleId
            level
            status
            lastUpdatedOn
            lastEvaluationBeginOn
            lastEvaluationEndOn
            createdOn
            dismissedOn
            lastEvaluationResult {
              rawDataDescriptors {
                recordCount
              }
            }
            questionRuleInstance {
              id
              name
              description
              question {
                queries {
                  query
                  name
                  version
                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `;

    const variables: any = {};
    if (alertStatus) variables.alertStatus = alertStatus;
    if (limit) variables.limit = limit;
    if (cursor) variables.cursor = cursor;

    const response = await this.client.request(query, variables);
    return ListAlertInstancesResponseSchema.parse(response);
  }

  /**
   * Get all alert instances by paginating through all pages
   */
  async getAllAlertInstances(
    alertStatus?: AlertStatus
  ): Promise<ListAlertInstancesResponse['listAlertInstances']['instances']> {
    const allInstances = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await this.listAlertInstances(alertStatus, 100, cursor || undefined);
      allInstances.push(...response.listAlertInstances.instances);

      cursor = response.listAlertInstances.pageInfo.endCursor;
      hasNextPage = response.listAlertInstances.pageInfo.hasNextPage;
    }

    return allInstances;
  }

  /**
   * List rule instances using the new GraphQL query
   */
  async listRuleInstances(
    limit?: number,
    cursor?: string,
    filters?: ListRuleInstancesFilters
  ): Promise<ListRuleInstancesResponse> {
    const query = `
      query listRuleInstances($limit: Int, $cursor: String, $filters: ListRuleInstancesFilters) {
        listRuleInstances(limit: $limit, cursor: $cursor, filters: $filters) {
          questionInstances {
            ...RuleInstanceFields
            __typename
          }
          pageInfo {
            hasNextPage
            endCursor
            __typename
          }
          __typename
        }
      }

      fragment RuleInstanceFields on QuestionRuleInstance {
        id
        resourceGroupId
        accountId
        name
        description
        version
        lastEvaluationStartOn
        lastEvaluationEndOn
        evaluationStep
        specVersion
        notifyOnFailure
        triggerActionsOnNewEntitiesOnly
        ignorePreviousResults
        pollingInterval
        templates
        outputs
        labels {
          labelName
          labelValue
          __typename
        }
        question {
          queries {
            query
            name
            version
            includeDeleted
            __typename
          }
          __typename
        }
        questionId
        latest
        deleted
        type
        operations {
          when
          actions
          __typename
        }
        latestAlertId
        latestAlertIsActive
        state {
          actions
          __typename
        }
        tags
        remediationSteps
        __typename
      }
    `;

    const variables: any = {};
    if (limit) variables.limit = limit;
    if (cursor) variables.cursor = cursor;
    if (filters) variables.filters = filters;

    const response = await this.client.request(query, variables);
    return ListRuleInstancesResponseSchema.parse(response);
  }

  /**
   * Get all rule instances by paginating through all pages
   */
  async getAllRuleInstances(
    filters?: ListRuleInstancesFilters
  ): Promise<QuestionRuleInstance[]> {
    const allInstances: QuestionRuleInstance[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await this.listRuleInstances(100, cursor || undefined, filters);
      allInstances.push(...response.listRuleInstances.questionInstances);

      cursor = response.listRuleInstances.pageInfo.endCursor;
      hasNextPage = response.listRuleInstances.pageInfo.hasNextPage;
    }

    return allInstances;
  }

  /**
   * Create an inline question rule instance
   */
  async createInlineQuestionRuleInstance(
    instance: CreateInlineQuestionRuleInstanceInput
  ): Promise<InlineQuestionRuleInstance> {
    const mutation = `
      mutation CreateInlineQuestionRuleInstance(
        $instance: CreateInlineQuestionRuleInstanceInput!
      ) {
        createInlineQuestionRuleInstance(instance: $instance) {
          id
          name
          description
          version
          pollingInterval
          question {
            queries {
              query
              name
              version
            }
          }
          operations {
            when {
              type
              version
              condition
            }
            actions {
              type
              ... on SetPropertyAction {
                targetProperty
                targetValue
              }
            }
          }
          outputs
        }
      }
    `;

    const response = (await this.client.request(mutation, { instance })) as any;
    return InlineQuestionRuleInstanceSchema.parse(response.createInlineQuestionRuleInstance);
  }

  /**
   * Update an inline question rule instance
   */
  async updateInlineQuestionRuleInstance(
    instance: UpdateInlineQuestionRuleInstanceInput
  ): Promise<InlineQuestionRuleInstance> {
    const mutation = `
      mutation UpdateInlineQuestionRuleInstance(
        $instance: UpdateInlineQuestionRuleInstanceInput!
      ) {
        updateInlineQuestionRuleInstance(instance: $instance) {
          id
          name
          description
          version
          pollingInterval
          question {
            queries {
              query
              name
              version
            }
          }
          operations {
            when {
              type
              version
              condition
            }
            actions {
              type
              ... on SetPropertyAction {
                targetProperty
                targetValue
              }
            }
          }
          outputs
        }
      }
    `;

    const response = (await this.client.request(mutation, { instance })) as any;
    return InlineQuestionRuleInstanceSchema.parse(response.updateInlineQuestionRuleInstance);
  }

  /**
   * Create a referenced question rule instance
   */
  async createReferencedQuestionRuleInstance(
    instance: CreateReferencedQuestionRuleInstanceInput
  ): Promise<ReferencedQuestionRuleInstance> {
    const mutation = `
      mutation CreateReferencedQuestionRuleInstance(
        $instance: CreateReferencedQuestionRuleInstanceInput!
      ) {
        createReferencedQuestionRuleInstance(instance: $instance) {
          id
          name
          description
          version
          pollingInterval
          questionId
          questionName
          operations {
            when {
              type
              version
              condition
            }
            actions {
              type
              ... on SetPropertyAction {
                targetProperty
                targetValue
              }
            }
          }
          outputs
        }
      }
    `;

    const response = (await this.client.request(mutation, { instance })) as any;
    return ReferencedQuestionRuleInstanceSchema.parse(
      response.createReferencedQuestionRuleInstance
    );
  }

  /**
   * Update a referenced question rule instance
   */
  async updateReferencedQuestionRuleInstance(
    instance: UpdateReferencedQuestionRuleInstanceInput
  ): Promise<ReferencedQuestionRuleInstance> {
    const mutation = `
      mutation UpdateReferencedQuestionRuleInstance(
        $instance: UpdateReferencedQuestionRuleInstanceInput!
      ) {
        updateReferencedQuestionRuleInstance(instance: $instance) {
          id
          name
          description
          version
          pollingInterval
          questionId
          questionName
          operations {
            when {
              type
              version
              condition
            }
            actions {
              type
              ... on SetPropertyAction {
                targetProperty
                targetValue
              }
            }
          }
          outputs
        }
      }
    `;

    const response = (await this.client.request(mutation, { instance })) as any;
    return ReferencedQuestionRuleInstanceSchema.parse(
      response.updateReferencedQuestionRuleInstance
    );
  }

  /**
   * Delete a rule instance
   */
  async deleteRuleInstance(id: string): Promise<{ id: string }> {
    const mutation = `
      mutation DeleteRuleInstance($id: ID!) {
        deleteRuleInstance(id: $id) {
          id
        }
      }
    `;

    const response = (await this.client.request(mutation, { id })) as any;
    return response.deleteRuleInstance;
  }

  /**
   * Trigger an alert rule on demand
   */
  async evaluateRuleInstance(
    id: string
  ): Promise<{ outputs: Array<{ name: string; value: any }> }> {
    const mutation = `
      mutation EvaluateRuleInstance($id: ID!) {
        evaluateRuleInstance(id: $id) {
          outputs {
            name
            value
          }
        }
      }
    `;

    const response = (await this.client.request(mutation, { id })) as any;
    return response.evaluateRuleInstance;
  }

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<{ accountId: string; name?: string }> {
    const query = `
      query account {
        iamGetAccount {
          accountId
          accountSubdomain
          accountName
          accountOwner
          status
          accountType
          accountLogoUrl
          __typename
        }
      }
    `;

    try {
      const response = (await this.client.request(query)) as any;
      return {
        accountId: response.iamGetAccount.accountId,
        name: response.iamGetAccount.accountName,
      };
    } catch (error) {
      console.error('Error getting account info', error);
      // Fallback to config if account query fails
      return {
        accountId: this.config.accountId,
      };
    }
  }

  /**
   * Test the connection to JupiterOne
   */
  async testConnection(): Promise<boolean> {
    const query = `
      query account {
        iamGetAccount {
          accountId
          accountSubdomain
          accountName
          accountOwner
          status
          accountType
          accountLogoUrl
          __typename
        }
      }
    `;

    try {
      await this.client.request(query);
      return true;
    } catch (error) {
      console.error('Error testing connection to JupiterOne', error);
      return false;
    }
  }
}
