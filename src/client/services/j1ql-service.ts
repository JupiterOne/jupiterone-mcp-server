import { GraphQLClient } from 'graphql-request';
import { CreateJ1qlFromNaturalLanguageResponse } from '../../types/jupiterone.js';
import { CREATE_J1QL_FROM_NATURAL_LANGUAGE } from '../graphql/mutations.js';
import { QUERY_V2 } from '../graphql/queries.js';

export class J1qlService {
  constructor(private client: GraphQLClient) {}

  /**
   * Convert natural language to J1QL query
   */
  async createJ1qlFromNaturalLanguage(
    naturalLanguage: string
  ): Promise<CreateJ1qlFromNaturalLanguageResponse['createJ1qlFromNaturalLanguage']> {
    const response = await this.client.request<CreateJ1qlFromNaturalLanguageResponse>(
      CREATE_J1QL_FROM_NATURAL_LANGUAGE,
      { naturalLanguage }
    );
    return response.createJ1qlFromNaturalLanguage;
  }

  /**
   * Execute a J1QL query
   */
  async executeJ1qlQuery({
    query,
    variables,
    cursor,
    scopeFilters,
    flags,
  }: {
    query: string;
    variables?: Record<string, any>;
    cursor?: string;
    scopeFilters?: Record<string, any>[];
    flags?: Record<string, any>;
  }): Promise<any> {
    // Use queryV2 for better error messages
    const response: any = await this.client.request(
      QUERY_V2,
      {
        query,
        variables,
        cursor,
        scopeFilters,
        includeDeleted: flags?.includeDeleted,
        returnRowMetadata: flags?.returnRowMeta,
        returnComputedProperties: flags?.computedProperties,
      }
    );
    
    // Handle deferred response
    if (response.queryV2.type === 'deferred' && response.queryV2.url) {
      // Fetch the actual results from the URL
      const fetchResponse = await fetch(response.queryV2.url);
      if (!fetchResponse.ok) {
        throw new Error(`Failed to fetch query results: ${fetchResponse.statusText}`);
      }
      return await fetchResponse.json();
    }
    
    return response.queryV2;
  }
}