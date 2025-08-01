import { GraphQLClient } from 'graphql-request';
import type { JupiterOneConfig } from '../types/jupiterone.js';
import { AlertService } from './services/alert-service.js';
import { RuleService } from './services/rule-service.js';
import { DashboardService } from './services/dashboard-service.js';
import { AccountService } from './services/account-service.js';
import { IntegrationService } from './services/integration-service.js';
import { J1qlService } from './services/j1ql-service.js';
import { version } from '../../package.json';

export class JupiterOneClient {
  private client: GraphQLClient;
  private config: JupiterOneConfig;
  private alertService: AlertService;
  public ruleService: RuleService;
  public dashboardService: DashboardService;
  private accountService: AccountService;
  private integrationService: IntegrationService;
  public j1qlService: J1qlService;

  constructor(config: JupiterOneConfig) {
    this.config = config;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${config.oauthToken || config.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': `jupiterone-mcp/${version}`,
    };
    if (config.accountId) {
      headers['LifeOmic-Account'] = config.accountId;
    }
    this.client = new GraphQLClient(config.baseUrl || 'https://graphql.us.jupiterone.io', {
      headers,
    });

    this.alertService = new AlertService(this.client);
    this.ruleService = new RuleService(this.client);
    this.dashboardService = new DashboardService(this.client);
    this.accountService = new AccountService(this.client);
    this.integrationService = new IntegrationService(this.client);
    this.j1qlService = new J1qlService(this.client);
  }

  public cloneWithAccountId(accountId: string): JupiterOneClient {
    const newConfig = { ...this.config, accountId };
    return new JupiterOneClient(newConfig);
  }

  // Alert methods
  async listAlertInstances(...args: Parameters<AlertService['listAlertInstances']>) {
    return this.alertService.listAlertInstances(...args);
  }

  async getAllAlertInstances(...args: Parameters<AlertService['getAllAlertInstances']>) {
    return this.alertService.getAllAlertInstances(...args);
  }

  // Rule methods
  async listRuleInstances(...args: Parameters<RuleService['listRuleInstances']>) {
    return this.ruleService.listRuleInstances(...args);
  }

  async getAllRuleInstances(...args: Parameters<RuleService['getAllRuleInstances']>) {
    return this.ruleService.getAllRuleInstances(...args);
  }

  async createInlineQuestionRuleInstance(
    ...args: Parameters<RuleService['createInlineQuestionRuleInstance']>
  ) {
    return this.ruleService.createInlineQuestionRuleInstance(...args);
  }

  async updateInlineQuestionRuleInstance(
    ...args: Parameters<RuleService['updateInlineQuestionRuleInstance']>
  ) {
    return this.ruleService.updateInlineQuestionRuleInstance(...args);
  }

  async createReferencedQuestionRuleInstance(
    ...args: Parameters<RuleService['createReferencedQuestionRuleInstance']>
  ) {
    return this.ruleService.createReferencedQuestionRuleInstance(...args);
  }

  async updateReferencedQuestionRuleInstance(
    ...args: Parameters<RuleService['updateReferencedQuestionRuleInstance']>
  ) {
    return this.ruleService.updateReferencedQuestionRuleInstance(...args);
  }

  async deleteRuleInstance(...args: Parameters<RuleService['deleteRuleInstance']>) {
    return this.ruleService.deleteRuleInstance(...args);
  }

  async evaluateRuleInstance(...args: Parameters<RuleService['evaluateRuleInstance']>) {
    return this.ruleService.evaluateRuleInstance(...args);
  }

  async listRuleEvaluations(...args: Parameters<RuleService['listRuleEvaluations']>) {
    return this.ruleService.listRuleEvaluations(...args);
  }

  async getAllRuleEvaluations(...args: Parameters<RuleService['getAllRuleEvaluations']>) {
    return this.ruleService.getAllRuleEvaluations(...args);
  }

  async getRuleEvaluationDetails(...args: Parameters<RuleService['getRuleEvaluationDetails']>) {
    return this.ruleService.getRuleEvaluationDetails(...args);
  }

  async getRawDataDownloadUrl(...args: Parameters<RuleService['getRawDataDownloadUrl']>) {
    return this.ruleService.getRawDataDownloadUrl(...args);
  }

  async getRawDataResults(...args: Parameters<RuleService['getRawDataResults']>) {
    return this.ruleService.getRawDataResults(...args);
  }

  // Dashboard methods
  async getDashboards() {
    return this.dashboardService.getDashboards();
  }

  async createDashboard(...args: Parameters<DashboardService['createDashboard']>) {
    return this.dashboardService.createDashboard(...args);
  }

  async getDashboard(...args: Parameters<DashboardService['getDashboard']>) {
    return this.dashboardService.getDashboard(...args);
  }

  async createDashboardWidget(...args: Parameters<DashboardService['createDashboardWidget']>) {
    return this.dashboardService.createDashboardWidget(...args);
  }

  async updateDashboard(...args: Parameters<DashboardService['updateDashboard']>) {
    return this.dashboardService.updateDashboard(...args);
  }

  // Account methods
  async getAccountInfo() {
    return this.accountService.getAccountInfo();
  }

  async testConnection() {
    return this.accountService.testConnection();
  }

  // Integration methods
  async getIntegrationDefinitions(
    ...args: Parameters<IntegrationService['getIntegrationDefinitions']>
  ) {
    return this.integrationService.getIntegrationDefinitions(...args);
  }

  async getIntegrationInstances(
    ...args: Parameters<IntegrationService['getIntegrationInstances']>
  ) {
    return this.integrationService.getIntegrationInstances(...args);
  }

  async getIntegrationJobs(...args: Parameters<IntegrationService['getIntegrationJobs']>) {
    return this.integrationService.getIntegrationJobs(...args);
  }

  /**
   * Get details for a specific integration job
   * @param integrationJobId ID of the job to get
   * @param integrationInstanceId ID of the instance the job belongs to
   */
  async getIntegrationJob(integrationJobId: string, integrationInstanceId: string) {
    return this.integrationService.getIntegrationJob(integrationJobId, integrationInstanceId);
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
  ) {
    return this.integrationService.getIntegrationEvents(jobId, integrationInstanceId, cursor, size);
  }

  // J1QL methods
  async createJ1qlFromNaturalLanguage(
    ...args: Parameters<J1qlService['createJ1qlFromNaturalLanguage']>
  ) {
    return this.j1qlService.createJ1qlFromNaturalLanguage(...args);
  }

  async executeJ1qlQuery(...args: Parameters<J1qlService['executeJ1qlQuery']>) {
    return this.j1qlService.executeJ1qlQuery(...args);
  }

  async listEntityTypes() {
    return this.j1qlService.listEntityTypes();
  }

  async listEntityProperties(entityType: string) {
    return this.j1qlService.listEntityProperties(entityType);
  }
}
