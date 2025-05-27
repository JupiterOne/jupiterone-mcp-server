import { GraphQLClient } from 'graphql-request';
import { AlertStatus, ListAlertInstancesResponse, AlertRuleInstance } from '../../types/jupiterone.js';
import { LIST_ALERT_INSTANCES } from '../graphql/queries.js';

export class AlertService {
  constructor(private client: GraphQLClient) {}

  /**
   * List alert instances with optional filtering
   */
  async listAlertInstances(
    alertStatus?: AlertStatus,
    limit?: number,
    cursor?: string
  ): Promise<ListAlertInstancesResponse['listAlertInstances']> {
    const variables: any = {};
    if (alertStatus) variables.alertStatus = alertStatus;
    if (limit) variables.limit = limit;
    if (cursor) variables.cursor = cursor;

    try {
      const response = await this.client.request<{ listAlertInstances: ListAlertInstancesResponse['listAlertInstances'] }>(
        LIST_ALERT_INSTANCES,
        variables
      );

      if (!response?.listAlertInstances) {
        throw new Error('Invalid response structure from JupiterOne API');
      }

      return response.listAlertInstances;
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
  ): Promise<AlertRuleInstance[]> {
    const allInstances: AlertRuleInstance[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    try {
      while (hasNextPage) {
        const response = await this.listAlertInstances(alertStatus, 100, cursor || undefined);

        if (!response?.instances) {
          console.error('Unexpected response structure:', response);
          break;
        }

        allInstances.push(...response.instances);

        cursor = response.pageInfo.endCursor;
        hasNextPage = response.pageInfo.hasNextPage;
      }

      return allInstances;
    } catch (error) {
      console.error('Error in getAllAlertInstances:', error);
      throw error;
    }
  }
}