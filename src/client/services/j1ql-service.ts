import { GraphQLClient } from 'graphql-request';
import { CreateJ1qlFromNaturalLanguageResponse } from '../../types/jupiterone.js';
import { CREATE_J1QL_FROM_NATURAL_LANGUAGE } from '../graphql/mutations.js';

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
}