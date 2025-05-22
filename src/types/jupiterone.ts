import { z } from 'zod';

// Base JupiterOne types
export const AlertStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'DISMISSED']);
export type AlertStatus = z.infer<typeof AlertStatusSchema>;

export const AlertLevelSchema = z.enum(['INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export type AlertLevel = z.infer<typeof AlertLevelSchema>;

export const PollingIntervalSchema = z.enum([
  'DISABLED',
  'THIRTY_MINUTES',
  'ONE_HOUR',
  'FOUR_HOURS',
  'EIGHT_HOURS',
  'TWELVE_HOURS',
  'ONE_DAY',
  'ONE_WEEK',
]);
export type PollingInterval = z.infer<typeof PollingIntervalSchema>;

// Query schema
export const QuerySchema = z.object({
  query: z.string(),
  name: z.string(),
  version: z.string().optional(),
});
export type Query = z.infer<typeof QuerySchema>;

// Question schema
export const QuestionSchema = z.object({
  queries: z.array(QuerySchema),
});
export type Question = z.infer<typeof QuestionSchema>;

// Operation schemas
export const FilterConditionSchema = z.object({
  type: z.literal('FILTER'),
  version: z.number(),
  condition: z.array(z.any()),
});

export const ActionSchema = z.union([
  z.object({
    type: z.literal('SET_PROPERTY'),
    targetProperty: z.string(),
    targetValue: z.any(),
  }),
  z.object({
    type: z.literal('CREATE_ALERT'),
  }),
]);

export const OperationSchema = z.object({
  when: FilterConditionSchema,
  actions: z.array(ActionSchema),
});
export type Operation = z.infer<typeof OperationSchema>;

// Alert rule instance schemas
export const AlertRuleInstanceSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  ruleId: z.string(),
  level: AlertLevelSchema,
  status: AlertStatusSchema,
  lastUpdatedOn: z.string(),
  lastEvaluationBeginOn: z.string().optional(),
  lastEvaluationEndOn: z.string().optional(),
  createdOn: z.string(),
  dismissedOn: z.string().optional(),
  lastEvaluationResult: z
    .object({
      rawDataDescriptors: z.array(
        z.object({
          recordCount: z.number(),
        })
      ),
    })
    .optional(),
  questionRuleInstance: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      question: QuestionSchema,
    })
    .optional(),
});
export type AlertRuleInstance = z.infer<typeof AlertRuleInstanceSchema>;

// Rule instance schemas
export const InlineQuestionRuleInstanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  pollingInterval: PollingIntervalSchema,
  question: QuestionSchema,
  operations: z.array(OperationSchema),
  outputs: z.array(z.string()),
});
export type InlineQuestionRuleInstance = z.infer<typeof InlineQuestionRuleInstanceSchema>;

export const ReferencedQuestionRuleInstanceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  pollingInterval: PollingIntervalSchema,
  questionId: z.string().optional(),
  questionName: z.string().optional(),
  operations: z.array(OperationSchema),
  outputs: z.array(z.string()),
});
export type ReferencedQuestionRuleInstance = z.infer<typeof ReferencedQuestionRuleInstanceSchema>;

// API response schemas
export const PageInfoSchema = z.object({
  endCursor: z.string().nullable(),
  hasNextPage: z.boolean(),
});

export const ListAlertInstancesResponseSchema = z.object({
  listAlertInstances: z.object({
    instances: z.array(AlertRuleInstanceSchema),
    pageInfo: PageInfoSchema,
  }),
});
export type ListAlertInstancesResponse = z.infer<typeof ListAlertInstancesResponseSchema>;

// Input schemas for mutations
export const CreateInlineQuestionRuleInstanceInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  pollingInterval: PollingIntervalSchema,
  outputs: z.array(z.string()),
  operations: z.array(OperationSchema),
  question: QuestionSchema,
});
export type CreateInlineQuestionRuleInstanceInput = z.infer<
  typeof CreateInlineQuestionRuleInstanceInputSchema
>;

export const UpdateInlineQuestionRuleInstanceInputSchema =
  CreateInlineQuestionRuleInstanceInputSchema.extend({
    id: z.string(),
  });
