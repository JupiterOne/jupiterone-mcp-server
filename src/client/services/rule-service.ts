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
} from '../../types/jupiterone.js';
import {
  LIST_RULE_INSTANCES,
} from '../graphql/queries.js';
import {
  CREATE_INLINE_QUESTION_RULE,
  UPDATE_INLINE_QUESTION_RULE,
  CREATE_REFERENCED_QUESTION_RULE,
  UPDATE_REFERENCED_QUESTION_RULE,
  DELETE_RULE,
  EVALUATE_RULE,
} from '../graphql/mutations.js';

export class RuleService {
  constructor(private client: GraphQLClient) {}

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
}