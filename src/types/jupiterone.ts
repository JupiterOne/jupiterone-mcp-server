// Base JupiterOne types
export type AlertStatus = 'ACTIVE' | 'INACTIVE' | 'DISMISSED';
export type AlertLevel = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type PollingInterval =
  | 'DISABLED'
  | 'THIRTY_MINUTES'
  | 'ONE_HOUR'
  | 'FOUR_HOURS'
  | 'EIGHT_HOURS'
  | 'TWELVE_HOURS'
  | 'ONE_DAY'
  | 'ONE_WEEK';

// Query types
export interface Query {
  query: string;
  name: string;
  version?: string;
}

export interface Question {
  queries: Query[];
}

// Operation types
export interface FilterCondition {
  type: 'FILTER';
  version?: number;
  condition: any[];
}

export type Action = {
  type: string;
  targetProperty?: string;
  targetValue?: any;
  [key: string]: any;
};

export interface Operation {
  when: FilterCondition;
  actions: Action[];
}

// Alert rule instance types
export interface AlertRuleInstance {
  accountId: string;
  resourceGroupId: string | null;
  createdOn: string;
  dismissedOn: string | null;
  endReason: string | null;
  id: string;
  lastEvaluationBeginOn: string | null;
  lastEvaluationEndOn: string | null;
  lastEvaluationResult: {
    answerText: string | null;
    evaluationEndOn: string | null;
    outputs: {
      name: string;
      value: any;
      __typename: string;
    }[];
    rawDataDescriptors: {
      name: string;
      recordCount: number;
      __typename: string;
    }[];
    __typename: string;
  } | null;
  lastUpdatedOn: string;
  level: AlertLevel;
  questionRuleInstance: {
    id: string;
    name: string;
    description: string;
    tags: string[];
    pollingInterval: PollingInterval;
    labels: {
      labelName: string;
      labelValue: string;
      __typename: string;
    }[];
    __typename: string;
  } | null;
  reportRuleInstance: {
    name: string;
    description: string;
    __typename: string;
  } | null;
  ruleId: string;
  ruleVersion: string;
  status: AlertStatus;
  users: string[];
  __typename: string;
}

// Rule instance types
export interface InlineQuestionRuleInstance {
  id: string;
  resourceGroupId: string | null;
  accountId: string;
  name: string;
  description: string;
  version: string;
  lastEvaluationStartOn: string | null;
  lastEvaluationEndOn: string | null;
  evaluationStep: string | null;
  specVersion: string | null;
  notifyOnFailure: boolean | null;
  triggerActionsOnNewEntitiesOnly: boolean | null;
  ignorePreviousResults: boolean | null;
  pollingInterval: PollingInterval;
  templates: any[] | null;
  outputs: string[];
  labels: RuleInstanceLabel[] | null;
  question: EnhancedQuestion;
  questionId: string | null;
  latest: boolean | null;
  deleted: boolean | null;
  type: string | null;
  operations: RuleInstanceOperation[] | null;
  latestAlertId: string | null;
  latestAlertIsActive: boolean | null;
  state: RuleInstanceState | null;
  tags: string[] | null;
  remediationSteps: string | null;
}

export interface ReferencedQuestionRuleInstance {
  id: string;
  name: string;
  description: string;
  version: string;
  pollingInterval: PollingInterval;
  questionId?: string;
  questionName?: string;
  operations: Operation[];
  outputs: string[];
}

// API response types
export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface ListAlertInstancesResponse {
  listAlertInstances: {
    instances: AlertRuleInstance[];
    pageInfo: PageInfo;
    __typename: string;
  };
}

// Input types for mutations
export interface CreateInlineQuestionRuleInstanceInput {
  name: string;
  description: string;
  notifyOnFailure?: boolean;
  triggerActionsOnNewEntitiesOnly?: boolean;
  ignorePreviousResults?: boolean;
  operations: Operation[];
  outputs: string[];
  pollingInterval: PollingInterval;
  question: {
    queries: {
      query: string;
      name: string;
      version?: string;
      includeDeleted?: boolean;
    }[];
  };
  specVersion?: number;
  tags?: string[];
  templates?: Record<string, any>;
}

