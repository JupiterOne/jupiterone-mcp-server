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
      // Poll the URL until results are ready
      const maxAttempts = 60; // 60 attempts = 1 minute max wait
      const pollInterval = 1000; // 1 second between polls
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const fetchResponse = await fetch(response.queryV2.url);
        if (!fetchResponse.ok) {
          throw new Error(`Failed to fetch query results: ${fetchResponse.statusText}`);
        }
        
        const result = await fetchResponse.json();
        
        // Check if the query is complete
        if (result.status === 'COMPLETE' || result.status === 'FAILED') {
          if (result.status === 'FAILED') {
            throw new Error(result.error || 'Query execution failed');
          }
          return result;
        }
        
        // If still in progress, wait before next poll
        if (result.status === 'IN_PROGRESS') {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          continue;
        }
        
        // If we get an unexpected status, return the result as-is
        return result;
      }
      
      throw new Error('Query timed out after 60 seconds');
    }
    
    return response.queryV2;
  }
}