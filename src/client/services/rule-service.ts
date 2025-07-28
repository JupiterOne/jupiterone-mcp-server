import { GraphQLClient } from 'graphql-request';
import {
  ListRuleInstancesResponse,
  ListRuleInstancesFilters,
  QuestionRuleInstance,
  InlineQuestionRuleInstance,
  ReferencedQuestionRuleInstance,
  CreateInlineQuestionRuleInstanceInput,
  UpdateInlineQuestionRuleInstanceInput,
  CreateReferencedQuestionRuleInstanceInput,
  UpdateReferencedQuestionRuleInstanceInput,
  ListRuleEvaluationsResponse,
  ListRuleEvaluationsFilters,
  RuleEvaluation,
  RuleEvaluationDetailsResponse,
  RuleEvaluationDetailsInput,
} from '../../types/jupiterone.js';
import {
  LIST_RULE_INSTANCES,
  LIST_RULE_EVALUATIONS,
  GET_RULE_EVALUATION_DETAILS,
  GET_RAW_DATA_DOWNLOAD_URL,
} from '../graphql/queries.js';
import {
  CREATE_INLINE_QUESTION_RULE,
  UPDATE_INLINE_QUESTION_RULE,
  CREATE_REFERENCED_QUESTION_RULE,
  UPDATE_REFERENCED_QUESTION_RULE,
  DELETE_RULE,
  EVALUATE_RULE,
} from '../graphql/mutations.js';
import { getEnv } from '../../utils/getEnv.js';

export class RuleService {
  constructor(private client: GraphQLClient) {}

  /**
   * Construct rule URL based on subdomain
   */
  constructRuleUrl(ruleId: string, subdomain?: string): string {
    // Default to 'j1' if no subdomain provided
    const accountSubdomain = subdomain || 'j1';
    return `https://${accountSubdomain}.apps.${getEnv()}.jupiterone.io/alerts/rules/${ruleId}`;
  }

  /**
   * List rule instances using the new GraphQL query
   */
  async listRuleInstances(
    limit?: number,
    cursor?: string,
    filters?: ListRuleInstancesFilters
  ): Promise<ListRuleInstancesResponse['listRuleInstances']> {
    const variables: any = {};
    if (limit) variables.limit = limit;
    if (cursor) variables.cursor = cursor;
    if (filters) variables.filters = filters;

    const response = await this.client.request<{
      listRuleInstances: ListRuleInstancesResponse['listRuleInstances'];
    }>(LIST_RULE_INSTANCES, variables);
    return response.listRuleInstances;
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
      if (!response?.questionInstances) {
        console.error('Unexpected response structure:', response);
        break;
      }
      allInstances.push(...response.questionInstances);

      cursor = response.pageInfo.endCursor;
      hasNextPage = response.pageInfo.hasNextPage;
    }

