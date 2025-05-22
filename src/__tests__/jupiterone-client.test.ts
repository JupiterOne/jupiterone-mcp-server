import { JupiterOneClient } from '../client/jupiterone-client.js';
import { JupiterOneConfig } from '../types/jupiterone.js';

// Mock GraphQL client
jest.mock('graphql-request', () => ({
  GraphQLClient: jest.fn().mockImplementation(() => ({
    request: jest.fn(),
  })),
}));

describe('JupiterOneClient', () => {
  let client: JupiterOneClient;
  let mockConfig: JupiterOneConfig;

  beforeEach(() => {
    mockConfig = {
      apiKey: 'test-api-key',
      accountId: 'test-account-id',
      baseUrl: 'https://test.jupiterone.io',
    };
    client = new JupiterOneClient(mockConfig);
  });

  describe('constructor', () => {
    it('should create a client with the provided config', () => {
      expect(client).toBeInstanceOf(JupiterOneClient);
    });
  });

  describe('testConnection', () => {
    it('should return true when connection is successful', async () => {
      const mockRequest = jest.fn().mockResolvedValue({
        iamGetAccount: { accountId: 'test-account-id', accountName: 'Test Account' },
      });
      (client as any).client.request = mockRequest;

      const result = await client.testConnection();
      expect(result).toBe(true);
    });

    it('should return false when connection fails', async () => {
      const mockRequest = jest.fn().mockRejectedValue(new Error('Connection failed'));
      (client as any).client.request = mockRequest;

      const result = await client.testConnection();
      expect(result).toBe(false);
    });
  });

  describe('getAccountInfo', () => {
    it('should return account information when successful', async () => {
      const mockRequest = jest.fn().mockResolvedValue({
        iamGetAccount: { accountId: 'test-account-id', accountName: 'Test Account' },
      });
      (client as any).client.request = mockRequest;

      const result = await client.getAccountInfo();
      expect(result).toEqual({
        accountId: 'test-account-id',
        name: 'Test Account',
      });
    });

    it('should fallback to config when account query fails', async () => {
      const mockRequest = jest.fn().mockRejectedValue(new Error('Query failed'));
      (client as any).client.request = mockRequest;

      const result = await client.getAccountInfo();
      expect(result).toEqual({
        accountId: 'test-account-id',
      });
    });
  });
});
