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
  version: number;
  condition: any[];
}

export type Action =
  | {
      type: 'SET_PROPERTY';
      targetProperty: string;
      targetValue: any;
    }
  | {
      type: 'CREATE_ALERT';
    };

export interface Operation {
  when: FilterCondition;
  actions: Action[];
}

// Alert rule instance types
export interface AlertRuleInstance {
  id: string;
  accountId: string;
  ruleId: string;
  level: AlertLevel;
  status: AlertStatus;
  lastUpdatedOn: string;
  lastEvaluationBeginOn?: string;
  lastEvaluationEndOn?: string;
  createdOn: string;
  dismissedOn?: string;
  lastEvaluationResult?: {
    rawDataDescriptors: {
      recordCount: number;
    }[];
  };
  questionRuleInstance?: {
    id: string;
    name: string;
    description: string;
    question: Question;
  };
}

// Rule instance types
export interface InlineQuestionRuleInstance {
  id: string;
  name: string;
  description: string;
  version: string;
  pollingInterval: PollingInterval;
  question: Question;
  operations: Operation[];
  outputs: string[];
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
  };
}

// Input types for mutations
export interface CreateInlineQuestionRuleInstanceInput {
  name: string;
  description: string;
  version: string;
  pollingInterval: PollingInterval;
  outputs: string[];
  operations: Operation[];
  question: Question;
}

export interface UpdateInlineQuestionRuleInstanceInput extends CreateInlineQuestionRuleInstanceInput {
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

export interface UpdateReferencedQuestionRuleInstanceInput extends CreateReferencedQuestionRuleInstanceInput {
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