export interface UpdateInlineQuestionRuleInstanceInput
  extends CreateInlineQuestionRuleInstanceInput {
  id: string;
}

export interface CreateReferencedQuestionRuleInstanceInput {
  name: string;
  description: string;
  version: string;
  pollingInterval: PollingInterval;
  outputs: string[];
  operations: Operation[];
  questionId?: string;
  questionName?: string;
}

export interface UpdateReferencedQuestionRuleInstanceInput
  extends CreateReferencedQuestionRuleInstanceInput {
  id: string;
}

// Configuration type
export interface JupiterOneConfig {
  apiKey: string;
  accountId: string;
  baseUrl?: string;
}

// Rule instance types for the new query
export interface RuleInstanceLabel {
  labelName: string;
  labelValue: string;
}

export interface RuleInstanceOperation {
  when: FilterCondition;
  actions: Action[];
}

export interface RuleInstanceState {
  actions: Action[];
}

export interface EnhancedQuery extends Query {
  includeDeleted?: boolean;
}

export interface EnhancedQuestion {
  queries: EnhancedQuery[];
}

export interface QuestionRuleInstance {
  id: string;
  resourceGroupId: string | null;
  accountId: string;
  name: string;
  description: string;
  version: string;
  lastEvaluationStartOn: string | null;
  lastEvaluationEndOn: string | null;
  evaluationStep: string | null;
  specVersion: string | null;
  notifyOnFailure: boolean | null;
  triggerActionsOnNewEntitiesOnly: boolean | null;
  ignorePreviousResults: boolean | null;
  pollingInterval: PollingInterval | null;
  templates: any[] | null;
  outputs: string[];
  labels: RuleInstanceLabel[] | null;
  question: EnhancedQuestion;
  questionId: string | null;
  latest: boolean | null;
  deleted: boolean | null;
  type: string | null;
  operations: RuleInstanceOperation[] | null;
  latestAlertId: string | null;
  latestAlertIsActive: boolean | null;
  state: RuleInstanceState | null;
  tags: string[] | null;
  remediationSteps: string | null;
}

export interface ListRuleInstancesResponse {
  listRuleInstances: {
    questionInstances: QuestionRuleInstance[];
    pageInfo: PageInfo;
  };
}

export interface ListRuleInstancesFilters {
  // Add filter properties as needed
}

export interface Dashboard {
  id: string;
  name: string;
  userId: string;
  category: string;
  supportedUseCase: string;
  prerequisites: {
    prerequisitesMet: boolean;
    preRequisitesGroupsFulfilled: boolean;
    preRequisitesGroupsRequired: boolean;
    __typename: string;
  };
  isJ1ManagedBoard: boolean;
  resourceGroupId: string;
  starred: boolean;
  _timeUpdated: string;
  _createdAt: string;
  __typename: string;
}

export interface DashboardResponse {
  getDashboards: Dashboard[];
}

export interface CreateDashboardInput {
  name: string;
  type: string;
}

export interface CreateDashboardResponse {
  createDashboard: {
    id: string;
    __typename: string;
  };
}

export interface DashboardParameter {
  dashboardId: string;
  accountId: string;
  id: string;
  label: string;
  name: string;
  options: any;
  valueType: string;
  type: string;
  default: any;
  disableCustomInput: boolean;
  requireValue: boolean;
  __typename: string;
}

export interface DashboardWidgetQuery {
  id: string;
  name: string;
  query: string;
  __typename: string;
}

export interface DashboardWidgetConfig {
  queries: DashboardWidgetQuery[];
  settings: any;
  postQueryFilters: any;
  disableQueryPolicyFilters: boolean;
  __typename: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  type: string;
  questionId: string;
  noResultMessage: string;
  includeDeleted: boolean;
  config: DashboardWidgetConfig;
  __typename: string;
}

export interface DashboardLayoutItem {
  static: boolean;
  moved: boolean;
  w: number;
  h: number;
  x: number;
  y: number;
  i: string;
  __typename: string;
}

