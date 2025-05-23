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
  ListRuleInstancesResponse,
  ListRuleInstancesFilters,
  QuestionRuleInstance,
  Dashboard,
  DashboardResponse,
  CreateDashboardInput,
  CreateDashboardResponse,
  GetDashboardResponse,
} from '../types/jupiterone.js';

interface GraphQLResponse<T> {
  [key: string]: T & {
    instances?: any[];
    pageInfo?: {
      endCursor: string | null;
      hasNextPage: boolean;
      __typename: string;
    };
    __typename: string;
  };
}

export class JupiterOneClient {
  private client: GraphQLClient;
  private config: JupiterOneConfig;

  constructor(config: JupiterOneConfig) {
    this.config = config;
    this.client = new GraphQLClient(config.baseUrl || 'https://graphql.us.jupiterone.io', {
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
      query listAlertInstances($alertStatus: AlertStatus, $limit: Int, $cursor: String) {
        listAlertInstances(alertStatus: $alertStatus, limit: $limit, cursor: $cursor) {
          instances {
            ...AlertInstanceFragment
            __typename
          }
          pageInfo {
            endCursor
            hasNextPage
            __typename
          }
          __typename
        }
      }

      fragment AlertInstanceFragment on AlertInstance {
        accountId
        resourceGroupId
        createdOn
        dismissedOn
        endReason
        id
        lastEvaluationBeginOn
        lastEvaluationEndOn
        lastEvaluationResult {
          answerText
          evaluationEndOn
          outputs {
            name
            value
            __typename
          }
          rawDataDescriptors {
            name
            recordCount
            __typename
          }
          __typename
        }
        lastUpdatedOn
        level
        questionRuleInstance {
          id
          name
          description
          tags
          pollingInterval
          labels {
            labelName
            labelValue
            __typename
          }
          __typename
        }
        reportRuleInstance {
          name
          description
          __typename
        }
        ruleId
        ruleVersion
        status
        users
        __typename
      }
    `;

    const variables: any = {};
    if (alertStatus) variables.alertStatus = alertStatus;
    if (limit) variables.limit = limit;
    if (cursor) variables.cursor = cursor;

    try {
      const response = await this.client.request<GraphQLResponse<ListAlertInstancesResponse>>(
        query,
        variables
      );

      if (!response?.listAlertInstances) {
        throw new Error('Invalid response structure from JupiterOne API');
      }

      const {
        instances = [],
        pageInfo = { endCursor: null, hasNextPage: false, __typename: 'PageInfo' },
      } = response.listAlertInstances;

      return {
        listAlertInstances: {
          instances,
          pageInfo,
          __typename: 'ListAlertInstancesResponse',
        },
      };
    } catch (error) {
      console.error('Error in listAlertInstances:', error);
      throw error;
    }
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

    try {
      while (hasNextPage) {
        const response = await this.listAlertInstances(alertStatus, 100, cursor || undefined);

        if (!response?.listAlertInstances?.instances) {
          console.error('Unexpected response structure:', response);
          break;
        }

        allInstances.push(...response.listAlertInstances.instances);

        cursor = response.listAlertInstances.pageInfo.endCursor;
        hasNextPage = response.listAlertInstances.pageInfo.hasNextPage;
      }

      return allInstances;
    } catch (error) {
      console.error('Error in getAllAlertInstances:', error);
      throw error;
    }
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

    const response = await this.client.request<{
      listRuleInstances: ListRuleInstancesResponse['listRuleInstances'];
    }>(query, variables);
    return { listRuleInstances: response.listRuleInstances };
  }

  /**
   * Get all rule instances by paginating through all pages
   */
  async getAllRuleInstances(filters?: ListRuleInstancesFilters): Promise<QuestionRuleInstance[]> {
    const allInstances: QuestionRuleInstance[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await this.listRuleInstances(100, cursor || undefined, filters);
      if (!response?.listRuleInstances?.questionInstances) {
        console.error('Unexpected response structure:', response);
        break;
      }
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
      mutation createInlineQuestionRuleInstance($instance: CreateInlineQuestionRuleInstanceInput!) {
        createInlineQuestionRuleInstance(instance: $instance) {
          ...RuleInstanceFields
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

    const response = await this.client.request<{
      createInlineQuestionRuleInstance: InlineQuestionRuleInstance;
    }>(mutation, { instance });
    return response.createInlineQuestionRuleInstance;
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

    const response = await this.client.request<{
      updateInlineQuestionRuleInstance: InlineQuestionRuleInstance;
    }>(mutation, { instance });
    return response.updateInlineQuestionRuleInstance;
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

    const response = await this.client.request<{
      createReferencedQuestionRuleInstance: ReferencedQuestionRuleInstance;
    }>(mutation, { instance });
    return response.createReferencedQuestionRuleInstance;
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

    const response = await this.client.request<{
      updateReferencedQuestionRuleInstance: ReferencedQuestionRuleInstance;
    }>(mutation, { instance });
    return response.updateReferencedQuestionRuleInstance;
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

    const response = await this.client.request<{ deleteRuleInstance: { id: string } }>(mutation, {
      id,
    });
    return response.deleteRuleInstance;
  }

  /**
   * Trigger an alert rule on demand
   */
  async evaluateRuleInstance(id: string): Promise<{ id: string; __typename: string }> {
    const query = `
      mutation evaluateRuleInstance($id: ID!) {
        evaluateRuleInstance(id: $id) {
          id
          __typename
        }
      }
    `;

    const response = await this.client.request<{
      evaluateRuleInstance: { id: string; __typename: string };
    }>(query, { id });
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
      const response = await this.client.request<{
        iamGetAccount: { accountId: string; accountName?: string };
      }>(query);
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

  /**
   * Get all dashboards
   */
  async getDashboards(): Promise<Dashboard[]> {
    const query = `
      query GetDashboards {
        getDashboards(options: {includeAllJ1ManagedDashboards: true}) {
          id
          name
          userId
          category
          supportedUseCase
          prerequisites {
            prerequisitesMet
            preRequisitesGroupsFulfilled
            preRequisitesGroupsRequired
            __typename
          }
          isJ1ManagedBoard
          resourceGroupId
          starred
          _timeUpdated
          _createdAt
          __typename
        }
      }
    `;

    try {
      const response = await this.client.request<DashboardResponse>(query);
      return response.getDashboards;
    } catch (error) {
      console.error('Error getting dashboards:', error);
      throw error;
    }
  }

  /**
   * Create a new dashboard
   */
  async createDashboard(
    input: CreateDashboardInput
  ): Promise<CreateDashboardResponse['createDashboard']> {
    const mutation = `
      mutation CreateDashboard($input: CreateInsightsDashboardInput!) {
        createDashboard(input: $input) {
          id
          __typename
        }
      }
    `;

    try {
      const response = await this.client.request<CreateDashboardResponse>(mutation, { input });
      return response.createDashboard;
    } catch (error) {
      console.error('Error creating dashboard:', error);
      throw error;
    }
  }

  /**
   * Get dashboard details by ID
   */
  async getDashboard(dashboardId: string): Promise<GetDashboardResponse['getDashboard']> {
    const query = `
      query solo_GetDashboard($dashboardId: String!) {
        getDashboard(dashboardId: $dashboardId) {
          ...InsightsDashboard
          __typename
        }
      }

      fragment InsightsDashboard on InsightsDashboard {
        id
        name
        category
        userId
        supportedUseCase
        isJ1ManagedBoard
        published
        publishedToUserIds
        publishedToGroupIds
        groupIds
        userIds
        scopeFilters
        resourceGroupId
        starred
        _timeUpdated
        _createdAt
        prerequisites {
          prerequisitesMet
          preRequisitesGroupsFulfilled
          preRequisitesGroupsRequired
          __typename
        }
        parameters {
          ...DashboardParameterFields
          __typename
        }
        widgets {
          ...InsightsWidget
          __typename
        }
        layouts {
          ...InsightsDashboardLayoutConfig
          __typename
        }
        __typename
      }

      fragment DashboardParameterFields on DashboardParameter {
        dashboardId
        accountId
        id
        label
        name
        options
        valueType
        type
        default
        disableCustomInput
        requireValue
        __typename
      }

      fragment InsightsWidget on InsightsWidget {
        id
        title
        description
        type
        questionId
        noResultMessage
        includeDeleted
        config {
          queries {
            id
            name
            query
            __typename
          }
          settings
          postQueryFilters
          disableQueryPolicyFilters
          __typename
        }
        __typename
      }

      fragment InsightsDashboardLayoutConfig on InsightsDashboardLayoutConfig {
        xs {
          ...InsightsDashboardLayoutItem
          __typename
        }
        sm {
          ...InsightsDashboardLayoutItem
          __typename
        }
        md {
          ...InsightsDashboardLayoutItem
          __typename
        }
        lg {
          ...InsightsDashboardLayoutItem
          __typename
        }
        xl {
          ...InsightsDashboardLayoutItem
          __typename
        }
        __typename
      }

      fragment InsightsDashboardLayoutItem on InsightsDashboardLayoutItem {
        static
        moved
        w
        h
        x
        y
        i
        __typename
      }
    `;

    try {
      const response = await this.client.request<GetDashboardResponse>(query, { dashboardId });
      return response.getDashboard;
    } catch (error) {
      console.error('Error getting dashboard details:', error);
      throw error;
    }
  }
}
