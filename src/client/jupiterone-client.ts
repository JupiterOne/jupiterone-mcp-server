import { GraphQLClient } from 'graphql-request';
import { JupiterOneConfig } from '../types/jupiterone.js';
import { AlertService } from './services/alert-service.js';
import { RuleService } from './services/rule-service.js';
import { DashboardService } from './services/dashboard-service.js';
import { AccountService } from './services/account-service.js';

export class JupiterOneClient {
  private client: GraphQLClient;
  private alertService: AlertService;
  private ruleService: RuleService;
  private dashboardService: DashboardService;
  private accountService: AccountService;

  constructor(config: JupiterOneConfig) {
    this.client = new GraphQLClient(config.baseUrl || 'https://graphql.us.jupiterone.io', {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'LifeOmic-Account': config.accountId,
      },
    });

    this.alertService = new AlertService(this.client);
    this.ruleService = new RuleService(this.client);
    this.dashboardService = new DashboardService(this.client);
    this.accountService = new AccountService(this.client);
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

  async createInlineQuestionRuleInstance(...args: Parameters<RuleService['createInlineQuestionRuleInstance']>) {
    return this.ruleService.createInlineQuestionRuleInstance(...args);
  }

  async updateInlineQuestionRuleInstance(...args: Parameters<RuleService['updateInlineQuestionRuleInstance']>) {
    return this.ruleService.updateInlineQuestionRuleInstance(...args);
  }

  async createReferencedQuestionRuleInstance(...args: Parameters<RuleService['createReferencedQuestionRuleInstance']>) {
    return this.ruleService.createReferencedQuestionRuleInstance(...args);
  }

  async updateReferencedQuestionRuleInstance(...args: Parameters<RuleService['updateReferencedQuestionRuleInstance']>) {
    return this.ruleService.updateReferencedQuestionRuleInstance(...args);
  }

  async deleteRuleInstance(...args: Parameters<RuleService['deleteRuleInstance']>) {
    return this.ruleService.deleteRuleInstance(...args);
  }

  async evaluateRuleInstance(...args: Parameters<RuleService['evaluateRuleInstance']>) {
    return this.ruleService.evaluateRuleInstance(...args);
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

  // Account methods
  async getAccountInfo() {
    return this.accountService.getAccountInfo();
  }

  async testConnection() {
    return this.accountService.testConnection();
  }
}
