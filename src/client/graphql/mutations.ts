export const CREATE_INLINE_QUESTION_RULE = `
  mutation createInlineQuestionRuleInstance($instance: CreateInlineQuestionRuleInstanceInput!) {
    createInlineQuestionRuleInstance(instance: $instance) {
      ...RuleInstanceFields
      __typename
    }
  }

  fragment RuleInstanceFields on QuestionRuleInstance {
    id
    resourceGroupId
    accountId
    name
    description
    version
    lastEvaluationStartOn
    lastEvaluationEndOn
    evaluationStep
    specVersion
    notifyOnFailure
    triggerActionsOnNewEntitiesOnly
    ignorePreviousResults
    pollingInterval
    templates
    outputs
    labels {
      labelName
      labelValue
      __typename
    }
    question {
      queries {
        query
        name
        includeDeleted
        __typename
      }
      __typename
    }
    questionId
    latest
    deleted
    type
    operations {
      when
      actions
      __typename
    }
    latestAlertId
    latestAlertIsActive
    state {
      actions
      __typename
    }
    tags
    remediationSteps
    __typename
  }
`;

export const UPDATE_INLINE_QUESTION_RULE = `
  mutation UpdateInlineQuestionRuleInstance(
    $instance: UpdateInlineQuestionRuleInstanceInput!
  ) {
    updateInlineQuestionRuleInstance(instance: $instance) {
      id
      name
      description
      version
      pollingInterval
      question {
        queries {
          query
          name
          version
        }
      }
      operations {
        when {
          type
          version
          condition
        }
        actions {
          type
          ... on SetPropertyAction {
            targetProperty
            targetValue
          }
        }
      }
      outputs
    }
  }
`;

export const CREATE_REFERENCED_QUESTION_RULE = `
  mutation CreateReferencedQuestionRuleInstance(
    $instance: CreateReferencedQuestionRuleInstanceInput!
  ) {
    createReferencedQuestionRuleInstance(instance: $instance) {
      id
      name
      description
      version
      pollingInterval
      questionId
      questionName
      operations {
        when {
          type
          version
          condition
        }
        actions {
          type
          ... on SetPropertyAction {
            targetProperty
            targetValue
          }
        }
      }
      outputs
    }
  }
`;

export const UPDATE_REFERENCED_QUESTION_RULE = `
  mutation UpdateReferencedQuestionRuleInstance(
    $instance: UpdateReferencedQuestionRuleInstanceInput!
  ) {
    updateReferencedQuestionRuleInstance(instance: $instance) {
      id
      name
      description
      version
      pollingInterval
      questionId
      questionName
      operations {
        when {
          type
          version
          condition
        }
        actions {
          type
          ... on SetPropertyAction {
            targetProperty
            targetValue
          }
        }
      }
      outputs
    }
  }
`;

export const DELETE_RULE = `
  mutation DeleteRuleInstance($id: ID!) {
    deleteRuleInstance(id: $id) {
      id
    }
  }
`;

export const EVALUATE_RULE = `
  mutation evaluateRuleInstance($id: ID!) {
    evaluateRuleInstance(id: $id) {
      id
      __typename
    }
  }
`;

export const CREATE_DASHBOARD = `
  mutation CreateDashboard($input: CreateInsightsDashboardInput!) {
    createDashboard(input: $input) {
      id
      __typename
    }
  }
`;