import { GraphQLClient } from 'graphql-request';
import {
  Dashboard,
  DashboardResponse,
  CreateDashboardInput,
  CreateDashboardResponse,
  GetDashboardResponse,
} from '../../types/jupiterone.js';
import { GET_DASHBOARDS, GET_DASHBOARD_DETAILS } from '../graphql/queries.js';
import { CREATE_DASHBOARD } from '../graphql/mutations.js';

export class DashboardService {
  constructor(private client: GraphQLClient) {}

  /**
   * Get all dashboards
   */
  async getDashboards(): Promise<Dashboard[]> {
    try {
      const response = await this.client.request<DashboardResponse>(GET_DASHBOARDS);
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
    try {
      const response = await this.client.request<CreateDashboardResponse>(CREATE_DASHBOARD, {
        input,
      });
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
    try {
      const response = await this.client.request<GetDashboardResponse>(GET_DASHBOARD_DETAILS, {
        dashboardId,
      });
      return response.getDashboard;
    } catch (error) {
      console.error('Error getting dashboard details:', error);
      throw error;
    }
  }
}