export type UpdateInlineQuestionRuleInstanceInput = z.infer<
  typeof UpdateInlineQuestionRuleInstanceInputSchema
>;

export const CreateReferencedQuestionRuleInstanceInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  pollingInterval: PollingIntervalSchema,
  outputs: z.array(z.string()),
  operations: z.array(OperationSchema),
  questionId: z.string().optional(),
  questionName: z.string().optional(),
});
export type CreateReferencedQuestionRuleInstanceInput = z.infer<
  typeof CreateReferencedQuestionRuleInstanceInputSchema
>;

export const UpdateReferencedQuestionRuleInstanceInputSchema =
  CreateReferencedQuestionRuleInstanceInputSchema.extend({
    id: z.string(),
  });
export type UpdateReferencedQuestionRuleInstanceInput = z.infer<
  typeof UpdateReferencedQuestionRuleInstanceInputSchema
>;

// Configuration schema
export const JupiterOneConfigSchema = z.object({
  apiKey: z.string(),
  accountId: z.string(),
  baseUrl: z.string().default('https://graphql.us.jupiterone.io'),
});
export type JupiterOneConfig = z.infer<typeof JupiterOneConfigSchema>;

// Rule instance label schema
export const RuleInstanceLabelSchema = z.object({
  labelName: z.string(),
  labelValue: z.string(),
});
export type RuleInstanceLabel = z.infer<typeof RuleInstanceLabelSchema>;

// Rule instance operation schema for the new query
export const RuleInstanceOperationSchema = z.object({
  when: z.any(),
  actions: z.any(),
});

// Rule instance state schema
export const RuleInstanceStateSchema = z.object({
  actions: z.any(),
});

// Enhanced Query schema with includeDeleted
export const EnhancedQuerySchema = z.object({
  query: z.string(),
  name: z.string(),
  version: z.string(),
  includeDeleted: z.boolean().optional(),
});

// Enhanced Question schema
export const EnhancedQuestionSchema = z.object({
  queries: z.array(EnhancedQuerySchema),
});

// Full rule instance schema based on the RuleInstanceFields fragment
export const QuestionRuleInstanceSchema = z.object({
  id: z.string(),
  resourceGroupId: z.string().optional(),
  accountId: z.string(),
  name: z.string(),
  description: z.string(),
  version: z.string(),
  lastEvaluationStartOn: z.string().nullable(),
  lastEvaluationEndOn: z.string().nullable(),
  evaluationStep: z.string().nullable(),
  specVersion: z.string().optional(),
  notifyOnFailure: z.boolean().optional(),
  triggerActionsOnNewEntitiesOnly: z.boolean().optional(),
  ignorePreviousResults: z.boolean().optional(),
  pollingInterval: PollingIntervalSchema,
  templates: z.array(z.any()).optional(),
  outputs: z.array(z.string()),
  labels: z.array(RuleInstanceLabelSchema).optional(),
  question: EnhancedQuestionSchema,
  questionId: z.string().optional(),
  latest: z.boolean().optional(),
  deleted: z.boolean().optional(),
  type: z.string().optional(),
  operations: z.array(RuleInstanceOperationSchema).optional(),
  latestAlertId: z.string().nullable(),
  latestAlertIsActive: z.boolean().optional(),
  state: RuleInstanceStateSchema.optional(),
  tags: z.array(z.string()).optional(),
  remediationSteps: z.string().optional(),
});
export type QuestionRuleInstance = z.infer<typeof QuestionRuleInstanceSchema>;

// List rule instances response schema
export const ListRuleInstancesResponseSchema = z.object({
  listRuleInstances: z.object({
    questionInstances: z.array(QuestionRuleInstanceSchema),
    pageInfo: PageInfoSchema,
  }),
});
export type ListRuleInstancesResponse = z.infer<typeof ListRuleInstancesResponseSchema>;

// List rule instances filters (for future use)
export const ListRuleInstancesFiltersSchema = z.object({
  // Add filter properties as needed
}).optional();
export type ListRuleInstancesFilters = z.infer<typeof ListRuleInstancesFiltersSchema>;
