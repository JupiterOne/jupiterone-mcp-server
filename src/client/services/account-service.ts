import { GraphQLClient } from 'graphql-request';
import { GET_ACCOUNT_INFO } from '../graphql/queries.js';

export class AccountService {
  constructor(private client: GraphQLClient) {}

  /**
   * Get account information
   */
  async getAccountInfo(): Promise<{ accountId: string; name?: string }> {
    try {
      const response = await this.client.request<{
        iamGetAccount: { accountId: string; accountName?: string };
      }>(GET_ACCOUNT_INFO);
      return {
        accountId: response.iamGetAccount.accountId,
        name: response.iamGetAccount.accountName,
      };
    } catch (error) {
      console.error('Error getting account info', error);
      throw error;
    }
  }

  /**
   * Test the connection to JupiterOne
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.client.request(GET_ACCOUNT_INFO);
      return true;
    } catch (error) {
      console.error('Error testing connection to JupiterOne', error);
      return false;
    }
  }
}