    return allInstances;
  }

  /**
   * Create an inline question rule instance
   */
  async createInlineQuestionRuleInstance(
    instance: CreateInlineQuestionRuleInstanceInput
  ): Promise<InlineQuestionRuleInstance> {
    const response = await this.client.request<{
      createInlineQuestionRuleInstance: InlineQuestionRuleInstance;
    }>(CREATE_INLINE_QUESTION_RULE, { instance });
    return response.createInlineQuestionRuleInstance;
  }

  /**
   * Update an inline question rule instance
   */
  async updateInlineQuestionRuleInstance(
    instance: UpdateInlineQuestionRuleInstanceInput
  ): Promise<InlineQuestionRuleInstance> {
    const response = await this.client.request<{
      updateInlineQuestionRuleInstance: InlineQuestionRuleInstance;
    }>(UPDATE_INLINE_QUESTION_RULE, { instance });
    return response.updateInlineQuestionRuleInstance;
  }

  /**
   * Create a referenced question rule instance
   */
  async createReferencedQuestionRuleInstance(
    instance: CreateReferencedQuestionRuleInstanceInput
  ): Promise<ReferencedQuestionRuleInstance> {
    const response = await this.client.request<{
      createReferencedQuestionRuleInstance: ReferencedQuestionRuleInstance;
    }>(CREATE_REFERENCED_QUESTION_RULE, { instance });
    return response.createReferencedQuestionRuleInstance;
  }

  /**
   * Update a referenced question rule instance
   */
  async updateReferencedQuestionRuleInstance(
    instance: UpdateReferencedQuestionRuleInstanceInput
  ): Promise<ReferencedQuestionRuleInstance> {
    const response = await this.client.request<{
      updateReferencedQuestionRuleInstance: ReferencedQuestionRuleInstance;
    }>(UPDATE_REFERENCED_QUESTION_RULE, { instance });
    return response.updateReferencedQuestionRuleInstance;
  }

  /**
   * Delete a rule instance
   */
  async deleteRuleInstance(id: string): Promise<{ id: string }> {
    const response = await this.client.request<{ deleteRuleInstance: { id: string } }>(
      DELETE_RULE,
      { id }
    );
    return response.deleteRuleInstance;
  }

  /**
   * Trigger an alert rule on demand
   */
  async evaluateRuleInstance(id: string): Promise<{ id: string; __typename: string }> {
    const response = await this.client.request<{
      evaluateRuleInstance: { id: string; __typename: string };
    }>(EVALUATE_RULE, { id });
    return response.evaluateRuleInstance;
  }

  /**
   * List rule evaluations for a specific rule instance
   */
  async listRuleEvaluations(
    filters: ListRuleEvaluationsFilters
  ): Promise<ListRuleEvaluationsResponse['listCollectionResults']> {
    const response = await this.client.request<{
      listCollectionResults: ListRuleEvaluationsResponse['listCollectionResults'];
    }>(LIST_RULE_EVALUATIONS, filters);
    return response.listCollectionResults;
  }

  /**
   * Get all rule evaluations for a specific rule instance by paginating through all pages
   */
  async getAllRuleEvaluations(
    filters: Omit<ListRuleEvaluationsFilters, 'cursor'>
  ): Promise<RuleEvaluation[]> {
    const allEvaluations: RuleEvaluation[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const response = await this.listRuleEvaluations({
        collectionType: filters.collectionType,
        collectionOwnerId: filters.collectionOwnerId,
        beginTimestamp: filters.beginTimestamp,
        endTimestamp: filters.endTimestamp,
        limit: filters.limit,
        tag: filters.tag,
        cursor: cursor || undefined,
      });
      if (!response?.results) {
        console.error('Unexpected response structure:', response);
        break;
      }
      allEvaluations.push(...response.results);

      cursor = response.pageInfo.endCursor;
      hasNextPage = response.pageInfo.hasNextPage;
    }

    return allEvaluations;
  }

  /**
   * Get detailed information about a specific rule evaluation
   */
  async getRuleEvaluationDetails(
    input: RuleEvaluationDetailsInput
  ): Promise<RuleEvaluationDetailsResponse['ruleEvaluationDetails']> {
    const response = await this.client.request<{
      ruleEvaluationDetails: RuleEvaluationDetailsResponse['ruleEvaluationDetails'];
    }>(GET_RULE_EVALUATION_DETAILS, { ruleEvaluationDetailsInput: input });
    return response.ruleEvaluationDetails;
  }

  /**
   * Get a download URL for raw data associated with a rule evaluation
   */
  async getRawDataDownloadUrl(rawDataKey: string): Promise<string> {
    const response = await this.client.request<{ getRawDataDownloadUrl: string }>(
      GET_RAW_DATA_DOWNLOAD_URL,
      { rawDataKey }
    );
    return response.getRawDataDownloadUrl;
  }

  async getRawDataResults(rawDataKey: string): Promise<any> {
    const downloadUrl = await this.getRawDataDownloadUrl(rawDataKey);
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch query results: ${response.statusText}`);
    }
    return response.json();
  }
}
