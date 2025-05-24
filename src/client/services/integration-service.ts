import { GraphQLClient } from 'graphql-request';
import {
  IntegrationDefinitionsResponse,
  IntegrationInstancesResponse,
  IntegrationJobsResponse,
  IntegrationJobResponse,
  IntegrationEventsResponse,
  ListIntegrationInstancesSearchFilter,
  IntegrationJobStatus
} from '../../types/jupiterone.js';
import {
  GET_INTEGRATION_DEFINITIONS,
  GET_INTEGRATION_INSTANCES,
  GET_INTEGRATION_JOBS,
  GET_INTEGRATION_JOB,
  GET_INTEGRATION_EVENTS
} from '../graphql/queries.js';

export class IntegrationService {
  constructor(private client: GraphQLClient) {}

  /**
   * Get integration definitions
   * @param cursor Optional cursor for pagination
   * @param includeConfig Whether to include configuration fields
   */
  async getIntegrationDefinitions(
    cursor?: string,
    includeConfig: boolean = false
  ): Promise<IntegrationDefinitionsResponse['integrationDefinitions']> {
    try {
      const response = await this.client.request<IntegrationDefinitionsResponse>(
        GET_INTEGRATION_DEFINITIONS,
        {
          cursor,
          includeConfig,
        }
      );
      return response.integrationDefinitions;
    } catch (error) {
      console.error('Error getting integration definitions:', error);
      throw error;
    }
  }

  /**
   * Get integration instances
   * @param definitionId Optional ID to filter instances by definition
   * @param cursor Optional cursor for pagination
   * @param limit Optional limit for number of instances to return
   * @param filter Optional search filter
   */
  async getIntegrationInstances(
    definitionId?: string,
    cursor?: string,
    limit?: number,
    filter?: ListIntegrationInstancesSearchFilter
  ): Promise<IntegrationInstancesResponse['integrationInstancesV2']> {
    try {
      const response = await this.client.request<IntegrationInstancesResponse>(
        GET_INTEGRATION_INSTANCES,
        {
          definitionId,
          cursor,
          limit,
          filter,
        }
      );
      return response.integrationInstancesV2;
    } catch (error) {
      console.error('Error getting integration instances:', error);
      throw error;
    }
  }

  /**
   * Get integration jobs
   * @param status Optional status to filter jobs
   * @param integrationInstanceId Optional ID to filter jobs by instance
   * @param integrationDefinitionId Optional ID to filter jobs by definition
   * @param integrationInstanceIds Optional array of instance IDs to filter jobs
   * @param cursor Optional cursor for pagination
   * @param size Optional size limit for number of jobs to return
   */
  async getIntegrationJobs(
    status?: IntegrationJobStatus,
    integrationInstanceId?: string,
    integrationDefinitionId?: string,
    integrationInstanceIds?: string[],
    cursor?: string,
    size?: number
  ): Promise<IntegrationJobsResponse['integrationJobs']> {
    try {
      const response = await this.client.request<IntegrationJobsResponse>(
        GET_INTEGRATION_JOBS,
        {
          status,
          integrationInstanceId,
          integrationDefinitionId,
          integrationInstanceIds,
          cursor,
          size,
        }
      );
      return response.integrationJobs;
    } catch (error) {
      console.error('Error getting integration jobs:', error);
      throw error;
    }
  }

  /**
   * Get details for a specific integration job
   * @param integrationJobId ID of the job to get
   * @param integrationInstanceId ID of the instance the job belongs to
   */
  async getIntegrationJob(
    integrationJobId: string,
    integrationInstanceId: string
  ): Promise<IntegrationJobResponse['integrationJob']> {
    try {
      const response = await this.client.request<IntegrationJobResponse>(
        GET_INTEGRATION_JOB,
        {
          integrationJobId,
          integrationInstanceId,
        }
      );
      return response.integrationJob;
    } catch (error) {
      console.error('Error getting integration job:', error);
      throw error;
    }
  }

  /**
   * Get events for a specific integration job
   * @param jobId ID of the job to get events for
   * @param integrationInstanceId ID of the instance the job belongs to
   * @param cursor Optional cursor for pagination
   * @param size Optional size limit for number of events to return
   */
  async getIntegrationEvents(
    jobId: string,
    integrationInstanceId: string,
    cursor?: string,
    size?: number
  ): Promise<IntegrationEventsResponse['integrationEvents']> {
    try {
      const response = await this.client.request<IntegrationEventsResponse>(
        GET_INTEGRATION_EVENTS,
        {
          jobId,
          integrationInstanceId,
          cursor,
          size,
        }
      );
      return response.integrationEvents;
    } catch (error) {
      console.error('Error getting integration events:', error);
      throw error;
    }
  }
}