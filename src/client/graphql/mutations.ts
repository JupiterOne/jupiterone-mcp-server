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
        when
        actions
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

export const CREATE_J1QL_FROM_NATURAL_LANGUAGE = `
  mutation createJ1qlFromNaturalLanguage($naturalLanguage: String!) {
    createJ1qlFromNaturalLanguage(naturalLanguage: $naturalLanguage) {
      uuid
      question
      query
      __typename
    }
  }
`;

export const CREATE_DASHBOARD_WIDGET = `
  mutation CreateWidget($dashboardId: String!, $input: CreateInsightsWidgetInput!) {
    createWidget(dashboardId: $dashboardId, input: $input) {
      ...InsightsWidget
      __typename
    }
  }

  fragment InsightsWidget on InsightsWidget {
    id
    title
    description
    type
    questionId
    noResultMessage
    includeDeleted
    config {
      queries {
        id
        name
        query
        __typename
      }
      settings
      postQueryFilters
      disableQueryPolicyFilters
      __typename
    }
    __typename
  }
`;

export const PATCH_DASHBOARD = `
  mutation PatchDashboard($input: PatchInsightsDashboardInput!) {
    patchDashboard(input: $input) {
      id
      name
      category
      userId
      supportedUseCase
      isJ1ManagedBoard
      published
      publishedToUserIds
      publishedToGroupIds
      groupIds
      userIds
      scopeFilters
      resourceGroupId
      starred
      _timeUpdated
      _createdAt
      prerequisites {
        prerequisitesMet
        preRequisitesGroupsFulfilled
        preRequisitesGroupsRequired
      }
      parameters {
        dashboardId
        accountId
        id
        label
        name
        options
        valueType
        type
        default
        disableCustomInput
        requireValue
      }
      widgets {
        id
        title
        description
        type
        questionId
        noResultMessage
        includeDeleted
        config {
          queries {
            id
            name
            query
          }
          settings
          postQueryFilters
          disableQueryPolicyFilters
        }
      }
      layouts {
        xs {
          static
          moved
          w
          h
          x
          y
          i
        }
        sm {
          static
          moved
          w
          h
          x
          y
          i
        }
        md {
          static
          moved
          w
          h
          x
          y
          i
        }
        lg {
          static
          moved
          w
          h
          x
          y
          i
        }
        xl {
          static
          moved
          w
          h
          x
          y
          i
        }
      }
    }
  }
`;