export interface DashboardLayout {
  xs: DashboardLayoutItem[];
  sm: DashboardLayoutItem[];
  md: DashboardLayoutItem[];
  lg: DashboardLayoutItem[];
  xl: DashboardLayoutItem[];
  __typename: string;
}

export interface DashboardDetails extends Dashboard {
  published: boolean;
  publishedToUserIds: string[];
  publishedToGroupIds: string[];
  groupIds: string[];
  userIds: string[];
  scopeFilters: any;
  parameters: DashboardParameter[];
  widgets: DashboardWidget[];
  layouts: DashboardLayout;
}

export interface GetDashboardResponse {
  getDashboard: DashboardDetails;
}

export interface IntegrationDefinition {
  id: string;
  name: string;
  type: string;
  title: string;
  displayMode: string;
  oAuth?: {
    oAuthUrlGeneratorPath: string;
  };
  offsiteUrl?: string;
  offsiteButtonTitle?: string;
  offsiteStatusQuery?: string;
  integrationType: string;
  integrationClass: string;
  integrationCategory: string;
  beta: boolean;
  docsWebLink?: string;
  repoWebLink?: string;
  invocationPaused: boolean;
  managedExecutionDisabled: boolean;
  managedCreateDisabled: boolean;
  managedDeleteDisabled: boolean;
  integrationPlatformFeatures?: {
    supportsChildInstances: boolean;
    supportsCollectors: boolean;
    supportsIngestionSourcesConfig: boolean;
    supportsAgentConfigurations: boolean;
  };
  ingestionSourcesConfig?: {
    id: string;
    title: string;
    description: string;
    defaultsToDisabled: boolean;
    childIngestionSourcesMetadata?: {
      id: string;
      name: string;
    }[];
    cannotBeDisabled: boolean;
  }[];
  ingestionSourcesOverrides?: {
    enabled: boolean;
    ingestionSourceId: string;
  }[];
  totalInstanceCount: number;
  integrationJobStatusMetrics?: {
    count: number;
    status: string;
  }[];
  icon?: string;
  provisioningType?: string;
  description?: string;
  customDefinitionType?: string;
  configFields?: ConfigField[];
  authSections?: {
    id: string;
    description: string;
    displayName: string;
    configFields: ConfigField[];
    verificationDisabled: boolean;
  }[];
  configSections?: {
    displayName: string;
    configFields: ConfigField[];
  }[];
}

export interface ConfigField {
  key: string;
  displayName: string;
  description?: string;
  type: string;
  format?: string;
  defaultValue?: any;
  helperText?: string;
  inputAdornment?: string;
  mask?: boolean;
  optional?: boolean;
  immutable?: boolean;
  readonly?: boolean;
  computed?: boolean;
  options?: {
    value: string;
    description?: string;
    label?: string;
    webLink?: string;
    default?: boolean;
  }[];
  configFields?: ConfigField[];
}

export interface IntegrationDefinitionsResponse {
  integrationDefinitions: {
    definitions: IntegrationDefinition[];
    pageInfo: {
      endCursor: string;
    };
  };
}

export interface IntegrationInstanceLite {
  id: string;
  name: string;
  accountId: string;
  sourceIntegrationInstanceId?: string;
  pollingInterval?: string;
  pollingIntervalCronExpression?: {
    hour: number;
    dayOfWeek: number;
  };
  integrationDefinitionId: string;
  description?: string;
  config: Record<string, any>;
  instanceRelationship?: string;
  resourceGroupId?: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
  mostRecentJob?: {
    status: string;
    hasSkippedSteps: boolean;
    createDate: string;
  };
}

export interface IntegrationInstancesResponse {
  integrationInstancesV2: {
    instances: IntegrationInstanceLite[];
    pageInfo: {
      endCursor: string;
    };
  };
}

export interface ListIntegrationInstancesSearchFilter {
  // Add filter properties as needed
}

export type IntegrationJobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface IntegrationJob {
  id: string;
  status: IntegrationJobStatus;
  integrationInstanceId: string;
  createDate: string;
  endDate?: string;
  hasSkippedSteps: boolean;
  integrationInstance: {
    id: string;
    name: string;
  };
  integrationDefinition: {
    id: string;
    title: string;
    integrationType: string;
  };
}

