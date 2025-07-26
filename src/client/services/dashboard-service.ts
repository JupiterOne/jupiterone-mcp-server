import { GraphQLClient } from 'graphql-request';
import {
  Dashboard,
  DashboardResponse,
  CreateDashboardInput,
  CreateDashboardResponse,
  GetDashboardResponse,
} from '../../types/jupiterone.js';
import { GET_DASHBOARDS, GET_DASHBOARD_DETAILS } from '../graphql/queries.js';
import {
  CREATE_DASHBOARD,
  CREATE_DASHBOARD_WIDGET,
  PATCH_DASHBOARD,
} from '../graphql/mutations.js';

export class DashboardService {
  constructor(private client: GraphQLClient) {}

  /**
   * Construct dashboard URL based on subdomain
   */
  constructDashboardUrl(dashboardId: string, subdomain?: string): string {
    // Default to 'j1' if no subdomain provided
    const accountSubdomain = subdomain || 'j1';
    return `https://${accountSubdomain}.apps.us.jupiterone.io/insights/dashboards/${dashboardId}`;
  }

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

  /**
   * Create a new dashboard widget
   */
  async createDashboardWidget(dashboardId: string, input: any): Promise<any> {
    try {
      const response = await this.client.request<any>(CREATE_DASHBOARD_WIDGET, {
        dashboardId,
        input,
      });
      return response.createWidget;
    } catch (error) {
      console.error('Error creating dashboard widget:', error);
      throw error;
    }
  }

  async updateDashboard(input: {
    dashboardId: string;
    layouts: {
      xs?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
      sm?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
      md?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
      lg?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
      xl?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
    };
  }): Promise<any> {
    return this.patchDashboard(input);
  }

  async patchDashboard(input: {
    dashboardId: string;
    layouts: {
      xs?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
      sm?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
      md?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
      lg?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
      xl?: Array<{
        w: number;
        h: number;
        x: number;
        y: number;
        i: string;
        moved: boolean;
        static: boolean;
      }>;
    };
  }): Promise<any> {
    return this.client.request(PATCH_DASHBOARD, { input });
  }
}