export interface IntegrationJobsResponse {
  integrationJobs: {
    jobs: IntegrationJob[];
    pageInfo: {
      endCursor: string;
    };
  };
}

export interface IntegrationEvent {
  id: string;
  name: string;
  description: string;
  createDate: string;
  jobId: string;
  level: string;
  eventCode: string;
}

export interface IntegrationEventsResponse {
  integrationEvents: {
    events: IntegrationEvent[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
}

export interface IntegrationInstanceResponse {
  integrationInstance: {
    id: string;
    name: string;
    accountId: string;
    sourceIntegrationInstanceId?: string;
    pollingInterval?: string;
    pollingIntervalCronExpression?: {
      hour: number;
      dayOfWeek: number;
    };
    integrationDefinition: {
      name: string;
      integrationType: string;
    };
    integrationDefinitionId: string;
    description?: string;
    config: Record<string, any>;
    offsiteComplete?: boolean;
    jobs: {
      jobs: IntegrationJob[];
    };
    instanceRelationship?: string;
    ingestionSourcesOverrides?: {
      ingestionSourceId: string;
      enabled: boolean;
    }[];
    collectorPoolId?: string;
    resourceGroupId?: string;
    createdOn: string;
    createdBy: string;
    updatedOn: string;
    updatedBy: string;
  };
}

export interface IntegrationJobResponse {
  integrationJob: IntegrationJob;
}

export interface RuleEvaluationOutput {
  name: string;
  value: any;
  __typename: string;
}

export interface RuleEvaluationRawDataDescriptor {
  name: string;
  persistedResultType: string;
  rawDataKey: string;
  recordCount: number;
  recordCreateCount: number;
  recordDeleteCount: number;
  recordUpdateCount: number;
  __typename: string;
}

export interface RuleEvaluation {
  accountId: string;
  collectionOwnerId: string;
  collectionOwnerVersion: string;
  collectionType: string;
  outputs: RuleEvaluationOutput[];
  rawDataDescriptors: RuleEvaluationRawDataDescriptor[];
  tag: string;
  timestamp: number;
  __typename: string;
}

export interface ListRuleEvaluationsResponse {
  listCollectionResults: {
    results: RuleEvaluation[];
    pageInfo: PageInfo;
    __typename: string;
  };
}

export interface ListRuleEvaluationsFilters {
  collectionType: 'RULE_EVALUATION';
  collectionOwnerId: string;
  beginTimestamp: number;
  endTimestamp: number;
  limit?: number;
  cursor?: string;
  tag?: string;
  [key: string]: any;
}

export interface QueryEvaluationDetails {
  name: string;
  duration: number;
  status: string;
  error: string | null;
  __typename: string;
}

export interface QueryEvaluation {
  status: string;
  queryEvaluationDetails: QueryEvaluationDetails[];
  __typename: string;
}

export interface QuestionEvaluation {
  totalDuration: number;
  queries: QueryEvaluation[];
  __typename: string;
}

export interface ConditionEvaluation {
  status: string;
  condition: string;
  __typename: string;
}

export interface ActionEvaluationDetails {
  actionId: string;
  action: string;
  status: string;
  duration: number;
  finishedOn: string;
  logs: string[];
  __typename: string;
}

export interface ActionEvaluation {
  status: string;
  actionEvaluationDetails: ActionEvaluationDetails[];
  __typename: string;
}

export interface RuleEvaluationDetails {
  accountRuleId: string;
  startedOn: string;
  question: QuestionEvaluation;
  conditions: ConditionEvaluation[];
  actions: ActionEvaluation[];
  ruleEvaluationOrigin: string;
  __typename: string;
}

export interface RuleEvaluationDetailsResponse {
  ruleEvaluationDetails: RuleEvaluationDetails;
}

export interface RuleEvaluationDetailsInput {
  ruleInstanceId: string;
  timestamp: number;
}

export interface RawDataDownloadUrlResponse {
  getRawDataDownloadUrl: string;
}
